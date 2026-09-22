import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { TokenVars as treeVars } from '@crab-dev/rc-tree';
import { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import token from './token.js';

export const rootStyle = css`
    display: flex; flex-direction: column; position: relative; overflow: hidden;
    width: 100%; height: ${token.root.height}; min-height: ${token.root['min-height']};
    border: ${token.root['border-width']} solid ${token.root['border-color']};
    border-radius: ${token.root['border-radius']}; background: ${token.root.background}; color: ${token.root.color};
    font-family: ${token.root['font-family']}; font-size: ${token.root['font-size']}; line-height: ${token.root['line-height']};
    box-sizing: border-box;
    & *, & *::before, & *::after { box-sizing: border-box; }
`;
export const toolbarStyle = css`
    display: flex; flex-wrap: wrap; align-items: center; flex-shrink: 0;
    min-height: ${token.toolbar['min-height']}; padding: ${token.toolbar.gap} ${token.toolbar.padding}; gap: ${token.toolbar.gap};
    background: ${token.toolbar.background};
`;
export const rowStyle = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.toolbar.gap};`;
export const panelTogglesStyle = css`display: flex; align-items: center; gap: ${token.toolbar.gap}; margin-inline-start: auto;`;
export const panelHeaderStyle = css`
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; gap: ${token.toolbar.gap};
    & > h2 { min-width: 0; }
`;
export const nameStyle = css`flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
export const toolbarNameStyle = css`min-width: ${token.toolbar['file-name']['min-width']};`;
export const bodyStyle = css`display: flex; flex: 1; min-height: 0; min-width: 0; position: relative;`;
export const sidebarStyle = css`
    display: flex; flex-direction: column; flex-shrink: 0; width: ${token.panel.width};
    gap: ${token.panel.gap}; padding: ${token.panel.padding}; overflow: auto;
    background: ${token.root.background};
    &[data-panel='properties'] { width: ${token.panel.properties.width}; overflow: hidden; }
    &[hidden] { display: none; }
    @media (max-width: 1000px) {
        position: absolute; inset-block: 0; inset-inline-start: 0; z-index: 2;
        &[data-panel='properties'] { inset-inline-start: auto; inset-inline-end: 0; }
    }
`;
export const sectionStyle = css`display: flex; flex-direction: column; min-width: 0; gap: ${token.panel.gap};`;
export const propertiesContentStyle = css`display: flex; flex-direction: column; flex: 1; min-width: 0; min-height: 0; overflow: hidden;`;
// 表单保留浏览器原生滚动与焦点自动滚入；不使用虚拟列表卸载正在编辑的字段。
export const propertiesScrollStyle = css`
    flex: 1; min-width: 0; min-height: 0;
    overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: contain;
    scrollbar-width: thin; scrollbar-gutter: stable;
    scrollbar-color: ${token.panel['scrollbar-color']} transparent;
    padding: ${token.panel.scroll.padding}; scroll-padding-block: ${token.panel.gap};
    & > * { flex-shrink: 0; min-width: 0; max-width: 100%; }
    /* 字体名称可能很长；解除 Select 网格子项的自动最小宽度，使用其内置省略行为。 */
    & [role='combobox'] { min-width: 0; max-width: 100%; }
    @media (pointer: coarse) { scrollbar-width: auto; }
    @media (forced-colors: active) { scrollbar-color: auto; }
`;
export const propertiesActionsStyle = css`
    display: flex; flex-wrap: wrap; flex-shrink: 0; gap: ${token.toolbar.gap};
    padding: ${token.panel.scroll.padding}; padding-block-start: ${token.panel.gap};
`;
export const objectSectionStyle = css`
    display: flex; flex-direction: column; flex-shrink: 0; min-height: 0;
    max-height: ${token.objects['max-height']}; gap: ${token.objects.gap};
`;
export const objectHeadingStyle = css`font-size: ${token.objects['font-size']};`;
export const headingStyle = css`margin: 0; font-size: ${token.panel.heading['font-size']}; font-weight: ${token.panel.heading['font-weight']};`;
export const viewStyle = css`flex: 1; min-width: 0; min-height: 0; position: relative; background: ${token.canvas.background}; overflow: hidden;`;
export const documentRootStyle = css`position: relative; width: 100%; height: 100%; overflow: hidden; row-gap: ${token.canvas.padding};`;
export const regionOverlayStyle = css`
    position: absolute; inset: 0; z-index: 2; cursor: crosshair; touch-action: none;
    & > svg { display: block; pointer-events: none; }
    &:focus-visible { outline: ${token.selection['border-width']} solid ${token.selection.color}; outline-offset: calc(-1 * ${token.selection['border-width']}); }
`;
export const regionOutlineStyle = css`fill: ${token.selection.background}; stroke: ${token.selection.color}; stroke-width: ${token.selection['border-width']}; vector-effect: non-scaling-stroke;`;
// 自有 Virtual 提供逻辑滚动窗口；PDF 页尺寸通过运行时几何变量传入。
export const documentContentStyle = css`
    position: relative; width: var(--pdf-document-width);
    height: calc(var(--crab-rc-virtual-top-padding-height, 0px) + var(--pdf-document-span) + var(--crab-rc-virtual-bottom-padding-height, 0px));
    min-height: var(--pdf-preview-height);
`;
export const documentSurfaceStyle = css`position: sticky; top: 0; left: 0; width: var(--pdf-preview-width); height: var(--pdf-preview-height);`;
export const fillStyle = css`flex: 1; min-height: 0; height: 100%; min-width: 0;`;
export const pageListStyle = css`flex: 1; min-height: 0; min-width: 0; position: relative;`;
export const frameStyle = css`position: absolute; inset: 0; &[data-visible='false'] { visibility: hidden; pointer-events: none; }`;
export const thumbnailCanvasStyle = css`display: block; position: relative; width: ${token.thumbnail.image.width}; height: ${token.thumbnail.image.height};`;
export const renderRetryStyle = css`position: absolute; inset-inline-end: ${token.panel.padding}; inset-block-end: ${token.panel.padding}; z-index: 2;`;
export const progressSlotStyle = css`display: flex; align-items: center; width: ${token.toolbar.icon.width}; height: ${token.toolbar.icon.width}; flex-shrink: 0;`;
export const pageDragStatusStyle = css`position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap;`;
export const stageStyle = css`
    width: 100%; height: 100%; position: relative; touch-action: none;
    &[data-tool='pan'] { cursor: grab; }
    &:not([data-tool='select']):not([data-tool='pan']) { cursor: crosshair; }
    &:not([data-tool='select']) canvas { cursor: inherit !important; }
`;
export const drawToolbarStyle = css`
    display: flex; flex-wrap: wrap; align-items: center; flex-shrink: 0;
    padding: ${token.toolbar.gap} ${token.toolbar.padding}; gap: ${token.toolbar.gap}; background: ${token.toolbar.background};
`;
export const toolDividerStyle = css`height: ${token.toolbar.icon.width}; width: ${token.root['border-width']}; background: ${token.root['border-color']}; margin-inline: ${token.toolbar.gap};`;
export const centerStyle = css`display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: ${token.canvas.padding}; gap: ${token.panel.gap}; text-align: center;`;
export const statusStyle = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.toolbar.gap}; padding: ${token.status['padding-block']} ${token.panel.padding}; color: ${token.status.color}; font-size: ${token.status['font-size']};`;
export const hintStyle = css`margin: 0; color: ${token.status.color}; font-size: ${token.status['font-size']}; overflow-wrap: anywhere;`;
export const errorStyle = css`padding: ${token.toolbar.gap} ${token.panel.padding}; color: ${token.root['color-error']}; background: ${token.root['background-color-error']};`;
export const thumbStyle = css`
    height: ${token.thumbnail.height}; position: relative; display: flex; flex-direction: column; align-items: stretch; padding-block: ${token.toolbar.gap}; gap: ${token.toolbar.gap};
    &[data-drop]::after { content: ''; position: absolute; z-index: 1; inset-inline: 0; height: ${token.thumbnail.drop.height}; background: ${token.thumbnail.drop['background-color']}; pointer-events: none; }
    &[data-drop='before']::after { inset-block-start: 0; }
    &[data-drop='after']::after { inset-block-end: 0; }
