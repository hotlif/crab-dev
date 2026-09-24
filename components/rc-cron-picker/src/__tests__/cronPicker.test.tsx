import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
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
    it('指定模式支持多选并上抛新表达式', async () => {
        const onChange = mock.fn();
        await render(<CronPicker defaultValue="0 * * * *" onChange={onChange}/>);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('checkbox', { name: '30分' }));
        expect(onChange).toHaveBeenCalledWith('0,30 * * * *');
        expect(getInput().value).toBe('0,30 * * * *');
    });
    it('弹层内选中步进模式,以默认步长产出表达式', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onChange={onChange}/>);
        await fireEvent.click(getInput());
        expect(screen.queryByRole('spinbutton')).toBeNull();
        expect(screen.queryByRole('group', { name: '选择分钟' })).toBeNull();
        await fireEvent.click(screen.getByRole('combobox', { name: '分钟设置方式' }));
        await fireEvent.click(screen.getByRole('option', { name: '固定间隔' }));
        expect(onChange).toHaveBeenCalledWith('*/5 * * * *');
        expect(screen.getAllByRole('spinbutton').length).toBe(2);
        expect((screen.getByRole('spinbutton', { name: '起始分钟' }) as HTMLInputElement).value).toBe('0');
        expect((screen.getByRole('spinbutton', { name: '间隔（分钟）' }) as HTMLInputElement).value).toBe('5');
        expect(screen.queryByRole('group', { name: '选择分钟' })).toBeNull();
    });
    it('切入指定模式有默认值，取消最后一项不会意外变成每分钟', async () => {
        await render(<CronPicker />);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('combobox', { name: '分钟设置方式' }));
        await fireEvent.click(screen.getByRole('option', { name: '指定分钟' }));
        expect(getInput().value).toBe('0 * * * *');
        await fireEvent.click(screen.getByRole('checkbox', { name: '0分' }));
        expect(getInput().value).toBe('0 * * * *');
        await fireEvent.keyDown(screen.getByRole('checkbox', { name: '30分' }), { key: ' ' });
        await fireEvent.click(screen.getByRole('checkbox', { name: '0分' }));
        expect(getInput().value).toBe('30 * * * *');
    });
    it('连续范围只显示对应输入项，修改起点保留终点及其他字段', async () => {
        await render(<CronPicker defaultValue="0 9 * * *" />);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('combobox', { name: '分钟设置方式' }));
        await fireEvent.click(screen.getByRole('option', { name: '连续范围' }));
        const start = screen.getByRole('spinbutton', { name: '开始分钟' });
        await fireEvent.keyDown(start, { key: 'ArrowUp' });
        expect(getInput().value).toBe('1-30 9 * * *');
        expect(screen.getAllByRole('spinbutton').length).toBe(2);
        expect(screen.queryByRole('checkbox', { name: '0分' })).toBeNull();
    });
    it('星期仅提供适用模式，区间端点保持合法', async () => {
        await render(<CronPicker defaultValue="0 9 * * *" />);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('tab', { name: '星期' }));
        await fireEvent.click(screen.getByRole('combobox', { name: '星期设置方式' }));
        expect(screen.queryByRole('option', { name: '固定间隔' })).toBeNull();
        await fireEvent.click(screen.getByRole('option', { name: '连续范围' }));
        expect(getInput().value).toBe('0 9 * * 1-5');
        await fireEvent.click(screen.getByRole('combobox', { name: '开始星期' }));
        await fireEvent.click(screen.getByRole('option', { name: '周六' }));
        expect(getInput().value).toBe('0 9 * * 6-6');
    });
    it('Escape 先关闭模式菜单，再关闭面板并把焦点还给表达式', async () => {
        const onOpenChange = mock.fn();
        await render(<CronPicker onOpenChange={onOpenChange} />);
        await fireEvent.click(getInput());
        const mode = screen.getByRole('combobox', { name: '分钟设置方式' });
        await fireEvent.click(mode);
        await fireEvent.keyDown(mode, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(screen.queryByRole('dialog')).not.toBeNull();
        await fireEvent.keyDown(mode, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(document.activeElement).toBe(getInput());
        expect(onOpenChange).toHaveBeenCalledWith(false);
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
