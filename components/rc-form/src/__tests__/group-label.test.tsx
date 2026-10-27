import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, screen } from '@crab-dev/wake/test/react';
import Checkbox, { CheckboxGroup } from '@crab-dev/rc-checkbox';
import Radio, { RadioGroup } from '@crab-dev/rc-radio';
import ConfigProvider from '@crab-dev/rc-config-provider';
import LineEdit from '@crab-dev/rc-line-edit';
import useForm from '../hooks/useForm.js';
import { RuleType, type FormInstance } from '../types.js';

let Form: typeof import('../form.js')['default'];
let Item: typeof import('../item.js')['default'];
beforeAll(async () => {
    Form = (await mock.import<typeof import('../form.js')>('../form.js')).default;
    Item = (await mock.import<typeof import('../item.js')>('../item.js')).default;
});

function caption(group: HTMLElement): HTMLElement {
    const id = group.getAttribute('aria-labelledby');
    if (!id) throw new Error('Missing group caption relationship');
    const label = document.getElementById(id);
    if (!label) throw new Error('Missing actual caption');
    return label;
}

describe('Form.Item external group labels', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`names each group while preserving option names: ${designSystem}/${colorMode}`, async () => {
                const { container } = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <Form defaultValue={{ skills: ['typescript'], plan: 'pro' }}>
                        <Item name="skills" label={<span>技能</span>} labelPlacement="external" labelTarget="group">
                            <CheckboxGroup>
                                <Checkbox value="typescript">TypeScript</Checkbox>
                                <Checkbox value="react">React</Checkbox>
                            </CheckboxGroup>
                        </Item>
                        <Item name="plan" label="套餐" labelPlacement="external" labelTarget="group">
                            <RadioGroup>
                                <Radio value="free">Free</Radio>
                                <Radio value="pro">Pro</Radio>
                            </RadioGroup>
                        </Item>
                    </Form>
                </ConfigProvider>);
                const skills = screen.getByRole('group', { name: '技能' });
                const plan = screen.getByRole('radiogroup', { name: '套餐' });
                expect(caption(skills).textContent).toBe('技能');
                expect(caption(plan).textContent).toBe('套餐');
                expect(caption(skills).id === caption(plan).id).toBe(false);
                expect(skills.id === plan.id).toBe(false);
                expect(skills.contains(screen.getByRole('checkbox', { name: 'TypeScript' }))).toBe(true);
                expect(skills.contains(screen.getByRole('checkbox', { name: 'React' }))).toBe(true);
                expect(plan.contains(screen.getByRole('radio', { name: 'Free' }))).toBe(true);
                expect(plan.contains(screen.getByRole('radio', { name: 'Pro' }))).toBe(true);
                expect(container.querySelector('label[for="' + skills.id + '"]')).toBeNull();
                expect(container.querySelector('label[for="' + plan.id + '"]')).toBeNull();
                const ids = [...container.querySelectorAll('[id]')].map(node => node.id);
                expect(new Set(ids).size).toBe(ids.length);
            });
        }
    }

    it('provides the same caption metadata to a render-prop without naming the first option', async () => {
        await render(<Form defaultValue={{ skills: ['typescript'] }}>
            <Item name="skills" label="技能" labelPlacement="external" labelTarget="group">
                {({ id, value, onValueChange, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy }) => (
                    <CheckboxGroup id={id} aria-labelledby={labelledBy} aria-describedby={describedBy}
                        value={Array.isArray(value) ? value.filter((entry: unknown): entry is string | number => typeof entry === 'string' || typeof entry === 'number') : []}
                        onValueChange={onValueChange}>
                        <Checkbox value="typescript">TypeScript</Checkbox>
                        <Checkbox value="react">React</Checkbox>
                    </CheckboxGroup>
                )}
            </Item>
        </Form>);
        const group = screen.getByRole('group', { name: '技能' });
        expect(caption(group).textContent).toBe('技能');
        const first = screen.getByRole('checkbox', { name: 'TypeScript' });
        expect(first.id === group.id).toBe(false);
        expect(first.getAttribute('aria-labelledby')).toBeNull();
    });

    it('preserves explicit editor names and their referenced caption priority', async () => {
        await render(<Form defaultValue={{ skills: [], plan: 'free' }}>
            <span id="explicit-plan-caption">现有套餐名称</span>
            <Item name="skills" label="可见技能标题" labelPlacement="external" labelTarget="group">
                <CheckboxGroup aria-label="现有技能名称"><Checkbox value="react">React</Checkbox></CheckboxGroup>
            </Item>
            <Item name="plan" label="可见套餐标题" labelPlacement="external" labelTarget="group">
                <RadioGroup aria-labelledby="explicit-plan-caption" aria-label="备用名称"><Radio value="free">Free</Radio></RadioGroup>
            </Item>
        </Form>);
        expect(screen.getByRole('group', { name: '现有技能名称' }).getAttribute('aria-labelledby')).toBeNull();
        expect(screen.getByRole('radiogroup', { name: '现有套餐名称' }).getAttribute('aria-labelledby')).toBe('explicit-plan-caption');
        expect(screen.getByRole('radio', { name: 'Free' })).toBeTruthy();
    });

    it('keeps external help and validation attached to the group root', async () => {
        let api: FormInstance<{ skills: string[] }> | undefined;
        function Example() {
            const [form] = useForm<{ skills: string[] }>();
            api = form;
            return <Form form={form} defaultValue={{ skills: [] }}>
                <span id="skills-help">可以选择多项</span>
                <Item name="skills" label="技能" labelPlacement="external" labelTarget="group" rules={[{
                    type: RuleType.ERROR,
                    validator: async () => { throw new Error('请选择至少一项技能'); },
                }]}>
                    <CheckboxGroup aria-describedby="skills-help"><Checkbox value="react">React</Checkbox></CheckboxGroup>
                </Item>
            </Form>;
        }
        await render(<Example />);
        await act(async () => {
            try { await api?.validateFields(); }
            catch { /* Expected custom validation failure is exposed by the field. */ }
        });
        const group = screen.getByRole('group', { name: '技能' });
        expect(group.getAttribute('aria-invalid')).toBe('true');
        const ids = group.getAttribute('aria-describedby')?.split(' ') ?? [];
        expect(ids).toContain('skills-help');
        expect(ids.map(id => document.getElementById(id)?.textContent).join(' ')).toContain('请选择至少一项技能');
        expect(screen.getByRole('checkbox', { name: 'React' })).toBeTruthy();
    });

    it('leaves the default single-control label and control-owned layout unchanged', async () => {
        const { container } = await render(<Form defaultValue={{ agree: false, name: 'Ada' }}>
            <Item name="agree" label="协议" adapter="checked"><Checkbox>我同意服务条款</Checkbox></Item>
            <Item name="name" label="姓名" labelPlacement="control"><LineEdit /></Item>
        </Form>);
        const checkbox = screen.getByRole('checkbox', { name: /我同意服务条款/ });
        expect(checkbox.getAttribute('aria-labelledby')).toBeNull();
        expect(container.querySelector('label[for="' + checkbox.id + '"]')).toBeTruthy();
        const input = screen.getByRole('textbox', { name: '姓名' });
        expect(input.getAttribute('aria-labelledby')).toBeNull();
        expect(container.querySelectorAll('label[for="' + input.id + '"]')).toHaveLength(1);
    });

    it('creates and clears the caption relationship when an external group title changes', async () => {
        const fieldChanged = mock.fn();
        const groupChanged = mock.fn();
        function Example({ label }: { label: string | null }) {
            return <Form defaultValue={{ skills: ['typescript'] }} onFieldValueChange={fieldChanged}>
                <Item name="skills" label={label} labelPlacement="external" labelTarget="group">
                    <CheckboxGroup onValueChange={groupChanged}>
                        <Checkbox value="typescript">TypeScript</Checkbox>
                        <Checkbox value="react">React</Checkbox>
                    </CheckboxGroup>
                </Item>
            </Form>;
        }
        const view = await render(<Example label={null} />);
        const initial = screen.getByRole('group');
        const groupId = initial.id;
        expect(groupId.length > 0).toBe(true);
        expect(initial.getAttribute('aria-labelledby')).toBeNull();
        expect((screen.getByRole('checkbox', { name: 'TypeScript' }) as HTMLInputElement).checked).toBe(true);

        await view.rerender(<Example label="动态技能标题" />);
        const named = screen.getByRole('group', { name: '动态技能标题' });
        const title = caption(named);
        const titleId = title.id;
        expect(named.id).toBe(groupId);
        expect(title.tagName).toBe('SPAN');
        expect(title.textContent).toBe('动态技能标题');
        expect(view.container.querySelectorAll('[id="' + titleId + '"]')).toHaveLength(1);
        expect((screen.getByRole('checkbox', { name: 'TypeScript' }) as HTMLInputElement).checked).toBe(true);
        expect(screen.getByRole('checkbox', { name: 'React' }).id === groupId).toBe(false);

        await view.rerender(<Example label={null} />);
        const unnamed = screen.getByRole('group');
        expect(unnamed.id).toBe(groupId);
        expect(unnamed.getAttribute('aria-labelledby')).toBeNull();
        expect(document.getElementById(titleId)).toBeNull();
        expect(screen.queryByText('动态技能标题')).toBeNull();
        for (const node of view.container.querySelectorAll('[aria-labelledby]')) {
            for (const id of (node.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean)) {
                expect(document.getElementById(id)).toBeTruthy();
            }
        }
        expect((screen.getByRole('checkbox', { name: 'TypeScript' }) as HTMLInputElement).checked).toBe(true);
        expect((screen.getByRole('checkbox', { name: 'React' }) as HTMLInputElement).checked).toBe(false);
        expect(fieldChanged).not.toHaveBeenCalled();
        expect(groupChanged).not.toHaveBeenCalled();
    });

    it('lets a render-prop retain an explicit name instead of forwarding the automatic caption', async () => {
        await render(<Form defaultValue={{ skills: ['typescript'] }}>
            <Item name="skills" label="可见技能标题" labelPlacement="external" labelTarget="group">
                {({ id, value, onValueChange }) => (
                    <CheckboxGroup id={id} aria-label="调用方技能名称"
                        value={Array.isArray(value) ? value.filter((entry: unknown): entry is string | number => typeof entry === 'string' || typeof entry === 'number') : []}
                        onValueChange={onValueChange}>
                        <Checkbox value="typescript">TypeScript</Checkbox>
                        <Checkbox value="react">React</Checkbox>
                    </CheckboxGroup>
                )}
            </Item>
        </Form>);
        const group = screen.getByRole('group', { name: '调用方技能名称' });
        expect(group.getAttribute('aria-label')).toBe('调用方技能名称');
        expect(group.getAttribute('aria-labelledby')).toBeNull();
        expect(screen.getByText('可见技能标题')).toBeTruthy();
        expect(screen.queryByRole('group', { name: '可见技能标题' })).toBeNull();
        const first = screen.getByRole('checkbox', { name: 'TypeScript' });
        expect(group.contains(first)).toBe(true);
        expect(group.contains(screen.getByRole('checkbox', { name: 'React' }))).toBe(true);
        expect(first.id === group.id).toBe(false);
        expect(first.getAttribute('aria-labelledby')).toBeNull();
        expect((first as HTMLInputElement).checked).toBe(true);
    });
});
