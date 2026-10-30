import { css } from '@crab-dev/css';
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import token, { vars as buttonVars } from './token.js';

const opacityLoading = token.root['opacity-loading'];

// Emit layout resets before appearance/shape rules in both source and published
// builds. Shape defaults belong only to the mutually exclusive shape classes.
export const baseStyle = css`
    display: inline-flex;
    box-sizing: border-box;
    max-width: 100%;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    border: unset;
    user-select: none;
    background-color: unset;
    font-family: ${token.root['font-family']};
    font-weight: ${token.root['font-weight']};
    line-height: ${token.root['line-height']};
    vertical-align: middle;
    text-decoration: none;
    white-space: nowrap;
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-disabled='true']:not([data-is-loading]) {
        cursor: not-allowed;
        color: ${token.root['color-disabled']};
        /* M3 applies 38% to content, independently of the 10% container. */
        > span { opacity: ${token.root['opacity-disabled']}; }
    }
    @media (prefers-reduced-motion: reduce) {
        /* Keep every appearance still, including selectors with state specificity. */
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { transform: none !important; }
    }
    @media (forced-colors: active) {
        /* Own the system-color pair, including descendants, so text backplates
           cannot turn HighlightText into white-on-white inside a filled button. */
        forced-color-adjust: none;
        color: ButtonText !important;
        background-color: ButtonFace !important;
        border-color: ButtonText !important;
        box-shadow: none !important;
        outline: ${token.root['border-width']} solid ButtonText;
        outline-offset: -1px;
        &:focus-visible {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-pressed='true'] {
            color: HighlightText !important;
            background-color: Highlight !important;
        }
        &[aria-disabled='true']:not([data-is-loading]) {
            color: GrayText !important;
            outline-color: GrayText;
            > span { opacity: 1; }
        }
    }
    &[data-is-loading] {
        opacity: ${opacityLoading};
        cursor: not-allowed;
        pointer-events: none;
    }
`;

export const iconWrapStyle = css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
    }
`;

export const labelStyle = css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const loadingIndicatorStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    --rc-spin-size: 1em;
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

export const primaryStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        box-shadow: ${token.primary['box-shadow']};
        background-color: ${token.primary["background-color"]};
        color: ${token.primary.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.primary['background-color-hover']}; }
        &:focus-visible { background-color: ${token.primary['background-color-focus']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            background-color: ${token.primary['background-color-active']};
            transform: none;
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.primary['background-color-disabled']};
    }
`;

export const dangerStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        box-shadow: ${token.danger['box-shadow']};
        background-color: ${token.danger["background-color"]};
        color: ${token.danger.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger['background-color-hover']}; }
        &:focus-visible { background-color: ${token.danger['background-color-focus']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            background-color: ${token.danger['background-color-active']};
            transform: none;
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.danger['background-color-disabled']};
    }
`;

export const linkStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        background-color: ${token.link["background-color"]};
        color: ${token.link.color};
        > span:not([aria-hidden]) {
            position: relative;
            &::after {
                content: '';
                position: absolute;
                bottom: ${token.link['text-underline-offset']};
                left: 0;
                width: 100%;
                height: ${token.link['text-decoration-width']};
                background-color: ${token.link['text-decoration-color']};
                transform: scaleX(0);
                transform-origin: right;
                transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; } transition-property: transform;
            }
            &:hover::after {
                transform: scaleX(1);
                transform-origin: left;
            }
        }
        &:hover:not([aria-disabled="true"]) { color: ${token.link['color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            transform: none;
            color: ${token.link['color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        background-color: ${token.link['background-color-disabled']};
        pointer-events: none;
    }
`;

export const dashedStyle = css`
    border-width: ${token.dashed['border-width']};
    border-style: ${token.dashed['border-style']};
    box-shadow: ${token.dashed['box-shadow']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.dashed.color};
        background-color: ${token.dashed["background-color"]};
        border-color: ${token.dashed['border-color']};
        &:hover:not([aria-disabled="true"]) {
            color: ${token.dashed['color-hover']};
            border-color: ${token.dashed['border-color-hover']};
        }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            transform: none;
            color: ${token.dashed['color-active']};
            border-color: ${token.dashed['border-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.dashed['background-color-disabled']};
        border-color: transparent;
    }
`;

export const textStyle = css`
    color: ${token.text.color};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) { background-color: ${token.text['background-color-hover']}; }
        &:focus-visible { background-color: ${token.text['background-color-focus']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            transform: none;
            background-color: ${token.text['background-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        background-color: transparent;
        pointer-events: none;
    }
`;

