import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider, { type ConfigLocale } from '@crab-dev/rc-config-provider';
import LineEdit from '@crab-dev/rc-line-edit';
import useForm from '../hooks/useForm.js';
import { FormValidationError, RuleType, type FormInstance } from '../types.js';

let Form: typeof import('../form.js')['default'];
let Item: typeof import('../item.js')['default'];
beforeAll(async () => {
    Form = (await mock.import<typeof import('../form.js')>('../form.js')).default;
    Item = (await mock.import<typeof import('../item.js')>('../item.js')).default;
});

async function rejectedValidation(validate: () => Promise<unknown>) {
    let failure: unknown;
    await act(async () => {
        try { await validate(); } catch (error) { failure = error; }
    });
    expect(failure).toBeInstanceOf(FormValidationError);
    if (!(failure instanceof FormValidationError)) throw new Error('Expected a field validation failure');
    return failure;
}

function fieldMessage(input: HTMLElement): HTMLElement {
    const message = input.closest('[data-form-item]')?.querySelector<HTMLElement>('[role="alert"]');
    if (!message) throw new Error('Missing visible validation message');
    return message;
}

describe('Form validation locale', () => {
    it('reformats only library feedback while preserving values, field nodes and validation snapshots', async () => {
        type Values = { required: string; invalid: string; custom: string; warning: string };
        const defaults: Values = { required: '', invalid: 'kept draft', custom: 'custom value', warning: 'warning value' };
        let form!: FormInstance<Values>;
        const invalid = mock.fn(() => Promise.reject());
        // Deliberately identical to the initial required feedback: its explicit
        // caller origin must prevent translation by string matching.
        const custom = mock.fn(() => { throw new Error('请输入Name'); });
        const warning = mock.fn(() => Promise.reject());
        const changed = mock.fn();
        function Host({ locale }: { locale: ConfigLocale }) {
            [form] = useForm<Values>();
            return <ConfigProvider locale={locale}>
                <Form form={form} defaultValue={defaults} onFieldValueChange={changed}>
                    <Item name="required" label="Name" required adapter="native"><input aria-label="Required" /></Item>
                    <Item name="invalid" label="Invalid" adapter="native" rules={[{ type: RuleType.ERROR, validator: invalid }]}><input aria-label="Invalid" /></Item>
                    <Item name="custom" label="Custom" adapter="native" rules={[{ type: RuleType.ERROR, validator: custom }]}><input aria-label="Custom" /></Item>
                    <Item name="warning" label="Warning" adapter="native" rules={[{ type: RuleType.WARNING, validator: warning }]}><input aria-label="Warning" /></Item>
                </Form>
            </ConfigProvider>;
        }
        const view = await render(<Host locale="zh-CN" />);
        const fields = ['Required', 'Invalid', 'Custom', 'Warning'].map(name => screen.getByRole('textbox', { name }) as HTMLInputElement);
        const firstForm = form;
        const snapshot = await rejectedValidation(() => form.validateFields());
        const messages = fields.map(fieldMessage);
        expect(messages.map(message => message.textContent)).toEqual(['请输入Name', '输入无效', '请输入Name', '输入无效']);
        expect(fields[3].getAttribute('aria-invalid')).toBeNull();

        for (const locale of ['en-US', 'zh-CN'] as const) {
            await view.rerender(<Host locale={locale} />);
            expect(form).toBe(firstForm);
            expect(form.getFieldsValue()).toEqual(defaults);
            fields.forEach((field, index) => {
                expect(screen.getByRole('textbox', { name: ['Required', 'Invalid', 'Custom', 'Warning'][index] })).toBe(field);
                expect(fieldMessage(field)).toBe(messages[index]);
            });
            expect(messages.map(message => message.textContent)).toEqual(locale === 'en-US'
                ? ['Please enter Name', 'Invalid value', '请输入Name', 'Invalid value']
                : ['请输入Name', '输入无效', '请输入Name', '输入无效']);
            expect(invalid).toHaveBeenCalledTimes(1);
            expect(custom).toHaveBeenCalledTimes(1);
            expect(warning).toHaveBeenCalledTimes(1);
            expect(changed).not.toHaveBeenCalled();
            expect(snapshot.fields).toEqual([
                { name: 'required', errors: ['请输入Name'], warnings: [] },
                { name: 'invalid', errors: ['输入无效'], warnings: [] },
                { name: 'custom', errors: ['请输入Name'], warnings: [] },
                { name: 'warning', errors: [], warnings: ['输入无效'] },
            ]);
        }

        await act(async () => { await form.resetFields(); });
        await view.rerender(<Host locale="en-US" />);
        expect(screen.queryByRole('alert')).toBeNull();
        expect(invalid).toHaveBeenCalledTimes(1);
        expect(changed).not.toHaveBeenCalled();
    });

    it('uses a localized invalid fallback for absent or blank rejection messages', async () => {
        const rejected = [undefined, null, '', ' \t ', new Error(''), new Error(' \n ')];
        let form!: FormInstance<Record<string, string>>;
        function Host({ locale }: { locale: ConfigLocale }) {
            [form] = useForm<Record<string, string>>();
            return <ConfigProvider locale={locale}><Form form={form}>
                {rejected.map((reason, index) => <Item key={index} name={`field-${index}`} adapter="native"
                    rules={[{ type: RuleType.ERROR, validator: () => Promise.reject(reason) }]}>
                    <input aria-label={`Field ${index}`} />
                </Item>)}
            </Form></ConfigProvider>;
        }
        const view = await render(<Host locale="zh-CN" />);
        const first = await rejectedValidation(() => form.validateFields());
        expect(first.fields.map(field => field.errors)).toEqual(rejected.map(() => ['输入无效']));
        await view.rerender(<Host locale="en-US" />);
        expect(screen.getAllByRole('alert').map(alert => alert.textContent)).toEqual(rejected.map(() => 'Invalid value'));
        const next = await rejectedValidation(() => form.validateFields());
        expect(next.fields.map(field => field.errors)).toEqual(rejected.map(() => ['Invalid value']));
    });

    it('formats a pending validation in the completion locale without starting it again', async () => {
        let form!: FormInstance<{ name: string }>;
        const deferred = Promise.withResolvers<void>();
        const validator = mock.fn(() => deferred.promise);
        const rules = [{ type: RuleType.ERROR, validator }];
        function Host({ locale }: { locale: ConfigLocale }) {
            [form] = useForm<{ name: string }>();
            return <ConfigProvider locale={locale}><Form form={form} defaultValue={{ name: '' }}>
                <Item name="name" label="Name" required adapter="native" rules={rules}><input aria-label="Pending" /></Item>
            </Form></ConfigProvider>;
        }
        const view = await render(<Host locale="zh-CN" />);
        const input = screen.getByRole('textbox', { name: 'Pending' });
        let pending!: Promise<unknown>;
        await act(async () => {
            pending = form.validateFields();
            void pending.catch(() => {});
            await Promise.resolve();
        });
        await view.rerender(<Host locale="en-US" />);
        let failure: unknown;
        await act(async () => {
            deferred.reject();
            try { await pending; } catch (error) { failure = error; }
        });
        expect(failure).toBeInstanceOf(FormValidationError);
        if (!(failure instanceof FormValidationError)) throw new Error('Expected a field validation failure');
        expect(failure.fields).toEqual([{ name: 'name', errors: ['Please enter Name', 'Invalid value'], warnings: [] }]);
        expect(fieldMessage(input).textContent).toBe('Please enter Name\nInvalid value');
        expect(screen.getByRole('textbox', { name: 'Pending' })).toBe(input);
        expect(validator).toHaveBeenCalledTimes(1);
    });

    it('updates control-owned feedback without remounting its editor', async () => {
        let form!: FormInstance<{ name: string }>;
        function Host({ locale }: { locale: ConfigLocale }) {
            [form] = useForm<{ name: string }>();
            return <ConfigProvider locale={locale}><Form form={form} defaultValue={{ name: '' }}>
                <Item name="name" label="Name" labelPlacement="control" required><LineEdit /></Item>
            </Form></ConfigProvider>;
        }
        const view = await render(<Host locale="zh-CN" />);
        await rejectedValidation(() => form.validateFields());
        const input = screen.getByRole('textbox', { name: /Name/ });
        const message = screen.getByText('请输入Name');
        await view.rerender(<Host locale="en-US" />);
        expect(screen.getByRole('textbox', { name: /Name/ })).toBe(input);
        expect(screen.getByText('Please enter Name')).toBe(message);
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });
});
