import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, screen } from '@crab-dev/wake/test/react';
import LineEdit from '@crab-dev/rc-line-edit';
let Form: typeof import('../form.js')['default'];
let Item: typeof import('../item.js')['default'];
beforeAll(async () => {
    Form = (await mock.import<typeof import('../form.js')>('../form.js')).default;
    Item = (await mock.import<typeof import('../item.js')>('../item.js')).default;
});
import useForm from '../hooks/useForm.js';
import { RuleType } from '../types.js';
import type { FormInstance } from '../types.js';

describe('Form.Item control 标签与字段反馈', () => {
    it('外部标签将必填标记从可读内容中分离，也不提前显示校验错误', async () => {
        const { container } = await render(<Form defaultValue={{ name: '', note: '' }}>
            <Item name="name" label="姓名" adapter="native" required>
                <input required />
            </Item>
            <Item name="note" label="备注" adapter="native">
                <input />
            </Item>
        </Form>);
        const input = screen.getByRole('textbox', { name: /姓名/ }) as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(input.labels?.length).toBe(1);
        const label = input.labels?.[0];
        expect(label?.querySelector('span:not([aria-hidden])')?.textContent).toBe('姓名');
        expect(label?.querySelector('[aria-hidden="true"]')?.textContent).toBe('*');
        expect(container.querySelectorAll('label [aria-hidden]')).toHaveLength(1);
        expect(screen.getByRole('textbox', { name: /^备注$/ })).toBeTruthy();
        expect(screen.queryByRole('alert')).toBeNull();
    });

    it('由输入字段呈现唯一的关联标签，并保留必填、自定义 ID 和外部说明', async () => {
        await render(<Form defaultValue={{ name: '' }}>
            <span id="name-help">团队成员可见</span>
            <Item name="name" label="姓名" labelPlacement="control" adapter="value" required>
                <LineEdit id="profile-name" aria-describedby="name-help" supportingText="填写真实姓名" />
            </Item>
        </Form>);
        const input = screen.getByRole('textbox', { name: /姓名/ }) as HTMLInputElement;
        expect(input.id).toBe('profile-name');
        expect(input.required).toBe(true);
        expect(input.form?.noValidate).toBe(true);
        const labels = document.querySelectorAll('label[for="profile-name"]');
        expect(labels.length).toBe(1);
        const descriptions = input.getAttribute('aria-describedby')?.split(' ') ?? [];
        expect(descriptions).toContain('name-help');
        expect(descriptions.map(id => document.getElementById(id)?.textContent).join(' ')).toContain('填写真实姓名');
        expect(screen.queryByRole('button', { name: '查看校验提示' })).toBeNull();
    });

    it('校验失败后在字段下显示错误，重新输入时恢复辅助说明', async () => {
        let formApi: FormInstance<{ name: string }> | undefined;
        function Example() {
            const [form] = useForm<{ name: string }>();
            formApi = form;
            return <Form form={form} defaultValue={{ name: '' }}>
                <Item name="name" label="姓名" labelPlacement="control" adapter="value" required>
                    <LineEdit supportingText="填写真实姓名" />
                </Item>
            </Form>;
        }
        await render(<Example />);
        await act(async () => {
            try { await formApi?.validateFields(); }
            catch { /* 验证失败由字段信息区显示。 */ }
        });
        const input = screen.getByRole('textbox', { name: /姓名/ }) as HTMLInputElement;
        expect(input.getAttribute('aria-invalid')).toBe('true');
        const descriptions = input.getAttribute('aria-describedby')?.split(' ') ?? [];
        expect(descriptions.map(id => document.getElementById(id)?.textContent).join(' ')).toContain('请输入姓名');
        expect(screen.queryByText('填写真实姓名')).toBeNull();
        expect(screen.getAllByText('请输入姓名').length).toBe(1);
        expect(screen.queryByRole('button', { name: '查看校验提示' })).toBeNull();
        await act(async () => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, 'Ada');
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(screen.queryByText('请输入姓名')).toBeNull();
        expect(screen.getByText('填写真实姓名')).toBeTruthy();
        expect(formApi?.getFieldValue('name')).toBe('Ada');
    });

    it('渲染函数得到同样的标签、必填与警告说明，警告不会标记为错误', async () => {
        let formApi: FormInstance<{ name: string }> | undefined;
        function Example() {
            const [form] = useForm<{ name: string }>();
            formApi = form;
            return <Form form={form} defaultValue={{ name: 'Ada' }}>
                <Item name="name" label="姓名" labelPlacement="control" required rules={[{
                    type: RuleType.WARNING,
                    validator: async () => { throw new Error('建议补充姓氏'); },
                }]}>
                    {({ validateState: _validateState, onValueChange, value, ...field }) => (
                        <LineEdit {...field} value={typeof value === 'string' ? value : ''}
                            onChange={event => onValueChange?.(event.currentTarget.value)} />
                    )}
                </Item>
            </Form>;
        }
        await render(<Example />);
        await act(async () => { await formApi?.validateFields(); });
        const input = screen.getByRole('textbox', { name: /姓名/ }) as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(screen.getByText('建议补充姓氏')).toBeTruthy();
        expect(screen.queryByRole('button', { name: '查看校验提示' })).toBeNull();
    });
});
