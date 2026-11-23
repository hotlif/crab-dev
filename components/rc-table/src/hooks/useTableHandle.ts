import { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState, type Key, type Ref, type RefObject } from 'react';
import type { UniformVirtualAxis, VirtualHandle } from '@crab-dev/rc-virtual';
import type { Row, TableHandle, TableScrollToRowOptions } from '../types.js';
import { isInternalRow, type InternalExpandedRow, type InternalGroupRow } from '../util.js';

/** 数据行坐标不含常驻表头和汇总；oversized 行跨越整个可视区时 nearest 保持原位。 */
export function getRowScrollTop(start: number, size: number, current: number, viewport: number, total: number, align: TableScrollToRowOptions['align']): number {
    let target = current;
    const end = start + size;
    if (align === 'start') target = start;
    else if (align === 'center') target = start + (size - viewport) / 2;
    else if (align === 'end') target = end - viewport;
    else if (start < current && end < current + viewport) target = size > viewport ? end - viewport : start;
    else if (end > current + viewport && start > current) target = size > viewport ? start : end - viewport;
    return Math.max(0, Math.min(target, Math.max(0, total - viewport)));
}

// Virtual layout arrays are immutable. Build the prefix index only when a command needs it.
const axisOffsets = new WeakMap<readonly number[], number[]>();
export function offsetsFor(sizes: readonly number[]): number[] {
    const cached = axisOffsets.get(sizes);
    if (cached) return cached;
    const offsets = [0];
    for (const size of sizes) offsets.push(offsets[offsets.length - 1] + (size >= 0 ? size : NaN));
    axisOffsets.set(sizes, offsets);
    return offsets;
}

type ScrollTarget = { rowId: Key } | { rowIndex: number };

interface PendingScroll {
    destination: ScrollTarget;
    align: TableScrollToRowOptions['align'];
    resolve: (found: boolean) => void;
    reject: (reason: Error) => void;
    target?: number;
    layout?: object;
}

export function useTableHandle<T extends Row>(options: {
    ref?: Ref<TableHandle>;
    rootRef: RefObject<HTMLDivElement | null>;
    virtualRef: RefObject<VirtualHandle | null>;
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>;
    targetRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>;
    rowHeights: number[];
    indexedAxis?: UniformVirtualAxis;
    indexedRows?: ReadonlyMap<number, T>;
    viewportHeight: number;
    reservedTopHeight: number;
    reservedBottomHeight: number;
}) {
    const { ref, rootRef, virtualRef, displayRows, targetRows, rowHeights, indexedAxis, indexedRows,
        viewportHeight, reservedTopHeight, reservedBottomHeight } = options;
    // 可变实例：保存待提交命令、逻辑滚动位置及真实焦点；不在渲染期写入。
    const pending = useRef<PendingScroll | null>(null);
    const mounted = useRef(false);
    const position = useRef({ left: 0, top: 0 });
    const lastFocus = useRef<HTMLElement | null>(null);
    const [, requestCommit] = useState(0);
    // latest-ref 例外：公开方法保持稳定，读取最近提交的 DOM 容器。
    const latestRoot = useRef(rootRef);
    useLayoutEffect(() => { latestRoot.current = rootRef; });

    useLayoutEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            pending.current?.reject(new globalThis.DOMException('Table was unmounted', 'AbortError'));
            pending.current = null;
            lastFocus.current = null;
        };
    }, []);

    // 稳定命令例外：调用方可保存 handle，查询和布局更新不改变命令身份。
    const scrollTo = useCallback((destination: ScrollTarget, scrollOptions?: TableScrollToRowOptions): Promise<boolean> => {
        if (!mounted.current) return Promise.reject(new globalThis.DOMException('Table is unmounted', 'AbortError'));
        pending.current?.reject(new globalThis.DOMException('Scroll was superseded', 'AbortError'));
        return new Promise<boolean>((resolve, reject) => {
            pending.current = { destination, align: scrollOptions?.align, resolve, reject };
            // 先进入一次 React 提交，再读取行布局，支持 await refresh() 后立即定位新数据。
            requestCommit(version => version + 1);
        });
    }, []);
    const scrollToRow = useCallback<TableHandle['scrollToRow']>((rowId, options) => scrollTo({ rowId }, options), [scrollTo]);
    const scrollToRowIndex = useCallback<TableHandle['scrollToRowIndex']>((rowIndex, options) => scrollTo({ rowIndex }, options), [scrollTo]);
    const focus = useCallback(() => {
        const root = latestRoot.current.current;
        if (!mounted.current || !root?.isConnected) return;
        const previous = lastFocus.current;
        if (previous?.isConnected && root.contains(previous) && previous.closest('[role="grid"]') === root
            && !previous.matches(':disabled') && !previous.closest('[hidden], [inert], [aria-hidden="true"], [aria-disabled="true"]')) {
            previous.focus({ preventScroll: true });
            if (root.ownerDocument.activeElement === previous) return;
        }
        root.focus({ preventScroll: true });
    }, []);
    useImperativeHandle(ref, () => ({ scrollToRow, scrollToRowIndex, focus }), [scrollToRow, scrollToRowIndex, focus]);

    useLayoutEffect(() => {
        const command = pending.current;
        if (!command) return;
        const { destination } = command;
        let index = -1;
        if ('rowIndex' in destination) {
            if (Number.isSafeInteger(destination.rowIndex)) index = destination.rowIndex;
        } else if (indexedRows) {
            for (const [rowIndex, row] of indexedRows) {
                if (row.id !== destination.rowId) continue;
                index = rowIndex;
                break;
            }
        } else {
            index = targetRows.findIndex(row => !isInternalRow(row) && row.id === destination.rowId);
        }
        const count = indexedAxis?.count ?? targetRows.length;
        const viewport = viewportHeight - reservedTopHeight - reservedBottomHeight;
        if (index < 0 || index >= count || viewport <= 0 || !Number.isFinite(viewport) || !virtualRef.current) {
            pending.current = null;
            command.resolve(false);
            return;
        }
        // 动画 Hook 在 layout effect 中同步新数据；等旧显示序列跟上目标布局。
        if (!indexedAxis && (displayRows.length !== count || displayRows.some((row, i) => row.id !== targetRows[i].id))) return;
        const layout = indexedAxis ?? rowHeights;
        const offsets = indexedAxis ? undefined : offsetsFor(rowHeights);
        const size = indexedAxis?.itemSize ?? rowHeights[index];
        const start = offsets ? offsets[index] : index * size;
        const total = offsets ? offsets[count] : count * size;
        if (!(size > 0) || !Number.isFinite(total)) {
            pending.current = null;
            command.resolve(false);
            return;
        }
        const target = getRowScrollTop(start, size, position.current.top, viewport, total, command.align);
        if (command.layout === layout && command.target === target && Math.abs(position.current.top - target) < 0.5) {
            pending.current = null;
            command.resolve(true);
            return;
        }
        command.layout = layout;
        command.target = target;
        virtualRef.current.scrollTo({ top: target });
        // 再提交一次：即使位置未变，也等子级虚拟列表的布局 effect 完成后兑现 Promise。
        requestCommit(version => version + 1);
    });

    return {
        position,
        onScrollPositionChange: (next: { left: number; top: number }) => { position.current = next; },
        rememberFocus: (element: HTMLElement) => {
            if (element.closest('[role="grid"]') === rootRef.current) lastFocus.current = element;
        },
    };
}
