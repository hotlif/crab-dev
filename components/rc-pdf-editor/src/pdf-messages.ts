import type { ConfigLocale } from '@crab-dev/rc-config-provider';
import { PdfEditorError, type PdfEditorErrorCode } from './types.js';
import { engineMessages } from './engine-messages.js';

/** Internal module export: Wake must emit this resource's exact keys for dependent types. */
export const componentMessages = {
    'source.http': { 'zh-CN': '无法加载文件（{status}）', 'en-US': 'Unable to load the file ({status}).' },
    'source.load': { 'zh-CN': '无法加载文件', 'en-US': 'Unable to load the file.' },
    'source.document-id': { 'zh-CN': '文档 id 不能为空', 'en-US': 'The document id must not be empty.' },
    'operation.failed': { 'zh-CN': '操作失败', 'en-US': 'The operation failed.' },
    'worker.operation': { 'zh-CN': 'PDF 操作失败', 'en-US': 'The PDF operation failed.' },
    'worker.load': { 'zh-CN': 'PDF Worker 加载失败', 'en-US': 'The PDF worker could not be loaded.' },
    'worker.message': { 'zh-CN': 'PDF Worker 消息解析失败', 'en-US': 'The PDF worker message could not be read.' },
    'worker.uninitialized': { 'zh-CN': 'PDF 引擎尚未初始化', 'en-US': 'The PDF engine has not been initialized.' },
    'runtime.not-ready': { 'zh-CN': 'PDF 引擎尚未就绪', 'en-US': 'The PDF engine is not ready.' },
    'runtime.invalid-preview': { 'zh-CN': '页面预览数据无效', 'en-US': 'The page preview data is invalid.' },
    'document.required': { 'zh-CN': '请先打开 PDF', 'en-US': 'Open a PDF first.' },
    'document.read-only': { 'zh-CN': '当前文档为只读', 'en-US': 'The current document is read only.' },
    'document.page-range': { 'zh-CN': '页码超出范围', 'en-US': 'The page number is out of range.' },
    'document.stale-selection': { 'zh-CN': '选区对应的文档版本已变化，请重新选择区域', 'en-US': 'The document version changed. Select the region again.' },
    'document.saving': { 'zh-CN': '已有保存正在进行', 'en-US': 'A save operation is already in progress.' },
    'image.format': { 'zh-CN': '请选择 PNG、JPEG 或 WebP 图片', 'en-US': 'Choose a PNG, JPEG or WebP image.' },
    'image.budget': { 'zh-CN': '图片不能超过 1600 万像素', 'en-US': 'Images must not exceed 16 million pixels.' },
    'image.decode': { 'zh-CN': '浏览器无法解码图片', 'en-US': 'The browser could not decode the image.' },
    'font.complete-ttf': { 'zh-CN': '请提供含有所需字符的完整 TTF 字体', 'en-US': 'Provide a complete TTF font containing the required characters.' },
    'font.missing-character': { 'zh-CN': '所选字体不包含字符“{character}”', 'en-US': 'The selected font does not contain “{character}”.' },
    'region.count': { 'zh-CN': '选区必须包含 1–32 个页面区域', 'en-US': 'A selection must contain 1–32 page regions.' },
    'region.page': { 'zh-CN': '选区页码无效或重复', 'en-US': 'Selection page numbers must be valid and unique.' },
    'region.bounds': { 'zh-CN': '选区必须位于页面内，且尺寸为有限正数', 'en-US': 'Selections must stay within the page and have finite positive dimensions.' },
    'region.scale': { 'zh-CN': '采样倍率必须在 0.25–8 之间', 'en-US': 'The sampling scale must be between 0.25 and 8.' },
    'region.page-size': { 'zh-CN': '页面渲染尺寸超出范围', 'en-US': 'The rendered page dimensions are out of range.' },
    'region.image-budget': { 'zh-CN': '选区图像过大，请缩小选区或采样倍率', 'en-US': 'The selected image is too large. Reduce the region or sampling scale.' },
    'region.stitched-budget': { 'zh-CN': '拼接图像过大，请缩小选区或采样倍率', 'en-US': 'The combined image is too large. Reduce the region or sampling scale.' },
    'region.capture-unsupported': { 'zh-CN': '浏览器不支持区域图像导出', 'en-US': 'The browser does not support exporting region images.' },
    'region.pending': { 'zh-CN': '已有区域选择正在进行', 'en-US': 'A region selection is already in progress.' },
    'region.wait-document': { 'zh-CN': '请等待文档操作完成', 'en-US': 'Wait for the document operation to finish.' },
    'plugin.cleanup': { 'zh-CN': '插件 {plugin} 清理失败', 'en-US': 'Plugin {plugin} could not be cleaned up.' },
    'plugin.invalid-id': { 'zh-CN': '插件 id 不能为空或重复', 'en-US': 'Plugin ids must not be empty or repeated.' },
    'plugin.invalid-action': { 'zh-CN': '插件 {plugin} 的动作 id / 名称无效或重复', 'en-US': 'Plugin {plugin} has an invalid or repeated action id or label.' },
    'plugin.invalid': { 'zh-CN': '插件配置无效', 'en-US': 'The plugin configuration is invalid.' },
    'plugin.install': { 'zh-CN': '插件 {plugin} 安装失败', 'en-US': 'Plugin {plugin} could not be installed.' },
    'plugin.uninstalled-action': { 'zh-CN': '插件动作尚未安装', 'en-US': 'The plugin action has not been installed.' },
    'plugin.pending': { 'zh-CN': '已有插件任务正在进行', 'en-US': 'A plugin task is already in progress.' },
    'plugin.not-ready': { 'zh-CN': '编辑器尚未就绪或正在处理文档', 'en-US': 'The editor is not ready or is processing the document.' },
    'plugin.unavailable': { 'zh-CN': '插件动作不可用', 'en-US': 'The plugin action is unavailable.' },
    'plugin.region-ocr': { 'zh-CN': '区域 OCR', 'en-US': 'Region OCR' },
} as const;

