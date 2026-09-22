import { afterEach, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { fireEvent, render } from '@crab-dev/wake/test/react';
import RegionSelector from '../region-selector.js';
import { layoutDocument } from '../document-layout.js';
import { regionsInRectangle, validateRegions } from '../regions.js';

const pages = [0, 1].map(index => ({ index, id: index, contentRevision: 1, width: 100, height: 100, rotation: 0 }));
const layout = layoutDocument(pages, 2, 300, 20);
beforeEach(() => {
    mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(10, 20, 300, 300));
    mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
    mock.spyOn(Element.prototype, 'hasPointerCapture').implement(() => true);
    mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
});
afterEach(() => mock.restoreAll());
function pointer(element: Element, type: string, x: number, y: number) {
    return fireEvent(element, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: 10 + x, clientY: 20 + y }));
}

describe('跨页区域选择', () => {
    it('按每页裁切并去掉间隙，反向拖动、缩放和不同页宽保持页面坐标', () => {
        const expected = [{ pageIndex: 0, x: 10, y: 90, width: 50, height: 10 }, { pageIndex: 1, x: 10, y: 0, width: 50, height: 10 }];
        expect(regionsInRectangle(layout, { x: 70, y: 200 }, { x: 170, y: 260 })).toEqual(expected);
        expect(regionsInRectangle(layout, { x: 170, y: 260 }, { x: 70, y: 200 })).toEqual(expected);
        expect(regionsInRectangle(layout, { x: 70, y: 225 }, { x: 170, y: 235 })).toEqual([]);
        const mixed = layoutDocument([pages[0], { ...pages[1], width: 80 }], 2, 300, 20);
        expect(regionsInRectangle(mixed, { x: 50, y: 200 }, { x: 100, y: 260 })[1]).toEqual({ pageIndex: 1, x: 0, y: 0, width: 15, height: 10 });
        expect(() => validateRegions([{ pageIndex: 0, x: 0, y: 0, width: Infinity, height: 20 }], pages)).toThrow('选区');
        expect(() => validateRegions([expected[0], expected[0]], pages)).toThrow('重复');
    });

    it('拖动跨页后返回两个区域，拖动中滚动使用新的视口偏移，取消指针不提交', async () => {
        const onComplete = mock.fn(), onCancel = mock.fn(), onReveal = mock.fn();
        const props = { layout, scroll: { left: 0, top: 0 }, width: 300, height: 300, onComplete, onCancel, onReveal };
        const view = await render(<RegionSelector {...props} />), root = view.container.firstElementChild!;
        await pointer(root, 'pointerdown', 70, 200);
        await view.rerender(<RegionSelector {...props} scroll={{ left: 0, top: 100 }} />);
        await pointer(root, 'pointermove', 170, 160);
        expect(view.container.querySelectorAll('rect').length).toBe(2);
        await pointer(root, 'pointerup', 170, 160);
        expect(onComplete).toHaveBeenCalledWith([{ pageIndex: 0, x: 10, y: 90, width: 50, height: 10 }, { pageIndex: 1, x: 10, y: 0, width: 50, height: 10 }]);
        await pointer(root, 'pointerdown', 80, 160); await pointer(root, 'pointercancel', 100, 180); await pointer(root, 'pointerup', 100, 180);
        expect(onComplete).toHaveBeenCalledTimes(1);
        await view.unmount();
    });

    it('键盘可扩展区域、确认及取消，缩放变化清除旧手势', async () => {
        const onComplete = mock.fn(), onCancel = mock.fn(), onReveal = mock.fn();
        const props = { layout, scroll: { left: 0, top: 0 }, width: 300, height: 300, onComplete, onCancel, onReveal };
        const view = await render(<RegionSelector {...props} />), root = view.container.firstElementChild!;
        await fireEvent.keyDown(root, { key: 'ArrowRight', shiftKey: true });
        await fireEvent.keyDown(root, { key: 'ArrowDown', shiftKey: true });
        await fireEvent.keyDown(root, { key: 'Enter' });
        expect(onComplete).toHaveBeenCalledWith([{ pageIndex: 0, x: 50, y: 65, width: 10, height: 10 }]);
        await pointer(root, 'pointerdown', 70, 200);
        await view.rerender(<RegionSelector {...props} layout={layoutDocument(pages, 1, 300, 20)} />);
        await pointer(root, 'pointerup', 170, 260);
        expect(onComplete).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(root, { key: 'Escape' }); expect(onCancel).toHaveBeenCalledTimes(1);
        await view.unmount();
    });
});
