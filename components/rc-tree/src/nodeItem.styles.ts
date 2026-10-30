import { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import { css } from "@crab-dev/css";
import { TokenVars as checkboxVars } from "@crab-dev/rc-checkbox";
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import token from "./token.js";

export const expandIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: ${token.root["border-radius"]};
    color: ${token.node.expand.icon.color};
    cursor: pointer;
    flex-shrink: 0;
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
    transition: background-color ${token.root.transition};
    @media (pointer: coarse) { min-width: ${token.node.touch['min-width']}; min-height: ${token.node.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { &, > svg { transition: none; } }

    > svg {
        display: block;
        transition: transform ${token.motion.arrow.transition};
    }

    &:dir(rtl) > svg {
        transform: rotate(180deg);
    }

    &[data-expanded="true"] > svg {
        transform: rotate(90deg);
    }

    &:hover {
        background-color: ${token.node.icon["background-color-hover"]};
    }
`;

export const loadingIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
    color: ${token.node.icon["color-loading"]};
    --rc-spin-size: 1em;
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

export const fileIconPlaceholderStyle = css`
    width: 20px;
    flex-shrink: 0;
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
`;

export const nodeItemBase = css`
    ${checkboxVars['control.target.width']}: ${token.node.selection.width};
    ${checkboxVars['state-layer.width']}: ${token.node.selection.width};
    ${checkboxVars['root.touch.min-width']}: ${token.node.selection.width};
    ${checkboxVars['root.touch.min-height']}: ${token.node.selection.width};
    @media (pointer: coarse) {
        ${checkboxVars['control.target.width']}: ${token.node.selection.touch.width};
        ${checkboxVars['state-layer.width']}: ${token.node.selection.touch.width};
        ${checkboxVars['root.touch.min-width']}: ${token.node.selection.touch.width};
        ${checkboxVars['root.touch.min-height']}: ${token.node.selection.touch.width};
    }
    position: relative;
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    border-radius: ${token.root["border-radius"]};
    user-select: none;
    padding-inline-end: 0.5rem;
    height: 100%;
    transition: background-color ${token.root.transition}, color ${token.root.transition}, opacity ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { &, [data-grip] { transition: none; } }
    @media (forced-colors: active) {
        &[data-selected="true"] { outline: ${token.root['outline-width-focus']} solid Highlight; outline-offset: -2px; }
        &[data-disabled="true"] { color: GrayText; opacity: 1; }
    }

    &:hover:not([data-disabled="true"]) {
        background-color: ${token.node["background-color-hover"]};
    }

    &[data-selected="true"]:not([data-disabled="true"]) {
        background-color: ${token.node["background-color-selected"]};
        color: ${token.node['color-selected']};
        @media (forced-colors: active) {
            forced-color-adjust: none;
            color: HighlightText;
            background-color: Highlight;
        }
        [data-node-title] { text-decoration: ${token.node.selection['text-decoration']}; }
        [data-expanded], [data-loading-indicator] { color: inherit; }
        /* Pair the library-owned icon container with the selected row. Only
           color inherits: caller-supplied SVG colors, fill and stroke survive. */
        > [data-node-icon] { color: inherit; }
    }

    &[data-disabled="true"] {
        color: ${token.node["color-disabled"]};
        background-color: ${token.node["background-color-disabled"]};
        cursor: not-allowed;
        opacity: ${token.node['opacity-disabled']};
    }

    &[data-disabled="true"] span {
        cursor: not-allowed;
        pointer-events: none;
    }

    &[data-dragging="true"] {
        opacity: 0.35;
    }

    &:hover:not([data-disabled="true"]) [data-grip] {
        opacity: 0.3;
    }

    &:hover:not([data-disabled="true"]) [data-grip]:hover {
        opacity: 0.8;
    }
`;

export const dragUpwardStyle = css`
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background:
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator['background-color']} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator['background-color']}, ${token.node.drag.indicator['background-color']})
            8px center / calc(100% - 8px) 2px no-repeat;
        pointer-events: none;
    }
`;

export const dragDownStyle = css`
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background:
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator['background-color']} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator['background-color']}, ${token.node.drag.indicator['background-color']})
            8px center / calc(100% - 8px) 2px no-repeat;
        pointer-events: none;
    }
`;

export const dragInsideStyle = css`
    background-color: ${token.node.drag.inside["background-color"]} !important;
    box-shadow: inset 0 0 0 2px ${token.node.drag.inside["border-color"]};
`;

export const dragBadgeBaseStyle = css`
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    line-height: 1;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    color: ${token.node.drag.badge.color};
    white-space: nowrap;
    pointer-events: none;
`;

export const dragBadgeIndicatorStyle = css`
    background-color: ${token.node.drag.badge["background-color"]};
`;

export const dragBadgeInsideStyle = css`
    background-color: ${token.node.drag.badge["background-color"]};
`;

export const indentLineSpanStyle = css`
    position: relative;
    padding-inline-start: 16px;
    width: ${token.indent.width};
    height: 100%;
    text-align: center;
    flex: 0 0 auto;

    &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        border-inline-end: 1px solid ${token.node["indent-line"]["border-color"]};
        content: "";
    }
`;

export const nodeIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-inline-start: 0.25rem;
    color: ${token.node.expand.icon.color};
`;

export const dragHandleStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 100%;
    cursor: grab;
    color: ${token.node.expand.icon.color};
    opacity: 0;
    transition: opacity ${token.root.transition};
    @media (pointer: coarse) { min-width: ${token.node.touch['min-width']}; opacity: 1; }

    &:active {
        cursor: grabbing;
    }
`;

export const titleSpanStyle = css`
    cursor: pointer;
    padding-inline: 0.375rem;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: ${token.root["border-radius"]};
`;

export const editInputStyle = css`
    /* Embedded editing follows the actual Tree row, including explicit row
       heights. The shared input supplies keyboard/value behavior; it must not
       reintroduce a standalone field minimum or a second native border. */
    ${lineEditVars['root.touch.min-height']}: 0px;
    /* The row supplies the paired L3 foreground, including selected Apple
       accent rows; an inset accent ring must not blend into the row. */
    ${lineEditVars['root.outline-color-focus']}: currentColor;
    ${lineEditVars['root.outline-width-focus']}: ${token.root['outline-width-focus']};
    ${lineEditVars['root.outline-offset-focus']}: calc(-1 * ${token.root['outline-width-focus']});
    flex: 1 1 auto;
    min-width: 0;
    font-size: inherit;
    line-height: inherit;
    /* bordered=false owns its defaults. Scope the host geometry/foreground;
       keep the focus/forced-color rules and transparent skin. */
    && {
        height: 100%;
        max-height: 100%;
        padding-inline: 0.375rem;
        border-radius: ${token.root["border-radius"]};
        color: inherit;
    }
`;

export const editLabelStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;
