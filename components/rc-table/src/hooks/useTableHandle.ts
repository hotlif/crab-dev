import { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState, type Key, type Ref, type RefObject } from 'react';
import type { VirtualHandle } from '@crab-dev/rc-virtual';
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

interface PendingScroll {
    rowId: Key;
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
    viewportHeight: number;
    reservedTopHeight: number;
    reservedBottomHeight: number;
}) {
    const { ref, rootRef, virtualRef, displayRows, targetRows, rowHeights, viewportHeight, reservedTopHeight, reservedBottomHeight } = options;
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
    const scrollToRow = useCallback((rowId: Key, scrollOptions?: TableScrollToRowOptions): Promise<boolean> => {
        if (!mounted.current) return Promise.reject(new globalThis.DOMException('Table is unmounted', 'AbortError'));
        pending.current?.reject(new globalThis.DOMException('Scroll was superseded', 'AbortError'));
        return new Promise<boolean>((resolve, reject) => {
            pending.current = { rowId, align: scrollOptions?.align, resolve, reject };
            // 先进入一次 React 提交，再读取行布局，支持 await refresh() 后立即定位新数据。
            requestCommit(version => version + 1);
        });
    }, []);
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
    useImperativeHandle(ref, () => ({ scrollToRow, focus }), [scrollToRow, focus]);

    useLayoutEffect(() => {
        const command = pending.current;
        if (!command) return;
        // 动画 Hook 在 layout effect 中同步新数据；先按目标视图判断存在性，
        // 再等显示行序列跟上，避免 refresh 后的新 ID 被旧的瞬时布局误判为不存在。
        if (!targetRows.some(row => !isInternalRow(row) && row.id === command.rowId)) {
            pending.current = null;
            command.resolve(false);
            return;
        }
        if (displayRows.length !== targetRows.length || displayRows.some((row, index) => row.id !== targetRows[index].id)) return;
        const index = displayRows.findIndex(row => !isInternalRow(row) && row.id === command.rowId);
        const viewport = viewportHeight - reservedTopHeight - reservedBottomHeight;
        if (index < 0 || viewport <= 0 || !Number.isFinite(viewport) || !(rowHeights[index] > 0) || !virtualRef.current) {
            pending.current = null;
            command.resolve(false);
            return;
        }
        let start = 0;
        let total = 0;
        for (let rowIndex = 0; rowIndex < rowHeights.length; rowIndex++) {
            if (!Number.isFinite(rowHeights[rowIndex]) || rowHeights[rowIndex] < 0) {
                pending.current = null;
                command.resolve(false);
                return;
            }
            if (rowIndex === index) start = total;
            total += rowHeights[rowIndex];
        }
        if (!Number.isFinite(total)) {
            pending.current = null;
            command.resolve(false);
            return;
        }
        const target = getRowScrollTop(start, rowHeights[index], position.current.top, viewport, total, command.align);
        if (command.layout === rowHeights && command.target === target && Math.abs(position.current.top - target) < 0.5) {
            pending.current = null;
            command.resolve(true);
            return;
        }
        command.layout = rowHeights;
        command.target = target;
        virtualRef.current.scrollTo({ top: target });
        // 再提交一次：即使位置未变，也等子级虚拟列表的布局 effect 完成后兑现 Promise。
        requestCommit(version => version + 1);
    });

    return {
        onScrollPositionChange: (next: { left: number; top: number }) => { position.current = next; },
        rememberFocus: (element: HTMLElement) => {
            if (element.closest('[role="grid"]') === rootRef.current) lastFocus.current = element;
        },
    };
}
