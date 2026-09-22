import { useRef, useState } from 'react';
import Button from '@crab-dev/rc-button';
import PdfEditor, { type PdfFont } from '../../src/index.js';

export const meta = { title: '本地编辑', description: '打开 PDF，上传项目提供的 TTF 字体后修改文字；图片与页面操作无需额外字体。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };

export default function BasicDemo() {
    const [fonts, setFonts] = useState<PdfFont[]>([]);
    // 可变实例状态：只用于触发系统字体文件选择器。
    const input = useRef<HTMLInputElement>(null);
    return <>
        <Button onClick={() => input.current?.click()}>配置 TTF 字体{fonts.length ? `：${fonts[0].family}` : ''}</Button>
        <input ref={input} type="file" accept=".ttf,font/ttf" hidden onChange={event => {
            const file = event.target.files?.[0]; event.target.value = '';
            if (file) void file.arrayBuffer().then(source => setFonts([{ id: 'project-font', family: file.name, source }]));
        }} />
        <PdfEditor runtime={runtime} fonts={fonts} />
    </>;
}
