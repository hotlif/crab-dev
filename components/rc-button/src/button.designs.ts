import { css } from '@crab-dev/css';
import token from './token.js';

// Tahoe 26 AppKit controls: mini–regular use rounded rectangles; large and
// extra-large use capsules. These classes do not compose Material state layers.
// https://developer.apple.com/videos/play/wwdc2025/310/ (Controls, 11:10)
export const macosButtonStyle = css`
    &:where([data-button-design="macos"]) {
        color: ${token.macos.control.color};
        background-color: ${token.macos.control['background-color']};
        background-image: ${token.macos.control['background-image']};
        border: ${token.root['border-width']} solid ${token.macos.control['border-color']};
        border-radius: ${token.macos.control['border-radius']};
        box-shadow: ${token.macos.control['box-shadow']};
        transition: ${token.macos.control.transition};
        font-weight: ${token.macos.control['font-weight']};
        &[data-button-size="l"], &[data-button-size="xl"], &[data-button-shape="round"] {
            border-radius: calc(${token.root.height} / 2);
        }
        &[data-button-shape="square"] { border-radius: ${token.macos.control['border-radius']}; }
        &[data-button-shape="circle"] { border-radius: 50%; padding: 0; aspect-ratio: 1; }
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.control['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            background-color: ${token.macos.control['background-color-active']};
            box-shadow: ${token.macos.control['box-shadow-active']};
        }
        &:focus-visible {
            outline-color: ${token.macos.control['outline-color']};
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled="true"]:not([data-is-loading]) {
            color: ${token.root['color-disabled']};
            background-color: ${token.root['background-color-disabled']};
            background-image: none;
            box-shadow: none;
            border-color: transparent;
            > span { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) { transition: none; }
        @media (forced-colors: active) {
            background-image: none !important;
            &:focus-visible { outline-color: Highlight; }
        }
    }
`;

// Primary prominence and toggle selection tint the backing; no tonal overlay,
// inverse-color outlined selection, or press-time shape morphing is applied.
export const macosProminentStyle = css`
    &:where([data-button-design="macos"]):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.macos.prominent.color};
        background-image: ${token.macos.prominent['background-image']};
        background-color: ${token.macos.prominent['background-color']};
        border-color: ${token.macos.prominent['border-color']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.prominent['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.macos.prominent['background-color-active']}; }
    }
`;

export const macosSecondaryStyle = css`
    &:where([data-button-design="macos"]):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.macos.secondary.color};
        background-color: ${token.macos.secondary['background-color']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.secondary['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.macos.secondary['background-color-active']}; }
    }
`;

// Composite controls can supply their own selected pair through the public
// tonal slots; the macOS default remains its prominent tint.
export const macosSelectedTonalStyle = css`
    &:where([data-button-design="macos"]):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.macos.tonal['color-selected']};
        background-color: ${token.macos.tonal['background-color-selected']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.tonal['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.macos.tonal['background-color-active']}; }
    }
`;

// Glass bezel is reserved for floating actions. Ordinary push buttons retain a
// solid backing, which prevents nested glass and keeps dense content legible.
export const macosGlassStyle = css`
    &:where([data-button-design="macos"]) {
        backdrop-filter: ${token.material['backdrop-filter']};
        -webkit-backdrop-filter: ${token.material['backdrop-filter']};
        background-color: ${token.macos.glass['background-color']};
        box-shadow: ${token.macos.glass['box-shadow']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.glass['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.macos.glass['background-color-active']}; }
    }
`;

export const macosPlainStyle = css`
    &:where([data-button-design="macos"]) {
        color: ${token.macos.plain.color};
        border-color: transparent;
        background: transparent;
        box-shadow: none;
        &[aria-disabled="true"]:not([data-is-loading]) { background-color: transparent; }
        &:focus-visible:not([aria-disabled="true"]) { background-color: ${token.text['background-color-focus']}; }
        &:hover:not([aria-disabled="true"]) { background-color: ${token.text['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) {
            background-color: ${token.text['background-color-active']};
            box-shadow: none;
        }
    }
`;

export const macosDangerStyle = css`
    &:where([data-button-design="macos"])[data-tone="danger"]:not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.macos.danger.color};
        background-color: ${token.macos.danger['background-color']};
        border-color: ${token.macos.control['border-color']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.macos.danger['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.macos.danger['background-color-active']}; }
    }
`;

export const macosDashedStyle = css`
    &:where([data-button-design="macos"]) { border-style: dashed; }
`;

// A connected toolbar is one glass surface, not a row of overlapping glass
// buttons. Descendant selectors are limited to this component's direct slots.
export const macosGroupStyle = css`
    gap: ${token.group.gap};
    padding: ${token.macos.group.padding};
    border-radius: ${token.macos.group['border-radius']};
    background-color: ${token.macos.glass['background-color']};
    background-image: ${token.material['background-image']};
    backdrop-filter: ${token.material['backdrop-filter']};
    -webkit-backdrop-filter: ${token.material['backdrop-filter']};
    box-shadow: ${token.macos.glass['box-shadow']};
    > [data-button-design="macos"] {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        background-image: none;
        box-shadow: none;
        border-color: transparent;
    }
    > [data-button-design="macos"]:not([data-button-selected="true"]):not([data-button-prominent="true"]):not([data-tone="danger"]) {
        background-color: transparent;
        &:hover:not([aria-disabled="true"]) { background-color: ${token.text['background-color-hover']}; }
        &:is(:active, [data-press-feedback]):not([aria-disabled="true"]) { background-color: ${token.text['background-color-active']}; }
    }
    @media (forced-colors: active) { box-shadow: none; outline: 1px solid CanvasText; }
`;
