import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import LineEdit from '@crab-dev/rc-line-edit';
import DatePicker from '@crab-dev/rc-date-picker';
import Select from '@crab-dev/rc-select';
import type { FormInstance } from '../../types.js';
// Geometry exception: actual published Form and all consumer CSS are necessary
// to detect an indirect field being squeezed into the parent's label track.
import Form, { Item, useForm } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

interface Values extends Record<string, unknown> {
    name: string;
    date: Temporal.ZonedDateTime | null;
    project: string | null;
    note: string;
    reference: string;
}

const emptyValues: Values = { name: '', date: null, project: null, note: '', reference: '' };

async function settle() {
    await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
        }
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
}

function requiredElement<T extends HTMLElement>(scope: ParentNode, selector: string): T {
    const element = scope.querySelector<T>(selector);
    if (!element) throw new Error(`Missing real fixture element: ${selector}`);
    return element;
}

function describedText(control: HTMLElement) {
    return (control.getAttribute('aria-describedby')?.split(/\s+/) ?? [])
        .map(id => document.getElementById(id)?.textContent ?? '').join(' ');
}

function assertGeometry(form: HTMLFormElement, designSystem: string, direction: string) {
    const formRect = form.getBoundingClientRect();
    expect(getComputedStyle(form).direction).toBe(direction);
    expect(form.scrollWidth).toBeLessThanOrEqual(form.clientWidth + 1);
    for (const name of ['name', 'date', 'project']) {
        const row = requiredElement<HTMLElement>(form, `[data-control-row="${name}"]`);
        const control = requiredElement<HTMLElement>(row, name === 'project' ? '[role="combobox"]' : '[data-field-control]');
        const input = requiredElement<HTMLElement>(row, name === 'project' ? '[role="combobox"]' : 'input');
        const slot = row.firstElementChild;
        if (!(slot instanceof HTMLElement) || !(slot.firstElementChild instanceof HTMLElement)) throw new Error('Missing actual editor slot');
        for (const element of [row, slot, slot.firstElementChild, control]) {
            const bounds = element.getBoundingClientRect();
            expect(bounds.width).toBeCloseTo(formRect.width, 1);
            expect(bounds.left).toBeCloseTo(formRect.left, 1);
            expect(bounds.right).toBeCloseTo(formRect.right, 1);
        }
        expect(input.getBoundingClientRect().width).toBeGreaterThan(formRect.width * 0.55);
        const label = requiredElement<HTMLElement>(row, name === 'project' ? '[data-role="select-label"]' : 'label');
        const labelRect = label.getBoundingClientRect();
        const controlRect = control.getBoundingClientRect();
        // Apple/shadcn fields own their above-control label layout. Form must
        // not turn only direct LineEdit into a different inline-label design.
        if (designSystem !== 'md3') expect(labelRect.bottom).toBeLessThanOrEqual(controlRect.top + 1);
        expect(labelRect.left).toBeGreaterThanOrEqual(formRect.left - 1);
        expect(labelRect.right).toBeLessThanOrEqual(formRect.right + 1);
        for (const id of input.getAttribute('aria-describedby')?.split(/\s+/) ?? []) {
            const support = document.getElementById(id);
            if (!support) throw new Error(`Dangling description ${id}`);
            const bounds = support.getBoundingClientRect();
            expect(bounds.top).toBeGreaterThanOrEqual(controlRect.bottom - 1);
            expect(bounds.left).toBeGreaterThanOrEqual(formRect.left - 1);
            expect(bounds.right).toBeLessThanOrEqual(formRect.right + 1);
        }
    }
    // The external contract still shares a label track across unequal labels.
    const notes = ['note', 'reference'].map(name => requiredElement<HTMLElement>(form, `[data-external-row="${name}"] [data-field-control]`).getBoundingClientRect());
    expect(notes[0].left).toBeCloseTo(notes[1].left, 1);
    expect(notes[0].right).toBeCloseTo(notes[1].right, 1);
    expect(notes[0].width).toBeGreaterThan(0);
    expect(notes[0].width).toBeLessThan(formRect.width);
}

