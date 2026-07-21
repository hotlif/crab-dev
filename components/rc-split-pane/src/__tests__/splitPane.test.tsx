import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import SplitPane from '../splitPane.js';

afterEach(() => {
    cleanup();
    window.localStorage.clear();
});

function renderPane(props: Partial<Parameters<typeof SplitPane>[0]> = {}) {
    const utils = render(
        <SplitPane defaultSize={280} {...props}>
            <div data-testid="first">A</div>
            <div data-testid="second">B</div>
        </SplitPane>,
    );
    const separator = utils.getByRole('separator');
    const firstPane = utils.getByTestId('first').parentElement as HTMLElement;
    const secondPane = utils.getByTestId('second').parentElement as HTMLElement;
    return { ...utils, separator, firstPane, secondPane };
}

/** jsdom 无 PointerEvent 构造器：用挂上 pointerId 的 MouseEvent 派发同名事件 */
function pointerDown(target: Element, clientX: number, clientY = 0) {
    act(() => {
        target.dispatchEvent(Object.assign(
            new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX, clientY }),
            { pointerId: 1 },
        ));
    });
}

function firePointer(type: 'pointermove' | 'pointerup', clientX = 0, clientY = 0) {
    act(() => {
        window.dispatchEvent(Object.assign(new Event(type), { clientX, clientY }));
    });
}

describe('SplitPane', () => {
    it('主面板按 defaultSize 定宽，另一侧 flex 填充', () => {
        const { firstPane, secondPane } = renderPane();
        expect(firstPane.style.width).toBe('280px');
        expect(secondPane.style.width).toBe('');
    });

    it('拖拽分隔条调整主面板宽度并夹在 min/max 内', () => {
        const { separator, firstPane } = renderPane({ min: 200, max: 400 });
        pointerDown(separator, 100);
        firePointer('pointermove', 150);
        expect(firstPane.style.width).toBe('330px');
        firePointer('pointermove', 1000);
        expect(firstPane.style.width).toBe('400px');
        firePointer('pointerup');
    });

    it('primary=second 时方向反转：向左拖增大第二面板', () => {
        const { separator, secondPane } = renderPane({ primary: 'second' });
        expect(secondPane.style.width).toBe('280px');
        pointerDown(separator, 100);
        firePointer('pointermove', 60);
        expect(secondPane.style.width).toBe('320px');
        firePointer('pointerup');
    });

    it('vertical 方向调整高度且分隔条汇报横向语义', () => {
        const { separator, firstPane } = renderPane({ direction: 'vertical' });
        expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
        pointerDown(separator, 0, 100);
        firePointer('pointermove', 0, 160);
        expect(firstPane.style.height).toBe('340px');
        firePointer('pointerup');
    });

    it('键盘：方向键步进、Home/End 到边界、Enter 复位', () => {
        const { separator, firstPane } = renderPane({ min: 100, max: 500, step: 20 });
        fireEvent.keyDown(separator, { key: 'ArrowRight' });
        expect(firstPane.style.width).toBe('300px');
        fireEvent.keyDown(separator, { key: 'ArrowLeft' });
        expect(firstPane.style.width).toBe('280px');
        fireEvent.keyDown(separator, { key: 'Home' });
        expect(firstPane.style.width).toBe('100px');
        fireEvent.keyDown(separator, { key: 'End' });
        expect(firstPane.style.width).toBe('500px');
        fireEvent.keyDown(separator, { key: 'Enter' });
        expect(firstPane.style.width).toBe('280px');
        expect(separator.getAttribute('aria-valuenow')).toBe('280');
    });

    it('双击分隔条复位到 defaultSize', () => {
        const { separator, firstPane } = renderPane();
        pointerDown(separator, 100);
        firePointer('pointermove', 200);
        firePointer('pointerup');
        expect(firstPane.style.width).toBe('380px');
        fireEvent.doubleClick(separator);
        expect(firstPane.style.width).toBe('280px');
    });

    it('persistKey：调整后记住尺寸，重新挂载时优先恢复', () => {
        jest.useFakeTimers();
        try {
            const first = renderPane({ persistKey: 'sp-test' });
            fireEvent.keyDown(first.separator, { key: 'ArrowRight' });
            act(() => { jest.advanceTimersByTime(400); });
            expect(window.localStorage.getItem('sp-test')).toBe('296');
            first.unmount();

            const second = renderPane({ persistKey: 'sp-test' });
            expect(second.firstPane.style.width).toBe('296px');
        } finally {
            jest.useRealTimers();
        }
    });

    it('disabled 时不可聚焦、拖拽与键盘均无效', () => {
        const { separator, firstPane } = renderPane({ disabled: true });
        expect(separator.hasAttribute('tabindex')).toBe(false);
        pointerDown(separator, 100);
        firePointer('pointermove', 200);
        expect(firstPane.style.width).toBe('280px');
        fireEvent.keyDown(separator, { key: 'ArrowRight' });
        expect(firstPane.style.width).toBe('280px');
    });

    it('受控模式：宽度跟随 size prop，变化经 onSizeChange 通知', () => {
        const onSizeChange = jest.fn();
        const { separator, firstPane } = renderPane({ size: 300, onSizeChange });
        expect(firstPane.style.width).toBe('300px');
        pointerDown(separator, 100);
        firePointer('pointermove', 150);
        expect(onSizeChange).toHaveBeenLastCalledWith(350);
        expect(firstPane.style.width).toBe('300px');
        firePointer('pointerup');
    });
});
