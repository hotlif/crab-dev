import { beforeAll, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import type { ReactNode } from 'react';
beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
// 弹层容器涉及 floating-ui 定位与 motion 动画,jsdom 无布局引擎,统一以最小实现替身:
// open 状态 + dispatch + overlay 条件渲染,交互语义与真实实现一致
mock.module('@crab-dev/rc-dropdown-container', async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    type MockDropdownContextValue = {
        state: {
            open: boolean;
        };
        dispatch: (action: {
            type: 'setOpen';
            payload: boolean;
        }) => void;
        refs: {
            setReference: () => void;
        };
    };
    const DropdownContext = mockReact.createContext<MockDropdownContextValue | null>(null);
    function MockDropdownContainer({ children, overlay }: {
        children: ReactNode;
        overlay: ReactNode;
    }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = {
            state: { open },
            dispatch: (action: {
                type: 'setOpen';
                payload: boolean;
            }) => {
                if (action.type === 'setOpen') {
                    setOpen(action.payload);
                }
            },
            refs: { setReference: () => { } },
        };
        return (<div>
            <DropdownContext value={ctx}>
                {children}
                {open ? overlay : null}
            </DropdownContext>
        </div>);
    }
    function useDropdownContext() {
        const context = mockReact.use(DropdownContext);
        if (!context) {
            throw new Error('useDropdownContext must be used within a DropdownContainer');
        }
        return context;
    }
    return {
        __esModule: true,
        default: MockDropdownContainer,
        useDropdownContext,
    };
});
let CronPicker: (typeof import("../cronPicker.js"))["default"];
beforeAll(async () => {
    const cronPickerModule = await mock.import<typeof import("../cronPicker.js")>("../cronPicker.js");
    CronPicker = cronPickerModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const getInput = () => screen.getByRole('textbox', { name: 'Cron 表达式' }) as HTMLInputElement;
const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
const changeInputValue = async (input: HTMLInputElement, value: string) => {
    if (!inputValueSetter) {
        throw new Error('HTMLInputElement.value setter is unavailable');
    }
    inputValueSetter.call(input, value);
    await fireEvent.input(input);
};
describe('CronPicker', () => {
    it('非受控默认渲染 * * * * *', async () => {
        await render(<CronPicker />);
        expect(getInput().value).toBe('* * * * *');
    });
    it('手动输入合法表达式,回车提交并归一化', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '0 9 * * MON-FRI');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('0 9 * * 1-5');
        expect(input.value).toBe('0 9 * * 1-5');
    });
    it('非法输入即时给出 error 意符,回车不提交,失焦回退旧值', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '* * *');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).not.toHaveBeenCalled();
        await fireEvent(input, new FocusEvent("focusout", { bubbles: true }));
        expect(input.value).toBe('* * * * *');
        expect(input.getAttribute('aria-invalid')).toBeNull();
    });
    it('Escape 放弃编辑草稿并回退显示', async () => {
        await render(<CronPicker defaultValue="30 9 * * *"/>);
        const input = getInput();
        await changeInputValue(input, 'x');
        await fireEvent.keyDown(input, { key: 'Escape' });
        expect(input.value).toBe('30 9 * * *');
    });
    it('点击输入框打开弹层,展示表达式与中文描述', async () => {
        await render(<CronPicker defaultValue="30 9 * * 1-5"/>);
        await fireEvent.click(getInput());
        const dialog = screen.getByRole('dialog', { name: 'Cron 表达式编辑面板' });
        expect(dialog.textContent).toContain('30 9 * * 1-5');
        expect(dialog.textContent).toContain('周一至周五 09:30');
    });
    it('弹层内点击网格值,一步切入指定模式并上抛新表达式', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onChange={onChange}/>);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('checkbox', { name: '30分' }));
        expect(onChange).toHaveBeenCalledWith('30 * * * *');
        expect(getInput().value).toBe('30 * * * *');
    });
    it('弹层内选中步进模式,以默认步长产出表达式', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onChange={onChange}/>);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('radio', { name: '按步进指定分钟' }));
        expect(onChange).toHaveBeenCalledWith('*/5 * * * *');
    });
    it('previewCount 控制下次执行时间预览', async () => {
        await render(<CronPicker defaultValue="0 0 * * *" previewCount={3}/>);
        await fireEvent.click(getInput());
        const dialog = screen.getByRole('dialog', { name: 'Cron 表达式编辑面板' });
        expect(dialog.textContent).toContain('接下来 3 次执行');
    });
    it('disabled 时不打开弹层', async () => {
        await render(<CronPicker disabled/>);
        await fireEvent.click(getInput());
        expect(screen.queryByRole('dialog')).toBeNull();
    });
    it('受控模式下交互只上抛,不自更新', async () => {
        const onChange = mock.fn();
        await render(<CronPicker value="* * * * *" onChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '0 12 * * *');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('0 12 * * *');
        expect(input.value).toBe('* * * * *');
    });
    it('受控传入非法表达式时输入框呈 error 态', async () => {
        await render(<CronPicker value="not a cron"/>);
        expect(getInput().getAttribute('aria-invalid')).toBe('true');
    });
});
