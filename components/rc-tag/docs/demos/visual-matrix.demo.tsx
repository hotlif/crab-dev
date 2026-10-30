import { css } from '@crab-dev/css';
import Tag, { CheckableTag } from '@crab-dev/rc-tag';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '标签与筛选状态矩阵', description: '状态标签、可关闭标签和可选择筛选共用语义角色，保留各自的真实交互。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;
const row = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['group-gap']}; padding: ${token.space['inline-gap']};`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [state, setState] = useState('default');
    const [checked, setChecked] = useState(false);
    const [closed, setClosed] = useState(false);
    const id = useId();
    const english = locale === 'en-US';
    return <section className={frame} aria-label="Tag visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{' '}<select id={id} value={state} onChange={event => setState(event.currentTarget.value)}><option>default</option><option>disabled</option></select></div>
        <div className={row} aria-label="状态标签">{(['default', 'primary', 'success', 'warning', 'error'] as const).map(color => <Tag key={color} color={color}>{color}</Tag>)}<Tag bordered={false}>{english ? 'Without border' : '无描边'}</Tag></div>
        <div className={row} aria-label="筛选标签">
            <CheckableTag checked={checked} disabled={state === 'disabled'} onCheckedChange={setChecked}>{english ? 'Assigned to me' : '分配给我'}</CheckableTag>
            <CheckableTag defaultChecked disabled={state === 'disabled'}>{english ? 'In progress' : '进行中'}</CheckableTag>
            {!closed && <Tag closable closeAriaLabel="移除筛选" onClose={() => setClosed(true)}>{english ? 'Long project classification label' : '项目分类长文本标签'}</Tag>}
        </div>
        <output aria-live="polite">{closed ? '筛选已移除' : checked ? '筛选已选中' : '尚未选择筛选'}</output>
    </section>;
}
