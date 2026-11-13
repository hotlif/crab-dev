import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import { TokenVars as checkboxVars } from "@crab-dev/rc-checkbox";
import { css } from "@crab-dev/css";
import token, { vars } from "./token.js";

export const flexColumnStyle = css`
    display: flex;
    flex-direction: column;
`;

export const tableFlexStyle = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    position: relative;
`;

export const tableFillStyle = css`
    position: relative;
    width: 100%;
    height: 100%;
`;

export const loadingOverlayStyle = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${token.overlay['background-color-loading']};
    z-index: 10;
`;

export const paginationBarStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    flex-shrink: 0;
    background-color: ${token.chrome['background-color']};
    border-left: 1px solid ${token.root['border-color']};
    border-right: 1px solid ${token.root['border-color']};
    border-bottom: 1px solid ${token.root['border-color']};
`;

export const iconButtonStyle = css`
    flex-shrink: 0;
    ${buttonVars['text.color']}: ${token.icon.color};
    ${buttonVars['text.background-color-hover']}: ${token.icon['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.icon['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.icon['background-color-pressed']};
    && { width: ${token.control.target.width}; height: ${token.control.target.width}; }
`;

export const tableAndPanelRowStyle = css`
    position: relative;
    container-type: inline-size;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    /* Keep the overlay offset and rail width in sync with coarse pointer targets. */
    @media (pointer: coarse) {
        ${vars['toolbar.width']}: calc(max(${token.toolbar.control.width}, ${token.control.target.width}) + ${token.toolbar.padding} * 2 + 1px);
    }
`;

/* TablePro's desktop tools compose themed extra-small Buttons; visual geometry is independent
   of touch targets. Keep Button's default shape, focus and press feedback. */
export const sideToolbarButtonStyle = css`
    flex-shrink: 0;
    /* Inset the focus ring so dense adjacent tools cannot cover it. */
    ${buttonVars['root.outline-offset-focus']}: ${token.toolbar['outline-offset-focus']};
    ${buttonVars['text.color']}: ${token.icon.color};
    ${buttonVars['text.background-color-hover']}: ${token.icon['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.icon['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.icon['background-color-pressed']};
    ${buttonVars['tonal.color-selected']}: ${token.icon['color-selected']};
    ${buttonVars['tonal.background-color-selected']}: ${token.icon['background-color-selected']};
    && { width: ${token.toolbar.control.width}; height: ${token.toolbar.control.width}; }
    @media (pointer: coarse) {
        min-width: ${token.control.target.width};
        min-height: ${token.control.target.width};
    }
`;

export const tableAreaStyle = css`
    flex: 1;
    min-width: 0;
    position: relative;
    /* Contain Table fixed-edge, focus and scrollbar layers below sibling panels. */
    z-index: 0;
`;

export const sideToolbarStyle = css`
    position: relative;
    z-index: 12;
    box-sizing: border-box;
    width: ${token.toolbar.width};
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block: ${token.toolbar.padding};
    gap: ${token.toolbar.gap};
    border-inline-start: 1px solid ${token.root['border-color']};
    background-color: ${token.chrome['background-color']};
`;

export const sideBarStyle = css`
    width: ${token.panel.width};
    min-width: 0;
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-inline-start: 1px solid ${token.root['border-color']};
    background-color: ${token.surface['background-color']};
    overflow: hidden;
    @container (max-width: 600px) {
        position: absolute;
        inset-block: 0;
        inset-inline-end: ${token.toolbar.width};
        z-index: 11;
        max-width: calc(100% - ${token.toolbar.width});
        box-shadow: ${token.panel['box-shadow']};
    }
`;

export const sideBarToolbarStyle = css`
    /* The select-all checkbox shares the desktop tool geometry. Checkbox keeps
       its own coarse-pointer minimum, independently of its visual state layer. */
    ${checkboxVars['control.target.width']}: ${token.toolbar.control.width};
    ${checkboxVars['state-layer.width']}: ${token.toolbar.control.width};
    min-height: ${token.toolbar.control.width};
    display: flex;
    align-items: center;
    padding: ${token.toolbar.padding};
    gap: ${token.toolbar.gap};
    border-bottom: 1px solid ${token.root['border-color']};
    background-color: ${token.chrome['background-color']};
    flex-shrink: 0;
`;

export const sideBarSearchStyle = css`
    flex: 1;
    min-width: 0;
`;

export const sideBarBodyStyle = css`
    flex: 1;
    min-height: 0;
    overflow: hidden;
`;

export const searchBarStyle = css`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    flex-shrink: 0;
    background-color: ${token.chrome['background-color']};
    border-bottom: 1px solid ${token.root['border-color']};
`;

export const searchBarInputWrapStyle = css`
    flex: 1;
    min-width: 0;
    max-width: 240px;
`;

export const searchBarCountStyle = css`
    font-size: 11px;
    color: ${token.text.tertiary.color};
    white-space: nowrap;
    padding: 0 4px;
`;

export const sideBarFooterStyle = css`
    flex-shrink: 0;
    border-top: 1px solid ${token.root['border-color']};
    padding: 4px 8px;
    display: flex;
    justify-content: flex-end;
`;

export const resetWidthBtnStyle = css`
    min-height: ${token.toolbar.control.width};
`;

export const clearAllBtnStyle = css`
    flex-shrink: 0;
    min-height: ${token.toolbar.control.width};
`;

export const filterPanelScrollStyle = css`
    overflow-y: auto;
`;

export const filterPanelRowStyle = css`
    padding: 6px 8px;
    border-bottom: 1px solid ${token.root['border-color']};
`;

export const filterPanelLabelStyle = css`
    font-size: 11px;
    color: ${token.text.secondary.color};
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const filterPanelEditorWrapStyle = css`
    min-width: 0;
    & > * { max-width: 100%; }
`;

export const filterPanelEmptyStyle = css`
    padding: 20px 8px;
    text-align: center;
    font-size: 12px;
    color: ${token.text.tertiary.color};
`;

export const errorOverlayStyle = css`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: ${token.overlay['background-color-error']};
    z-index: 10;
    color: ${token.failure.icon.color};
`;

export const errorMessageStyle = css`
    font-size: 12px;
    color: ${token.failure.text.color};
    max-width: 280px;
    text-align: center;
    word-break: break-word;
    margin: 0;
`;

export const retryBtnStyle = css`
    min-height: ${token.control.target.width};
`;
