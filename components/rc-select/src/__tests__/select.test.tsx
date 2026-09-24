import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, userEvent } from "@crab-dev/wake/test/react";
import type { ReactNode } from 'react';
let virtualRowHeights: number[] = [];
beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
mock.module('@crab-dev/rc-virtual', () => ({
    __esModule: true,
    default: ({ renderRows, gridTemplateRows, }: {
        renderRows: (rowRange: [
            number,
            number
        ], columnRange: [
            number,
            number
        ]) => ReactNode;
        gridTemplateRows: number[];
    }) => {
        virtualRowHeights = gridTemplateRows;
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
        const onChange = mock.fn();
        await render(<Select aria-label='city-select' onChange={onChange} options={[
            { label: 'Beijing', value: 'beijing' },
            { label: 'Shanghai', value: 'shanghai' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'city-select' });
        await fireEvent.click(combobox);
        await fireEvent.click(screen.getByRole('option', { name: 'Shanghai' }));
        expect(onChange).toHaveBeenCalledWith('shanghai', expect.objectContaining({ value: 'shanghai' }));
        expect(combobox.textContent).toContain('Shanghai');
    });
    // ─── Multiple Select + Search ────────────────────────────────────────
    it('supports multiple mode and filtering', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='lang-select' multiple searchable onChange={onChange} options={[
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
        expect(onChange).toHaveBeenCalledWith(['typescript'], [expect.objectContaining({ value: 'typescript' })]);
    });
    it('renders a checkbox indicator reflecting selected state in multiple mode', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='indicator-select' multiple defaultValue={['javascript']} onChange={onChange} options={[
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
        expect(onChange).toHaveBeenCalledWith(['javascript', 'typescript'], [
            expect.objectContaining({ value: 'javascript' }),
            expect.objectContaining({ value: 'typescript' }),
        ]);
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
        const onChange = mock.fn();
        await render(<Select aria-label='select' onChange={onChange} options={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled', disabled: true },
        ]}/>);
        await fireEvent.click(screen.getByRole('combobox'));
        await fireEvent.click(screen.getByRole('option', { name: 'Disabled' }));
        expect(onChange).not.toHaveBeenCalled();
    });
    // ─── Keyboard Navigation ─────────────────────────────────────────────
    it('navigates options with ArrowDown/ArrowUp and selects with Enter', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='kb-select' onChange={onChange} options={[
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
        await fireEvent.keyDown(combobox, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('beta', expect.objectContaining({ value: 'beta' }));
    });
    it('closes dropdown on Escape', async () => {
        await render(<Select aria-label='esc-select' options={[{ label: 'A', value: 'a' }]}/>);
        const combobox = screen.getByRole('combobox', { name: 'esc-select' });
        await fireEvent.click(combobox);
        expect(screen.getByRole('listbox')).toBeTruthy();
        await fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
    });
    // ─── Clear ───────────────────────────────────────────────────────────
    it('keeps null controlled and lets the parent accept or reject selection and clear', async () => {
        const onChange = mock.fn();
        const options = [{ label: 'Alpha', value: 'a' }];
        const view = await render(<Select aria-label='controlled' value={null} allowClear onChange={onChange} options={options} />);
        const combobox = screen.getByRole('combobox');
        await fireEvent.click(combobox);
        await fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
        expect(onChange).toHaveBeenCalledWith('a', options[0]);
        expect(combobox.textContent).toContain('请选择');
        await view.rerender(<Select aria-label='controlled' value='a' allowClear onChange={onChange} options={options} />);
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(onChange).toHaveBeenCalledWith(null, undefined);
        expect(combobox.textContent).toContain('Alpha');
        await view.rerender(<Select aria-label='controlled' value={null} allowClear onChange={onChange} options={options} />);
        expect(combobox.textContent).toContain('请选择');
    });
    it('clears value when clear button is clicked', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='clear-select' allowClear defaultValue='beijing' onChange={onChange} options={[
            { label: 'Beijing', value: 'beijing' },
            { label: 'Shanghai', value: 'shanghai' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'clear-select' });
        expect(combobox.textContent).toContain('Beijing');
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        const clearBtn = screen.getByRole('button', { name: 'Clear' });
        await fireEvent.click(clearBtn);
        expect(onChange).toHaveBeenCalledWith(null, undefined);
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
        expect(document.getElementById(combobox.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('工作城市 *');
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
        const onChange = mock.fn();
        await render(<Select aria-label="城市" allowClear defaultValue="beijing" onChange={onChange} options={[
            { label: '北京', value: 'beijing' },
        ]} />);
        const combobox = screen.getByRole('combobox', { name: '城市' });
        const caret = combobox.querySelector('[data-role="select-caret"]')!;
        expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
        const value = combobox.querySelector('[data-role="select-value"]')!;
        await act(() => value.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        expect(screen.getByRole('button', { name: 'Clear' })).toBe(caret);
        expect(combobox.querySelector('[data-role="select-caret"]')).toBeNull();
        await act(() => value.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: caret })));
        await act(() => caret.dispatchEvent(new MouseEvent('pointerover', { bubbles: true, relatedTarget: value })));
        const icon = caret.querySelector('svg')!;
        await act(() => caret.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: icon })));
        expect(screen.getByRole('button', { name: 'Clear' })).toBe(caret);
        await act(() => icon.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: document.body })));
        expect(combobox.querySelector('[data-role="select-caret"]')).toBe(caret);
        await fireEvent.click(combobox);
        expect(combobox.getAttribute('aria-expanded')).toBe('true');
        expect(onChange).not.toHaveBeenCalled();
        await act(() => combobox.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(onChange).toHaveBeenCalledWith(null, undefined);
        expect(combobox.getAttribute('aria-expanded')).toBe('false');
        expect(combobox.contains(caret)).toBe(true);
        await fireEvent.click(caret);
        expect(combobox.getAttribute('aria-expanded')).toBe('true');
    });

    for (const key of ['Enter', ' ']) {
        it(`preserves native ${key === ' ' ? 'Space' : 'Enter'} activation without submitting or reopening and restores focus`, async () => {
            const user = userEvent.setup();
            const onChange = mock.fn();
            const onSubmit = mock.fn();
            await render(<form onSubmit={event => { event.preventDefault(); onSubmit(); }}>
                <Select aria-label="城市" allowClear defaultValue="beijing" onChange={onChange} options={[
                    { label: '北京', value: 'beijing' },
                ]} />
            </form>);
            const combobox = screen.getByRole('combobox', { name: '城市' });
            await act(() => combobox.focus());
            await act(async () => { await user.tab(); });
            const clearButton = screen.getByRole('button', { name: 'Clear' });
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
            expect(onChange).toHaveBeenCalledWith(null, undefined);
            expect(onSubmit).not.toHaveBeenCalled();
            expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
            expect(document.activeElement).toBe(combobox);
            expect(combobox.getAttribute('aria-expanded')).toBe('false');
            await fireEvent.keyDown(combobox, { key: 'ArrowDown' });
            expect(screen.getByRole('listbox')).toBeTruthy();
        });
    }
    it('keeps clear reachable from a searchable multi-select while loading', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label="多选" multiple searchable loading allowClear defaultValue={['a', 'b']} onChange={onChange}
            options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]} />);
        const control = screen.getByRole('combobox', { name: '多选' });
        await fireEvent.click(control);
        const input = screen.getByRole('textbox');
        await act(() => input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        const clear = screen.getByRole('button', { name: 'Clear' });
        await act(() => input.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: clear })));
        expect(screen.getByRole('button', { name: 'Clear' })).toBe(clear);
        expect(control.querySelector('[data-role="select-suffix"]')?.querySelectorAll('button')).toHaveLength(1);
        expect(control.getAttribute('aria-busy')).toBe('true');
        await act(async () => { await userEvent.setup().click(clear); });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([], []);
        expect(document.activeElement).toBe(control);
        expect(control.getAttribute('aria-expanded')).toBe('false');
    });

    for (const mode of ['empty', 'disabled', 'no-clear'] as const) {
        it(`keeps only the caret for ${mode} fields on hover`, async () => {
            const onChange = mock.fn();
            await render(<Select aria-label="不可清除" allowClear={mode !== 'no-clear'} disabled={mode === 'disabled'}
                defaultValue={mode === 'empty' ? undefined : 'a'} onChange={onChange} options={[{ label: 'Alpha', value: 'a' }]} />);
            const control = screen.getByRole('combobox', { name: '不可清除' });
            await act(() => control.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
            const action = screen.getByRole('button', { name: 'Open options' });
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
            const onChange = mock.fn();
            const view = await render(<Select aria-label="触屏" allowClear defaultValue="a" onChange={onChange} options={[{ label: 'Alpha', value: 'a' }]} />);
            await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
            expect(onChange).toHaveBeenCalledWith(null, undefined);
            expect(screen.getByRole('button', { name: 'Open options' })).toBeTruthy();
            await view.unmount();
            expect(removeEventListener).toHaveBeenCalled();
        } finally {
            if (original) Object.defineProperty(window, 'matchMedia', original);
            else Reflect.deleteProperty(window, 'matchMedia');
        }
    });

    // ─── Tag Remove ──────────────────────────────────────────────────────
    it('removes tag via close button in multi mode', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='tag-select' multiple defaultValue={['a', 'b']} onChange={onChange} options={[
            { label: 'ItemA', value: 'a' },
            { label: 'ItemB', value: 'b' },
            { label: 'ItemC', value: 'c' },
        ]}/>);
        const removeBtn = screen.getByRole('button', { name: 'Remove ItemA' });
        await fireEvent.click(removeBtn);
        expect(onChange).toHaveBeenCalledWith(['b'], [expect.objectContaining({ value: 'b' })]);
    });
    // ─── Backspace removes last tag ──────────────────────────────────────
    it('removes last tag on Backspace in searchable multi mode', async () => {
        const onChange = mock.fn();
        await render(<Select aria-label='bs-select' multiple searchable defaultValue={['a', 'b']} onChange={onChange} options={[
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'bs-select' });
        await fireEvent.click(combobox);
        // Backspace with empty search text → removes last tag "b"
        await fireEvent.keyDown(combobox, { key: 'Backspace' });
        expect(onChange).toHaveBeenCalledWith(['a'], [expect.objectContaining({ value: 'a' })]);
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
        const onChange = mock.fn();
        const { rerender } = await render(<Select aria-label='controlled' value='a' onChange={onChange} options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ]}/>);
        const combobox = screen.getByRole('combobox', { name: 'controlled' });
        expect(combobox.textContent).toContain('A');
        await fireEvent.click(combobox);
        await fireEvent.click(screen.getByRole('option', { name: 'B' }));
        expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ value: 'b' }));
        // Value doesn't change without parent update (controlled)
        expect(combobox.textContent).toContain('A');
        // Parent updates value
        await rerender(<Select aria-label='controlled' value='b' onChange={onChange} options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
        ]}/>);
        expect(combobox.textContent).toContain('B');
    });
    // ─── Empty Options ───────────────────────────────────────────────────
    it('renders empty state with no options', async () => {
        await render(<Select aria-label='empty-select' options={[]}/>);
        await fireEvent.click(screen.getByRole('combobox'));
        expect(screen.getByText('无匹配选项')).toBeTruthy();
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
        expect(onOpenChange).toHaveBeenCalledWith(true);
        await fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
