import { css, cx } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Avatar from '@crab-dev/rc-avatar';
import { AvatarGroup } from '@crab-dev/rc-avatar';

export const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };
const frameStyle = css`
    box-sizing: border-box;
    display: grid;
    gap: ${token.space['group-gap']};
    padding: calc(${token.space['group-gap']} * 2);
    min-width: 0;
    color: ${token.color.text.primary};
    background-color: ${token.color.background.surface};
`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;
const sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;
const flexSceneStyle = css`display: flex; flex-wrap: wrap; align-items: center;`;
const portrait = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#b9d5df"/><circle cx="32" cy="24" r="12" fill="#354952"/><path d="M8 64a24 24 0 0 1 48 0" fill="#354952"/></svg>');

export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [longContent, setLongContent] = useState(false);
    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');
    const [size, setSize] = useState('medium');
    const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
    const [state, setState] = useState('default');
    const [layout, setLayout] = useState('grid');
    const [count, setCount] = useState(0);
    const [draft, setDraft] = useState('保留这份草稿');
    
    return <div>
        <div className={rowStyle}>
            <label>验收尺寸<select aria-label="验收尺寸" value={size} onChange={event => setSize(event.currentTarget.value)}><option>small</option><option>medium</option><option>large</option></select></label>
            <label>验收密度<select aria-label="验收密度" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}><option>standard</option></select></label>
            <label>验收状态<select aria-label="验收状态" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}><option value="default">default</option><option value="image">image</option><option value="fallback">fallback</option><option value="disabled">disabled</option><option value="hover">hover</option><option value="focus-visible">focus-visible</option><option value="pressed">pressed</option><option value="group">group</option></select></label>
            
        </div>
        <label>宿主布局<select aria-label="宿主布局" value={layout} onChange={event => setLayout(event.currentTarget.value)}><option>grid</option><option>flex</option></select></label>
        <label><input type="checkbox" aria-label="长文本" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本</label>
        <label>配置切换草稿<input aria-label="配置切换草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>
            <section className={frameStyle} aria-label="Avatar visual matrix" data-visual-frame>
                <div className={cx(sceneStyle, layout === 'flex' && flexSceneStyle)} data-visual-scene data-size={size} data-density={density} data-state={state} data-layout={layout}>
                    {state === 'group' ? <AvatarGroup size={size as 'small' | 'medium' | 'large'} max={2} onExtraClick={() => setCount(count + 1)}>{['甲','乙','丙','丁'].map(name => <Avatar key={name}>{name}</Avatar>)}</AvatarGroup> : <Avatar data-visual-target size={size as 'small' | 'medium' | 'large'} shape="circle" bordered disabled={state === 'disabled'} onClick={() => setCount(count + 1)} aria-label={copy('打开个人资料', 'Open profile')} src={state === 'image' ? portrait : state === 'fallback' ? 'data:image/png;base64,broken' : undefined} alt={copy('成员头像', 'Member portrait')}>{state === 'fallback' ? undefined : longContent ? 'Long Member Identity' : '林'}</Avatar>}<Avatar shape="square" size={size as 'small' | 'medium' | 'large'} variant="primary">AB</Avatar><Avatar data-numeric-avatar size={37} variant="success">37</Avatar>
                    
                </div>
                <output aria-label="操作次数">{count}</output>
            </section>
        </ConfigProvider>
    </div>;
}
