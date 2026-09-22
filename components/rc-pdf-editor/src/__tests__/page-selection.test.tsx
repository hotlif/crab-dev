import { useRef } from 'react';
import { beforeEach, afterEach, clock, describe, it, expect, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import type { VirtualHandle } from '@crab-dev/rc-virtual';
import usePageDrag from '../use-page-drag.js';
import { pageDropDestination, pageMoveOrder, togglePageSelection } from '../page-selection.js';

beforeEach(() => {
    mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
    mock.spyOn(Element.prototype, 'hasPointerCapture').implement(() => true);
    mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
    mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(function (this: HTMLElement) {
        return new globalThis.DOMRect(0, this.dataset.pageRow ? Number(this.dataset.pageRow) * 200 : 0, 200, this.dataset.pageRow ? 200 : 600);
    });
});
afterEach(() => mock.restoreAll());

function Harness({ onSelect, onMove, disabled = false, readOnly = false, revision = 1, gridHandle }: {
    onSelect: (page: number, toggle: boolean) => void; onMove: (pages: number[], to: number) => void;
    disabled?: boolean; readOnly?: boolean; revision?: number; gridHandle?: VirtualHandle;
}) {
    const root = useRef<HTMLDivElement>(null), grid = useRef<VirtualHandle>(gridHandle ?? null);
    const { handlers, drop, cancel } = usePageDrag({ root, grid, selected: [0, 2], count: 5, revision, disabled, readOnly, onSelect, onMove });
    return <div ref={root} {...handlers} onKeyDown={event => { if (event.key === 'Escape') cancel(); }}>
        {[0, 1, 2, 3, 4].map(index => <div key={index} data-page-row={index}><button data-page-index={index} onClick={event => onSelect(index, event.ctrlKey || event.metaKey)}>{index}</button></div>)}
        <output>{drop ? `${drop.pages.join(',')} → ${drop.boundary}` : '空闲'}</output>
    </div>;
}
function pointer(target: Element, type: string, y: number, ctrlKey = false) {
    return fireEvent(target, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: 50, clientY: y, ctrlKey }));
}

describe('页面多选与拖拽', () => {
    it('普通点击替换选择，Ctrl 切换选择并保持页面顺序，可取消全部选择', () => {
        expect(togglePageSelection([0, 2], 1, false)).toEqual([1]);
        expect(togglePageSelection([0, 2], 1, true)).toEqual([0, 1, 2]);
        expect(togglePageSelection([0, 1, 2], 1, true)).toEqual([0, 2]);
        expect(togglePageSelection([0], 0, true)).toEqual([]);
    });
    it('向前/后拖动及不连续多选使用移除后的目标位置，原地放置不产生编辑', () => {
        expect(pageMoveOrder(5, [1, 3], pageDropDestination([1, 3], 5))).toEqual([0, 2, 4, 1, 3]);
        expect(pageMoveOrder(5, [3, 1], 0)).toEqual([1, 3, 0, 2, 4]);
        expect(pageMoveOrder(5, [1, 2], pageDropDestination([1, 2], 3))).toBeUndefined();
        expect(pageMoveOrder(3, [0, 1, 2], 0)).toBeUndefined();
        expect(pageMoveOrder(3, [0], 4)).toBeUndefined();
    });
    it('一次点击仅选一次，拖动已选项会携带全部选页，松开只提交一次', async () => {
        const onSelect = mock.fn(), onMove = mock.fn();
        const view = await render(<Harness onSelect={onSelect} onMove={onMove} />);
        const root = view.container.firstElementChild!;
        const second = view.container.querySelector('[data-page-index="1"]')!;
        await pointer(second, 'pointerdown', 250, true); await pointer(root, 'pointerup', 250, true);
        await fireEvent.click(second, { ctrlKey: true, detail: 1 });
        expect(onSelect).toHaveBeenCalledTimes(1); expect(onSelect).toHaveBeenCalledWith(1, true);
        const third = view.container.querySelector('[data-page-index="2"]')!;
        await pointer(third, 'pointerdown', 450); await pointer(root, 'pointermove', 550);
        expect(view.container.querySelector('output')?.textContent).toBe('0,2 → 3'); expect(onMove).not.toHaveBeenCalled();
        await pointer(root, 'pointerup', 550);
        expect(onMove).toHaveBeenCalledTimes(1); expect(onMove).toHaveBeenCalledWith([0, 2], 1);
        await view.unmount();
    });
    it('Esc、取消指针、版本切换和只读时不提交拖拽', async () => {
        const onSelect = mock.fn(), onMove = mock.fn();
        const view = await render(<Harness onSelect={onSelect} onMove={onMove} />);
        const root = view.container.firstElementChild!, second = view.container.querySelector('[data-page-index="1"]')!;
        await pointer(second, 'pointerdown', 250); await pointer(root, 'pointermove', 550);
        await fireEvent.keyDown(root, { key: 'Escape' }); await pointer(root, 'pointerup', 550);
        await pointer(second, 'pointerdown', 250); await pointer(root, 'pointermove', 550); await pointer(root, 'pointercancel', 550);
        await pointer(second, 'pointerdown', 250); await pointer(root, 'pointermove', 550);
        await view.rerender(<Harness onSelect={onSelect} onMove={onMove} revision={2} />); await pointer(root, 'pointerup', 550);
        await view.rerender(<Harness onSelect={onSelect} onMove={onMove} readOnly />);
        await pointer(second, 'pointerdown', 250); await pointer(root, 'pointermove', 550); await pointer(root, 'pointerup', 550);
        expect(onMove).not.toHaveBeenCalled(); expect(onSelect).not.toHaveBeenCalled();
        await fireEvent.click(second, { detail: 1 });
        expect(onSelect).toHaveBeenCalledWith(1, false);
        await view.unmount();
    });
    it('拖动至边缘自动滚动，移出列表不提交排序并停止滚动', async () => {
        // React 19 调度保留原生 Performance API，仅推进拖动使用的计时器。
        await clock.fake({ exclude: ['performance'] });
        try {
            const onSelect = mock.fn(), onMove = mock.fn(), scrollToCell = mock.fn();
            const view = await render(<Harness onSelect={onSelect} onMove={onMove}
                gridHandle={{ scrollTo: mock.fn(), scrollToCell, getScrollCellPosition: () => ({ rowIndex: 0, columnIndex: 0 }) }} />);
            const root = view.container.firstElementChild!, second = view.container.querySelector('[data-page-index="1"]')!;
            await pointer(second, 'pointerdown', 250); await pointer(root, 'pointermove', 590);
            await act(async () => { await clock.advanceBy(80); });
            expect(scrollToCell).toHaveBeenCalledWith({ rowIndex: 3 });
            expect(onMove).not.toHaveBeenCalled();
            await pointer(root, 'pointermove', 650);
            await act(async () => { await clock.advanceBy(80); });
            expect(scrollToCell).toHaveBeenCalledTimes(1);
            await pointer(root, 'pointerup', 650);
            await act(async () => { await clock.advanceBy(160); });
            expect(scrollToCell).toHaveBeenCalledTimes(1); expect(onMove).not.toHaveBeenCalled();
            await view.unmount();
        } finally { await clock.restore(); }
    });
});
