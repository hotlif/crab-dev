import { css } from '@crab-dev/css';
import Tabs from '@crab-dev/rc-tabs';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '页签状态与溢出矩阵', description: '三种公开外观对照选中、禁用与关闭，切换配置保留活动页和面板草稿。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;
const content = css`padding: ${token.space['group-gap']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; overflow-wrap: anywhere;`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [variant, setVariant] = useState<'line' | 'card' | 'pill'>('line');
    const [value, setValue] = useState('overview');
    const [keys, setKeys] = useState(['overview', 'activity', 'settings', 'archived']);
    const [draft, setDraft] = useState('保留的工作区草稿');
    const id = useId();
    const english = locale === 'en-US';
    const labels: Record<string, string> = { overview: english ? 'Overview' : '概览', activity: english ? 'Activity and audit history' : '活动与审计历史长标签', settings: english ? 'Project settings' : '项目设置', archived: english ? 'Archived' : '已归档' };
    return <section className={frame} aria-label="Tabs visual matrix" data-visual-scene data-variant={variant}>
        <div><label htmlFor={id}>页签外观</label>{' '}<select id={id} value={variant} onChange={event => setVariant(event.currentTarget.value as typeof variant)}><option>line</option><option>card</option><option>pill</option></select></div>
        <Tabs type={variant} value={value} onValueChange={setValue} onTabClose={key => {
            setKeys(keys.filter(candidate => candidate !== key));
            if (value === key) setValue(keys.find(candidate => candidate !== key && candidate !== 'archived') ?? '');
        }} items={keys.map(key => ({ key, label: labels[key], disabled: key === 'archived', closable: key === 'settings', children: <div className={content}>{key === 'overview' ? <label>{english ? 'Project draft' : '项目草稿'}{' '}<input aria-label="项目草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label> : <p>{labels[key]} · {english ? 'Workspace content' : '工作区内容'}</p>}</div> }))} />
        <output aria-live="polite">{value}</output>
    </section>;
}
