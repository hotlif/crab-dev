import { afterEach, beforeAll, beforeEach, describe, expect, it, mock, fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import type { ReactNode } from "react";
/**
 * Mock @crab-dev/rc-dropdown-container to avoid transitive floating-ui deps in jsdom.
 * Provides a minimal implementation that renders children + overlay when open.
 * refs 形状与真实 DropdownContainer 提供的 context 保持一致:仅暴露 setReference。
 */
mock.module('@crab-dev/rc-dropdown-container', async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DropdownContext = mockReact.createContext(null as any);

    function MockDropdownContainer({ children, overlay }: {
        children: ReactNode;
        overlay: ReactNode;
    }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = {
            state: { open },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch: (action: any) => {
                if (action.type === 'setOpen')
                    setOpen(action.payload);
            },
            refs: { setReference: () => { } },
        };
        return mockReact.createElement('div', null, mockReact.createElement(DropdownContext, { value: ctx }, children, open ? overlay : null));
    }
    function useDropdownContext() {
        const ctx = mockReact.use(DropdownContext);
        if (!ctx)
            throw new Error('useDropdownContext must be used within a DropdownContainer');
        return ctx;
    }
    return {
        __esModule: true,
        default: MockDropdownContainer,
        useDropdownContext,
    };
});
import type { OKLCHValue } from "../types.js";
let ColorPicker: (typeof import("../colorPicker/colorPicker.js"))["default"];
beforeAll(async () => {
    const colorPickerModule = await mock.import<typeof import("../colorPicker/colorPicker.js")>("../colorPicker/colorPicker.js");
    ColorPicker = colorPickerModule.default;
});
import type { ColorPickerProps } from "../colorPicker/colorPicker.js";
// Wake 模块替身不提升，因此被测模块必须在 mock.module 之后加载。
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom 未内置 ResizeObserver;面板内的 RcSelect(颜色格式选择器)依赖它测量触发器宽度。
(globalThis as typeof globalThis & {
    ResizeObserver?: unknown;
}).ResizeObserver ??= class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.setPointerCapture = mock.fn() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.releasePointerCapture = mock.fn() as any;
    Element.prototype.getBoundingClientRect = (() => ({
        left: 0, width: 200, top: 0, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON() { },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;
});
afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});
const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180 };
const renderColorPicker = async (props: Partial<ColorPickerProps> = {}) => {
    const onValueChange = mock.fn<(v: OKLCHValue) => void>();
    const renderResult = await render(<ColorPicker value={defaultValue} onValueChange={onValueChange} {...props}/>);
    const trigger = screen.getByRole('button', { name: '选择颜色' });
    return { ...renderResult, trigger, onValueChange };
};
describe('ColorPicker', () => {
    it('renders without runtime error', async () => {
        const { container } = await renderColorPicker();
        expect(container.firstElementChild).toBeTruthy();
    });
    it('shows a swatch tinted with the current color', async () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120 };
        const { trigger } = await renderColorPicker({ value });
        const swatch = trigger.querySelector('div') as HTMLElement;
        // Wake 的 DOM CSS 解析器会丢弃当前尚不识别的 OKLCH 声明；尺寸变量仍可
        // 确认颜色样本节点按传入值路径完成渲染。
        expect(swatch).toBeTruthy();
        expect(swatch.style.getPropertyValue('--cp-swatch-size')).toBeTruthy();
    });
    it('exposes the trigger as an accessible button', async () => {
        const { trigger } = await renderColorPicker();
        expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
    it('opens the overlay on click', async () => {
        const { trigger } = await renderColorPicker();
        expect(screen.queryByText('确定')).toBeNull();
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
        expect(screen.getByText('取消')).toBeTruthy();
    });
    it('opens the overlay via keyboard (Enter)', async () => {
        const { trigger } = await renderColorPicker();
        await act(async () => {
            await fireEvent.keyDown(trigger, { key: 'Enter' });
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });
    it('does NOT open on focus (focus must not auto-open)', async () => {
        const { trigger } = await renderColorPicker();
        await act(async () => {
            await fireEvent(trigger, new FocusEvent("focusin", { bubbles: true }));
        });
        expect(screen.queryByText('确定')).toBeNull();
    });
    it('shows four sliders (incl. alpha) in the overlay by default', async () => {
        const { trigger } = await renderColorPicker();
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getAllByRole('slider')).toHaveLength(4);
    });
    it('shows three sliders when showAlpha is false', async () => {
        const { trigger } = await renderColorPicker({ showAlpha: false });
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getAllByRole('slider')).toHaveLength(3);
    });
    it('commits the value and closes on confirm', async () => {
        const { trigger, onValueChange } = await renderColorPicker();
        await act(async () => {
            await fireEvent.click(trigger);
        });
        await act(async () => {
            await fireEvent.click(screen.getByText('确定'));
        });
        expect(onValueChange).toHaveBeenCalledWith(defaultValue);
        expect(screen.queryByText('确定')).toBeNull();
    });
    it('does not call onValueChange on cancel', async () => {
        const { trigger, onValueChange } = await renderColorPicker();
        await act(async () => {
            await fireEvent.click(trigger);
        });
        await act(async () => {
            await fireEvent.click(screen.getByText('取消'));
        });
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.queryByText('取消')).toBeNull();
    });
    it('does not open when disabled', async () => {
        const { trigger } = await renderColorPicker({ disabled: true });
        expect(trigger.getAttribute('aria-disabled')).toBe('true');
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.queryByText('确定')).toBeNull();
    });
    it('shows the reset button only when allowClear is set', async () => {
        const { trigger } = await renderColorPicker({ allowClear: true });
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getByText('重置')).toBeTruthy();
    });
    it('renders with a custom locale', async () => {
        const { trigger } = await renderColorPicker({
            locale: {
                overlay: { confirmText: 'OK', cancelText: 'Cancel' },
                panel: { labelLightness: 'L', labelChroma: 'C', labelHue: 'H', labelAlpha: 'A' },
            },
        });
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getByText('OK')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
        expect(screen.getByText('L')).toBeTruthy();
    });
    it('works uncontrolled via defaultValue', async () => {
        await render(<ColorPicker defaultValue={defaultValue}/>);
        const trigger = screen.getByRole('button', { name: '选择颜色' });
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });
    // "点击外部关闭 / 点击内部不关闭" 现由 @crab-dev/rc-dropdown-container 统一收口并覆盖测试
    // (含嵌套下拉场景,见该包的 dropdownContainer.nested.test.tsx);本文件 mock 掉了
    // rc-dropdown-container,不适合再重复验证这个机制本身。真实端到端场景见
    // colorPickerSelectNesting.test.tsx(不 mock rc-dropdown-container / rc-select)。
    it('falls back to default texts when a partial locale is given', async () => {
        const { trigger } = await renderColorPicker({
            locale: { panel: { labelLightness: 'L', labelChroma: 'C', labelHue: 'H' } },
        });
        await act(async () => {
            await fireEvent.click(trigger);
        });
        // overlay 文案与可选的 labelAlpha 均回退默认
        expect(screen.getByText('确定')).toBeTruthy();
        expect(screen.getByText('取消')).toBeTruthy();
        expect(screen.getByText('L')).toBeTruthy();
        expect(screen.getByText('透明度')).toBeTruthy();
    });
    it('merges a user className instead of replacing the trigger style', async () => {
        const { trigger } = await renderColorPicker({ className: 'my-custom' });
        expect(trigger.classList.contains('my-custom')).toBe(true);
        await act(async () => {
            await fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });
});