`;
export const thumbButtonStyle = css`
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${token.toolbar.gap}; user-select: none;
    &[data-draggable='true'] { cursor: grab; }
    &[data-dragging='true'] { cursor: grabbing; background-color: ${token.thumbnail['background-color-dragging']}; }
`;
export const thumbContentStyle = css`display: flex; flex-direction: column; align-items: center; font-size: ${token.status['font-size']};`;
export const fieldsStyle = css`
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; gap: ${token.toolbar.gap};
    & > * { min-width: 0; max-width: 100%; }
`;
export const objectTreeStyle = css`
    height: ${token.objects.height}; min-height: 0; min-width: 0;
    ${treeVars['node.selection.border-width']}: 0px;
    ${treeVars['root.font-size']}: ${token.objects['font-size']};
    ${treeVars['root.line-height']}: ${token.objects['line-height']};
    & svg { width: ${token.objects.icon.width}; height: ${token.objects.icon.width}; }
`;
export const iconStyle = css`width: ${token.toolbar.icon.width}; height: ${token.toolbar.icon.width}; display: block; flex-shrink: 0; & > svg { width: 100%; height: 100%; }`;
export const toolbarButtonStyle = css`
    flex-shrink: 0;
    ${buttonVars['icon.width']}: ${token.toolbar.icon.width};
    ${buttonVars['size.middle.icon.width']}: ${token.toolbar.icon.width};
    ${buttonVars['text.color']}: ${token.toolbar.icon.color};
    ${buttonVars['text.background-color-hover']}: ${token.toolbar.icon['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.toolbar.icon['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.toolbar.icon['background-color-pressed']};
    &::after {
        content: ''; position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
        width: max(100%, ${token.toolbar.target.width}); height: max(100%, ${token.toolbar.target.width});
    }
`;
// 桌面状态栏的紧凑数值字段；复用 LineEdit 边框、状态和焦点，粗指针仍由其保证触控高度。
export const zoomStyle = css`
    width: ${token.status.zoom.width}; max-width: ${token.status.zoom.width};
    ${lineEditVars['size.small.height']}: ${token.status.zoom.height};
    ${lineEditVars['size.small.font-size']}: ${token.status.zoom['font-size']};
    ${lineEditVars['size.small.line-height']}: ${token.status.zoom['line-height']};
    & input { text-align: end; font-variant-numeric: tabular-nums; }
`;
// rc-virtual 提供的测量变量，属于运行时布局数据。
export const topSpacerStyle = css`height: var(--crab-rc-virtual-top-padding-height, 0px);`;
export const bottomSpacerStyle = css`height: var(--crab-rc-virtual-bottom-padding-height, 0px);`;
