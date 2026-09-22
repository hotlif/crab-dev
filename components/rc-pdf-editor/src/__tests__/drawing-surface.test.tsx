import { beforeEach, afterEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { fireEvent, render } from '@crab-dev/wake/test/react';
import DrawingSurface from '../drawing-surface.js';
import { constrainedPoint, DEFAULT_SHAPE_STYLE } from '../drawing.js';
import type { Drawing } from '../protocol.js';

beforeEach(() => {
    mock.spyOn(Element.prototype, 'setPointerCapture').implement(() => {});
    mock.spyOn(Element.prototype, 'hasPointerCapture').implement(() => true);
    mock.spyOn(Element.prototype, 'releasePointerCapture').implement(() => {});
    mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(() => new globalThis.DOMRect(100, 50, 400, 300));
});
afterEach(() => mock.restoreAll());
const page = { id: 1, contentRevision: 1, index: 0, width: 180, height: 130, rotation: 0 };
const viewport = { zoom: 2, panX: 20, panY: 10 };
const props = { style: DEFAULT_SHAPE_STYLE, disabled: false, page, revision: 1, viewport, width: 400, height: 300 };
function pointer(surface: HTMLElement, type: string, x: number, y: number, shiftKey = false) {
    return fireEvent(surface, new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y, shiftKey }));
}

describe('鼠标绘制', () => {
    it('按视口转换坐标，拖拽期间预览，松开后只提交一次', async () => {
        const drawings: Drawing[] = [];
        const view = await render(<DrawingSurface {...props} tool="rectangle" onDraw={drawing => drawings.push(drawing)}>{drawing => <output>{drawing ? '预览' : '空闲'}</output>}</DrawingSurface>);
        const surface = view.container.firstElementChild as HTMLElement;
        await pointer(surface, 'pointerdown', 160, 100);
        await pointer(surface, 'pointermove', 260, 160);
        expect(view.container.textContent).toBe('预览'); expect(drawings.length).toBe(0);
        await pointer(surface, 'pointerup', 260, 160);
        expect(drawings.length).toBe(1);
        expect(drawings[0].points).toEqual([{ x: 20, y: 20 }, { x: 70, y: 50 }]);
        expect(view.container.textContent).toBe('空闲');
        await view.unmount();
    });
    it('手绘采样合为一笔，Esc、取消指针、切换工具与禁用都不提交半成品', async () => {
        const onDraw = mock.fn();
        const child = () => null;
        const view = await render(<DrawingSurface {...props} tool="freehand" onDraw={onDraw}>{child}</DrawingSurface>);
        const surface = view.container.firstElementChild as HTMLElement;
        await pointer(surface, 'pointerdown', 160, 100);
        await pointer(surface, 'pointermove', 170, 130);
        await pointer(surface, 'pointermove', 200, 160);
        await fireEvent.keyDown(surface, { key: 'Escape' });
        await pointer(surface, 'pointerup', 200, 160);
        expect(onDraw).not.toHaveBeenCalled();
        await pointer(surface, 'pointerdown', 160, 100); await pointer(surface, 'pointercancel', 180, 120);
        await pointer(surface, 'pointerdown', 160, 100);
        await view.rerender(<DrawingSurface {...props} tool="line" onDraw={onDraw}>{child}</DrawingSurface>);
        await pointer(surface, 'pointerup', 200, 160);
        expect(onDraw).not.toHaveBeenCalled();
        await view.rerender(<DrawingSurface {...props} tool="line" disabled onDraw={onDraw}>{child}</DrawingSurface>);
        await pointer(surface, 'pointerdown', 160, 100); await pointer(surface, 'pointerup', 200, 160);
        expect(onDraw).not.toHaveBeenCalled();
        await view.rerender(<DrawingSurface {...props} tool="freehand" onDraw={onDraw}>{child}</DrawingSurface>);
        await pointer(surface, 'pointerdown', 160, 100);
        await pointer(surface, 'pointermove', 170, 130); await pointer(surface, 'pointermove', 200, 160);
        await pointer(surface, 'pointerup', 220, 180);
        expect(onDraw).toHaveBeenCalledTimes(1);
        await view.unmount();
    });
    it('Shift 保持正方形/正圆或 45 度方向，超出页面时维持约束', () => {
        expect(constrainedPoint('rectangle', { x: 10, y: 10 }, { x: 50, y: 30 }, true, page)).toEqual({ x: 50, y: 50 });
        expect(constrainedPoint('ellipse', { x: 170, y: 120 }, { x: 300, y: 300 }, true, page)).toEqual({ x: 180, y: 130 });
        const end = constrainedPoint('line', { x: 10, y: 10 }, { x: 60, y: 12 }, true, page);
        expect(end.y).toBeCloseTo(10, 5);
    });
});