export const layeredStyle = css`
    isolation: isolate;
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not([aria-disabled='true']) {
        &:hover::before { opacity: ${token['state-layer']['opacity-hover']}; }
        &:focus-visible::before { opacity: ${token['state-layer']['opacity-focus']}; }
        &:is(:active, [data-press-feedback])::before { opacity: ${token['state-layer']['opacity-active']}; }
    }
    &[aria-disabled='true']:not([data-is-loading]) {
        color: ${token.subtle['color-disabled']};
        background: ${token.root['background-color-disabled']};
        border-color: transparent;
    }
    @media (prefers-reduced-motion: reduce) { &::before { transition: none; } }
    @media (forced-colors: active) { &::before { display: none; } }
`;

export const touchTargetStyle = css`
    position: absolute;
    inset: 0;
    @media (pointer: coarse) {
        inset: auto;
        top: 50%;
        left: 50%;
        width: max(100%, ${token.root.touch['min-width']});
        height: max(100%, ${token.root.touch['min-height']});
        transform: translate(-50%, -50%);
    }
`;

export const elevatedStyle = css`
    color: ${token.elevated.color};
    background-color: ${token.elevated['background-color']};
    box-shadow: ${token.elevated['box-shadow']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) {
            &:not([data-tone="danger"]) { background-color: ${token.elevated['background-color-hover']}; }
            box-shadow: ${token.elevated['box-shadow-hover']};
        }
        &:focus-visible {
            &:not([data-tone="danger"]) { background-color: ${token.elevated['background-color-focus']}; }
            box-shadow: ${token.elevated['box-shadow']};
        }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            &:not([data-tone="danger"]) { background-color: ${token.elevated['background-color-active']}; }
            box-shadow: ${token.elevated['box-shadow']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.elevated['color-disabled']};
        background-color: ${token.elevated['background-color-disabled']};
        box-shadow: none;
    }
`;

export const dangerTextStyle = css`
    &[data-tone="danger"]:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.danger.content.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger.content['background-color-hover']}; }
        &:focus-visible, &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.danger.content['background-color-active']}; }
    }
`;

export const dangerSubtleStyle = css`
    &[data-tone="danger"]:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.danger.content.color};
        background-color: ${token.danger.subtle['background-color']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger.subtle['background-color-hover']}; }
        &:focus-visible, &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.danger.subtle['background-color-active']}; }
    }
`;

export const dangerSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading]))[data-tone="danger"] {
            color: ${token.danger.color} !important;
            background-color: ${token.danger['background-color']} !important;
            border-color: ${token.danger['background-color']} !important;
        }
    }
`;

export const tonalStyle = css`
    border-color: transparent;
    color: ${token.tonal.color};
    background-color: ${token.tonal['background-color']};
`;

export const dangerTonalStyle = css`
    &[data-tone='danger']:not([aria-disabled='true']:not([data-is-loading])) {
        color: ${token.danger.tonal.color};
        background-color: ${token.danger.tonal['background-color']};
    }
`;

export const dangerElevatedStyle = css`
    &[data-tone='danger']:not([aria-disabled='true']:not([data-is-loading])) {
        color: ${token.danger.content.color};
        background-color: ${token.elevated['background-color']};
    }
