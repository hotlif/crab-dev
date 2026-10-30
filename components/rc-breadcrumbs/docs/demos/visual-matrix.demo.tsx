import { css } from '@crab-dev/css';
import Breadcrumbs from '@crab-dev/rc-breadcrumbs';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '路径导航状态矩阵', description: '链接、动作、当前位置、禁用、折叠与长路径保持独立语义。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [collapsed, setCollapsed] = useState(false);
    const [visited, setVisited] = useState('');
    const id = useId();
    const english = locale === 'en-US';
    return <section className={frame} aria-label="Breadcrumbs visual matrix" data-visual-scene>
        <div><label htmlFor={id}>路径显示</label>{' '}<select id={id} value={collapsed ? 'collapsed' : 'full'} onChange={event => setCollapsed(event.currentTarget.value === 'collapsed')}><option>full</option><option>collapsed</option></select></div>
        <Breadcrumbs aria-label="路径验收" maxCount={collapsed ? 3 : undefined} items={[
            { key: 'home', title: english ? 'Workspace' : '工作区', href: '#workspace', onClick: event => { event.preventDefault(); setVisited('workspace'); } },
            { key: 'projects', title: english ? 'Projects' : '项目', onClick: () => setVisited('projects') },
            { key: 'disabled', title: english ? 'Restricted' : '受限目录', disabled: true, onClick: () => setVisited('restricted') },
            { key: 'team', title: english ? 'Design systems and shared resources' : '设计系统与团队共享资源目录', href: '#team', onClick: event => { event.preventDefault(); setVisited('team'); } },
            { key: 'current', title: english ? 'Current component specifications' : '当前组件规范' },
        ]} />
        <output aria-live="polite">{visited || (english ? 'Choose an ancestor' : '请选择上级路径')}</output>
    </section>;
}
