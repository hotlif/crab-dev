import { act } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import ColorPicker from '../colorPicker/colorPicker.js';
import type { OKLCHValue } from '../types.js';

/**
 * 本文件刻意不 mock @crab-dev/rc-dropdown-container / @crab-dev/rc-select —— 要验证的
 * 正是"RcSelect 用在 rc-color-picker 面板内"这一真实嵌套场景:两者各自的浮层因独立
 * FloatingPortal 而在 DOM 上是兄弟节点,曾导致点击 RcSelect 自身下拉选项时,外层
 * ColorPicker 的 outside-click 判定误以为"点击到了外部"而把整个弹层关闭。
 * 根因与修复见 @crab-dev/rc-dropdown-container(FloatingTree 化的 useDismiss)。
 * colorPicker.test.tsx 为隔离而 mock 掉了 rc-dropdown-container,无法覆盖这一场景。
 * motion 是 rc-dropdown-container 的依赖而非本包依赖,Yarn PnP 下不能在本包 mock 它;
 * 关闭动画为真实 AnimatePresence 驱动,故下方"关闭"断言用 waitFor 等待退出动画结束。
 */

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未内置 ResizeObserver;真实 useFloating(autoUpdate)与 RcSelect 的宽度测量都依赖它。
(globalThis as typeof globalThis & { ResizeObserver?: unknown }).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// jsdom 未内置 requestAnimationFrame / matchMedia;真实 motion(AnimatePresence)的退出动画依赖它们
// 才能推进并完成,否则弹层关闭后的 DOM 卸载永远不会发生。
(globalThis as Record<string, unknown>).requestAnimationFrame ??=
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((cb: (time: number) => void) => globalThis.setTimeout(() => cb(performance.now()), 16)) as any;
(globalThis as Record<string, unknown>).cancelAnimationFrame ??=
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((handle: number) => globalThis.clearTimeout(handle)) as any;
(globalThis as typeof globalThis & { matchMedia?: (query: string) => MediaQueryList }).matchMedia ??=
    ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.setPointerCapture = jest.fn() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.releasePointerCapture = jest.fn() as any;
    Element.prototype.getBoundingClientRect = (() => ({
        left: 0, width: 200, top: 0, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON() {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;
});

afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    cleanup();
});

const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180 };

const pointerDownOn = (el: HTMLElement) => {
    act(() => {
        el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    });
};

describe('ColorPicker + RcSelect nesting (real rc-dropdown-container / rc-select)', () => {
    it('keeps the picker open and applies the change when picking an option in the nested format select', () => {
        const onValueChange = jest.fn<(v: OKLCHValue) => void>();
        render(<ColorPicker value={defaultValue} onValueChange={onValueChange} />);

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: '选择颜色' }));
        });
        expect(screen.getByRole('dialog', { name: '颜色选择' })).toBeTruthy();

        act(() => {
            fireEvent.click(screen.getByRole('combobox', { name: '颜色格式' }));
        });
        const rgbOption = screen.getByRole('option', { name: 'RGB' });

        // 曾经的 bug:选项自身浮层的 pointerdown 会被外层 ColorPicker 误判为"点击外部"
        // 而立即关闭整个弹层,选项的 click(实际选中逻辑)根本来不及触发。
        pointerDownOn(rgbOption);
        expect(screen.getByRole('dialog', { name: '颜色选择' })).toBeTruthy();

        act(() => {
            fireEvent.click(rgbOption);
        });

        expect(screen.getByRole('dialog', { name: '颜色选择' })).toBeTruthy();
        const colorInput = screen.getByLabelText('颜色值') as HTMLInputElement;
        expect(colorInput.value.toLowerCase()).toMatch(/^rgb/);
    });

    it('still closes the picker on a genuine outside pointerdown', async () => {
        render(<ColorPicker value={defaultValue} />);

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: '选择颜色' }));
        });
        expect(screen.getByRole('dialog', { name: '颜色选择' })).toBeTruthy();

        pointerDownOn(document.body);
        // 真实 AnimatePresence 驱动退出动画,弹层需等动画结束才从 DOM 移除
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: '颜色选择' })).toBeNull();
        });
    });
});
