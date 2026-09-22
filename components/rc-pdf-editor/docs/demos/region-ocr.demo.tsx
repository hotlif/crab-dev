import { useEffect, useState } from 'react';
import { css } from '@crab-dev/css';
import Checkbox from '@crab-dev/rc-checkbox';
import PdfEditor, { createRegionOcrPlugin, type PdfEditorPlugin, type PdfRegionImage } from '../../src/index.js';
import token from '../../src/token.js';
import { regionDocument } from './sample-document.js';

export const meta = { title: '跨页区域与 OCR 插件', description: '框选相邻页交界区域，按页面坐标裁切并拼接为真实 PNG；通过 recognize 回调接入自己的 OCR 引擎。示例适配器只展示输入图像，不执行文字识别。' };
const runtime = { workerUrl: './runtime/pdf-editor.worker.js', wasmUrl: './runtime/pdfium.wasm' };
const sectionStyle = css`display: flex; flex-direction: column; gap: ${token.panel.gap}; min-width: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.toolbar.gap}; align-items: center;`;
const hintStyle = css`margin: 0; color: ${token.status.color}; font-size: ${token.status['font-size']};`;
const imageStyle = css`display: block; max-width: 100%; height: auto; border: ${token.root['border-width']} solid ${token.root['border-color']};`;
const codeStyle = css`overflow: auto; padding: ${token.panel.padding}; background: ${token.canvas.background}; border-radius: ${token.root['border-radius']};`;

export default function RegionOcrDemo() {
    const [installed, setInstalled] = useState(true);
    const [image, setImage] = useState<PdfRegionImage>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [plugin] = useState<PdfEditorPlugin>(() => {
        const ocr = createRegionOcrPlugin({
            id: 'demo.region-ocr', label: '框选跨页区域',
            // 替换此适配器即可对接项目的 OCR；默认演示不上传文档，也不伪造识别文本。
            recognize: async (input, { signal }) => {
                signal.throwIfAborted();
                return { receivedPixels: input.width * input.height };
            },
            onResult: (_result, input) => setImage(input),
        });
        return { ...ocr, actions: [...ocr.actions!, {
            id: 'boundary-example', label: '采集两页交界样例', placement: 'tools',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M4 3h16v7H4V3zm2 2v3h12V5H6zM4 14h16v7H4v-7zm2 2v3h12v-3H6zM2 11h20v2H2z" /></svg>,
            disabled: state => (state.document?.pageCount ?? 0) < 2,
            async onSelect({ getEditor, signal }) {
                const editor = getEditor(), pages = editor.getPages();
                const selection = editor.createRegionSelection([
                    { pageIndex: 0, x: 0, y: pages[0].height - Math.min(80, pages[0].height), width: pages[0].width, height: Math.min(80, pages[0].height) },
                    { pageIndex: 1, x: 0, y: 0, width: pages[1].width, height: Math.min(80, pages[1].height) },
                ]);
                const result = await editor.captureRegion(selection, { signal, scale: 2 });
                signal.throwIfAborted(); setImage(result);
            },
        }] };
    });
    useEffect(() => {
        if (!image) return;
        const url = URL.createObjectURL(image.blob); setImageUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);
    return <div className={sectionStyle}>
        <div className={rowStyle}><Checkbox checked={installed} onChange={setInstalled}>安装区域 OCR 插件</Checkbox></div>
        <p className={hintStyle}>先点击绘图栏末尾“采集两页交界样例”查看拼接结果。手动选择时，可先调低缩放并滚到页间交界，再点击“框选跨页区域”；选区支持滚轮翻页、键盘操作和取消。当前编辑器为只读，区域采集仍可使用。</p>
        <PdfEditor runtime={runtime} initialDocument={regionDocument} readOnly plugins={installed ? [plugin] : []} />
        <p role="status">{image ? `已采集 ${image.parts.length} 页区域，PNG ${image.width} × ${image.height} px。演示适配器已收到图像；尚未接入 OCR 识别引擎。` : '选择区域后，这里显示去掉页间留白的真实图像和坐标映射。'}</p>
        {imageUrl && <img className={imageStyle} src={imageUrl} alt="跨页选区拼接图像，作为 OCR 输入" />}
        {image && <details><summary>查看页坐标与拼接图像坐标</summary><pre className={codeStyle}>{JSON.stringify({ selection: image.selection, parts: image.parts }, null, 2)}</pre></details>}
    </div>;
}
