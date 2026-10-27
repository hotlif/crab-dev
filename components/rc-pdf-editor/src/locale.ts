import { useLocale } from '@crab-dev/rc-config-provider';
import { BUILTIN_ACTIONS, type PdfEditorActionId } from './actions.js';
import type { PdfEditorError } from './types.js';
import type { PdfObject } from './protocol.js';
import { formatPdfError, formatPdfMessage } from './pdf-messages.js';
import { defaultActionMessage } from './default-action-label.js';

const english = {
    'PDF 编辑工具栏': 'PDF editing toolbar', 'PDF 编辑器': 'PDF editor', ' · 未保存': ' · Unsaved',
    '绘图区域': 'Drawing area', 'PDF 区域选择': 'PDF region selection', '重试页面渲染': 'Retry rendering page',
    '拖动框选，可跨页；滚轮翻页。方向键移动起点，Shift 加方向键扩展选区，Enter 完成，Escape 取消。': 'Drag to select across pages; scroll to navigate. Use arrow keys to move the start, Shift + arrow keys to extend the selection, Enter to finish and Escape to cancel.',
    '绘图工具栏': 'Drawing toolbar', '侧栏显示': 'Sidebar visibility',
    '收起页面面板': 'Collapse pages panel', '展开页面面板': 'Expand pages panel',
    '收起属性面板': 'Collapse properties panel', '展开属性面板': 'Expand properties panel',
    '拖动页面平移': 'Drag to pan the page', '选择对象后可移动、缩放或旋转': 'Select an object to move, resize or rotate it',
    '{shape} · 拖动绘制，Esc 退出': '{shape} · Drag to draw; Esc to exit', '，Shift 约束形状': '; Shift to constrain the shape',
    '区域选择：拖动框选，可跨页；滚轮翻页，Shift + 方向键扩选，Enter 完成，Esc 取消。': 'Drag to select across pages. Scroll to navigate, Shift + arrow keys to extend, Enter to finish, Esc to cancel.',
    '{label}处理中…': 'Processing {label}…', '取消区域选择': 'Cancel region selection', '取消插件任务': 'Cancel plugin task',
    '页面管理': 'Page management', '页面': 'Pages',
    '点击选页，Ctrl / ⌘ 点击多选；拖拽调整顺序。': 'Click to select a page; Ctrl / ⌘ + click to select multiple pages. Drag to reorder.',
    'PDF 页面画布': 'PDF page canvas', '在本地编辑 PDF': 'Edit PDFs locally', '等待加载 PDF': 'Waiting for a PDF',
    '修改文字、调整图片，或整理文档页面。': 'Edit text and images, or organize document pages.',
    '文档加载完成后，可在此浏览和处理。': 'View and edit the document here once it is loaded.', '选择 PDF 文件': 'Choose a PDF file',
    '对象属性': 'Object properties', '{shape}设置': '{shape} settings',
    '在页面内按下并拖动鼠标，松开完成一笔。绘制完成后，可从对象树选择图形继续编辑。': 'Drag on a page and release to finish drawing. Select the shape in the object tree to keep editing it.',
    '点击画布中的文字、图片或图形，或从下方对象树选择。': 'Select text, an image or a shape on the canvas, or use the object tree below.',
    '页面对象': 'Page objects', '第 {page} / {total} 页': 'Page {page} of {total}', ' · 已选择 {count} 页': ' · {count} pages selected',
    ' · 未选择页面': ' · No pages selected', ' · 只读': ' · Read only', '正在处理…': 'Processing…',
    '请选择 PDF 文件': 'Choose a PDF file', '正在处理 PDF': 'Processing PDF',
    'Ctrl / ⌘ + 滚轮缩放；普通滚轮滚动页面': 'Ctrl / ⌘ + scroll to zoom; scroll to navigate pages', '缩放百分比': 'Zoom percentage',
    '添加文字': 'Add text', '文字内容': 'Text content', '字体': 'Font', 'PDF 密码': 'PDF password', '密码': 'Password',
    '删除页面': 'Delete pages', '删除 {count} 页？删除后可以撤销。': 'Delete {count} pages? You can undo this action.',
    '线宽（pt）': 'Stroke width (pt)', '线型': 'Line style', '实线': 'Solid', '虚线': 'Dashed',
    '描边颜色': 'Stroke color', '填充图形': 'Fill shape', '填充颜色': 'Fill color',
    '属性字段': 'Property fields', '{shape}属性': '{shape} properties', '文字属性': 'Text properties', '图片属性': 'Image properties', '对象信息': 'Object information',
    '选择字体': 'Choose a font', '接入项目配置 TTF 字体后，可新增或修改文字内容。现有对象仍可移动、缩放及调整颜色。': 'Configure a TTF font to add or edit text. Existing objects can still be moved, resized and recolored.',
    '字号（pt）': 'Font size (pt)', '文字颜色': 'Text color', 'X（pt）': 'X (pt)', 'Y（pt）': 'Y (pt)', '宽（pt）': 'Width (pt)', '高（pt）': 'Height (pt)', '旋转增量（°）': 'Rotation delta (°)',
    '对象操作': 'Object actions', '应用修改': 'Apply changes', '替换图片': 'Replace image', '删除对象': 'Delete object',
    '{shape} {number}': '{shape} {number}', '文字：{text}': 'Text: {text}', '无法识别': 'Unrecognized', '图片 {number}': 'Image {number}', '其他对象 {number}': 'Other object {number}',
    'PDF 页面列表': 'PDF page list', '第 {page} 页': 'Page {page}',
    '正在移动 {count} 页': 'Moving {count} pages', '，移回列表后放置': '; move back to the list to drop', '，放到文档末尾': '; drop at the end of the document', '，放到第 {page} 页前': '; drop before page {page}', '，Esc 取消': '; Esc to cancel',
    '点击选页，Ctrl 或 Command 点击多选，拖拽排序。方向键浏览，空格切换选择。': 'Click to select; Ctrl or Command + click for multiple selection. Drag to reorder, use arrow keys to navigate and Space to toggle selection.',
    'PDF 连续页面预览': 'Continuous PDF preview', 'Ctrl 或 Command 加滚轮缩放，普通滚轮上下浏览页面': 'Ctrl or Command + scroll to zoom; scroll to navigate pages',
    '选区覆盖 {count} 页': 'Selection covers {count} pages', '选区覆盖 1 页': 'Selection covers 1 page', '拖动或使用键盘选择区域': 'Drag or use the keyboard to select a region',
} as const;

