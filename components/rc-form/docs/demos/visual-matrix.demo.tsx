import { css } from '@crab-dev/css';
import Form, { Item, RuleType, useForm, type Rule } from '@crab-dev/rc-form';
import LineEdit from '@crab-dev/rc-line-edit';
import Button from '@crab-dev/rc-button';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useRef, useState } from 'react';

export const meta = { title: '表单校验与布局矩阵', description: '通过真实校验进入错误、警告、成功和等待状态；外部标签与控件标签保持字段关联。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 17); min-width: 0;`;
const actions = css`display: flex; flex-wrap: wrap; gap: ${token.space['group-gap']};`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [form] = useForm<{ name: string; owner: string }>();
    const [state, setState] = useState('default');
    const [result, setResult] = useState('尚未校验');
    // A user-controlled completion represents a pending server validation; it
    // allows natural loading video without imposing an arbitrary capture delay.
    const complete = useRef<(() => void) | null>(null);
    const id = useId();
    const english = locale === 'en-US';
    const rules: Rule[] = [{ type: state === 'warning' ? RuleType.WARNING : RuleType.ERROR, validator: async () => {
        if (state === 'validating') await new Promise<void>(resolve => { complete.current = resolve; });
        if (state === 'error') throw new Error(english ? 'This project name is unavailable.' : '此项目名称不可用。');
        if (state === 'warning') throw new Error(english ? 'Confirm the shared project name.' : '请确认团队共享项目名称。');
    } }];
    return <section className={frame} aria-label="Form visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{' '}<select id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'read-only', 'error', 'warning', 'success', 'validating'].map(value => <option key={value}>{value}</option>)}</select></div>
        <Form form={form} defaultValue={{ name: 'Crab workspace', owner: 'Design team' }}>
            <Item name="name" label={english ? 'Project name' : '项目名称'} labelPlacement="control" required rules={rules} disabled={state === 'disabled'} readOnly={state === 'read-only'} supportingText={english ? 'Shared with your workspace members.' : '此名称会向工作区成员展示。'}><LineEdit aria-label="项目名称" /></Item>
            <Item name="owner" label={english ? 'Project owner' : '项目负责人'} disabled={state === 'disabled'} readOnly={state === 'read-only'}><LineEdit aria-label="项目负责人" /></Item>
        </Form>
        <div className={actions}>
            <Button onClick={async () => { try { await form.validateFields(); setResult('校验完成'); } catch { setResult('校验失败'); } }} disabled={state === 'disabled'}>校验字段</Button>
            <Button appearance="outlined" onClick={async () => { complete.current?.(); complete.current = null; await form.resetFields(); setResult('字段已重置'); }}>重置字段</Button>
            {state === 'validating' && <Button appearance="text" onClick={() => { complete.current?.(); complete.current = null; }}>完成校验</Button>}
        </div>
        <output aria-live="polite">{result}</output>
    </section>;
}
