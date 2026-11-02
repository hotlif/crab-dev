import { useState } from 'react';
import { css } from '@crab-dev/css';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Preview from '@crab-dev/rc-component-preview';
export const meta = { title: '预览密度、源码与操作', description: '使用公开回调查看复制成功、失败和外部打开；真实展开动态源码。' };
const frame = css`display: grid; min-width: 0; gap: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;
const source = `// 保留当前草稿 · Keep the current draft\nexport function Workspace() {\n    const count = 42;\n    const ready = true;\n    const pattern = /draft/i;\n    return <main aria-label="Workspace" data-count={count} hidden={!ready} data-valid={pattern.test('draft')}>\n        保存草稿 · Save the draft\n    </main>;\n}`;
const examples = {
    tsx: source,
    javascript: 'export const draft = "Retained draft";',
    js: 'export const draft = "Retained draft";',
    typescript: 'export const draft: string = "Retained draft";',
    ts: 'export const draft: string = "Retained draft";',
    css: '.draft { color: red; padding: 16px; }',
    json: '{ "draft": "Retained draft", "count": 42 }',
    python: 'def draft():\n    return "Retained draft"',
    ruby: 'def draft\n  "Retained draft"\nend',
    text: 'Retained draft <plain text> & no syntax',
    'unknown-language': 'Retained draft <unknown language> & no syntax',
} as const;
export default function VisualMatrixDemo() {
    const { density, locale } = useConfig();
    const [codeTheme, setCodeTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<keyof typeof examples>('tsx');
    const [rejectCopy, setRejectCopy] = useState(false);
    const [feedback, setFeedback] = useState('');
    const english = locale === 'en-US';
    const previewDensity = { compact: 'compact', standard: 'regular', comfortable: 'spacious' } as const;
    return <section className={frame} aria-label="ComponentPreview visual matrix">
        <label>源码配色 <select value={codeTheme} onChange={event => setCodeTheme(event.currentTarget.value === 'dark' ? 'dark' : 'light')}><option>light</option><option>dark</option></select></label>
        <label>源码语言 <select value={language} onChange={event => {
            const selected = event.currentTarget.value;
            if (Object.hasOwn(examples, selected)) setLanguage(selected as keyof typeof examples);
        }}>{Object.keys(examples).map(name => <option key={name}>{name}</option>)}</select></label>
        <label><input type="checkbox" checked={rejectCopy} onChange={event => setRejectCopy(event.currentTarget.checked)} /> 拒绝复制</label>
        <Preview title={english ? 'Workspace preview' : '工作区预览'} description={english ? 'Long descriptions wrap within the preview. **Keep the current draft.**' : '较长的说明应在预览宽度内换行。**保留当前业务草稿。**'} density={previewDensity[density]} sourceCode={examples[language]} language={language} codeTheme={codeTheme} path="https://example.com/workspace" onCopyCode={() => { if (rejectCopy) { setFeedback('复制失败 · Copy failed'); throw Error('Copy denied by the example'); } setFeedback('复制成功 · Copy succeeded'); }} onOpenExternal={path => setFeedback(`Open requested: ${path}`)}>
            <label>{english ? 'Draft' : '业务草稿'} <input defaultValue="Retained draft" /></label>
        </Preview>
        <output role={feedback.includes('failed') ? 'alert' : 'status'} aria-label="操作结果">{feedback}</output>
    </section>;
}
