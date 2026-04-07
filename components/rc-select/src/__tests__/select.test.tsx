import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { ReactNode } from 'react';

beforeAll(() => {
    (globalThis as Record<string, unknown>).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

jest.mock('@crab-dev/rc-virtual', () => ({
    __esModule: true,
    default: ({
        renderRows,
        gridTemplateRows,
    }: {
        renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode;
        gridTemplateRows: number[];
    }) => {
        const lastRowIndex = Math.max(gridTemplateRows.length - 1, 0);
        return <div>{renderRows([0, lastRowIndex], [0, 0])}</div>;
    },
}));

jest.mock('@crab-dev/rc-dropdown-container', () => {
    const mockReact = jest.requireActual('react') as typeof import('react');

    type MockDropdownContextValue = {
        state: { open: boolean };
        dispatch: (action: { type: 'setOpen'; payload: boolean }) => void;
        refs: { setReference: () => void };
    };

    const DropdownContext = mockReact.createContext<MockDropdownContextValue | null>(null);

    function MockDropdownContainer({ children, overlay }: { children: ReactNode; overlay: ReactNode }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = mockReact.useMemo(
            () => ({
                state: { open },
                dispatch: (action: { type: 'setOpen'; payload: boolean }) => {
                    if (action.type === 'setOpen') {
                        setOpen(action.payload);
                    }
                },
                refs: { setReference: () => {} },
            }),
            [open],
        );

        return (
            <div>
                <DropdownContext.Provider value={ctx}>
                    {children}
                    {open ? overlay : null}
                </DropdownContext.Provider>
            </div>
        );
    }

    function useDropdownContext() {
        const context = mockReact.useContext(DropdownContext);
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

import Select from '../index.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('Select', () => {
    afterEach(() => {
        cleanup();
    });

    // ─── Basic Rendering ─────────────────────────────────────────────────

    it('renders placeholder and opens dropdown', () => {
        render(
            <Select
                aria-label='city-select'
                placeholder='请选择城市'
                options={[
                    { label: 'Beijing', value: 'beijing' },
                    { label: 'Shanghai', value: 'shanghai' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'city-select' });
        expect(combobox.textContent).toContain('请选择城市');

        fireEvent.click(combobox);

        expect(screen.getByRole('listbox')).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Beijing' })).toBeTruthy();
    });

    // ─── Single Select ───────────────────────────────────────────────────

    it('selects one value in single mode', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='city-select'
                onChange={onChange}
                options={[
                    { label: 'Beijing', value: 'beijing' },
                    { label: 'Shanghai', value: 'shanghai' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'city-select' });
        fireEvent.click(combobox);
        fireEvent.click(screen.getByRole('option', { name: 'Shanghai' }));

        expect(onChange).toHaveBeenCalledWith('shanghai', expect.objectContaining({ value: 'shanghai' }));
        expect(combobox.textContent).toContain('Shanghai');
    });

    // ─── Multiple Select + Search ────────────────────────────────────────

    it('supports multiple mode and filtering', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='lang-select'
                multiple
                searchable
                onChange={onChange}
                options={[
                    { label: 'JavaScript', value: 'javascript' },
                    { label: 'TypeScript', value: 'typescript' },
                    { label: 'Rust', value: 'rust' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'lang-select' });
        fireEvent.click(combobox);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'type' } });

        const option = screen.getByRole('option', { name: 'TypeScript' });
        fireEvent.click(option);

        expect(onChange).toHaveBeenCalledWith(
            ['typescript'],
            [expect.objectContaining({ value: 'typescript' })],
        );
    });

    // ─── Disabled ────────────────────────────────────────────────────────

    it('does not open when disabled', () => {
        render(
            <Select
                aria-label='disabled-select'
                disabled
                options={[
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'disabled-select' });
        expect(combobox.getAttribute('aria-disabled')).toBe('true');
        expect(combobox.getAttribute('tabindex')).toBe('-1');

        fireEvent.click(combobox);
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('skips disabled options on click', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='select'
                onChange={onChange}
                options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Disabled', value: 'disabled', disabled: true },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('combobox'));
        fireEvent.click(screen.getByRole('option', { name: 'Disabled' }));

        expect(onChange).not.toHaveBeenCalled();
    });

    // ─── Keyboard Navigation ─────────────────────────────────────────────

    it('navigates options with ArrowDown/ArrowUp and selects with Enter', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='kb-select'
                onChange={onChange}
                options={[
                    { label: 'Alpha', value: 'alpha' },
                    { label: 'Beta', value: 'beta' },
                    { label: 'Gamma', value: 'gamma' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'kb-select' });

        // ArrowDown opens dropdown and highlights first
        fireEvent.keyDown(combobox, { key: 'ArrowDown' });
        expect(screen.getByRole('listbox')).toBeTruthy();

        // ArrowDown again → second option
        fireEvent.keyDown(combobox, { key: 'ArrowDown' });

        // Enter selects highlighted
        fireEvent.keyDown(combobox, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith('beta', expect.objectContaining({ value: 'beta' }));
    });

    it('closes dropdown on Escape', () => {
        render(
            <Select
                aria-label='esc-select'
                options={[{ label: 'A', value: 'a' }]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'esc-select' });
        fireEvent.click(combobox);
        expect(screen.getByRole('listbox')).toBeTruthy();

        fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    // ─── Clear ───────────────────────────────────────────────────────────

    it('clears value when clear button is clicked', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='clear-select'
                allowClear
                defaultValue='beijing'
                onChange={onChange}
                options={[
                    { label: 'Beijing', value: 'beijing' },
                    { label: 'Shanghai', value: 'shanghai' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'clear-select' });
        expect(combobox.textContent).toContain('Beijing');

        const clearBtn = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearBtn);

        expect(onChange).toHaveBeenCalledWith(undefined, undefined);
        expect(combobox.textContent).toContain('请选择');
    });

    // ─── Tag Remove ──────────────────────────────────────────────────────

    it('removes tag via close button in multi mode', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='tag-select'
                multiple
                defaultValue={['a', 'b']}
                onChange={onChange}
                options={[
                    { label: 'ItemA', value: 'a' },
                    { label: 'ItemB', value: 'b' },
                    { label: 'ItemC', value: 'c' },
                ]}
            />,
        );

        const removeBtn = screen.getByRole('button', { name: 'Remove ItemA' });
        fireEvent.click(removeBtn);

        expect(onChange).toHaveBeenCalledWith(
            ['b'],
            [expect.objectContaining({ value: 'b' })],
        );
    });

    // ─── Backspace removes last tag ──────────────────────────────────────

    it('removes last tag on Backspace in searchable multi mode', () => {
        const onChange = jest.fn();

        render(
            <Select
                aria-label='bs-select'
                multiple
                searchable
                defaultValue={['a', 'b']}
                onChange={onChange}
                options={[
                    { label: 'Alpha', value: 'a' },
                    { label: 'Beta', value: 'b' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'bs-select' });
        fireEvent.click(combobox);

        // Backspace with empty search text → removes last tag "b"
        fireEvent.keyDown(combobox, { key: 'Backspace' });

        expect(onChange).toHaveBeenCalledWith(
            ['a'],
            [expect.objectContaining({ value: 'a' })],
        );
    });

    // ─── Option Groups ──────────────────────────────────────────────────

    it('renders grouped options', () => {
        render(
            <Select
                aria-label='group-select'
                options={[
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
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('combobox'));

        expect(screen.getByText('Fruits')).toBeTruthy();
        expect(screen.getByText('Vegetables')).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Apple' })).toBeTruthy();
        expect(screen.getByRole('option', { name: 'Carrot' })).toBeTruthy();
    });

    // ─── maxTagCount ─────────────────────────────────────────────────────

    it('collapses tags with +N when maxTagCount is set', () => {
        render(
            <Select
                aria-label='max-tag-select'
                multiple
                maxTagCount={2}
                defaultValue={['a', 'b', 'c', 'd']}
                options={[
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                    { label: 'C', value: 'c' },
                    { label: 'D', value: 'd' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'max-tag-select' });
        expect(combobox.textContent).toContain('+2');
    });

    // ─── notFoundContent ─────────────────────────────────────────────────

    it('shows custom notFoundContent', () => {
        render(
            <Select
                aria-label='nf-select'
                searchable
                notFoundContent='Nothing here!'
                options={[{ label: 'Only', value: 'only' }]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'nf-select' });
        fireEvent.click(combobox);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'zzz' } });

        expect(screen.getByText('Nothing here!')).toBeTruthy();
    });

    // ─── Controlled Mode ─────────────────────────────────────────────────

    it('works in controlled mode', () => {
        const onChange = jest.fn();

        const { rerender } = render(
            <Select
                aria-label='controlled'
                value='a'
                onChange={onChange}
                options={[
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                ]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'controlled' });
        expect(combobox.textContent).toContain('A');

        fireEvent.click(combobox);
        fireEvent.click(screen.getByRole('option', { name: 'B' }));
        expect(onChange).toHaveBeenCalledWith('b', expect.objectContaining({ value: 'b' }));

        // Value doesn't change without parent update (controlled)
        expect(combobox.textContent).toContain('A');

        // Parent updates value
        rerender(
            <Select
                aria-label='controlled'
                value='b'
                onChange={onChange}
                options={[
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                ]}
            />,
        );
        expect(combobox.textContent).toContain('B');
    });

    // ─── Empty Options ───────────────────────────────────────────────────

    it('renders empty state with no options', () => {
        render(
            <Select
                aria-label='empty-select'
                options={[]}
            />,
        );

        fireEvent.click(screen.getByRole('combobox'));
        expect(screen.getByText('无匹配选项')).toBeTruthy();
    });

    // ─── Status ──────────────────────────────────────────────────────────

    it('renders with error status', () => {
        render(
            <Select
                aria-label='error-select'
                status='error'
                options={[{ label: 'A', value: 'a' }]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'error-select' });
        expect(combobox).toBeTruthy();
    });

    // ─── onOpenChange ────────────────────────────────────────────────────

    it('calls onOpenChange when opening/closing', () => {
        const onOpenChange = jest.fn();

        render(
            <Select
                aria-label='open-change'
                onOpenChange={onOpenChange}
                options={[{ label: 'A', value: 'a' }]}
            />,
        );

        const combobox = screen.getByRole('combobox', { name: 'open-change' });

        fireEvent.click(combobox);
        expect(onOpenChange).toHaveBeenCalledWith(true);

        fireEvent.keyDown(combobox, { key: 'Escape' });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
