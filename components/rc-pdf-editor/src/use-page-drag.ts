import { useEffect, useEffectEvent, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from 'react';
import type { VirtualHandle } from '@crab-dev/rc-virtual';
import { pageDropDestination } from './page-selection.js';

interface Gesture { pointer: number; x: number; y: number; startX: number; startY: number; page: number; pages: number[]; active: boolean; toggle: boolean }
interface Drop { pages: number[]; boundary?: number }

/** 页面缩略图专用拖拽；捕获在列表容器，虚拟行移出视口后仍可继续拖动。 */
export default function usePageDrag({ root, grid, selected, count, revision, disabled, readOnly, onSelect, onMove }: {
    root: RefObject<HTMLDivElement | null>; grid: RefObject<VirtualHandle | null>; selected: number[]; count: number; revision: number;
    disabled: boolean; readOnly: boolean; onSelect: (page: number, toggle: boolean) => void; onMove: (pages: number[], to: number) => void;
}) {
    const [drop, setDrop] = useState<Drop>();
    // 可变实例状态：一轮鼠标手势、捕获指针和拖动后需要吞掉的浏览器 click。
    const gesture = useRef<Gesture | undefined>(undefined);
    const suppressClick = useRef(false);
    function release() {
        const value = gesture.current; gesture.current = undefined;
        if (value && root.current?.hasPointerCapture(value.pointer)) root.current.releasePointerCapture(value.pointer);
    }
    function cancel() { release(); setDrop(undefined); }
    useEffect(() => { setDrop(undefined); return release; }, [revision, count, disabled, readOnly]);

    function visibleRows() {
        const box = root.current?.getBoundingClientRect();
        if (!box || !root.current) return [];
        return [...root.current.querySelectorAll<HTMLElement>('[data-page-row]')].map(row => ({ index: Number(row.dataset.pageRow), box: row.getBoundingClientRect() }))
            .filter(row => row.box.bottom > box.top && row.box.top < box.bottom);
    }
    function destination(): number | undefined {
        const value = gesture.current, box = root.current?.getBoundingClientRect();
        if (!value || !box || value.x < box.left || value.x > box.right || value.y < box.top || value.y > box.bottom) return;
        const rows = visibleRows();
        if (!rows.length) return;
        const after = rows.find(row => value.y < row.box.top + row.box.height / 2);
        return after ? after.index : rows[rows.length - 1].index + 1;
    }
    function preview() {
        const value = gesture.current;
        if (value?.active) {
            const boundary = destination();
            setDrop(previous => previous?.pages === value.pages && previous.boundary === boundary ? previous : { pages: value.pages, boundary });
        }
    }
    const autoScroll = useEffectEvent(() => {
        const value = gesture.current, box = root.current?.getBoundingClientRect();
        if (!value?.active || !box || value.x < box.left || value.x > box.right || value.y < box.top || value.y > box.bottom) return;
        const rows = visibleRows();
        if (!rows.length) return;
        if (value.y < box.top + 32) grid.current?.scrollToCell({ rowIndex: Math.max(0, rows[0].index - 1) });
        else if (value.y > box.bottom - 32) grid.current?.scrollToCell({ rowIndex: Math.min(count - 1, rows[rows.length - 1].index + 1) });
        preview();
    });
    const dragging = !!drop;
    useEffect(() => {
        if (!dragging) return;
        const timer = setInterval(autoScroll, 80);
        const blur = () => cancel();
        window.addEventListener('blur', blur);
        return () => { clearInterval(timer); window.removeEventListener('blur', blur); };
    }, [dragging]);

    function start(event: PointerEvent<HTMLDivElement>) {
        if (!gesture.current) suppressClick.current = false;
        if (disabled || readOnly || event.button !== 0 || event.pointerType === 'touch' || gesture.current) return;
        const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-page-index]') : null;
        if (!target) return;
        const page = Number(target.dataset.pageIndex);
        gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY,
            page, pages: selected.includes(page) ? [...selected].sort((a, b) => a - b) : [page], active: false, toggle: event.ctrlKey || event.metaKey };
        suppressClick.current = true;
        event.preventDefault(); event.stopPropagation();
        target.focus({ preventScroll: true }); root.current?.setPointerCapture(event.pointerId);
    }
    function move(event: PointerEvent<HTMLDivElement>) {
        const value = gesture.current;
        if (!value || value.pointer !== event.pointerId) return;
        event.stopPropagation(); value.x = event.clientX; value.y = event.clientY;
        if (Math.hypot(value.x - value.startX, value.y - value.startY) >= 5) value.active = true;
        preview();
    }
    function end(event: PointerEvent<HTMLDivElement>) {
        const value = gesture.current;
        if (!value || value.pointer !== event.pointerId) return;
        event.stopPropagation(); value.x = event.clientX; value.y = event.clientY;
        const boundary = destination();
        release(); setDrop(undefined);
        if (disabled || readOnly) return;
        if (!value.active) onSelect(value.page, value.toggle);
        else if (boundary !== undefined) onMove(value.pages, pageDropDestination(value.pages, boundary));
    }
    return { drop, cancel, handlers: {
        onPointerDownCapture: start, onPointerMoveCapture: move, onPointerUpCapture: end,
        onPointerCancelCapture: cancel,
        onLostPointerCapture: () => { if (gesture.current) cancel(); },
        onClickCapture: (event: MouseEvent<HTMLDivElement>) => {
            if (suppressClick.current && event.detail > 0) { suppressClick.current = false; event.preventDefault(); event.stopPropagation(); }
        },
    } };
}
