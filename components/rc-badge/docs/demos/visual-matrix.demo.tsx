import { css, cx } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Badge from '@crab-dev/rc-badge';


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
const sceneStyle = css`display: grid; grid-template-columns: minmax(0, 1fr); min-width: 0; gap: ${token.space['stack-gap']};`;
const flexSceneStyle = css`display: flex; flex-wrap: wrap; align-items: center;`;


export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [longContent, setLongContent] = useState(false);
    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');
    const [size, setSize] = useState('default');
    const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
    const [state, setState] = useState('default');
    const [layout, setLayout] = useState('grid');
    const [actionCount, setActionCount] = useState(0);
    const [draft, setDraft] = useState('保留这份草稿');
    
    return <div>
        <div className={rowStyle}>
            <label>验收尺寸<select aria-label="验收尺寸" value={size} onChange={event => setSize(event.currentTarget.value)}><option>default</option><option>small</option></select></label>
            <label>验收密度<select aria-label="验收密度" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}><option>standard</option></select></label>
            <label>验收状态<select aria-label="验收状态" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}><option value="default">default</option><option value="zero">zero</option><option value="overflow">overflow</option><option value="dot">dot</option><option value="status">status</option><option value="error">error</option><option value="processing">processing</option></select></label>
            
        </div>
        <label>宿主布局<select aria-label="宿主布局" value={layout} onChange={event => setLayout(event.currentTarget.value)}><option>grid</option><option>flex</option></select></label>
        <label><input type="checkbox" aria-label="长文本" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本</label>
        <label>配置切换草稿<input aria-label="配置切换草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>
            <section className={frameStyle} aria-label="Badge visual matrix" data-visual-frame>
                <div className={cx(sceneStyle, layout === 'flex' && flexSceneStyle)} data-visual-scene data-size={size} data-density={density} data-state={state} data-layout={layout}>
                    <Badge data-visual-target size={size as 'default' | 'small'} count={state === 'zero' ? 0 : state === 'overflow' ? 120 : 8} showZero dot={state === 'dot'} status={state === 'processing' ? 'processing' : state === 'error' ? 'error' : state === 'status' ? 'success' : undefined} text={state === 'processing' ? copy('正在同步', 'Syncing') : state === 'status' ? copy('已同步', 'Synced') : state === 'error' ? copy('同步失败', 'Sync failed') : undefined} /><Badge data-wrapped-badge size={size as 'default' | 'small'} count={8}><Button onClick={() => setActionCount(actionCount + 1)}>{copy('收件箱', 'Inbox')}</Button></Badge>
                    
                </div>
                <output aria-label="宿主操作次数">{actionCount}</output>
            </section>
        </ConfigProvider>
    </div>;
}
