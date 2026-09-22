import type { PdfIconName } from './icon.js';

interface ActionDefinition { label: string; icon: PdfIconName; group: string }

/** 内置动作的唯一注册点；业务代码应使用公开描述列表，不依赖图标实现。 */
export const BUILTIN_ACTIONS = {
    open: { label: '打开 PDF', icon: 'open', group: 'file' },
    undo: { label: '撤销', icon: 'undo', group: 'history' },
    redo: { label: '重做', icon: 'redo', group: 'history' },
    addText: { label: '添加文字', icon: 'text', group: 'insert' },
    addImage: { label: '添加图片', icon: 'image', group: 'insert' },
    insertPage: { label: '插入空白页', icon: 'insertPage', group: 'pages' },
    merge: { label: '合并 PDF', icon: 'merge', group: 'pages' },
    rotatePage: { label: '旋转页面', icon: 'rotatePage', group: 'pages' },
    deletePage: { label: '删除页面', icon: 'deletePage', group: 'pages' },
    pageUp: { label: '页面前移', icon: 'pageUp', group: 'pages' },
    pageDown: { label: '页面后移', icon: 'pageDown', group: 'pages' },
    extract: { label: '提取页面', icon: 'extract', group: 'output' },
    save: { label: '保存 PDF', icon: 'save', group: 'output' },
    select: { label: '选择对象', icon: 'select', group: 'navigation' },
    pan: { label: '抓手平移', icon: 'pan', group: 'navigation' },
    rectangle: { label: '矩形边框', icon: 'rectangle', group: 'drawing' },
    ellipse: { label: '圆形/椭圆', icon: 'ellipse', group: 'drawing' },
    line: { label: '直线', icon: 'line', group: 'drawing' },
    arrow: { label: '箭头', icon: 'arrow', group: 'drawing' },
    freehand: { label: '自由手绘', icon: 'freehand', group: 'drawing' },
    togglePages: { label: '页面面板', icon: 'panelLeft', group: 'panels' },
    toggleProperties: { label: '属性面板', icon: 'panelRight', group: 'panels' },
    closePages: { label: '收起页面面板', icon: 'collapseLeft', group: 'panels' },
    closeProperties: { label: '收起属性面板', icon: 'collapseRight', group: 'panels' },
    fitPage: { label: '适应页面', icon: 'fitPage', group: 'view' },
} as const satisfies Record<string, ActionDefinition>;

export type PdfEditorActionId = keyof typeof BUILTIN_ACTIONS;
export type PdfEditorActionGroup = typeof BUILTIN_ACTIONS[PdfEditorActionId]['group'];
export interface PdfEditorActionDescriptor {
    readonly id: PdfEditorActionId;
    readonly label: string;
    readonly group: PdfEditorActionGroup;
}

/** 只读动作目录，供配置面板和宿主菜单使用；新增内置动作会自动进入此列表。 */
export const PDF_EDITOR_ACTIONS: readonly PdfEditorActionDescriptor[] = Object.freeze(
    (Object.keys(BUILTIN_ACTIONS) as PdfEditorActionId[]).map(id =>
        Object.freeze({ id, label: BUILTIN_ACTIONS[id].label, group: BUILTIN_ACTIONS[id].group })),
);
