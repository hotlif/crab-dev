import { useEffect, useRef, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import Button from "@crab-dev/rc-button";
import Dialog from "@crab-dev/rc-dialog";
import PdfEditor, { PdfEditorError, type PdfDocumentChangeRequest, type PdfDocumentInput, type PdfEditorRef, type PdfEditorState, type PdfEditorToolbar, type PdfExportResult } from "@crab-dev/rc-pdf-editor";
import { useSiteHref } from "../siteContext.js";
import { EditorPrototype } from "./editorPrototype.js";

const toolbar: PdfEditorToolbar = { visibility: {
    open: false, addText: false, addImage: false, insertPage: false, merge: false,
    extract: false, save: false, deletePage: false, pageUp: false, pageDown: false,
    ellipse: false, line: false, arrow: false, freehand: false, toggleProperties: false,
} };
const packageRoot = "components/rc-pdf-editor/workbench";

interface PendingChange {
    settle: (accepted: boolean) => void;
    signal: AbortSignal;
}

export default function PdfEditorPrototype() {
    const href = useSiteHref();
    const [state, setState] = useState<PdfEditorState>();
    const [readOnly, setReadOnly] = useState(true);
    const [busy, setBusy] = useState(false);
    const [guard, setGuard] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [download, setDownload] = useState<PdfExportResult | null>(null);
    const [downloadUrl, setDownloadUrl] = useState("");
    const editor = useRef<PdfEditorRef>(null);
    const operationTrigger = useRef<HTMLButtonElement | null>(null);
    const pending = useRef<PendingChange | null>(null);
    const simulateSaveFailure = useRef(true);
    const document = state?.document;
    const ready = state?.status === "ready";
    const fixture = href("prototype-assets/inspection-handover.pdf");
    const runtime = { workerUrl: href(`${packageRoot}/runtime/pdf-editor.worker.js`), wasmUrl: href(`${packageRoot}/runtime/pdfium.wasm`) };
    const initialDocument: PdfDocumentInput = { id: "inspection-main", fileName: "inspection-index.pdf", source: { url: fixture } };

    useEffect(() => {
        if (!download) return;
        const url = URL.createObjectURL(download.blob);
        setDownloadUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [download]);

    useEffect(() => () => {
        pending.current?.settle(false);
        pending.current = null;
    }, []);

    function resolveGuard(accepted: boolean) {
        const request = pending.current;
        pending.current = null;
        setGuard(false);
        request?.settle(accepted);
    }

    function beforeChange(request: PdfDocumentChangeRequest) {
        if (!request.current.dirty) return true;
        return new Promise<boolean>((resolve) => {
            const cancel = () => {
                if (pending.current?.signal !== request.signal) return;
                pending.current = null;
                setGuard(false);
                resolve(false);
            };
            request.signal.addEventListener("abort", cancel, { once: true });
            pending.current = { signal: request.signal, settle: (confirmed) => {
                request.signal.removeEventListener("abort", cancel);
                resolve(confirmed);
            } };
            setGuard(true);
        });
    }

    async function execute(trigger: HTMLButtonElement, command: (ref: PdfEditorRef) => Promise<unknown>) {
        const instance = editor.current;
        if (!instance || busy) return;
        operationTrigger.current = trigger;
        setBusy(true);
        setError("");
        try {
            await command(instance);
        } catch (reason) {
            if (reason instanceof PdfEditorError && reason.code === "cancelled") {
                setNotice("已保留当前文档和未保存修改。");
            } else {
                setError(reason instanceof Error ? reason.message : "文档操作失败，请重试。");
            }
        } finally {
            setBusy(false);
        }
    }

    async function save(result: PdfExportResult) {
        if (simulateSaveFailure.current) {
            simulateSaveFailure.current = false;
            throw new Error("本地保存暂未完成。重试后可下载文件。");
        }
        if (await result.blob.slice(0, 4).text() !== "%PDF") throw new Error("生成的输出无效，请重试。");
        setDownload(result);
        setNotice(`已保存 ${result.fileName}，可下载 PDF。`);
    }

    return <EditorPrototype route="pdf-editor" title="PdfEditor 文档编辑器" description="阅读示例 PDF，试用编辑、未保存保护和导出失败恢复。"
        scene="巡检交接单编辑台" rules={[
            ["浏览与编辑", "示例先进入预览模式，页面可翻阅和适应视图。编辑模式打开旋转与标注功能。"],
            ["文件保护", "无法读取的文件给出错误说明。当前文档有更改时，打开其他文档前先确认是否保留。"],
            ["保存与导出", "首次保存模拟失败，保留未保存状态。重试后校验实际 PDF 输出并显示下载入口，输出绑定到保存时的版本。"],
            ["主题差异", "MD3 让编辑动作和保存状态有清晰的层级，macOS 使用紧凑工具条，shadcn/ui 用描边区分工具与页面。窄屏仍可切页和保存。"],
        ]}>
        <div className="crab-editor-modebar">
            <Button size="s" appearance={readOnly ? "tonal" : "text"} aria-pressed={readOnly} onClick={() => setReadOnly(true)}>预览模式</Button>
            <Button size="s" appearance={!readOnly ? "tonal" : "text"} aria-pressed={!readOnly} onClick={() => setReadOnly(false)}>编辑模式</Button>
            <Button size="s" appearance="outlined" disabled={!document || document.currentPageIndex >= document.pageCount - 1}
                onClick={() => { if (document) editor.current?.goToPage(document.currentPageIndex + 1); }}>下一页</Button>
            <Button size="s" appearance="text" disabled={!document || document.currentPageIndex === 0}
                onClick={() => { if (document) editor.current?.goToPage(document.currentPageIndex - 1); }}>上一页</Button>
        </div>
        <div className="crab-editor-actions">
            <Button size="s" appearance="primary" disabled={!document || !ready} loading={busy}
                onClick={(event) => execute(event.currentTarget, (ref) => ref.save())}>保存交接单</Button>
            <Button size="s" appearance="outlined" disabled={!ready || busy} onClick={(event) => execute(event.currentTarget, (ref) => ref.open({
                id: "inspection-copy", fileName: "inspection-review.pdf", source: { url: fixture },
            }))}>打开复核副本</Button>
            <Button size="s" appearance="text" disabled={!ready || busy} onClick={(event) => execute(event.currentTarget, (ref) => ref.open({
                id: "invalid-sample", fileName: "unreadable.pdf", source: new Blob(["invalid pdf"], { type: "application/pdf" }),
            }))}>模拟打开损坏文件</Button>
        </div>
        <p className="crab-editor-status" role="status" data-pdf-prototype-status data-pdf-dirty={document?.dirty ?? false}>
            {state?.status === "failed" ? "编辑器初始化失败。" : !document ? "正在加载示例 PDF…" : <>
                {document.fileName} · 第 {document.currentPageIndex + 1}/{document.pageCount} 页 · {document.dirty ? "有未保存修改" : "无未保存修改"}
            </>}
        </p>
        {error && <Alert type="error" title="文档操作失败" closable onClose={() => {
            setError("");
            operationTrigger.current?.focus({ preventScroll: true });
        }}>{error}</Alert>}
        <div className="crab-editor-pdf-shell" aria-label="PDF 操作区" role="region">
            <PdfEditor ref={editor} className="crab-editor-pdf-editor" runtime={runtime} initialDocument={initialDocument}
                toolbar={toolbar} readOnly={readOnly} onStateChange={setState} onError={(reason) => setError(reason.message)}
                beforeDocumentChange={beforeChange} onSave={save} />
        </div>
        <p className="crab-editor-status" role="status" data-pdf-result>{notice}</p>
        {download && downloadUrl && <a href={downloadUrl} download={download.fileName}>下载已保存 PDF</a>}
        <Dialog open={guard} onOpenChange={(open) => { if (!open) resolveGuard(false); }} title="保留当前文档的修改"
            footer={<div className="crab-editor-actions">
                <Button appearance="text" onClick={() => resolveGuard(false)}>继续编辑</Button>
                <Button appearance="primary" danger onClick={() => resolveGuard(true)}>放弃修改并打开</Button>
            </div>}>
            交接单还有未保存的修改。可以返回编辑并保存，或放弃这些修改后打开另一个文件。
        </Dialog>
    </EditorPrototype>;
}
