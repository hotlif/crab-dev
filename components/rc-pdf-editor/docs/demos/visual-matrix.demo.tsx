import { useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import PdfEditor, { type PdfDocumentInput, type PdfEditorRef, type PdfEditorState } from '@crab-dev/rc-pdf-editor';
import Button from '@crab-dev/rc-button';
import Checkbox from '@crab-dev/rc-checkbox';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '真实 PDF 工作区矩阵', description: '自包含双页 PDF，使用实际 Worker/WASM；验证文档编辑、错误、只读、工具栏和配置切换，不上传文件。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };
const sceneStyle = css`padding: ${token.space['component-gap']}; max-inline-size: 100%; background: ${token.color.surface.content};`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;

// An ASCII fixture is generated in the demo so this example remains independently copyable.
function createDocument(): PdfDocumentInput {
    const streams = [
        'BT /F1 24 Tf 36 250 Td (Crab professional workspace) Tj 0 -42 Td /F1 16 Tf (Editable local document - Page 1) Tj ET',
        'BT /F1 24 Tf 36 250 Td (Second page) Tj 0 -42 Td /F1 16 Tf (Stable content for scrolling and selection) Tj ET',
    ];
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>'];
    streams.forEach((stream, index) => objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 320] /Resources << /Font << /F1 7 0 R >> >> /Contents ${4 + index * 2} 0 R >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`));
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    let pdf = '%PDF-1.4\n';
    const offsets = objects.map((object, index) => { const offset = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; return offset; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return { id: 'professional-visual', fileName: 'professional-visual.pdf', source: new TextEncoder().encode(pdf) };
}

export default function VisualMatrixDemo() {
    // Command handle: editor sessions stay live through host configuration changes.
    const editor = useRef<PdfEditorRef>(null);
    const [document] = useState(createDocument);
    const [state, setState] = useState<PdfEditorState>();
    const [readOnly, setReadOnly] = useState(false);
    const [commandError, setCommandError] = useState('');
    async function run(command: (instance: PdfEditorRef) => Promise<unknown>) {
        const instance = editor.current;
        if (!instance) return;
        try { setCommandError(''); await command(instance); } catch (error) { setCommandError(error instanceof Error ? error.message : String(error)); }
    }
    return <div>
        <div className={rowStyle}>
            <Button appearance="outlined" onClick={() => { void run(instance => instance.open(document)); }}>重新打开</Button>
            <Button appearance="outlined" onClick={() => { void run(instance => instance.close()); }}>关闭文档</Button>
            <Button appearance="outlined" onClick={() => { void run(instance => instance.open({ ...document, id: 'professional-long', fileName: '企业级专业文档工作区：国际服务与长期运营季度报告 Enterprise professional document workspace and long-term international operations.pdf' })); }}>打开长文件名</Button>
            <Checkbox checked={readOnly} onCheckedChange={setReadOnly}>只读模式</Checkbox>
        </div>
        {commandError && <p role="alert">{commandError}</p>}
        <section aria-label="PdfEditor visual matrix" className={sceneStyle} data-status={state?.status ?? 'initializing'} data-document={state?.document?.id ?? ''} data-revision={state?.document?.revision ?? 0} data-dirty={String(state?.document?.dirty ?? false)} data-page={state?.document?.currentPageIndex ?? 0}>
            <PdfEditor ref={editor} runtime={runtime} initialDocument={document} readOnly={readOnly} onStateChange={setState} />
        </section>
    </div>;
}
