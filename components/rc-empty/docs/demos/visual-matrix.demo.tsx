import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Empty from '@crab-dev/rc-empty';


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
    const [count, setCount] = useState(0);
    const [draft, setDraft] = useState('保留这份草稿');
    
    return <div>
        <div className={rowStyle}>
            <label>验收尺寸<select aria-label="验收尺寸" value={size} onChange={event => setSize(event.currentTarget.value)}><option>medium</option></select></label>
            <label>验收密度<select aria-label="验收密度" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}><option>compact</option><option>standard</option><option>comfortable</option></select></label>
            <label>验收状态<select aria-label="验收状态" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}><option value="default">default</option><option value="search">search</option><option value="no-permission">no-permission</option><option value="action">action</option><option value="hover">hover</option><option value="focus-visible">focus-visible</option><option value="pressed">pressed</option><option value="custom">custom</option></select></label>
            
        </div>
        <label><input type="checkbox" aria-label="长文本" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本</label>
        <label>配置切换草稿<input aria-label="配置切换草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>
            <section className={frameStyle} aria-label="Empty visual matrix" data-visual-frame>
                <div className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>
                    <Empty imageSize={longContent ? 72 : undefined} data-visual-target preset={state === 'search' || state === 'no-permission' ? state : 'default'} title={state === 'custom' ? copy('没有符合筛选条件的记录', 'No records match these filters') : undefined} description={state === 'custom' ? copy('可以更改筛选条件，或稍后重新加载数据。', 'Change the filters or reload the data later.') : undefined} image={state === 'custom' ? <span aria-hidden="true">◇</span> : undefined} action={['action','hover','focus-visible','pressed'].includes(state) ? <Button onClick={() => setCount(count + 1)}>{copy('创建记录', 'Create record')}</Button> : undefined} />
                    
                </div>
                <output aria-label="操作次数">{count}</output>
            </section>
        </ConfigProvider>
    </div>;
}
