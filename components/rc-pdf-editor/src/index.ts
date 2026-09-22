import PdfEditor from './pdf-editor.js';
export { PdfEditor };
export default PdfEditor;
export { definePdfEditor } from './web-component.js';
export type { PdfEditorElement, PdfEditorElementOptions, PdfEditorElementConstructor, PdfEditorElementEventMap } from './web-component-types.js';
export { PdfEditorError } from './types.js';
export { PDF_EDITOR_ACTIONS } from './actions.js';
export { createRegionOcrPlugin } from './plugins/region-ocr.js';
export type { PdfEditorActionId, PdfEditorActionGroup, PdfEditorActionDescriptor } from './actions.js';
export type {
    PdfEditorProps, PdfEditorRef, PdfEditorRuntime, PdfEditorState, PdfEditorErrorCode, PdfFont, PdfSource,
    PdfDocumentInput, PdfDocumentState, PdfExportResult, PdfOperation, PdfOperationOptions,
    PdfDocumentChangeRequest, PdfDocumentChangeGuard, PdfSaveHandler,
    PdfEditorActionVisibility, PdfEditorToolbarAction, PdfEditorToolbar,
    PdfEditorPlugin, PdfEditorPluginAction, PdfEditorPluginContext, PdfRegionOcrPluginOptions,
    PdfPageDescriptor, PdfRegionBounds, PdfPageRegion, PdfRegionSelection, PdfRegionCaptureOptions, PdfRegionImage, PdfRegionImagePart,
} from './types.js';
export { vars as TokenVars } from './token.js';
