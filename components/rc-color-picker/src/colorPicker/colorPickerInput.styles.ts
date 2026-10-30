import { css } from "@crab-dev/css";
import token from "../token.js";

export const triggerStyle = css`
    display: inline-flex;
    box-sizing: border-box;
    min-width: ${token.trigger.touch['min-width']};
    min-height: ${token.trigger.touch['min-height']};
    cursor: pointer;
    border: 1px solid ${token.trigger['border-color']};
    padding: ${token.trigger.padding};
    border-radius: ${token.trigger['border-radius']};
    gap: ${token.trigger.gap};
    justify-content: center;
    align-items: center;
    &:not([aria-disabled="true"]):hover {
        border-color: ${token.trigger['border-color-hover']};
        background-color: ${token.trigger['background-color-hover']};
    }
    &:not([aria-disabled="true"]):active {
        border-color: ${token.trigger['border-color-hover']};
        background-color: ${token.trigger['background-color-active']};
    }
    &:focus-visible {
        outline: ${token.trigger.ring['width-focus']} solid ${token.trigger.ring['color-focus']};
        outline-offset: ${token.trigger.ring['outline-offset-focus']};
    }
    @media (forced-colors: active) {
        border-color: ButtonText;
        &:focus-visible { outline-color: Highlight; }
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const disabledStyle = css`
    cursor: not-allowed;
    border-color: ${token.trigger['border-color-disabled']};
    background: ${token.trigger['background-color-disabled']};
    opacity: ${token.trigger['opacity-disabled']};
    @media (forced-colors: active) {
        /* Disabled UI uses a system boundary without fading the color data. */
        opacity: 1;
        border-color: GrayText;
    }
`;

export const swatchStyle = css`
    border-radius: inherit;
    height: var(--cp-swatch-size);
    min-width: var(--cp-swatch-size);
    @media (forced-colors: active) {
        /* Preserve only the current color data, including its actual alpha. */
        forced-color-adjust: none;
    }
`;
