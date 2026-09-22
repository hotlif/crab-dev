import PdfEditor from '../../src/index.js';

export const meta = { title: '只读浏览', description: '保留打开、翻页、缩放、对象查看、提取和导出，禁用编辑。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };

export default function ReadOnlyDemo() {
    return <PdfEditor runtime={runtime} readOnly />;
}
