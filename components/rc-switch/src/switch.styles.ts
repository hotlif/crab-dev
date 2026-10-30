import { css } from '@crab-dev/css';
import token from './token.js';

export const wrapperStyle = css`
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    max-width: 100%;
    gap: ${token.label.gap};
    cursor: pointer;
    font-size: ${token.label['font-size']};
    color: ${token.label.color};
    line-height: ${token.root['line-height']};
    font-family: ${token.root['font-family']};
    user-select: none;
    min-height: ${token.root['min-height']};
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }

    &[data-disabled] {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.label['color-disabled']};
        > span { opacity: ${token.root['opacity-disabled']}; }
    }
    > span { min-width: 0; overflow-wrap: anywhere; }
    @media (forced-colors: active) {
        &[data-disabled] { color: GrayText; > span { opacity: 1; } }
    }
`;

export const trackStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    background-color: ${token.track['background-color']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    border: none;
    box-shadow: inset 0 0 0 ${token.track['border-width']} ${token.track['border-color']};
    &::before { content: ""; position: absolute; inset: calc((100% - max(100%, ${token.root.touch['min-height']})) / 2) calc((100% - max(100%, ${token.root.touch['min-width']})) / 2); }
    padding: 0;
    cursor: inherit;
    outline: none;
    flex-shrink: 0;
    &::after {
        content: "";
        position: absolute;
        pointer-events: none;
        width: ${token.track.halo.width};
        height: ${token.track.halo.width};
        inset-inline-start: ${token.track.halo.left};
        border-radius: inherit;
        transition: ${token.root.transition};
    }
    &[aria-checked='true']::after { translate: ${token.track.halo['translate-checked']} 0; }
    &:dir(rtl)[aria-checked='true']::after { translate: calc(-1 * ${token.track.halo['translate-checked']}) 0; }
    &:hover:not(:disabled)::after { background: ${token.track['state-layer']['background-color-hover']}; }
    &:active:not(:disabled)::after, &:focus-visible::after { background: ${token.track['state-layer']['background-color-active']}; }
    &[aria-checked='true']:hover:not(:disabled)::after { background: ${token.track.checked['state-layer']['background-color-hover']}; }
    &[aria-checked='true']:is(:active, :focus-visible):not(:disabled)::after { background: ${token.track.checked['state-layer']['background-color-active']}; }
    &:is(:hover, :active, :focus-visible):not(:disabled) > span { background-color: ${token.handle.interactive['background-color']}; }
    &[aria-checked='true']:is(:hover, :active, :focus-visible):not(:disabled) > span { background-color: ${token.handle.checked.interactive['background-color']}; }
    &:active:not(:disabled) > span { scale: ${token.handle.pressed.scale}; }
    &:disabled, &:disabled > span { transition: none; }
    @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }

    &:hover {
        background-color: ${token.track['background-color-hover']};
    }

    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-invalid='true']:not(:disabled) {
        box-shadow: inset 0 0 0 ${token.root['outline-width-focus']} ${token.track['border-color-error']};
        &:focus-visible { outline-color: ${token.track['border-color-error']}; }
        &[aria-checked='true'] {
            background-color: ${token.track['background-color-error']};
            > span { background-color: ${token.handle['background-color-error']}; }
        }
    }
    @media (forced-colors: active) {
        /* Match the checked interactive/error selector specificity. With only
           &&, its ordinary on-primary color wins and hides the thumb on Highlight. */
        &&& {
        forced-color-adjust: none;
        background: Canvas;
        box-shadow: none;
        outline: ${token.track['border-width']} solid CanvasText;
        outline-offset: -1px;
        &::after { content: none; }
        > span { background: CanvasText; box-shadow: none; border-width: 0; }
        &[aria-checked='true'] {
            background: Highlight;
            > span { background: HighlightText; }
        }
        &:disabled {
            background: Canvas;
            outline-color: GrayText;
            > span { background: GrayText; }
        }
        &:focus-visible {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        }
    }
`;

export const trackCheckedStyle = css`
    background-color: ${token.track['background-color-checked']};
    box-shadow: none;

    &:hover {
        background-color: ${token.track.checked['background-color-hover']};
    }
`;

export const trackDisabledStyle = css`
    background-color: ${token.track['background-color-disabled']};
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: inset 0 0 0 ${token.track['border-width']} ${token.track['border-color-disabled']};
`;

export const trackDisabledCheckedStyle = css`
    background-color: ${token.track.checked['background-color-disabled']};
    box-shadow: none;
`;

export const handleStyle = css`
    position: absolute;
    box-sizing: border-box;
    border: ${token.handle.unchecked['border-width']} solid ${token.handle.unchecked['border-color']};
    border-radius: 50%;
    background-color: ${token.handle['background-color']};
    box-shadow: ${token.handle['box-shadow']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    scale: ${token.handle.unchecked.scale};
`;

export const handleCheckedStyle = css`
    border-width: 0;
    background-color: ${token.handle.checked['background-color']};
    scale: 1;
`;

export const handleDisabledStyle = css`
    background-color: ${token.handle['background-color-disabled']};
`;

export const handleDisabledCheckedStyle = css`
    background-color: ${token.handle.checked['background-color-disabled']};
`;
