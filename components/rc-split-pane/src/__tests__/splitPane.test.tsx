import { afterEach, describe, expect, it, mock, clock, act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import SplitPane from '../splitPane.js';
afterEach(() => {
    window.localStorage.clear();
});
async function renderPane(props: Partial<Parameters<typeof SplitPane>[0]> = {}) {
    const utils = await render(<SplitPane defaultSize={280} {...props}>
        <div data-testid="first">A</div>
        <div data-testid="second">B</div>
    </SplitPane>);
    const separator = screen.getByRole('separator');
    const firstPane = screen.getByTestId('first').parentElement as HTMLElement;
    const secondPane = screen.getByTestId('second').parentElement as HTMLElement;
    return { ...utils, separator, firstPane, secondPane };
}
/** Wake fast DOM 中显式派发带 pointerId 的 PointerEvent。 */
async function pointerDown(target: Element, clientX: number, clientY = 0) {
    await act(() => {
        target.dispatchEvent(Object.assign(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX, clientY }), { pointerId: 1 }));
    });
}
async function firePointer(type: 'pointermove' | 'pointerup', clientX = 0, clientY = 0) {
    await act(() => {
        window.dispatchEvent(Object.assign(new Event(type), { clientX, clientY }));
    });
}
describe('SplitPane', () => {
    it('主面板按 defaultSize 定宽，另一侧 flex 填充', async () => {
        const { firstPane, secondPane } = await renderPane();
        expect(firstPane.style.width).toBe('280px');
        expect(secondPane.style.width).toBe('');
    });
    it('拖拽分隔条调整主面板宽度并夹在 min/max 内', async () => {
        const { separator, firstPane } = await renderPane({ min: 200, max: 400 });
        await pointerDown(separator, 100);
        await firePointer('pointermove', 150);
        expect(firstPane.style.width).toBe('330px');
        await firePointer('pointermove', 1000);
        expect(firstPane.style.width).toBe('400px');
        await firePointer('pointerup');
    });
    it('primary=second 时方向反转：向左拖增大第二面板', async () => {
        const { separator, secondPane } = await renderPane({ primary: 'second' });
        expect(secondPane.style.width).toBe('280px');
        await pointerDown(separator, 100);
        await firePointer('pointermove', 60);
        expect(secondPane.style.width).toBe('320px');
        await firePointer('pointerup');
    });
    it('vertical 方向调整高度且分隔条汇报横向语义', async () => {
        const { separator, firstPane } = await renderPane({ direction: 'vertical' });
        expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
        await pointerDown(separator, 0, 100);
        await firePointer('pointermove', 0, 160);
        expect(firstPane.style.height).toBe('340px');
        await firePointer('pointerup');
    });
    it('键盘：方向键步进、Home/End 到边界、Enter 复位', async () => {
        const { separator, firstPane } = await renderPane({ min: 100, max: 500, step: 20 });
        await fireEvent.keyDown(separator, { key: 'ArrowRight' });
        expect(firstPane.style.width).toBe('300px');
        await fireEvent.keyDown(separator, { key: 'ArrowLeft' });
        expect(firstPane.style.width).toBe('280px');
        await fireEvent.keyDown(separator, { key: 'Home' });
        expect(firstPane.style.width).toBe('100px');
        await fireEvent.keyDown(separator, { key: 'End' });
        expect(firstPane.style.width).toBe('500px');
        await fireEvent.keyDown(separator, { key: 'Enter' });
        expect(firstPane.style.width).toBe('280px');
        expect(separator.getAttribute('aria-valuenow')).toBe('280');
    });
    it('双击分隔条复位到 defaultSize', async () => {
        const { separator, firstPane } = await renderPane();
        await pointerDown(separator, 100);
        await firePointer('pointermove', 200);
        await firePointer('pointerup');
        expect(firstPane.style.width).toBe('380px');
        await fireEvent(separator, new MouseEvent("dblclick", { bubbles: true }));
        expect(firstPane.style.width).toBe('280px');
    });
    it('persistKey：调整后记住尺寸，重新挂载时优先恢复', async () => {
        await clock.fake();
        try {
            const first = await renderPane({ persistKey: 'sp-test' });
            await fireEvent.keyDown(first.separator, { key: 'ArrowRight' });
            await act(async () => { await clock.advanceBy(400); });
            expect(window.localStorage.getItem('sp-test')).toBe('296');
            await first.unmount();
            const second = await renderPane({ persistKey: 'sp-test' });
            expect(second.firstPane.style.width).toBe('296px');
        }
        finally {
            await clock.restore();
        }
    });
    it('disabled 时不可聚焦、拖拽与键盘均无效', async () => {
        const { separator, firstPane } = await renderPane({ disabled: true });
        expect(separator.hasAttribute('tabindex')).toBe(false);
        await pointerDown(separator, 100);
        await firePointer('pointermove', 200);
        expect(firstPane.style.width).toBe('280px');
        await fireEvent.keyDown(separator, { key: 'ArrowRight' });
        expect(firstPane.style.width).toBe('280px');
    });
    it('受控模式：宽度跟随 size prop，变化经 onSizeChange 通知', async () => {
        const onSizeChange = mock.fn();
        const { separator, firstPane } = await renderPane({ size: 300, onSizeChange });
        expect(firstPane.style.width).toBe('300px');
        await pointerDown(separator, 100);
        await firePointer('pointermove', 150);
        expect(onSizeChange).toHaveBeenLastCalledWith(350);
        expect(firstPane.style.width).toBe('300px');
        await firePointer('pointerup');
    });
});