const actionLabels: Record<PdfEditorActionId, string> = {
    open: 'Open PDF', undo: 'Undo', redo: 'Redo', addText: 'Add text', addImage: 'Add image', insertPage: 'Insert blank page', merge: 'Merge PDF', rotatePage: 'Rotate pages', deletePage: 'Delete pages', pageUp: 'Move pages earlier', pageDown: 'Move pages later', extract: 'Extract pages', save: 'Save PDF',
    select: 'Select objects', pan: 'Pan', rectangle: 'Rectangle', ellipse: 'Ellipse', line: 'Line', arrow: 'Arrow', freehand: 'Freehand', togglePages: 'Pages panel', toggleProperties: 'Properties panel', closePages: 'Collapse pages panel', closeProperties: 'Collapse properties panel', fitPage: 'Fit page',
};

type PdfMessage = keyof typeof english;

/** Translate editor chrome only; document text, object identities and host errors remain data. */
export function usePdfLocale() {
    const { locale } = useLocale();
    function text(message: PdfMessage, values: Readonly<Record<string, string | number>> = {}): string {
        const template = locale === 'en-US' ? english[message] : message;
        return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(values[key] ?? placeholder));
    }
    function actionLabel(action: PdfEditorActionId): string {
        return locale === 'en-US' ? actionLabels[action] : BUILTIN_ACTIONS[action].label;
    }
    function errorMessage(error: PdfEditorError): string { return formatPdfError(error, locale); }
    function objectReason(object: Pick<PdfObject, 'reason' | 'reasonId'>): string {
        return object.reasonId ? formatPdfMessage({ id: object.reasonId }, locale) : object.reason ?? '';
    }
    function toolbarLabel(action: { readonly label: string }): string {
        const message = defaultActionMessage(action);
        return message ? formatPdfMessage(message, locale) : action.label;
    }
    return { text, actionLabel, errorMessage, objectReason, toolbarLabel };
}
