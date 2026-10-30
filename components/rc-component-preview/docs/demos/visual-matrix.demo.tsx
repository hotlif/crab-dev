import { useState } from 'react';
import { css } from '@crab-dev/css';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Preview from '@crab-dev/rc-component-preview';
export const meta = { title: '预览密度、源码与操作', description: '使用公开回调查看复制成功、失败和外部打开；真实展开动态源码。' };
const frame = css`display: grid; min-width: 0; gap: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;
const source = `export function Workspace() {\n    return <main aria-label="Workspace">\n        保存草稿 · Save the draft\n    </main>;\n}`;
export default function VisualMatrixDemo() {
    const { density, locale } = useConfig();
    const [codeTheme, setCodeTheme] = useState<'light' | 'dark'>('light');
    const [rejectCopy, setRejectCopy] = useState(false);
    const [feedback, setFeedback] = useState('');
    const english = locale === 'en-US';
    const previewDensity = { compact: 'compact', standard: 'regular', comfortable: 'spacious' } as const;
    return <section className={frame} aria-label="ComponentPreview visual matrix">
        <label>源码配色 <select value={codeTheme} onChange={event => setCodeTheme(event.currentTarget.value === 'dark' ? 'dark' : 'light')}><option>light</option><option>dark</option></select></label>
        <label><input type="checkbox" checked={rejectCopy} onChange={event => setRejectCopy(event.currentTarget.checked)} /> 拒绝复制</label>
        <Preview title={english ? 'Workspace preview' : '工作区预览'} description={english ? 'Long descriptions wrap within the preview. **Keep the current draft.**' : '较长的说明应在预览宽度内换行。**保留当前业务草稿。**'} density={previewDensity[density]} sourceCode={source} codeTheme={codeTheme} path="https://example.com/workspace" onCopyCode={() => { if (rejectCopy) { setFeedback('复制失败 · Copy failed'); throw Error('Copy denied by the example'); } setFeedback('复制成功 · Copy succeeded'); }} onOpenExternal={path => setFeedback(`Open requested: ${path}`)}>
            <label>{english ? 'Draft' : '业务草稿'} <input defaultValue="Retained draft" /></label>
        </Preview>
        <output role={feedback.includes('failed') ? 'alert' : 'status'} aria-label="操作结果">{feedback}</output>
    </section>;
}
