import { css } from '@crab-dev/css';
import token from './token.js';

export const trackStyle = css`
    position: relative;
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    max-inline-size: 100%;
    align-items: stretch;
    box-sizing: border-box;
    background-color: ${token.track['background-color']};
    border-radius: ${token.track['border-radius']};
    font-weight: ${token.root['font-weight']};
    font-family: ${token.root['font-family']};
    line-height: ${token.root['line-height']};
    user-select: none;
    outline: 1px solid ${token.track['border-color']};

    &[data-disabled] {
        cursor: not-allowed;
        outline-color: ${token.track['border-color-disabled']};
    }
    @media (forced-colors: active) {
        outline-color: ButtonText;
        &[data-disabled] { outline-color: GrayText; }
    }
`;

export const trackBlockStyle = css`
    display: grid;
    width: 100%;
`;

export const trackPadSmallStyle = css`
    padding: ${token.size.small.track.padding};
`;

export const trackPadMiddleStyle = css`
    padding: ${token.size.medium.track.padding};
`;

export const trackPadLargeStyle = css`
    padding: ${token.size.large.track.padding};
`;

export const hiddenInputStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

export const segmentStyle = css`
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 0;
    min-inline-size: 0;
    &:not(:last-child) { border-inline-end: 1px solid ${token.item['border-color']}; }
    &:first-child { border-start-start-radius: max(${token.size.medium['border-radius']}, calc(${token.track['border-radius']} - ${token.size.medium.track.padding})); border-end-start-radius: max(${token.size.medium['border-radius']}, calc(${token.track['border-radius']} - ${token.size.medium.track.padding})); }
    &:last-child { border-start-end-radius: max(${token.size.medium['border-radius']}, calc(${token.track['border-radius']} - ${token.size.medium.track.padding})); border-end-end-radius: max(${token.size.medium['border-radius']}, calc(${token.track['border-radius']} - ${token.size.medium.track.padding})); }
    color: ${token.item.color};
    cursor: pointer;
    white-space: nowrap;
    transition: color ${token.item.transition}, background-color ${token.item.transition};

    /* Keep a 48px target without clipping it to the 40px visual container. */
    &::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        top: 50%;
        min-height: ${token.interaction.touch['min-height']};
        height: 100%;
        transform: translateY(-50%);
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${token.item.transition};
    }
    &:hover:not(:has(input:disabled))::before { opacity: ${token.item['state-layer']['opacity-hover']}; }
    &:has(input:focus-visible)::before { opacity: ${token.item['state-layer']['opacity-focus']}; }
    &:active:not(:has(input:disabled))::before { opacity: ${token.item['state-layer']['opacity-active']}; }

    &:hover:not(:has(input:disabled)):not([data-selected]) {
        color: ${token.item['color-hover']};
    }

    /* 键盘焦点意符：焦点落在隐藏 input 上时高亮所属分段（forced-colors 下 outline 保留） */
    &:has(input:focus-visible) {
        outline: ${token.item['outline-width-focus']} solid ${token.item['outline-color-focus']};
        outline-offset: ${token.item['outline-offset-focus']};
        z-index: 2;
    }

    @media (prefers-reduced-motion: reduce) {
        &, &::before { transition: none; }
    }
    @media (forced-colors: active) {
        && {
        forced-color-adjust: none;
        color: ButtonText;
        background: ButtonFace;
        &:not(:last-child) { border-color: ButtonText; }
        &[data-selected] { color: HighlightText; background: Highlight; }
        &:has(input:disabled) { color: GrayText; border-color: GrayText; }
        &:has(input:focus-visible) { outline-color: Highlight; }
        &[data-selected]:has(input:focus-visible) { outline-color: HighlightText; }
        &::before { display: none; }
        }
    }
`;

export const segmentSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-inline']};
    gap: ${token.size.small.gap};
    font-size: ${token.size.small['font-size']};
    border-radius: ${token.size.small['border-radius']};
`;

export const segmentMiddleStyle = css`
    height: ${token.size.medium.height};
    padding: 0 ${token.size.medium['padding-inline']};
    gap: ${token.size.medium.gap};
    font-size: ${token.size.medium['font-size']};
    border-radius: ${token.size.medium['border-radius']};
`;

export const segmentLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-inline']};
    gap: ${token.size.large.gap};
    font-size: ${token.size.large['font-size']};
    border-radius: ${token.size.large['border-radius']};
`;

export const segmentBlockStyle = css`
    min-width: 0;
`;

export const labelStyle = css`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const unselectedSmallLabelStyle = css`
    position: relative;
    inset-inline-start: calc((${token.item.icon.width} + ${token.size.small.gap}) / -2);
`;

export const unselectedMediumLabelStyle = css`
    position: relative;
    inset-inline-start: calc((${token.item.icon.width} + ${token.size.medium.gap}) / -2);
`;

export const unselectedLargeLabelStyle = css`
    position: relative;
    inset-inline-start: calc((${token.item.icon.width} + ${token.size.large.gap}) / -2);
`;

export const selectionIconStyle = css`
    display: inline-flex;
    flex: none;
    width: ${token.item.icon.width};
    height: ${token.item.icon.width};
    > svg { width: 100%; height: 100%; }
`;

export const checkIconStyle = css`display: ${token.item.check.display};`;

export const selectedOptionIconStyle = css`display: ${token.item.icon['display-selected']};`;

export const segmentSelectedStyle = css`
    color: ${token.item['color-selected']};
    background-color: ${token.thumb['background-color']};
    box-shadow: ${token.thumb['box-shadow']};

    &:hover {
        color: ${token.item['color-selected']};
    }
`;

export const segmentDisabledStyle = css`
    color: ${token.item['color-disabled']};
    cursor: not-allowed;
    &:not(:last-child) { border-color: ${token.track['border-color-disabled']}; }
    &[data-selected] { background-color: ${token.item['background-color-disabled']}; box-shadow: none; }

    &:hover {
        color: ${token.item['color-disabled']};
    }
`;