`;

export const outlinedStyle = css`
    border: ${token.root['border-width']} solid ${token.outlined['border-color']};
    box-shadow: ${token.subtle['box-shadow']};
    color: ${token.outlined.color};
    background-color: ${token.outlined['background-color']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) { background-color: ${token.outlined['background-color-hover']}; }
        &:focus-visible { background-color: ${token.outlined['background-color-focus']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            background-color: ${token.outlined['background-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.subtle['color-disabled']};
        background-color: ${token.subtle['background-color-disabled']};
        border-color: ${token.subtle['border-color-disabled']};
        box-shadow: ${token.subtle['box-shadow-disabled']};
    }
`;

export const outlinedSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            color: ${token.outlined['color-selected']} !important;
            background-color: ${token.outlined['background-color-selected']} !important;
            border-color: ${token.outlined['background-color-selected']} !important;
        }
    }
`;

export const sizeLargeStyle = css`
    ${buttonVars['root.border-width']}: ${token.size.large['border-width']};
    ${buttonVars['root.height']}: ${token.size.large.height};
    ${buttonVars['root.border-radius']}: ${token.size.large.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.large['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.large.icon.width};
    line-height: ${token.size.large['line-height']};
    font-size: ${token.size.large["font-size"]};
    padding: ${token.size.large.padding};
    height: max(${token.size.large.height}, calc(1lh + 2 * ${token.root['border-width']}));
    gap: ${token.size.large.gap};
    border-radius: ${token.size.large['border-radius']};
`;

export const sizeMiddleStyle = css`
    ${buttonVars['root.border-width']}: ${token.size.medium['border-width']};
    ${buttonVars['root.height']}: ${token.size.medium.height};
    ${buttonVars['root.border-radius']}: ${token.size.medium.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.medium['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.medium.icon.width};
    line-height: ${token.size.medium['line-height']};
    font-size: ${token.size.medium["font-size"]};
    height: max(${token.size.medium.height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size.medium.padding};
    gap: ${token.size.medium.gap};
    border-radius: ${token.size.medium['border-radius']};
`;

export const sizeSmallStyle = css`
    ${buttonVars['root.border-width']}: ${token.size.small['border-width']};
    ${buttonVars['root.height']}: ${token.size.small.height};
    ${buttonVars['root.border-radius']}: ${token.size.small.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.small['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.small.icon.width};
    line-height: ${token.size.small['line-height']};
    font-size: ${token.size.small["font-size"]};
    height: max(${token.size.small.height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size.small.padding};
    gap: ${token.size.small.gap};
    border-radius: ${token.size.small['border-radius']};
`;

export const sizeExtraLargeStyle = css`
    ${buttonVars['root.border-width']}: ${token.size['extra-large']['border-width']};
    ${buttonVars['root.height']}: ${token.size['extra-large'].height};
    ${buttonVars['root.border-radius']}: ${token.size['extra-large'].square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size['extra-large']['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size['extra-large'].icon.width};
    font-size: ${token.size['extra-large']['font-size']};
    line-height: ${token.size['extra-large']['line-height']};
    height: max(${token.size['extra-large'].height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size['extra-large'].padding};
    gap: ${token.size['extra-large'].gap};
`;

export const sizeExtraExtraLargeStyle = css`
    ${buttonVars['root.border-width']}: ${token.size['extra-extra-large']['border-width']};
    ${buttonVars['root.height']}: ${token.size['extra-extra-large'].height};
    ${buttonVars['root.border-radius']}: ${token.size['extra-extra-large'].square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size['extra-extra-large']['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size['extra-extra-large'].icon.width};
    font-size: ${token.size['extra-extra-large']['font-size']};
    line-height: ${token.size['extra-extra-large']['line-height']};
    height: max(${token.size['extra-extra-large'].height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size['extra-extra-large'].padding};
    gap: ${token.size['extra-extra-large'].gap};
`;

export const squareStyle = css`border-radius: ${token.root['border-radius']};`;

export const roundStyle = css`border-radius: calc(${token.root.height} / 2);`;

export const defaultShapeStyle = css`
    border-radius: ${token.shape.default['border-radius']};
    &:is(:active, [data-press-feedback]):not(:disabled):not([aria-disabled="true"]) {
        border-radius: ${token.shape.default['border-radius-active']};
    }
`;

export const defaultSelectedShapeStyle = css`border-radius: ${token.shape.default['border-radius-selected']};`;

export const selectedFeedbackStyle = css`
    isolation: isolate;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not([aria-disabled='true']) {
        &:hover::after { opacity: ${token['state-layer']['opacity-hover']}; }
        &:focus-visible::after { opacity: ${token['state-layer']['opacity-focus']}; }
        &:is(:active, [data-press-feedback])::after { opacity: ${token['state-layer']['opacity-active']}; }
    }
    @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }
    @media (forced-colors: active) { &::after { display: none; } }
`;

export const pressShapeStyle = css`
    &:is(:active, [data-press-feedback]):not(:disabled):not([aria-disabled="true"]) { border-radius: ${token.root['border-radius-active']}; }
`;

export const tonalSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            color: ${token.tonal['color-selected']} !important;
            background-color: ${token.tonal['background-color-selected']} !important;
        }
    }
`;

export const primaryUnselectedStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.primary.unselected.color};
        background-color: ${token.primary.unselected['background-color']};
        border-color: transparent;
    }
`;

export const selectedDisabledStyle = css`
    &[aria-disabled='true']:not([data-is-loading]) {
        background-color: ${token.root['background-color-disabled']};
        border-color: transparent;
    }
`;

export const fitContainerStyle = css`width: 100%;`;

export const selectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            background-color: ${token.root["background-color-selected"]} !important;
            color: ${token.root["color-selected"]} !important;
            border-color: ${token.root['border-color-selected']} !important;
        }
    }
`;

export const circleStyle = css`
    border-radius: ${token.shape.circle['border-radius']};
    padding: ${token.shape.circle.padding};
    aspect-ratio: 1;
`;

export const iconOnlyStyle = css`
    padding: ${token.shape.circle.padding};
    aspect-ratio: 1;
`;
