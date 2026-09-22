import { useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import Checkbox from '@crab-dev/rc-checkbox';
import PdfEditor, { PDF_EDITOR_ACTIONS, type PdfEditorActionGroup, type PdfEditorActionVisibility, type PdfEditorToolbarAction } from '../../src/index.js';
import token from '../../src/token.js';
import { sampleDocument } from './sample-document.js';

export const meta = { title: '图标显隐与动作扩展', description: '逐项或分组控制全部内置图标，实时预览配置，并追加一个业务动作。隐藏入口不会限制快捷键和 ref。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };
const groupLabels: Record<PdfEditorActionGroup, string> = {
    file: '文件', history: '历史', insert: '插入对象', pages: '页面管理', output: '输出',
    navigation: '画布工具', drawing: '绘图工具', panels: '侧栏图标', view: '视图',
};
const groups = [...new Set(PDF_EDITOR_ACTIONS.map(action => action.group))];
const sectionStyle = css`display: flex; flex-direction: column; gap: ${token.panel.gap}; min-width: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.toolbar.gap};`;
const gridStyle = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, ${token.panel.width}), 1fr)); gap: ${token.panel.gap};`;
const fieldStyle = css`border: 0; padding: 0; margin: 0; min-width: 0; & legend { margin-bottom: ${token.toolbar.gap}; }`;
const noteStyle = css`margin: 0; color: ${token.status.color}; font-size: ${token.status['font-size']};`;
const codeStyle = css`margin: 0; padding: ${token.panel.padding}; overflow: auto; background: ${token.canvas.background}; border-radius: ${token.root['border-radius']};`;

export default function ToolbarDemo() {
    const [visibility, setVisibility] = useState<PdfEditorActionVisibility>({});
    const [readOnly, setReadOnly] = useState(false);
    const [showSummary, setShowSummary] = useState(true);
    const [summary, setSummary] = useState('点击工具栏末尾的“文档摘要”查看业务动作结果。');
    const shownCount = PDF_EDITOR_ACTIONS.filter(action => visibility[action.id] !== false).length;
    const extraActions: readonly PdfEditorToolbarAction[] = [{
        id: 'demo.document-summary', label: '文档摘要', placement: 'main', visible: showSummary,
        icon: <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2zm1-7a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" /></svg>,
        disabled: state => !state.document,
        onSelect(editor) {
            const document = editor.getState().document;
            if (document) setSummary(`${document.fileName} · ${document.pageCount} 页 · 版本 ${document.revision}${document.dirty ? ' · 未保存' : ' · 已保存'}`);
        },
    }];
    return <div className={sectionStyle}>
        <div className={rowStyle}>
            <Checkbox checked={shownCount === PDF_EDITOR_ACTIONS.length} indeterminate={shownCount > 0 && shownCount < PDF_EDITOR_ACTIONS.length}
                onChange={checked => setVisibility(Object.fromEntries(PDF_EDITOR_ACTIONS.map(action => [action.id, checked])))}>全部内置图标（{shownCount}/{PDF_EDITOR_ACTIONS.length}）</Checkbox>
            <Button onClick={() => setVisibility({})}>恢复默认</Button>
            <Checkbox checked={readOnly} onChange={setReadOnly}>只读模式</Checkbox>
            <Checkbox checked={showSummary} onChange={setShowSummary}>扩展：文档摘要</Checkbox>
        </div>
        <details>
            <summary>逐项配置 {PDF_EDITOR_ACTIONS.length} 个内置图标</summary>
            <div className={gridStyle}>
                {groups.map(group => {
                    const actions = PDF_EDITOR_ACTIONS.filter(action => action.group === group);
                    const count = actions.filter(action => visibility[action.id] !== false).length;
                    return <fieldset className={fieldStyle} key={group}>
                        <legend><Checkbox checked={count === actions.length} indeterminate={count > 0 && count < actions.length}
                            onChange={checked => setVisibility(previous => ({ ...previous, ...Object.fromEntries(actions.map(action => [action.id, checked])) }))}>{groupLabels[group]}</Checkbox></legend>
                        <div className={sectionStyle}>{actions.map(action => <Checkbox key={action.id} checked={visibility[action.id] !== false}
                            onChange={checked => setVisibility(previous => ({ ...previous, [action.id]: checked }))}>{action.label}</Checkbox>)}</div>
                    </fieldset>;
                })}
            </div>
        </details>
        <p className={noteStyle}>显隐只改变入口；只读模式决定能否编辑。侧栏开关和收起按钮可分别隐藏，面板本身保持当前状态。示例未配置 TTF，“添加文字”显示但不可用。</p>
        <output aria-live="polite">{summary}</output>
        <PdfEditor runtime={runtime} initialDocument={sampleDocument} readOnly={readOnly} toolbar={{ visibility, extraActions }} />
        <details><summary>查看当前显隐配置</summary><pre className={codeStyle}>{JSON.stringify({ toolbar: { visibility } }, null, 2)}</pre></details>
    </div>;
}
