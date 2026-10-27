import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Checkbox, { CheckboxGroup } from '@crab-dev/rc-checkbox';
import useForm from '../hooks/useForm.js';
import { FormValidationError, type FormInstance } from '../types.js';

let Form: typeof import('../form.js')['default'];
let Item: typeof import('../item.js')['default'];
beforeAll(async () => {
    Form = (await mock.import<typeof import('../form.js')>('../form.js')).default;
    Item = (await mock.import<typeof import('../item.js')>('../item.js')).default;
});

describe('Form required value collections', () => {
    it('rejects an empty CheckboxGroup, accepts a checked option, then rejects its reset empty value', async () => {
        type Values = { skills: Array<string | number> };
        let api: FormInstance<Values> | undefined;
        const changed = mock.fn();
        function Example() {
            const [form] = useForm<Values>();
            api = form;
            return <Form form={form} defaultValue={{ skills: [] }}>
                <Item name="skills" label="技能" labelPlacement="external" labelTarget="group" required>
                    <CheckboxGroup onValueChange={changed}><Checkbox value="react">React</Checkbox></CheckboxGroup>
                </Item>
            </Form>;
        }
        await render(<Example />);
        // Wake's role-name query includes text in aria-hidden descendants.
        const group = screen.getByRole('group');
        const captionId = group.getAttribute('aria-labelledby');
        if (!captionId) throw new Error('Missing group caption relationship');
        const caption = document.getElementById(captionId);
        expect(caption?.querySelector('span:not([aria-hidden])')?.textContent).toBe('技能');
        expect(caption?.querySelector('[aria-hidden="true"]')?.textContent).toBe('*');
        const checkbox = screen.getByRole('checkbox', { name: 'React' }) as HTMLInputElement;
        let initialError: unknown;
        await act(async () => {
            try { await api?.validateFields(); }
            catch (error) { initialError = error; }
        });
        expect(initialError).toBeInstanceOf(FormValidationError);
        if (!(initialError instanceof FormValidationError)) throw new Error('Required [] must reject');
        expect(initialError.fields.find(field => field.name === 'skills')?.errors).toEqual(['请输入技能']);
        expect(group.getAttribute('aria-invalid')).toBe('true');
        await act(async () => { await fireEvent.click(checkbox); });
        expect(checkbox.checked).toBe(true);
        expect(api?.getFieldValue('skills')).toEqual(['react']);
        let selectedValues: unknown;
        await act(async () => { selectedValues = await api?.validateFields(); });
        expect(selectedValues).toEqual({ skills: ['react'] });
        expect(group.getAttribute('aria-invalid')).toBeNull();
        expect(changed).toHaveBeenCalledTimes(1);
        await act(async () => { await api?.resetFields(); });
        expect(checkbox.checked).toBe(false);
        expect(api?.getFieldValue('skills')).toEqual([]);
        expect(changed).toHaveBeenCalledTimes(1);
        let resetError: unknown;
        await act(async () => {
            try { await api?.validateFields(); }
            catch (error) { resetError = error; }
        });
        expect(resetError).toBeInstanceOf(FormValidationError);
        if (!(resetError instanceof FormValidationError)) throw new Error('Reset required [] must reject');
        expect(resetError.fields.find(field => field.name === 'skills')?.errors).toEqual(['请输入技能']);
        expect(group.getAttribute('aria-invalid')).toBe('true');
    });

    it('keeps zero, false, whitespace, objects and nonempty tuple shapes outside missing-value inference', async () => {
        const defaults = { zero: 0, flag: false, whitespace: ' ', object: {}, partialDate: [null, '2026-10-27'], emptySlots: [null, null] };
        let api: FormInstance<typeof defaults> | undefined;
        function Example() {
            const [form] = useForm<typeof defaults>();
            api = form;
            return <Form form={form} defaultValue={defaults}>
                {Object.keys(defaults).map(name => <Item key={name} name={name} label={name} required>
                    {({ id, value }) => <output id={id}>{String(value)}</output>}
                </Item>)}
            </Form>;
        }
        await render(<Example />);
        let values: unknown;
        await act(async () => { values = await api?.validateFields(); });
        expect(values).toEqual(defaults);
        expect(screen.queryByRole('alert')).toBeNull();
    });
});
