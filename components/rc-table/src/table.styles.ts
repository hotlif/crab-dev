import { TokenVars as VirtualTokenVars } from "@crab-dev/rc-virtual";
import { css } from "@crab-dev/css";
import { TokenVars as checkboxVars } from "@crab-dev/rc-checkbox";
import { TokenVars as radioVars } from "@crab-dev/rc-radio";
import token from "./token.js";
import { ROW_BG_VAR, ROW_BG_TRANSITION } from "./rowBg.js";

export const tableRootStyle = css`
    --table-row-motion: ${token.motion.rows.transition};
    position: relative;
    width: fit-content;
    font-family: ${token.root['font-family']};
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
    font-variant-numeric: tabular-nums;
    color: ${token.root.color};
    background-color: ${token.cell['background-color']};
    ${VirtualTokenVars['scrollbar.opacity']}: ${token.scrollbar.opacity};

    &:focus-visible {
        outline: none;
    }
    &:focus-visible > [data-table-focus-ring] {
        display: block;
    }

    &::before, &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        width: ${token['fixed-edge'].width};
        pointer-events: none;
        z-index: 30;
    }
    &[data-fixed-left]::before {
        content: '';
        left: clamp(0px, var(--rc-table-fixed-left-width), calc(100% - ${token['fixed-edge'].width}));
        background: linear-gradient(to right, ${token['fixed-edge'].color}, transparent);
    }
    &[data-fixed-right]::after {
        content: '';
        right: clamp(0px, var(--rc-table-fixed-right-width), calc(100% - ${token['fixed-edge'].width}));
        background: linear-gradient(to left, ${token['fixed-edge'].color}, transparent);
    }

    @media (forced-colors: active) {
        &[data-fixed-left]::before {
            border-left: 1px solid CanvasText;
        }
        &[data-fixed-right]::after {
            border-right: 1px solid CanvasText;
        }
        & [role='columnheader'], & [role='gridcell'] {
            outline: 1px solid CanvasText;
            outline-offset: -1px;
        }
    }
`;

export const tableFocusRingStyle = css`
    display: none;
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* Above Virtual's local scrollbars (200), below semantic overlays (1000+). */
    z-index: 300;
    outline: ${token.root["outline-width-focus"]} solid ${token.root["outline-color-focus"]};
    outline-offset: ${token.root["outline-offset-focus"]};
    @media (forced-colors: active) { outline-color: Highlight; }
`;

export const filterSizeProbeStyle = css`
    position: absolute;
    inset: 0 auto auto 0;
    width: 0;
    height: calc(${token['filter-cell'].control['min-height']} + ${token['filter-cell'].padding} * 2);
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
`;

export const selectionCellStyle = css`
    /* Dense rows own their spacing; selection targets must not overlap adjacent rows. */
    ${checkboxVars['control.target.width']}: ${token['row-selection'].control.width};
    ${checkboxVars['state-layer.width']}: ${token['row-selection'].control.width};
    ${checkboxVars['root.touch.min-width']}: ${token['row-selection'].control.width};
    ${checkboxVars['root.touch.min-height']}: ${token['row-selection'].control.width};
    ${radioVars['control.target.width']}: ${token['row-selection'].control.width};
    ${radioVars['state-layer.width']}: ${token['row-selection'].control.width};
    ${radioVars['root.touch.min-width']}: ${token['row-selection'].control.width};
    ${radioVars['root.touch.min-height']}: ${token['row-selection'].control.width};
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`;

export const expandChevronStyle = css`
    transition: ${token.expand.chevron.transition};
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const expandContentStyle = css`
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: ${token.expand.content.padding};
    background-color: ${token.expand.content["background-color"]};
    box-shadow: inset 0 1px 0 ${token.root["border-color"]},
                inset 0 -1px 0 ${token.root["border-color"]};
`;

export const selectedRowStyle = css`
    background-color: var(${ROW_BG_VAR}, ${token.cell['background-color']});
    color: ${token['row-selection']['color-selected']};
    transition: ${ROW_BG_TRANSITION};

    @media (forced-colors: active) {
        forced-color-adjust: none;
        color: HighlightText;
        ${ROW_BG_VAR}: Highlight;
        & [role='gridcell'] { background-color: Highlight; }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const clickableRowStyle = css`
    cursor: ${token['row-click'].cursor};
    background-color: var(${ROW_BG_VAR}, transparent);
    transition: ${ROW_BG_TRANSITION};

    &:hover {
        ${ROW_BG_VAR}: ${token['row-click']['background-color-hover']};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const fixedCellBgWithRowVar = css`
    z-index: 9;
    background-color: var(${ROW_BG_VAR}, ${token.cell['background-color']});
    transition: ${ROW_BG_TRANSITION};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const filterCellBorderShadow = css`
    box-shadow: inset -1px 0 0 ${token.root["border-color"]},
                inset 0 -1px 0 ${token.root["border-color"]};
`;

export const emptyContainerStyle = css`
    position: relative;
`;

export const emptyBodyStyle = css`
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const rowEditingRowStyle = css`
    position: relative;
    /* The action strip extends over the next row. Its row stacking context must
       clear ordinary sticky cells (9); child z-index alone cannot escape it.
       The later summary row stays above at the same level, and headers/filter
       cells retain their higher local layers (11/30). */
    z-index: 10;
`;

export const rowEditBorderOverlayStyle = css`
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid ${token['row-edit']['border-color']};
    border-radius: ${token['row-edit'].card["border-radius"]} ${token['row-edit'].card["border-radius"]} 0 0;
    box-shadow: ${token['row-edit'].card["box-shadow"]};
    pointer-events: none;
    z-index: 10;
`;

export const rowEditActionsWrapperStyle = css`
    display: inline-block;
    position: sticky;
    inset-inline-end: 0;
    width: 0;
    height: 100%;
    vertical-align: top;
    z-index: 25;
    overflow: visible;
`;

export const rowEditActionsInnerStyle = css`
    position: absolute;
    top: 100%;
    inset-inline-end: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: ${token['row-edit'].actions.gap};
    padding: ${token['row-edit'].actions.padding};
    background-color: ${token['row-edit'].actions["background-color"]};
    border: 1px solid ${token['row-edit'].actions["border-color"]};
    border-top: none;
    border-radius: 0 0 ${token['row-edit'].actions["border-radius"]} ${token['row-edit'].actions["border-radius"]};
    box-shadow: ${token['row-edit'].actions["box-shadow"]};
`;

export const fixedCellRowEditBgStyle = css`
    z-index: 9;
    background-color: ${token['row-edit'].row["background-color"]};
`;

export const filterCellBottomOnlyShadow = css`
    box-shadow: inset 0 -1px 0 ${token.root["border-color"]};
`;
