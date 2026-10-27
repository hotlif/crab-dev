import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, userEvent } from "@crab-dev/wake/test/react";
import type { ReactNode } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { SelectChangeDetails } from '../types.js';
// Positioning geometry is verified by the published-CSS browser suite; this
// lightweight suite deliberately replaces the entire dropdown renderer.
mock.module('@crab-dev/rc-dropdown-container/internal', () => ({
    useDropdownPositionReference: () => () => {},
}));
let virtualRowHeights: number[] = [];
let virtualColumnWidths: number[] = [];
beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
mock.module('@crab-dev/rc-virtual', () => ({
    __esModule: true,
    default: ({ renderRows, gridTemplateRows, gridTemplateColumns }: {
        renderRows: (rowRange: [
            number,
            number
        ], columnRange: [
            number,
            number
        ]) => ReactNode;
        gridTemplateRows: number[];
        gridTemplateColumns: number[];
    }) => {
        virtualRowHeights = gridTemplateRows;
        virtualColumnWidths = gridTemplateColumns;
        const lastRowIndex = Math.max(gridTemplateRows.length - 1, 0);
        return <div>{renderRows([0, lastRowIndex], [0, 0])}</div>;
    },
}));
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
    function MockDropdownContainer({ children, overlay, open: controlledOpen, defaultOpen = false, onOpenChange }: {
        children: ReactNode;
        overlay: ReactNode;
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean, details: { reason: 'trigger' }) => void;
    }) {
        const [internalOpen, setOpen] = mockReact.useState(defaultOpen);
        const open = controlledOpen ?? internalOpen;
        const ctx = {
            state: { open },
            dispatch: (action: {
                type: 'setOpen';
                payload: boolean;
            }) => {
                if (action.type === 'setOpen') {
                    if (controlledOpen === undefined) setOpen(action.payload);
                    if (action.payload !== open) onOpenChange?.(action.payload, { reason: 'trigger' });
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
let Select: (typeof import("../select.js"))["default"];
beforeAll(async () => {
    const selectModule = await mock.import<typeof import("../select.js")>("../select.js");
    Select = selectModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
const changeInputValue = async (input: HTMLInputElement, value: string) => {
    if (!inputValueSetter) {
        throw new Error('HTMLInputElement.value setter is unavailable');
    }
    inputValueSetter.call(input, value);
    await fireEvent.input(input);
};
describe('Select', () => {
    it('fits virtual columns to a narrow rendered popup instead of forcing a 160px minimum', async () => {
        const originalObserver = globalThis.ResizeObserver;
        const observers = new Map<Element, () => void>();
        // Only supply the missing DOM layout measurement; keep the real overlay,
        // selection and virtual-column calculation. CSS spacing is browser-audited.
        (globalThis as Record<string, unknown>).ResizeObserver = class {
            private targets = new Set<Element>();
            constructor(private callback: () => void) { }
            observe(target: Element) { this.targets.add(target); observers.set(target, this.callback); }
            unobserve(target: Element) { this.targets.delete(target); observers.delete(target); }
            disconnect() { for (const target of this.targets) observers.delete(target); this.targets.clear(); }
        };
        try {
            await render(<Select aria-label="窄弹层" open value="a" options={[{ label: 'Alpha', value: 'a' }]} />);
            const overlay = screen.getByRole('listbox');
            Object.defineProperty(overlay, 'clientWidth', { configurable: true, value: 130 });
            const notifyResize = observers.get(overlay);
            expect(notifyResize).toBeDefined();
            await act(() => notifyResize?.());
            expect(virtualColumnWidths).toEqual([130]);
            expect(screen.getByRole('option', { name: 'Alpha' }).getAttribute('aria-selected')).toBe('true');
        } finally {
            globalThis.ResizeObserver = originalObserver;
        }
    });
    it('keeps a disabled open field inert for options, search and default tags', async () => {
        const onValueChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        const onOpenChange = mock.fn();
        await render(<Select aria-label="禁用展开" disabled open multiple searchable defaultValue={['a']}
            onValueChange={onValueChange} onOpenChange={onOpenChange}
            options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]} />);
        const field = screen.getByRole('combobox', { name: '禁用展开' });
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(document.activeElement).not.toBe(input);
        expect(screen.queryByRole('button', { name: '移除 Alpha' })).toBeNull();
        const beta = screen.getByRole('option', { name: 'Beta' });
        expect(beta.getAttribute('aria-disabled')).toBe('true');
        expect(screen.getByRole('listbox').getAttribute('aria-disabled')).toBe('true');
        await fireEvent.click(beta);
        await fireEvent.keyDown(field, { key: 'Backspace' });
        await fireEvent.keyDown(field, { key: 'Escape' });
        expect(screen.getByRole('option', { name: 'Alpha' }).getAttribute('aria-selected')).toBe('true');
        expect(beta.getAttribute('aria-selected')).toBe('false');
        expect(field.getAttribute('aria-expanded')).toBe('true');
        expect(onValueChange).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('guards custom tag removal callbacks while the field is disabled', async () => {
        const onValueChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label="自定义标签" disabled multiple defaultValue={['a']}
            onValueChange={onValueChange} options={[{ label: 'Alpha', value: 'a' }]}
            tagRender={(option, onClose) => <button type="button" onClick={onClose}>移除自定义 {option.value}</button>} />);
        await fireEvent.click(screen.getByRole('button', { name: '移除自定义 a' }));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: '移除自定义 a' })).toBeTruthy();
    });

    it('preserves the event supplied by a custom tag close action', async () => {
        const onValueChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label="自定义标签事件" multiple defaultValue={['a']}
            onValueChange={onValueChange} options={[{ label: 'Alpha', value: 'a' }]}
            tagRender={(option, onClose) => <button type="button" onClick={onClose}>移除自定义 {option.value}</button>} />);
        const button = screen.getByRole('button', { name: '移除自定义 a' });
        const click = new MouseEvent('click', { bubbles: true });
        await act(() => button.dispatchEvent(click));
        expect(onValueChange).toHaveBeenCalledWith([], {
            reason: 'remove', options: [], event: expect.objectContaining({ type: 'click' }),
        });
        expect(onValueChange.calls.calls[0][1].event?.nativeEvent).toBe(click);
        expect(onValueChange.calls.calls[0][1].event?.target).toBe(button);
    });

    it('does not invent an event when a custom tag invokes its close command directly', async () => {
        const onValueChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        let closeTag: (() => void) | undefined;
        await render(<Select aria-label="主动关闭标签" multiple defaultValue={['a']}
            onValueChange={onValueChange} options={[{ label: 'Alpha', value: 'a' }]}
            tagRender={(option, onClose) => { closeTag = onClose; return <span>{option.label}</span>; }} />);
        await act(() => closeTag?.());
        expect(onValueChange).toHaveBeenCalledWith([], { reason: 'remove', options: [], event: undefined });
    });

    it('preserves search and highlight when a controlled parent declines a close request', async () => {
        const onOpenChange = mock.fn();
        const onValueChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        const options = [{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }];
        const field = (open: boolean) => <Select aria-label="受控展开" open={open} searchable options={options}
            onOpenChange={onOpenChange} onValueChange={onValueChange} />;
        const view = await render(field(true));
        const control = screen.getByRole('combobox', { name: '受控展开' });
        const input = screen.getByRole('textbox') as HTMLInputElement;
        await changeInputValue(input, 'Beta');
        const beta = screen.getByRole('option', { name: 'Beta' });
        await fireEvent.keyDown(control, { key: 'Escape' });
        expect(onOpenChange).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'trigger' }));
        expect(control.getAttribute('aria-expanded')).toBe('true');
        expect(input.value).toBe('Beta');
        expect(control.getAttribute('aria-activedescendant')).toBe(beta.id);
        expect(screen.queryByRole('option', { name: 'Alpha' })).toBeNull();
        await fireEvent.click(beta);
        expect(onValueChange).toHaveBeenCalledWith('b', expect.objectContaining({ reason: 'select' }));
        expect(onOpenChange).toHaveBeenCalledTimes(2);
        expect(input.value).toBe('Beta');
        expect(control.getAttribute('aria-activedescendant')).toBe(beta.id);
        await view.rerender(field(false));
        expect(screen.queryByRole('textbox')).toBeNull();
        await view.rerender(field(true));
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
        expect(screen.getByRole('option', { name: 'Alpha' })).toBeTruthy();
        expect(onOpenChange).toHaveBeenCalledTimes(2);
    });

    it('updates tag removal names when the locale changes without resetting values', async () => {
        const field = (locale: 'zh-CN' | 'en-US') => <ConfigProvider locale={locale}>
            <Select aria-label="locale-tags" multiple defaultValue={['a']} options={[{ label: 'Alpha', value: 'a' }]} />
        </ConfigProvider>;
        const view = await render(field('zh-CN'));
        const control = screen.getByRole('combobox', { name: 'locale-tags' });
        expect(screen.getByRole('button', { name: '移除 Alpha' })).toBeTruthy();
        await view.rerender(field('en-US'));
        expect(screen.getByRole('combobox', { name: 'locale-tags' })).toBe(control);
        expect(screen.getByRole('button', { name: 'Remove Alpha' })).toBeTruthy();
    });

    it('preserves a named open field and selection when its design boundary changes', async () => {
        const options = [{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }];
        const view = await render(<div data-crab-design="md3"><Select label="工作区" required searchable defaultValue="a" options={options} /></div>);
        const control = screen.getByRole('combobox', { name: '工作区' });
        await fireEvent.click(control);
        const input = screen.getByRole('textbox', { name: '工作区' });
        await changeInputValue(input as HTMLInputElement, 'Beta');
        for (const design of ['apple', 'shadcn']) {
            await view.rerender(<div data-crab-design={design}><Select label="工作区" required searchable defaultValue="a" options={options} /></div>);
            expect(screen.getByRole('combobox', { name: '工作区' })).toBe(control);
            expect(screen.getByRole('textbox', { name: '工作区' })).toBe(input);
            expect((input as HTMLInputElement).value).toBe('Beta');
            expect(control.getAttribute('aria-expanded')).toBe('true');
            expect(control.getAttribute('aria-required')).toBe('true');
        }
        await fireEvent.keyDown(control, { key: 'Enter' });
        expect(control.textContent).toContain('Beta');
        expect(control.getAttribute('aria-expanded')).toBe('false');
    });

    it('announces visible errors through the field description', async () => {
        await render(<Select label="工作区" errorText="请选择一个可用工作区" options={[]} />);
        const field = screen.getByRole('combobox', { name: '工作区' });
        const error = screen.getByRole('alert');
        expect(error.textContent).toBe('请选择一个可用工作区');
        expect(field.getAttribute('aria-describedby')).toBe(error.id);
        expect(field.getAttribute('aria-invalid')).toBe('true');
    });

    it('tracks the active option independently from multiple selected values', async () => {
        await render(<Select aria-label="selected-options" multiple defaultValue={['a', 'b']} options={[
            { label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' },
        ]} />);
        const field = screen.getByRole('combobox', { name: 'selected-options' });
        await fireEvent.click(field);
        await fireEvent.keyDown(field, { key: 'ArrowDown' });
        const alpha = screen.getByRole('option', { name: 'Alpha' });
        const beta = screen.getByRole('option', { name: 'Beta' });
        expect(field.getAttribute('aria-activedescendant')).toBe(alpha.id);
        expect(alpha.getAttribute('data-highlighted')).toBe('true');
        await fireEvent.keyDown(field, { key: 'ArrowDown' });
        expect(field.getAttribute('aria-activedescendant')).toBe(beta.id);
        expect(alpha.getAttribute('data-highlighted')).toBeNull();
        expect(beta.getAttribute('data-highlighted')).toBe('true');
        expect(alpha.getAttribute('aria-selected')).toBe('true');
        expect(beta.getAttribute('aria-selected')).toBe('true');
        await fireEvent.keyDown(field, { key: 'Enter' });
        expect(beta.getAttribute('aria-selected')).toBe('false');
        expect(beta.getAttribute('data-highlighted')).toBe('true');
    });

    it('forwards an external label to the combobox in both search modes', async () => {
        const labelId = 'external-select-label';
        const view = await render(<><span id={labelId}>应用类型</span>
            <Select aria-labelledby={labelId} options={[{ label: '设计系统', value: 'design' }]} />
        </>);
        expect(screen.getByRole('combobox', { name: '应用类型' }).getAttribute('aria-labelledby')).toBe(labelId);
        await view.rerender(<><span id={labelId}>应用类型</span>
            <Select searchable aria-labelledby={labelId} label="内部标签" options={[{ label: '设计系统', value: 'design' }]} />
        </>);
        expect(screen.getByRole('combobox', { name: '应用类型' }).getAttribute('aria-labelledby')).toBe(labelId);
    });

    it('keeps grouped virtual offsets aligned with resized option text', async () => {
        const original = Element.prototype.getBoundingClientRect;
        const measurement = mock.spyOn(Element.prototype, 'getBoundingClientRect').implement(function (this: Element) {
            if (!this.hasAttribute('data-select-option-measure')) return original.call(this);
            return { x: 0, y: 0, top: 0, left: 0, right: 200, bottom: 52, width: 200, height: 52, toJSON: () => ({}) };
        });
        try {
            await render(<Select aria-label="scaled-options" options={[{ label: 'Cities', options: [
                { label: 'Beijing', value: 'beijing' }, { label: 'Shanghai', value: 'shanghai' },
            ] }]}/>);
            await fireEvent.click(screen.getByRole('combobox', { name: 'scaled-options' }));
            expect(virtualRowHeights).toEqual([52, 52, 52]);
            expect(screen.getByRole('listbox').style.getPropertyValue('--select-option-measured-height')).toBe('52px');
            expect(screen.getAllByRole('option')).toHaveLength(2);
        } finally {
            measurement.restore();
        }
    });
    // ─── Basic Rendering ─────────────────────────────────────────────────
    it('renders placeholder and opens dropdown', async () => {
        await render(<Select aria-label='city-select' placeholder='请选择城市' options={[
            { label: 'Beijing', value: 'beijing' },
            { label: 'Shanghai', value: 'shanghai' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'city-select' });
        expect(combobox.textContent).toContain('请选择城市');
        await fireEvent.click(combobox);
        expect(screen.getByRole('listbox')).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Beijing' })).toBeTruthy();
    });
    // ─── Single Select ───────────────────────────────────────────────────
    it('selects one value in single mode', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='city-select' onValueChange={onChange} options={[
            { label: 'Beijing', value: 'beijing' },
            { label: 'Shanghai', value: 'shanghai' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'city-select' });
        await fireEvent.click(combobox);
        const option = screen.getByRole('option', { name: 'Shanghai' });
        const click = new MouseEvent('click', { bubbles: true });
        await act(() => option.dispatchEvent(click));
        expect(onChange).toHaveBeenCalledWith('shanghai', expect.objectContaining({ reason: 'select', option: expect.objectContaining({ value: 'shanghai' }), event: expect.objectContaining({ type: 'click' }) }));
        expect(onChange.calls.calls[0][1].event?.nativeEvent).toBe(click);
        expect(onChange.calls.calls[0][1].event?.target).toBe(option);
        expect(combobox.textContent).toContain('Shanghai');
    });
    // ─── Multiple Select + Search ────────────────────────────────────────
    it('supports multiple mode and filtering', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='lang-select' multiple searchable onValueChange={onChange} options={[
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Rust', value: 'rust' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'lang-select' });
        await fireEvent.click(combobox);
        const input = screen.getByRole('textbox');
        await changeInputValue(input as HTMLInputElement, 'type');
        const option = screen.getByRole('option', { name: 'TypeScript' });
        await fireEvent.click(option);
        expect(onChange).toHaveBeenCalledWith(['typescript'], { reason: 'select', options: [expect.objectContaining({ value: 'typescript' })], event: expect.objectContaining({ type: 'click' }) });
        expect(onChange.calls.calls[0][1].event?.target).toBe(option);
    });
    it('renders a checkbox indicator reflecting selected state in multiple mode', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='indicator-select' multiple defaultValue={['javascript']} onValueChange={onChange} options={[
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
        ]}/>);
        await fireEvent.click(screen.getByRole('combobox', { name: 'indicator-select' }));
        const selectedOption = screen.getByRole('option', { name: 'JavaScript' });
        const unselectedOption = screen.getByRole('option', { name: 'TypeScript' });
        expect(selectedOption.querySelector('input[type="checkbox"]')).toHaveProperty('checked', true);
        expect(unselectedOption.querySelector('input[type="checkbox"]')).toHaveProperty('checked', false);
        // Clicking the row must toggle exactly once — the checkbox is decorative only
        // and must not fire its own change in addition to the row's onClick.
        await fireEvent.click(unselectedOption);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(['javascript', 'typescript'], { reason: 'select', options: [
            expect.objectContaining({ value: 'javascript' }),
            expect.objectContaining({ value: 'typescript' }),
        ], event: expect.objectContaining({ type: 'click' }) });
        expect(onChange.calls.calls[0][1].event?.target).toBe(unselectedOption);
    });

    it('preserves the click event when deselecting an existing option', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label="取消选中" multiple defaultValue={['a']} defaultOpen
            onValueChange={onChange} options={[{ label: 'Alpha', value: 'a' }]} />);
        const option = screen.getByRole('option', { name: 'Alpha' });
        const click = new MouseEvent('click', { bubbles: true });
        await act(() => option.dispatchEvent(click));
        expect(onChange).toHaveBeenCalledWith([], { reason: 'deselect', options: [], event: expect.objectContaining({ type: 'click' }) });
        expect(onChange.calls.calls[0][1].event?.nativeEvent).toBe(click);
        expect(onChange.calls.calls[0][1].event?.target).toBe(option);
    });
    // ─── Disabled ────────────────────────────────────────────────────────
    it('does not open when disabled', async () => {
        await render(<Select aria-label='disabled-select' disabled options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'disabled-select' });
        expect(combobox.getAttribute('aria-disabled')).toBe('true');
        expect(combobox.getAttribute('tabindex')).toBe('-1');
        await fireEvent.click(combobox);
        expect(screen.queryByRole('listbox')).toBeNull();
    });
    it('skips disabled options on click', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='select' onValueChange={onChange} options={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled', disabled: true },
        ]}/>);
        await fireEvent.click(screen.getByRole('combobox'));
        await fireEvent.click(screen.getByRole('option', { name: 'Disabled' }));
        expect(onChange).not.toHaveBeenCalled();
    });
    // ─── Keyboard Navigation ─────────────────────────────────────────────
    it('navigates options with ArrowDown/ArrowUp and selects with Enter', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='kb-select' onValueChange={onChange} options={[
            { label: 'Alpha', value: 'alpha' },
            { label: 'Beta', value: 'beta' },
            { label: 'Gamma', value: 'gamma' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'kb-select' });
        // ArrowDown opens dropdown and highlights first
        await fireEvent.keyDown(combobox, { key: 'ArrowDown' });
        expect(screen.getByRole('listbox')).toBeTruthy();
        // ArrowDown again → second option
        await fireEvent.keyDown(combobox, { key: 'ArrowDown' });
        // Enter selects highlighted
        const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        await act(() => combobox.dispatchEvent(enter));
        expect(onChange).toHaveBeenCalledWith('beta', expect.objectContaining({ reason: 'select', option: expect.objectContaining({ value: 'beta' }), event: expect.objectContaining({ type: 'keydown', key: 'Enter' }) }));
        expect(onChange.calls.calls[0][1].event?.nativeEvent).toBe(enter);
    });
    it('closes dropdown on Escape', async () => {
        await render(<Select aria-label='esc-select' options={[{ label: 'A', value: 'a' }]}/>);
        const combobox = screen.getByRole('combobox', { name: 'esc-select' });
        await fireEvent.click(combobox);
        expect(screen.getByRole('listbox')).toBeTruthy();
        await fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    for (const key of ['Enter', 'Escape', 'click']) {
        it(`returns focus from the disappearing search input after ${key}`, async () => {
            await render(<Select label="团队" searchable defaultValue="a" options={[
                { label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' },
            ]} />);
            const control = screen.getByRole('combobox', { name: '团队' });
            await fireEvent.click(control);
            const search = screen.getByRole('textbox', { name: '团队' });
            await act(() => search.focus());
            await changeInputValue(search as HTMLInputElement, 'Beta');
            expect(document.activeElement).toBe(search);

            if (key === 'click') {
                await fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
            } else {
                await fireEvent.keyDown(search, { key });
            }

            expect(screen.queryByRole('textbox', { name: '团队' })).toBeNull();
            expect(control.getAttribute('aria-expanded')).toBe('false');
            expect(control.textContent).toContain(key === 'Escape' ? 'Alpha' : 'Beta');
            expect(document.activeElement).toBe(control);
        });
    }
    // ─── Clear ───────────────────────────────────────────────────────────
    it('keeps null controlled and lets the parent accept or reject selection and clear', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        const options = [{ label: 'Alpha', value: 'a' }];
        const view = await render(<Select aria-label='controlled' value={null} allowClear onValueChange={onChange} options={options} />);
        const combobox = screen.getByRole('combobox');
        await fireEvent.click(combobox);
        await fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
        expect(onChange).toHaveBeenCalledWith('a', { reason: 'select', option: options[0], options, event: expect.objectContaining({ type: 'click' }) });
        expect(combobox.textContent).toContain('请选择');
        await view.rerender(<Select aria-label='controlled' value='a' allowClear onValueChange={onChange} options={options} />);
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        await fireEvent.click(screen.getByRole('button', { name: '清除' }));
        expect(onChange).toHaveBeenCalledWith(null, { reason: 'clear', option: undefined, options: [], event: expect.objectContaining({ type: 'click' }) });
        expect(combobox.textContent).toContain('Alpha');
        await view.rerender(<Select aria-label='controlled' value={null} allowClear onValueChange={onChange} options={options} />);
        expect(combobox.textContent).toContain('请选择');
    });
    it('clears value when clear button is clicked', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='clear-select' allowClear defaultValue='beijing' onValueChange={onChange} options={[
            { label: 'Beijing', value: 'beijing' },
            { label: 'Shanghai', value: 'shanghai' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'clear-select' });
        expect(combobox.textContent).toContain('Beijing');
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        const clearBtn = screen.getByRole('button', { name: '清除' });
        const click = new MouseEvent('click', { bubbles: true });
        await act(() => clearBtn.dispatchEvent(click));
        expect(onChange).toHaveBeenCalledWith(null, { reason: 'clear', option: undefined, options: [], event: expect.objectContaining({ type: 'click' }) });
        expect(onChange.calls.calls[0][1].event?.nativeEvent).toBe(click);
        expect(onChange.calls.calls[0][1].event?.target).toBe(clearBtn);
        expect(combobox.textContent).toContain('请选择');
    });
    it('renders a Material field label, supporting text, and required semantics', async () => {
        const { container } = await render(<Select
            label='工作城市'
            supportingText='用于安排线下办公地点'
            appearance='filled'
            required
            options={[{ label: '杭州', value: 'hz' }]}
        />);
        const combobox = container.querySelector('[role="combobox"]') as HTMLElement;
        expect(combobox.getAttribute('aria-required')).toBe('true');
        expect(combobox.getAttribute('data-appearance')).toBe('filled');
        expect(document.getElementById(combobox.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('工作城市');
        expect(document.getElementById(combobox.getAttribute('aria-describedby') ?? '')?.textContent).toBe('用于安排线下办公地点');
    });
    it('uses errorText as the field error and invalid state', async () => {
        const { container } = await render(<Select
            label='工作城市'
            supportingText='选择常驻地点'
            errorText='请选择一个城市'
            options={[]}
        />);
        const combobox = container.querySelector('[role="combobox"]') as HTMLElement;
        expect(combobox.getAttribute('aria-invalid')).toBe('true');
        expect(document.getElementById(combobox.getAttribute('aria-describedby') ?? '')?.textContent).toBe('请选择一个城市');
        expect(screen.queryByText('选择常驻地点')).toBeNull();
    });
    it('switches the same slot on hover, preserves clear across descendants and restores the caret on exit', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label="城市" allowClear defaultValue="beijing" onValueChange={onChange} options={[
            { label: '北京', value: 'beijing' },
        ]} />);
        const combobox = screen.getByRole('combobox', { name: '城市' });
        const caret = combobox.querySelector('[data-role="select-caret"]')!;
        expect(screen.queryByRole('button', { name: '清除' })).toBeNull();
        const value = combobox.querySelector('[data-role="select-value"]')!;
        await act(() => value.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        expect(screen.getByRole('button', { name: '清除' })).toBe(caret);
        expect(combobox.querySelector('[data-role="select-caret"]')).toBeNull();
        await act(() => value.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: caret })));
        await act(() => caret.dispatchEvent(new MouseEvent('pointerover', { bubbles: true, relatedTarget: value })));
        const icon = caret.querySelector('svg')!;
        await act(() => caret.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: icon })));
        expect(screen.getByRole('button', { name: '清除' })).toBe(caret);
        await act(() => icon.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: document.body })));
        expect(combobox.querySelector('[data-role="select-caret"]')).toBe(caret);
        await fireEvent.click(combobox);
        expect(combobox.getAttribute('aria-expanded')).toBe('true');
        expect(onChange).not.toHaveBeenCalled();
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        await fireEvent.click(screen.getByRole('button', { name: '清除' }));
        expect(onChange).toHaveBeenCalledWith(null, { reason: 'clear', option: undefined, options: [], event: expect.objectContaining({ type: 'click' }) });
        expect(combobox.getAttribute('aria-expanded')).toBe('false');
        expect(combobox.contains(caret)).toBe(true);
        await fireEvent.click(caret);
        expect(combobox.getAttribute('aria-expanded')).toBe('true');
    });

    for (const key of ['Enter', ' ']) {
        it(`preserves native ${key === ' ' ? 'Space' : 'Enter'} activation without submitting or reopening and restores focus`, async () => {
            const user = userEvent.setup();
            const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
            const onSubmit = mock.fn();
            await render(<form onSubmit={event => { event.preventDefault(); onSubmit(); }}>
                <Select aria-label="城市" allowClear defaultValue="beijing" onValueChange={onChange} options={[
                    { label: '北京', value: 'beijing' },
                ]} />
            </form>);
            const combobox = screen.getByRole('combobox', { name: '城市' });
            await act(() => combobox.focus());
            await act(async () => { await user.tab(); });
            const clearButton = screen.getByRole('button', { name: '清除' });
            expect(document.activeElement).toBe(clearButton);
            expect(clearButton.tagName).toBe('BUTTON');
            expect(clearButton.getAttribute('type')).toBe('button');
            const activation = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
            await act(() => clearButton.dispatchEvent(activation));
            expect(activation.defaultPrevented).toBe(false);
            expect(combobox.getAttribute('aria-expanded')).toBe('false');
            // Wake DOM 不合成原生按钮的键盘 click；浏览器另行验证 Enter / Space。
            await fireEvent.click(clearButton);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(null, { reason: 'clear', option: undefined, options: [], event: expect.objectContaining({ type: 'click' }) });
            expect(onSubmit).not.toHaveBeenCalled();
            expect(screen.queryByRole('button', { name: '清除' })).toBeNull();
            expect(document.activeElement).toBe(combobox);
            expect(combobox.getAttribute('aria-expanded')).toBe('false');
            await fireEvent.keyDown(combobox, { key: 'ArrowDown' });
            expect(screen.getByRole('listbox')).toBeTruthy();
        });
    }
    it('keeps clear reachable from a searchable multi-select while loading', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label="多选" multiple searchable loading allowClear defaultValue={['a', 'b']} onValueChange={onChange}
            options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]} />);
        const control = screen.getByRole('combobox', { name: '多选' });
        await fireEvent.click(control);
        const input = screen.getByRole('textbox');
        await act(() => input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        const clear = screen.getByRole('button', { name: '清除' });
        await act(() => input.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: clear })));
        expect(screen.getByRole('button', { name: '清除' })).toBe(clear);
        expect(control.querySelector('[data-role="select-suffix"]')?.querySelectorAll('button')).toHaveLength(1);
        expect(control.getAttribute('aria-busy')).toBe('true');
        await act(async () => { await userEvent.setup().click(clear); });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([], { reason: 'clear', options: [], event: expect.objectContaining({ type: 'click' }) });
        expect(document.activeElement).toBe(control);
        expect(control.getAttribute('aria-expanded')).toBe('false');
    });

    for (const mode of ['empty', 'disabled', 'no-clear'] as const) {
        it(`keeps only the caret for ${mode} fields on hover`, async () => {
            const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
            await render(<Select aria-label="不可清除" allowClear={mode !== 'no-clear'} disabled={mode === 'disabled'}
                defaultValue={mode === 'empty' ? undefined : 'a'} onValueChange={onChange} options={[{ label: 'Alpha', value: 'a' }]} />);
            const control = screen.getByRole('combobox', { name: '不可清除' });
            await act(() => control.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            expect(screen.queryByRole('button', { name: '清除' })).toBeNull();
            const action = screen.getByRole('button', { name: '展开选项' });
            await act(async () => { await userEvent.setup().click(action); });
            expect(control.getAttribute('aria-expanded')).toBe(mode === 'disabled' ? 'false' : 'true');
            expect(onChange).not.toHaveBeenCalled();
        });
    }

    it('shows clear without hover on touch devices and releases the media listener', async () => {
        const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
        const removeEventListener = mock.fn();
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
            matches: true, addEventListener: () => {}, removeEventListener,
        }) });
        try {
            const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
            const view = await render(<Select aria-label="触屏" allowClear defaultValue="a" onValueChange={onChange} options={[{ label: 'Alpha', value: 'a' }]} />);
            await fireEvent.click(screen.getByRole('button', { name: '清除' }));
            expect(onChange).toHaveBeenCalledWith(null, { reason: 'clear', option: undefined, options: [], event: expect.objectContaining({ type: 'click' }) });
            expect(screen.getByRole('button', { name: '展开选项' })).toBeTruthy();
            await view.unmount();
            expect(removeEventListener).toHaveBeenCalled();
        } finally {
            if (original) Object.defineProperty(window, 'matchMedia', original);
            else Reflect.deleteProperty(window, 'matchMedia');
        }
    });

    // ─── Tag Remove ──────────────────────────────────────────────────────
    it('removes tag via close button in multi mode', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='tag-select' multiple defaultValue={['a', 'b']} onValueChange={onChange} options={[
            { label: 'ItemA', value: 'a' },
            { label: 'ItemB', value: 'b' },
            { label: 'ItemC', value: 'c' },
        ]}/>);
        const removeBtn = screen.getByRole('button', { name: '移除 ItemA' });
        await fireEvent.click(removeBtn);
        expect(onChange).toHaveBeenCalledWith(['b'], { reason: 'remove', options: [expect.objectContaining({ value: 'b' })], event: expect.objectContaining({ type: 'click' }) });
        expect(onChange.calls.calls[0][1].event?.target).toBe(removeBtn);
    });
    // ─── Backspace removes last tag ──────────────────────────────────────
    it('removes last tag on Backspace in searchable multi mode', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        await render(<Select aria-label='bs-select' multiple searchable defaultValue={['a', 'b']} onValueChange={onChange} options={[
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'bs-select' });
        await fireEvent.click(combobox);
        // Backspace with empty search text → removes last tag "b"
        const backspace = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
        await act(() => combobox.dispatchEvent(backspace));
        expect(onChange).toHaveBeenCalledWith(['a'], { reason: 'remove', options: [expect.objectContaining({ value: 'a' })], event: expect.objectContaining({ type: 'keydown', key: 'Backspace' }) });
        expect(onChange.calls.calls[0][1].event?.nativeEvent).toBe(backspace);
    });
    // ─── Option Groups ──────────────────────────────────────────────────
    it('renders grouped options', async () => {
        await render(<Select aria-label='group-select' options={[
            {
                label: 'Fruits',
                options: [
                    { label: 'Apple', value: 'apple' },
                    { label: 'Banana', value: 'banana' },
                ],
            },
            {
                label: 'Vegetables',
                options: [
                    { label: 'Carrot', value: 'carrot' },
                ],
            },
        ]}/>);
        await fireEvent.click(screen.getByRole('combobox'));
        expect(screen.getByText('Fruits')).toBeTruthy();
        expect(screen.getByText('Vegetables')).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Apple' })).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Carrot' })).toBeTruthy();
    });
    // ─── maxTagCount ─────────────────────────────────────────────────────
    it('collapses tags with +N when maxTagCount is set', async () => {
        await render(<Select aria-label='max-tag-select' multiple maxTagCount={2} defaultValue={['a', 'b', 'c', 'd']} options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' },
            { label: 'D', value: 'd' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'max-tag-select' });
        expect(combobox.textContent).toContain('+2');
    });
    // ─── notFoundContent ─────────────────────────────────────────────────
    it('shows custom notFoundContent', async () => {
        await render(<Select aria-label='nf-select' searchable notFoundContent='Nothing here!' options={[{ label: 'Only', value: 'only' }]}/>);
        const combobox = screen.getByRole('combobox', { name: 'nf-select' });
        await fireEvent.click(combobox);
        const input = screen.getByRole('textbox');
        await changeInputValue(input as HTMLInputElement, 'zzz');
        expect(screen.getByText('Nothing here!')).toBeTruthy();
    });
    // ─── Controlled Mode ─────────────────────────────────────────────────
    it('works in controlled mode', async () => {
        const onChange = mock.fn<(value: string | string[] | null, details: SelectChangeDetails) => void>();
        const { rerender } = await render(<Select aria-label='controlled' value='a' onValueChange={onChange} options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'controlled' });
        expect(combobox.textContent).toContain('A');
        await fireEvent.click(combobox);
        await fireEvent.click(screen.getByRole('option', { name: 'B' }));
        expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ reason: 'select', option: expect.objectContaining({ value: 'b' }) }));
        // Value doesn't change without parent update (controlled)
        expect(combobox.textContent).toContain('A');
        // Parent updates value
        await rerender(<Select aria-label='controlled' value='b' onValueChange={onChange} options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ]}/>);
        expect(combobox.textContent).toContain('B');
    });
    // ─── Empty Options ───────────────────────────────────────────────────
    it('renders empty state with no options', async () => {
        await render(<Select aria-label='empty-select' options={[]}/>);
        await fireEvent.click(screen.getByRole('combobox'));
        expect(screen.getByText('暂无选项')).toBeTruthy();
    });
    // ─── Status ──────────────────────────────────────────────────────────
    it('renders with error status', async () => {
        await render(<Select aria-label='error-select' status='error' options={[{ label: 'A', value: 'a' }]}/>);
        const combobox = screen.getByRole('combobox', { name: 'error-select' });
        expect(combobox).toBeTruthy();
    });
    // ─── onOpenChange ────────────────────────────────────────────────────
    it('calls onOpenChange when opening/closing', async () => {
        const onOpenChange = mock.fn();
        await render(<Select aria-label='open-change' onOpenChange={onOpenChange} options={[{ label: 'A', value: 'a' }]}/>);
        const combobox = screen.getByRole('combobox', { name: 'open-change' });
        await fireEvent.click(combobox);
        expect(onOpenChange).toHaveBeenCalledWith(true, { reason: 'trigger' });
        await fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(onOpenChange).toHaveBeenCalledWith(false, { reason: 'trigger' });
    });
});
