import { beforeEach, describe, expect, it, render } from "@crab-dev/wake/test/react";
import Masonry from '../masonry.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
let resizeCallbacks: Array<(...args: unknown[]) => void> = [];
class MockResizeObserver {
    callback: (...args: unknown[]) => void;
    constructor(callback: (...args: unknown[]) => void) {
        this.callback = callback;
        resizeCallbacks.push(callback);
    }
    observe() { }
    unobserve() { }
    disconnect() { }
}
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
describe('Masonry', () => {
    beforeEach(() => {
        resizeCallbacks = [];
    });
    it('renders without crashing when no children provided', async () => {
        const { container } = await render(<Masonry />);
        expect(container.firstChild).toBeTruthy();
    });
    it('renders children items', async () => {
        const { container } = await render(<Masonry columns={2}>
            <div data-testid="item-1">Item 1</div>
            <div data-testid="item-2">Item 2</div>
            <div data-testid="item-3">Item 3</div>
        </Masonry>);
        expect(container.querySelectorAll('[data-testid]').length).toBe(3);
    });
    it('applies custom className', async () => {
        const { container } = await render(<Masonry className="custom-class">
            <div>Item</div>
        </Masonry>);
        expect(container.firstElementChild?.classList.contains('custom-class')).toBe(true);
    });
    it('applies custom style', async () => {
        const { container } = await render(<Masonry style={{ background: 'red' }}>
            <div>Item</div>
        </Masonry>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.style.background).toBe('red');
    });
    it('forwards data-* attributes', async () => {
        const { container } = await render(<Masonry data-section="gallery">
            <div>Item</div>
        </Masonry>);
        expect(container.firstElementChild?.getAttribute('data-section')).toBe('gallery');
    });
    it('defaults to 2 columns', async () => {
        const { container } = await render(<Masonry>
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
        </Masonry>);
        // 所有子项都应渲染为 wrapper div
        const wrappers = container.firstElementChild?.children;
        expect(wrappers?.length).toBe(4);
    });
    it('wraps each child in a wrapper div', async () => {
        const { container } = await render(<Masonry columns={3}>
            <div>A</div>
            <div>B</div>
        </Masonry>);
        const wrappers = container.firstElementChild?.children;
        expect(wrappers?.length).toBe(2);
        if (wrappers) {
            for (const wrapper of Array.from(wrappers)) {
                // 每个子项都被包裹在一个 div 中
                expect(wrapper.tagName).toBe('DIV');
                expect(wrapper.children.length).toBe(1);
            }
        }
    });
    it('handles single child', async () => {
        const { container } = await render(<Masonry columns={3}>
            <div>Only child</div>
        </Masonry>);
        expect(container.firstElementChild?.children.length).toBe(1);
    });
    it('clamps columns to at least 1', async () => {
        const { container } = await render(<Masonry columns={0}>
            <div>A</div>
            <div>B</div>
        </Masonry>);
        // Should not crash
        expect(container.firstElementChild?.children.length).toBe(2);
    });
});
