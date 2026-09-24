import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import useForm from '../hooks/useForm.js';
import { FormValidationError, RuleType, type FormInstance } from '../types.js';

let Form: typeof import('../form.js')['default'];
let Item: typeof import('../item.js')['default'];
beforeAll(async () => {
    Form = (await mock.import<typeof import('../form.js')>('../form.js')).default;
    Item = (await mock.import<typeof import('../item.js')>('../item.js')).default;
});

function inputByLabel(text: string): HTMLInputElement {
    const label = [...document.querySelectorAll('label')].find(node => node.textContent === text);
    const input = label ? document.getElementById(label.htmlFor) : null;
    if (!(input instanceof HTMLInputElement)) throw new Error(`Missing label: ${text}`);
    return input;
}

async function edit(input: HTMLInputElement, value: string) {
    await act(() => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
}

describe('Form API contracts', () => {
    it('propagates a business failure and releases the submission lock for retry', async () => {
        let form!: FormInstance<{ name: string }>;
        let attempts = 0;
        const failure = new Error('Save failed');
        function Host() {
            [form] = useForm<{ name: string }>();
            return <Form form={form} defaultValue={{ name: 'Alice' }} onSubmitSuccess={async () => {
                attempts += 1;
                if (attempts === 1) throw failure;
            }} />;
        }
        await render(<Host />);
        let caught: unknown;
        await act(async () => { try { await form.submit(); } catch (error) { caught = error; } });
        expect(caught).toBe(failure);
        await act(async () => { expect((await form.submit()).status).toBe('success'); });
        expect(attempts).toBe(2);
    });
    it('isolates plain snapshots and preserves opaque immutable field values', async () => {
        class CalendarValue {
            constructor(readonly iso: string) {}
            toString() { return this.iso; }
        }
        const date = new CalendarValue('2026-09-22');
        let form!: FormInstance<{ date: CalendarValue; nested: { name: string }; created: Date }>;
        function Host() {
            [form] = useForm<{ date: CalendarValue; nested: { name: string }; created: Date }>();
            return <Form form={form} defaultValue={{ date, nested: { name: 'Original' }, created: new Date(0) }} />;
        }
        await render(<Host />);
        const snapshot = form.getFieldsValue();
        expect(snapshot.date).toBe(date);
        expect(snapshot.date.toString()).toBe('2026-09-22');
        snapshot.nested.name = 'Outside mutation';
        snapshot.created.setTime(1000);
        expect(form.getFieldValue(['nested', 'name'])).toBe('Original');
        expect(form.getFieldValue('created')?.getTime()).toBe(0);
    });
    it('keeps the form instance and edited data across inline defaultValue changes', async () => {
        let form!: FormInstance<{ user: { name: string } }>;
        function Host({ initial, extra = false }: { initial: string; extra?: boolean }) {
            [form] = useForm<{ user: { name: string } }>();
            return <Form form={form} defaultValue={{ user: { name: initial } }}>
                <Item name={['user', 'name']} label='Name' binding='event'><input /></Item>
                {extra && <Item name={['user', 'name']} label='Mirror' binding='event'><input /></Item>}
            </Form>;
        }
        const view = await render(<Host initial='Alice' />);
        const firstInstance = form;
        await edit(inputByLabel('Name'), 'Edited');
        await view.rerender(<Host initial='Server update' extra />);
        expect(form).toBe(firstInstance);
        expect(form.getFieldValue(['user', 'name'])).toBe('Edited');
        expect((inputByLabel('Mirror') as HTMLInputElement).value).toBe('Edited');
        await act(async () => { await form.resetFields(); });
        expect(form.getFieldValue(['user', 'name'])).toBe('Alice');
        await act(() => form.reinitialize({ user: { name: 'New baseline' } }));
        await act(() => form.setFieldValue(['user', 'name'], 'Changed again'));
        await act(async () => { await form.resetFields(); });
        expect((inputByLabel('Name') as HTMLInputElement).value).toBe('New baseline');
    });

    it('binds native events, checked and valueChange without losing child handlers', async () => {
        let form!: FormInstance<{ text: string; enabled: boolean; choice: string }>;
        const original = mock.fn();
        function Choice({ value, onValueChange }: { value?: string; onValueChange?: (value: string) => void }) {
            return <button type='button' onClick={() => onValueChange?.('b')}>{value ?? 'empty'}</button>;
        }
        function Host() {
            [form] = useForm<{ text: string; enabled: boolean; choice: string }>();
            return <Form form={form} defaultValue={{ text: '', enabled: false, choice: 'a' }}>
                <Item name='text' label='Text' binding='event'><input onChange={original} /></Item>
                <Item name='enabled' label='Enabled' binding='checked'><input type='checkbox' /></Item>
                <Item name='choice' binding='valueChange'><Choice onValueChange={original} /></Item>
            </Form>;
        }
        await render(<Host />);
        await edit(inputByLabel('Text'), 'hello');
        await fireEvent.click(inputByLabel('Enabled'));
        await fireEvent.click(screen.getByRole('button', { name: 'a' }));
        expect(form.getFieldsValue()).toEqual({ text: 'hello', enabled: true, choice: 'b' });
        expect(original).toHaveBeenCalledTimes(2);
        expect(original).toHaveBeenCalledWith('b');
    });

    it('waits for submission, coalesces repeats, and lets warnings pass', async () => {
        let form!: FormInstance<{ name: string }>;
        const completed = Promise.withResolvers<void>();
        const onSubmit = mock.fn(() => completed.promise);
        function Host() {
            [form] = useForm<{ name: string }>();
            return <Form form={form} defaultValue={{ name: 'Alice' }} onSubmitSuccess={onSubmit}>
                <Item name='name' label='Name' binding='event' rules={[{
                    type: RuleType.WARNING, validator: () => { throw new Error('Review this value'); },
                }]}><input /></Item>
            </Form>;
        }
        await render(<Host />);
        let pending!: ReturnType<typeof form.submit>;
        let repeated!: ReturnType<typeof form.submit>;
        let settled = false;
        await act(async () => {
            pending = form.submit(); repeated = form.submit();
            void pending.then(() => { settled = true; });
            await Promise.resolve();
        });
        expect(pending).toBe(repeated);
        expect(settled).toBe(false);
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(inputByLabel('Name').getAttribute('aria-invalid')).toBeNull();
        await act(async () => { completed.resolve(); await pending; });
        expect(await pending).toEqual({ status: 'success', values: { name: 'Alice' } });
    });

    it('returns field errors and validates a programmatic change in the same event', async () => {
        let form!: FormInstance<{ name: string }>;
        const onFailed = mock.fn();
        function Host() {
            [form] = useForm<{ name: string }>();
            return <Form form={form} defaultValue={{ name: '' }} onSubmitFailed={onFailed}>
                <Item name='name' label='Name' required binding='event'><input /></Item>
            </Form>;
        }
        await render(<Host />);
        await act(async () => {
            const result = await form.submit();
            expect(result.status).toBe('invalid');
            if (result.status === 'invalid') {
                expect(result.error).toBeInstanceOf(FormValidationError);
                expect(result.error.fields).toEqual([{ name: 'name', errors: ['请输入Name'], warnings: [] }]);
                expect(onFailed).toHaveBeenCalledWith({ name: '' }, result.error);
            }
            form.setFieldValue(['name'], 'Valid');
            expect(await form.validateFields()).toEqual({ name: 'Valid' });
        });
    });
});
