import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import type { ReactNode } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { CronPickerChangeDetails } from '../types.js';
// Observe which real subtree is passed to Floating UI's reference contract.
// This is a structural assertion; the browser suite owns actual geometry.
const dropdownReferences = new Set<HTMLElement>();
beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
// 弹层容器涉及 floating-ui 定位与 motion 动画,jsdom 无布局引擎,统一以最小实现替身:
// 保留受控/非受控、已提交 open 和真实共享 Escape 栈；仅替换定位与动画
mock.module('@crab-dev/rc-dropdown-container/internal', () => ({
    // This suite replaces the entire layout renderer; actual positioning stays
    // covered by the published Select and CronPicker browser regressions.
    useDropdownPositionReference: () => () => {},
}));
mock.module('@crab-dev/rc-dropdown-container', async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const { registerOverlayLayer } = await mock.actual<typeof import("@crab-dev/rc-hooks/internal")>("@crab-dev/rc-hooks/internal");
    type MockDropdownContextValue = {
        state: {
            open: boolean;
        };
        dispatch: (action: {
            type: 'setOpen';
            payload: boolean;
        }) => void;
        refs: {
            setReference: (node: HTMLElement | null) => void;
        };
    };
    const DropdownContext = mockReact.createContext<MockDropdownContextValue | null>(null);
    function MockDropdownContainer({ children, overlay, open: controlledOpen, defaultOpen = false, onOpenChange }: {
        children: ReactNode;
        overlay: ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean, details: { reason: 'trigger' | 'escape'; event?: KeyboardEvent }) => void;
    }) {
        const [internalOpen, setOpen] = mockReact.useState(defaultOpen);
        const open = controlledOpen ?? internalOpen;
        const overlayRef = mockReact.useRef<HTMLDivElement | null>(null);
        const referenceRef = mockReact.useRef<HTMLElement | null>(null);
        const escapeRef = mockReact.useRef(false);
        const requestOpen = (nextOpen: boolean, details: { reason: 'trigger' | 'escape'; event?: KeyboardEvent }) => {
            escapeRef.current = details.reason === 'escape';
            if (controlledOpen === undefined) setOpen(nextOpen);
            if (nextOpen !== open) onOpenChange?.(nextOpen, details);
        };
        const dismiss = mockReact.useEffectEvent((event: KeyboardEvent) => requestOpen(false, { reason: 'escape', event }));
        mockReact.useEffect(() => {
            const node = overlayRef.current;
            if (!open || !node) return;
            const reference = referenceRef.current;
            const returnFocus = reference?.matches('button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])')
                ? reference : reference?.querySelector('input,button,textarea,select,a[href],[tabindex]:not([tabindex="-1"])') ?? reference;
            const layer = registerOverlayLayer(node, event => dismiss(event), returnFocus);
            return () => layer.release({ restoreFocus: escapeRef.current });
        }, [open]);
        const ctx = {
            state: { open },
            dispatch: (action: { type: 'setOpen'; payload: boolean }) => {
                requestOpen(action.payload, { reason: 'trigger' });
            },
            refs: { setReference: (node: HTMLElement | null) => {
                if (referenceRef.current) dropdownReferences.delete(referenceRef.current);
                referenceRef.current = node;
                if (node) dropdownReferences.add(node);
            } },
        };
        return (<div>
            <DropdownContext value={ctx}>
                {children}
                {open ? <div ref={overlayRef}>{overlay}</div> : null}
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
    it('keeps the actual Enter commit event and does not notify again on blur', async () => {
        const changed = mock.fn<(next: string, details: CronPickerChangeDetails) => void>();
        await render(<CronPicker onValueChange={changed} />);
        const input = getInput();
        await changeInputValue(input, '0 9 * * *');
        expect(changed).not.toHaveBeenCalled();
        const commit = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        await fireEvent(input, commit);
        const details = changed.calls.calls[0][1];
        expect(details.reason).toBe('input');
        expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(commit);
        await fireEvent(input, new FocusEvent('focusout', { bubbles: true }));
        expect(changed).toHaveBeenCalledTimes(1);
    });

    it('passes the same blur event to value details and the native field callback', async () => {
        const changed = mock.fn<(next: string, details: CronPickerChangeDetails) => void>();
        const blurred = mock.fn();
        await render(<CronPicker onValueChange={changed} onBlur={blurred} />);
        const input = getInput();
        await changeInputValue(input, '0 10 * * *');
        await fireEvent(input, new FocusEvent('focusout', { bubbles: true }));
        expect(changed).toHaveBeenCalledTimes(1);
        expect(blurred).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][1].event).toBe(blurred.calls.calls[0][0]);
    });

    for (const activation of ['click', 'keyboard'] as const) {
        it(`retains the actual ${activation} event from a field value tag once`, async () => {
            const changed = mock.fn<(next: string, details: CronPickerChangeDetails) => void>();
            await render(<CronPicker defaultOpen defaultValue="0 * * * *" onValueChange={changed} />);
            const tag = screen.getByRole('checkbox', { name: '30分' });
            const event = activation === 'click'
                ? new MouseEvent('click', { bubbles: true })
                : new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
            await fireEvent(tag, event);
            expect(changed).toHaveBeenCalledTimes(1);
            expect(changed.calls.calls[0][0]).toBe('0,30 * * * *');
            const details = changed.calls.calls[0][1];
            expect(details.reason).toBe('field');
            expect(details.field).toBe('minute');
            expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(event);
        });
    }

    it('retains number-field blur and keyboard step events', async () => {
        const changed = mock.fn<(next: string, details: CronPickerChangeDetails) => void>();
        await render(<CronPicker defaultOpen defaultValue="*/5 * * * *" onValueChange={changed} />);
        const start = screen.getByRole('spinbutton', { name: '起始分钟' }) as HTMLInputElement;
        await act(() => start.focus());
        await changeInputValue(start, '3');
        const blur = new FocusEvent('focusout', { bubbles: true });
        await fireEvent(start, blur);
        expect(changed).toHaveBeenCalledTimes(1);
        const details = changed.calls.calls[0][1];
        expect(details.reason).toBe('field');
        expect(details.field).toBe('minute');
        expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(blur);
        changed.clear();
        const step = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });
        await fireEvent(start, step);
        expect(changed).toHaveBeenCalledTimes(1);
        const stepDetails = changed.calls.calls[0][1];
        expect(stepDetails.reason).toBe('field');
        expect(stepDetails.field).toBe('minute');
        expect(stepDetails.event && 'nativeEvent' in stepDetails.event ? stepDetails.event.nativeEvent : stepDetails.event).toBe(step);
    });

    it('forwards native field identity and associations without replacing an external label', async () => {
        await render(<>
            <label htmlFor="schedule-expression">任务执行时间</label>
            <p id="schedule-hint">使用本地时区</p>
            <CronPicker id="schedule-expression" name="schedule" required aria-describedby="schedule-hint" aria-busy />
        </>);
        const input = screen.getByRole('textbox', { name: '任务执行时间' }) as HTMLInputElement;
        expect(input.id).toBe('schedule-expression');
        expect(input.name).toBe('schedule');
        expect(input.required).toBe(true);
        expect(input.getAttribute('aria-label')).toBeNull();
        expect(input.labels?.[0]?.textContent).toBe('任务执行时间');
        expect(input.getAttribute('aria-describedby')?.split(' ')).toContain('schedule-hint');
        expect(input.getAttribute('aria-busy')).toBe('true');
    });

    it('preserves external aria labels and validation independently of its internal label', async () => {
        await render(<>
            <span id="schedule-heading">批处理计划</span>
            <CronPicker label="内部名称" aria-labelledby="schedule-heading" aria-invalid />
        </>);
        const input = screen.getByRole('textbox', { name: '批处理计划' });
        expect(input.getAttribute('aria-labelledby')).toBe('schedule-heading');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.getAttribute('aria-label')).toBeNull();
    });

    for (const mode of ['disabled', 'readOnly'] as const) {
        it(`keeps a controlled open ${mode} editor from changing the expression`, async () => {
            const onValueChange = mock.fn();
            const onOpenChange = mock.fn();
            await render(<CronPicker open defaultValue="0 * * * *" disabled={mode === 'disabled'} readOnly={mode === 'readOnly'}
                onValueChange={onValueChange} onOpenChange={onOpenChange} />);
            const input = getInput();
            expect(input.disabled).toBe(mode === 'disabled');
            expect(input.readOnly).toBe(mode === 'readOnly');
            expect(screen.getByRole('dialog')).toBeTruthy();
            const minute = screen.getByRole('checkbox', { name: '30分' });
            expect(minute.getAttribute('aria-disabled')).toBe('true');
            const select = screen.getByRole('combobox', { name: '分钟设置方式' });
            expect(select.getAttribute('aria-disabled')).toBe('true');
            await fireEvent.click(minute);
            await fireEvent.click(select);
            await fireEvent.keyDown(select, { key: 'ArrowDown' });
            expect(screen.queryByRole('listbox')).toBeNull();
            expect(input.value).toBe('0 * * * *');
            expect(onValueChange).not.toHaveBeenCalled();
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    }

    it('allows a readonly field to show its panel without making its expression editable', async () => {
        const onValueChange = mock.fn();
        await render(<CronPicker readOnly defaultValue="*/5 * * * *" onValueChange={onValueChange} />);
        const input = getInput();
        await act(() => input.focus());
        expect(screen.queryByRole('dialog')).toBeNull();
        await fireEvent.keyDown(input, { key: 'ArrowDown' });
        expect(screen.getByRole('dialog')).toBeTruthy();
        const start = screen.getByRole('spinbutton', { name: '起始分钟' }) as HTMLInputElement;
        expect(start.disabled).toBe(true);
        await fireEvent.keyDown(start, { key: 'ArrowUp' });
        expect(input.value).toBe('*/5 * * * *');
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('synchronizes programmatic open changes without reporting a user action', async () => {
        const onOpenChange = mock.fn();
        const field = (open: boolean) => <CronPicker open={open} onOpenChange={onOpenChange} />;
        const view = await render(field(false));
        const input = getInput();
        await view.rerender(field(true));
        expect(screen.getByRole('dialog')).toBeTruthy();
        await view.rerender(field(false));
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(getInput()).toBe(input);
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    for (const mode of ['controlled', 'default'] as const) {
        it(`renders an initially ${mode} open panel without an open callback`, async () => {
            const onOpenChange = mock.fn();
            const openProps = mode === 'controlled' ? { open: true } : { defaultOpen: true };
            await render(<CronPicker {...openProps} defaultValue="0 9 * * *" onOpenChange={onOpenChange} />);
            expect(screen.getByRole('dialog')).toBeTruthy();
            expect(getInput().getAttribute('aria-expanded')).toBe('true');
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    }

    it('emits one close request when its controlled parent keeps the panel open', async () => {
        const onOpenChange = mock.fn();
        await render(<CronPicker open onOpenChange={onOpenChange} />);
        await fireEvent.keyDown(getInput(), { key: 'Escape' });
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(getInput().getAttribute('aria-expanded')).toBe('true');
        expect(onOpenChange).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false, { reason: 'escape', event: expect.any(KeyboardEvent) });
    });

    it('switches all built-in editor copy without resetting the expression', async () => {
        const view = await render(<ConfigProvider locale="en-US"><CronPicker defaultValue="30 9 * * 1-5" /></ConfigProvider>);
        const input = screen.getByRole('textbox', { name: 'Cron expression' });
        await fireEvent.click(input);
        expect(screen.getByRole('dialog', { name: 'Cron expression editor' })).toBeTruthy();
        expect(screen.getByRole('tab', { name: 'Minute' })).toBeTruthy();
        expect(screen.getByText('Local time')).toBeTruthy();
        await view.rerender(<ConfigProvider locale="zh-CN"><CronPicker defaultValue="30 9 * * 1-5" /></ConfigProvider>);
        expect(screen.getByRole('textbox', { name: 'Cron 表达式' })).toBe(input);
        expect((input as HTMLInputElement).value).toBe('30 9 * * 1-5');
        expect(screen.getByRole('dialog', { name: 'Cron 表达式编辑面板' })).toBeTruthy();
    });
    it('关联可见标签并在修正表达式后恢复辅助说明', async () => {
        await render(<CronPicker label="执行计划" supportingText="工作日上午执行" />);
        const input = screen.getByRole('textbox', { name: '执行计划' }) as HTMLInputElement;
        expect(document.getElementById(input.getAttribute('aria-describedby') ?? '')?.textContent).toBe('工作日上午执行');
        await changeInputValue(input, 'invalid');
        const error = screen.getByRole('alert');
        expect(error.textContent).toContain('五段式 Cron 表达式');
        expect(input.getAttribute('aria-describedby')).toBe(error.id);
        await changeInputValue(input, '30 9 * * 1-5');
        expect(screen.queryByRole('alert')).toBeNull();
        expect(document.getElementById(input.getAttribute('aria-describedby') ?? '')?.textContent).toBe('工作日上午执行');
    });

    it('非受控默认渲染 * * * * *', async () => {
        await render(<CronPicker />);
        expect(getInput().value).toBe('* * * * *');
    });
    it('手动输入合法表达式,回车提交并归一化', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onValueChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '0 9 * * MON-FRI');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('0 9 * * 1-5', expect.objectContaining({ reason: 'input', event: expect.anything() }));
        expect(input.value).toBe('0 9 * * 1-5');
    });
    it('非法输入即时给出 error 意符,回车不提交,失焦回退旧值', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onValueChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '* * *');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).not.toHaveBeenCalled();
        await fireEvent(input, new FocusEvent("focusout", { bubbles: true }));
        expect(input.value).toBe('* * * * *');
        expect(input.getAttribute('aria-invalid')).toBeNull();
    });
    it('anchors validation with the field while an invalid draft leaves the committed panel unchanged', async () => {
        const changed = mock.fn();
        const view = await render(<CronPicker defaultValue="30 9 * * 1-5" supportingText="工作日执行" onValueChange={changed} />);
        const input = getInput();
        await fireEvent.click(input);
        const reference = [...dropdownReferences].find(node => node.contains(input));
        expect(reference?.textContent).toContain('工作日执行');
        await changeInputValue(input, 'invalid-cron');
        const alert = screen.getByRole('alert');
        expect(reference?.contains(alert)).toBe(true);
        expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(alert.id);
        expect(input.value).toBe('invalid-cron');
        const dialog = screen.getByRole('dialog');
        expect(dialog.querySelector('[aria-label="生成的 Cron 表达式"]')?.textContent).toBe('30 9 * * 1-5');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.value).toBe('invalid-cron');
        expect(changed).not.toHaveBeenCalled();
        await fireEvent(input, new FocusEvent('focusout', { bubbles: true }));
        expect(input.value).toBe('30 9 * * 1-5');
        expect(screen.queryByRole('alert')).toBeNull();
        expect(reference?.textContent).toContain('工作日执行');
        expect(changed).not.toHaveBeenCalled();
        await view.unmount();
        expect(dropdownReferences.size).toBe(0);
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
        await render(<CronPicker defaultValue="0 * * * *" onValueChange={onChange}/>);
        await fireEvent.click(getInput());
        await fireEvent.click(screen.getByRole('checkbox', { name: '30分' }));
        expect(onChange).toHaveBeenCalledWith('0,30 * * * *', expect.objectContaining({ reason: 'field', field: 'minute', event: expect.anything() }));
        expect(getInput().value).toBe('0,30 * * * *');
    });
    it('弹层内选中步进模式,以默认步长产出表达式', async () => {
        const onChange = mock.fn();
        await render(<CronPicker onValueChange={onChange}/>);
        await fireEvent.click(getInput());
        expect(screen.queryByRole('spinbutton')).toBeNull();
        expect(screen.queryByRole('group', { name: '选择分钟' })).toBeNull();
        await fireEvent.click(screen.getByRole('combobox', { name: '分钟设置方式' }));
        await fireEvent.click(screen.getByRole('option', { name: '固定间隔' }));
        expect(onChange).toHaveBeenCalledWith('*/5 * * * *', { reason: 'field', field: 'minute' });
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
        await act(() => mode.focus());
        await fireEvent.click(mode);
        await fireEvent.keyDown(mode, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(screen.queryByRole('dialog')).not.toBeNull();
        expect(onOpenChange).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(mode, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(document.activeElement).toBe(getInput());
        expect(onOpenChange).toHaveBeenCalledTimes(2);
        expect(onOpenChange).toHaveBeenCalledWith(false, { reason: 'escape', event: expect.any(KeyboardEvent) });
        await fireEvent.keyDown(getInput(), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(onOpenChange).toHaveBeenCalledTimes(2);
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
        await render(<CronPicker value="* * * * *" onValueChange={onChange}/>);
        const input = getInput();
        await changeInputValue(input, '0 12 * * *');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('0 12 * * *', expect.objectContaining({ reason: 'input', event: expect.anything() }));
        expect(input.value).toBe('* * * * *');
    });
    it('受控传入非法表达式时输入框呈 error 态', async () => {
        await render(<CronPicker value="not a cron"/>);
        expect(getInput().getAttribute('aria-invalid')).toBe('true');
    });
});
