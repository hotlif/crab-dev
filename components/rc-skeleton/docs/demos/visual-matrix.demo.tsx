import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Skeleton from '@crab-dev/rc-skeleton';


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


export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [longContent, setLongContent] = useState(false);
    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');
    const [size, setSize] = useState('medium');
    const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
    const [state, setState] = useState('default');
    const [draft, setDraft] = useState('保留这份草稿');
    
    return <div>
        <div className={rowStyle}>
            <label>验收尺寸<select aria-label="验收尺寸" value={size} onChange={event => setSize(event.currentTarget.value)}><option>small</option><option>medium</option><option>large</option></select></label>
            <label>验收密度<select aria-label="验收密度" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}><option>standard</option></select></label>
            <label>验收状态<select aria-label="验收状态" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}><option value="default">default</option><option value="inactive">inactive</option><option value="loaded">loaded</option><option value="round">round</option><option value="wave">wave</option></select></label>
            
        </div>
        <label><input type="checkbox" aria-label="长文本" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本</label>
        <label>配置切换草稿<input aria-label="配置切换草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>
            <section className={frameStyle} aria-label="Skeleton visual matrix" data-visual-frame>
                <div className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>
                    <Skeleton data-visual-target size={size as 'small' | 'medium' | 'large'} rows={3} active={state === 'default' || state === 'wave'} animation={state === 'wave' ? 'wave' : 'pulse'} loading={state !== 'loaded'} round={state === 'round'}><p data-visual-target>{copy('内容已经加载完成', 'Content has loaded')}</p></Skeleton>{(['rect','circle','button','avatar','image'] as const).map(variant => <Skeleton key={variant} variant={variant} active={false} width={variant === 'image' ? '100%' : variant === 'circle' ? 37 : undefined} height={variant === 'image' ? 96 : undefined} />)}
                    
                </div>
            </section>
        </ConfigProvider>
    </div>;
}
