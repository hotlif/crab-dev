import { useState } from 'react';
import { css } from '@crab-dev/css';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';

export const meta = { title: '主题表面、字阶与嵌套恢复', description: '检查显式边界的表面、文本、品牌、焦点和形状；主题不改变业务草稿。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; overflow-wrap: anywhere;`;
const strip = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;
const brand = css`padding: ${token.space['component-gap']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border-radius: ${token.shape.control};`;
const raised = css`padding: ${token.space['component-gap']}; background: ${token.color.surface.raised}; border: 1px solid ${token.color.border.default}; box-shadow: ${token.shadow.card}; border-radius: ${token.shape.card};`;
const heading = css`margin: 0; font-family: ${token.typography.headline.small['font-family']}; font-size: ${token.typography.headline.small['font-size']}; line-height: ${token.typography.headline.small['line-height']}; font-weight: ${token.typography.headline.small['font-weight']};`;
const focus = css`max-width: 100%; box-sizing: border-box; color: inherit; background: inherit; border: 1px solid ${token.color.border.default}; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;
export default function VisualMatrixDemo() {
    const [state, setState] = useState('default');
    const [draft, setDraft] = useState('主题切换保留文字 Theme draft');
    return <section className={frame} aria-label="Theme visual matrix">
        <label>验收状态 <select value={state} onChange={event => setState(event.currentTarget.value)}><option>default</option><option>nested</option></select></label>
        <h2 className={heading}>内容、层级与清晰焦点</h2>
        <div className={strip}><span className={brand} data-role="brand">Brand container</span><span className={raised} data-role="raised">Raised surface</span></div>
        <label>主题草稿 <input className={focus} value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        {state === 'nested' && Object.entries(designSystemRegistry).map(([id, design]) => <section key={id} className={frame} data-crab-design={id} data-theme="light" aria-label={`${id} nested`}><strong>{design.label}</strong><span className={brand}>Explicit light boundary</span><span className={raised}>Independent geometry and color</span></section>)}
    </section>;
}