describe('Form control-owned layout with published composite fields', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                it(`retains full slots, owned labels, feedback and value protocol (${designSystem}/${colorMode}/${direction})`, async () => {
                    const changed = mock.fn();
                    const nameChanged = mock.fn();
                    const dateChanged = mock.fn();
                    const projectChanged = mock.fn();
                    let api: FormInstance<Values> | undefined;
                    function Example({ width }: { width: number }) {
                        const [form] = useForm<Values>();
                        api = form;
                        return <ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction} locale="en-US">
                            <style>{compiledCss}</style>
                            <div style={{ width, padding: 16 }}>
                                <Form form={form} defaultValue={emptyValues} onFieldValueChange={changed}>
                                    <Item data-control-row="name" name="name" label="Name" labelPlacement="control" supportingText="Name help" required>
                                        <LineEdit onValueChange={nameChanged} />
                                    </Item>
                                    <Item data-control-row="date" name="date" label="Date" labelPlacement="control" supportingText="Date help" required>
                                        <DatePicker onValueChange={dateChanged} renderDisplayString={value => value ? value.toPlainDate().toString() : '请选择日期'} />
                                    </Item>
                                    <Item data-control-row="project" name="project" label="Project" labelPlacement="control" supportingText="Project help" required>
                                        <Select onValueChange={projectChanged} options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]} />
                                    </Item>
                                    <Item data-external-row="note" name="note" label="备注"><LineEdit /></Item>
                                    <Item data-external-row="reference" name="reference" label="外部对齐标签"><LineEdit /></Item>
                                </Form>
                            </div>
                        </ConfigProvider>;
                    }
                    const view = await render(<Example width={384} />);
                    const form = requiredElement<HTMLFormElement>(view.container, 'form');
                    const name = requiredElement<HTMLInputElement>(form, '[data-control-row="name"] input');
                    const date = requiredElement<HTMLInputElement>(form, '[data-control-row="date"] input');
                    const project = requiredElement<HTMLElement>(form, '[role="combobox"]');
                    const inputs = [name, date, project];
                    const labels = ['Name', 'Date', 'Project'];
                    for (const [index, input] of inputs.entries()) {
                        if (input instanceof HTMLInputElement) {
                            expect(input.labels).toHaveLength(1);
                            expect(input.labels?.[0].textContent).toContain(labels[index]);
                        } else {
                            const ids = input.getAttribute('aria-labelledby')?.split(/\s+/) ?? [];
                            expect(ids).toHaveLength(1);
                            expect(document.getElementById(ids[0])?.textContent).toBe(labels[index]);
                        }
                    }
                    for (const width of [384, 240]) {
                        await view.rerender(<Example width={width} />);
                        await act(() => api?.reinitialize(emptyValues));
                        await settle();
                        assertGeometry(form, designSystem, direction);
                        expect(date.value).toBe('请选择日期');
                        expect(date.scrollWidth).toBeLessThanOrEqual(date.clientWidth + 1);
                        for (const [index, input] of inputs.entries()) {
                            expect(describedText(input)).toContain(`${labels[index]} help`);
                            expect(input.getAttribute('aria-invalid')).toBeNull();
                        }
                        await act(() => api?.setFieldsValue({ ...emptyValues, name: 'Ada', date: Temporal.ZonedDateTime.from('2026-10-25T12:00:00+00:00[UTC]'), project: 'two' }));
                        await settle();
                        assertGeometry(form, designSystem, direction);
                        expect(name.value).toBe('Ada');
                        expect(date.value).toBe('2026-10-25');
                        expect(project.textContent).toContain('Two');
                        expect(date.scrollWidth).toBeLessThanOrEqual(date.clientWidth + 1);
                        await act(async () => {
                            api?.reinitialize(emptyValues);
                        });
                        await act(async () => {
                            try { await api?.validateFields(); }
                            catch { /* Expected required failures remain visible and associated. */ }
                        });
                        await settle();
                        assertGeometry(form, designSystem, direction);
                        expect(form.querySelectorAll('[role="alert"]')).toHaveLength(3);
                        for (const [index, input] of inputs.entries()) {
                            expect(input.getAttribute('aria-invalid')).toBe('true');
                            expect(describedText(input)).toContain(labels[index]);
                            expect(describedText(input)).not.toContain(`${labels[index]} help`);
                        }
                    }
                    // All external sync above is silent; user operations still
                    // notify Form and the original control handler exactly once.
                    expect(changed).toHaveBeenCalledTimes(0);
                    expect(nameChanged).toHaveBeenCalledTimes(0);
                    expect(dateChanged).toHaveBeenCalledTimes(0);
                    expect(projectChanged).toHaveBeenCalledTimes(0);
                    const user = userEvent.setup();
                    await act(() => user.type(name, 'A'));
                    await settle();
                    expect(api?.getFieldValue('name')).toBe('A');
                    expect(changed).toHaveBeenCalledTimes(1);
                    expect(nameChanged).toHaveBeenCalledTimes(1);
                    expect(name.getAttribute('aria-invalid')).toBeNull();
                    expect(describedText(name)).toContain('Name help');
                    await act(() => user.click(project));
                    await settle();
                    const options = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
                    const one = options.find(option => option.textContent?.trim() === 'One');
                    if (!one) throw new Error('Missing actual Select option One');
                    await act(() => user.click(one));
                    await settle();
                    expect(api?.getFieldValue('project')).toBe('one');
                    expect(changed).toHaveBeenCalledTimes(2);
                    expect(projectChanged).toHaveBeenCalledTimes(1);
                    expect(project.getAttribute('aria-invalid')).toBeNull();
                    expect(describedText(project)).toContain('Project help');
                    expect(form.querySelector('[data-control-row="name"] input')).toBe(name);
                    expect(form.querySelector('[data-control-row="date"] input')).toBe(date);
                    assertGeometry(form, designSystem, direction);
                });
            }
        }
    }
});
