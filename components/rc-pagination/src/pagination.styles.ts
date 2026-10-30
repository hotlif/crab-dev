import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { css } from "@crab-dev/css";
import token from "./token.js";

export const rootStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    gap: ${token.group.gap};
    font-size: ${token.root['font-size']};
    font-weight: ${token.root['font-weight']};
    color: ${token.item.color};
    line-height: 1;
    @media (pointer: coarse) {
        & > ul button, & > span > input {
            min-width: ${token.interaction.touch['min-width']};
            min-height: ${token.interaction.touch['min-height']};
        }
    }
`;

export const listStyle = css`
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    gap: ${token.root.gap};
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

export const itemBaseStyle = css`
    /* Pagination owns the page colors; Button owns input feedback. Map its
       interactive tokens so its more specific hover/focus/press selectors
       cannot replace a selected page's container with a translucent text tint. */
    ${buttonVars['text.color']}: ${token.item.color};
    ${buttonVars['text.background-color-hover']}: ${token.item['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.item['background-color-hover']};
    ${buttonVars['text.background-color-active']}: ${token.item['background-color-hover']};
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } &[aria-selected='true'], &[aria-current='page'] { outline: 2px solid Highlight; } }
    @media (prefers-reduced-motion: reduce) { transition: none; }

    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: ${token.size.medium.height};
    min-width: ${token.size.medium["min-width"]};
    padding: ${token.size.medium.padding};
    font-size: ${token.size.medium['font-size']};
    font-weight: inherit;
    font-variant-numeric: tabular-nums;
    color: ${token.item.color};
    background-color: ${token.item['background-color']};
    border: ${token.input['border-width']} solid transparent;
    border-radius: ${token.item['border-radius']};
    cursor: pointer;
    user-select: none;
    transition: ${token.root.transition};
    appearance: none;
    font-family: inherit;

    &:hover:not(:disabled):not([aria-disabled="true"]):not([aria-current="page"]) {
        color: ${token.item["color-hover"]};
        background-color: ${token.item["background-color-hover"]};
    }

    &:active:not(:disabled):not([aria-disabled="true"]):not([aria-current="page"]) {
        background-color: ${token.item["background-color-hover"]};
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }

    &[aria-current="page"] {
        ${buttonVars['text.color']}: ${token.item['color-active']};
        ${buttonVars['text.background-color-hover']}: ${token.item['background-color-active']};
        ${buttonVars['text.background-color-focus']}: ${token.item['background-color-active']};
        ${buttonVars['text.background-color-active']}: ${token.item['background-color-active']};
        color: ${token.item["color-active"]};
        background-color: ${token.item["background-color-active"]};
        border-color: ${token.item['border-color-active']};
    }

    &[aria-current="page"]:hover:not(:disabled) {
        color: ${token.item["color-active"]};
        background-color: ${token.item["background-color-active"]};
    }

    &:disabled,
    &[aria-disabled="true"] {
        ${buttonVars['root.color-disabled']}: ${token.item['color-disabled']};
        color: ${token.item["color-disabled"]};
        background-color: transparent;
        cursor: not-allowed;
    }

    /* Disabled navigation still has a current location. Match Button's full
       disabled condition so its text appearance cannot erase this marker. */
    &[aria-current="page"]:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.item["color-disabled"]};
        background-color: ${token.item.current["background-color-disabled"]};
        border-color: ${token.item.current["border-color-disabled"]};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    /* Windows 高对比度模式：系统会强制覆盖背景色，需显式描边兜底激活态 */
    @media (forced-colors: active) {
        &[aria-current="page"] {
            outline: 2px solid CanvasText;
            outline-offset: -2px;
        }
    }
`;

export const largeSizeStyle = css`
    height: ${token.size.large.height};
    min-width: ${token.size.large["min-width"]};
    padding: ${token.size.large.padding};
    font-size: ${token.size.large["font-size"]};
`;

export const itemSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small["min-width"]};
    padding: ${token.size.small.padding};
    font-size: ${token.size.small['font-size']};
`;

export const ellipsisStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: ${token.size.medium.height};
    min-width: ${token.size.medium["min-width"]};
    padding: 0;
    color: ${token.ellipsis.color};
    background-color: transparent;
    border: 0;
    border-radius: ${token.item['border-radius']};
    cursor: pointer;
    user-select: none;
    transition: ${token.root.transition};
    appearance: none;
    font-family: inherit;
    font-size: inherit;

    /* 默认显示省略号，hover 时切换为双向箭头（语义化跳 5 页） */
    & .rc-pagination-ellipsis-dots,
    & .rc-pagination-ellipsis-jump {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: opacity 120ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    & .rc-pagination-ellipsis-dots {
        letter-spacing: 0.05em;
        opacity: 1;
    }
    & .rc-pagination-ellipsis-jump {
        position: absolute;
        inset: 0;
        opacity: 0;
    }

    &:hover:not(:disabled) {
        color: ${token.item["color-hover"]};
        background-color: ${token.item["background-color-hover"]};
    }
    &:hover:not(:disabled) .rc-pagination-ellipsis-dots {
        opacity: 0;
    }
    &:hover:not(:disabled) .rc-pagination-ellipsis-jump {
        opacity: 1;
    }
    &:focus-visible .rc-pagination-ellipsis-dots {
        opacity: 0;
    }
    &:focus-visible .rc-pagination-ellipsis-jump {
        opacity: 1;
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }

    &:disabled {
        color: ${token.item["color-disabled"]};
        cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
        & .rc-pagination-ellipsis-dots,
        & .rc-pagination-ellipsis-jump {
            transition: none;
        }
    }
`;

export const ellipsisSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small["min-width"]};
    font-size: ${token.size.small['font-size']};
`;

export const iconStyle = css`
    width: 1em;
    height: 1em;
    flex-shrink: 0;
`;

export const totalStyle = css`
    color: ${token.total.color};
    font-weight: ${token.root['font-weight']};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
`;

export const quickJumperStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token["quick-jumper"].gap};
    color: ${token.total.color};
    white-space: nowrap;
`;

export const quickJumperInputStyle = css`
    box-sizing: border-box;
    width: ${token["quick-jumper"].input.width};
    height: ${token.size.medium.height};
    padding: ${token["quick-jumper"].input.padding};
    font-family: inherit;
    font-size: ${token.size.medium['font-size']};
    font-variant-numeric: tabular-nums;
    color: ${token.input.color};
    background-color: ${token.input['background-color']};
    border: ${token.input['border-width']} solid ${token.input['border-color']};
    border-radius: ${token.input['border-radius']};
    text-align: center;
    transition: ${token.root.transition};

    &:hover:not(:disabled) {
        border-color: ${token.input["border-color-hover"]};
    }

    &:focus {
        outline: none;
        border-color: ${token.input["border-color-focus"]};
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }

    &:disabled {
        color: ${token.input["color-disabled"]};
        cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    /* 去除数字输入框的原生步进按钮 */
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

export const quickJumperInputSmallStyle = css`
    height: ${token.size.small.height};
    font-size: ${token.size.small['font-size']};
`;

export const sizeChangerStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.total.color};
    white-space: nowrap;
`;
