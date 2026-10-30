import { css } from "@crab-dev/css";
import token from "./token.js";

export const draggableStyle = css`
    cursor: pointer;
    &:active {
        cursor: grabbing;
    }
`;

export const sortableRootStyle = css`
    cursor: ${token.sort.header.cursor};
    user-select: none;
`;

export const titleInnerBaseStyle = css`
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: ${token.header.gap};
    padding-inline: ${token.cell['padding-inline']};
    box-sizing: border-box;
    overflow: hidden;
`;

export const sortTitleInnerStyle = css`
    cursor: pointer;
    &:focus-visible {
        outline: ${token.root["outline-width-focus"]} solid ${token.root["outline-color-focus"]};
        outline-offset: calc(-1 * ${token.root["outline-width-focus"]});
    }
`;

export const sortIconWrapStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 2px;
`;

export const sortIconPlaceholderStyle = css`
    display: none;
`;

export const sortIconIdleStyle = css`
    color: ${token.sort.icon.color};
`;

export const sortIconActiveStyle = css`
    stroke: ${token.sort.icon['color-active']};
`;

export const sortBadgeStyle = css`
    font-size: ${token.sort.badge['font-size']};
    color: ${token.sort.badge.color};
    line-height: 1;
    font-variant-numeric: tabular-nums;
`;

export const fixedHeaderBgStyle = css`
    background-color: ${token.header['background-color']};
`;

export const fixedRightSpanStyle = css`
    box-shadow: inset 0 1px 0 ${token.root["border-color"]}, inset 1px 0 0 ${token.cell.separator["border-color"]};
`;

export const fixedRightSpanWithBottomStyle = css`
    box-shadow: inset 0 1px 0 ${token.root["border-color"]}, inset 1px 0 0 ${token.cell.separator["border-color"]}, inset 0 -1px 0 ${token.root["border-color"]};
`;

export const fixedRightSkipStyle = css`
    box-shadow: inset 1px 0 0 ${token.cell.separator["border-color"]}, inset 0 -1px 0 ${token.root["border-color"]};
`;

export const draggingStyle = css`
    opacity: ${token['column-drag']['opacity-dragging']};
`;

export const skipCellStyle = css`
    pointer-events: none;
`;

export const dropLineBaseStyle = css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${token['column-drag'].indicator.width};
    background-color: ${token['column-drag'].indicator["background-color"]};
    pointer-events: none;
    z-index: 2;
`;

export const dropLineLeftStyle = css`
    left: 0;
`;

export const dropLineRightStyle = css`
    right: 0;
`;