type MessageResources = typeof engineMessages & typeof componentMessages;
export type PdfBuiltinMessageId = keyof MessageResources;

/** Only library-owned messages receive an id. Document text and host errors stay data. */
export const pdfMessages: Readonly<Record<PdfBuiltinMessageId, Readonly<Record<ConfigLocale, string>>>> = {
    ...engineMessages,
    ...componentMessages,
};

/**
 * Wake 0.1.45 widens resource strings when emitting declarations. Keep only
 * parameter-bearing identities explicit; type regressions compare this map
 * with both actual localized templates, including the engine resources.
 * This internal type is not re-exported from the package entry.
 */
export type PdfMessageParameterNames = {
    'source.http': 'status';
    'font.missing-character': 'character';
    'plugin.cleanup': 'plugin';
    'plugin.invalid-action': 'plugin';
    'plugin.install': 'plugin';
};
type ParametersFor<Id extends PdfBuiltinMessageId> = Record<Id extends keyof PdfMessageParameterNames ? PdfMessageParameterNames[Id] : never, string | number>;
type MessageArguments<Id extends PdfBuiltinMessageId> = [keyof ParametersFor<Id>] extends [never]
    ? [values?: undefined, options?: ErrorOptions]
    : [values: ParametersFor<Id>, options?: ErrorOptions];

export interface PdfBuiltinMessage {
    readonly id: PdfBuiltinMessageId;
    readonly values?: Readonly<Record<string, string | number>>;
}

/** Internal subtype: existing public Error/code/message and constructor remain unchanged. */
class LibraryPdfError extends PdfEditorError {
    readonly originalMessage: string;
    readonly builtinMessage: PdfBuiltinMessage;
    constructor(code: PdfEditorErrorCode, message: string, builtinMessage: PdfBuiltinMessage, options?: ErrorOptions) {
        super(code, message, options);
        this.originalMessage = message;
        this.builtinMessage = builtinMessage;
    }
}

export function formatPdfMessage(message: PdfBuiltinMessage, locale: ConfigLocale): string {
    const template = pdfMessages[message.id][locale];
    return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => String(message.values?.[key] ?? placeholder));
}

export function pdfError<Id extends PdfBuiltinMessageId>(code: PdfEditorErrorCode, id: Id, ...[values, options]: MessageArguments<Id>): PdfEditorError {
    const message: PdfBuiltinMessage = { id, ...(values === undefined ? {} : { values }) };
    return new LibraryPdfError(code, formatPdfMessage(message, 'zh-CN'), message, options);
}

export function builtinPdfMessage(error: unknown): PdfBuiltinMessage | undefined {
    return error instanceof LibraryPdfError && error.message === error.originalMessage ? error.builtinMessage : undefined;
}

function isBuiltinMessage(value: unknown): value is PdfBuiltinMessage {
    if (value === null || typeof value !== 'object' || !('id' in value) || typeof value.id !== 'string'
        || !isBuiltinId(value.id)) return false;
    const values = 'values' in value ? value.values : undefined;
    const parameters = [...pdfMessages[value.id]['zh-CN'].matchAll(/\{(\w+)\}/g)];
    if (values === undefined) return parameters.length === 0;
    if (values === null || typeof values !== 'object' || Array.isArray(values)
        || !Object.values(values).every(parameter => typeof parameter === 'string' || (typeof parameter === 'number' && Number.isFinite(parameter)))) return false;
    return parameters.every(([, key]) => Object.hasOwn(values, key));
}

function isBuiltinId(id: string): id is PdfBuiltinMessageId { return Object.hasOwn(pdfMessages, id); }

export function restorePdfError(code: PdfEditorErrorCode, message: string, builtinMessage?: unknown): PdfEditorError {
    return isBuiltinMessage(builtinMessage) ? new LibraryPdfError(code, message, builtinMessage) : new PdfEditorError(code, message);
}

export function formatPdfError(error: PdfEditorError, locale: ConfigLocale): string {
    const message = builtinPdfMessage(error);
    return message ? formatPdfMessage(message, locale) : error.message;
}
