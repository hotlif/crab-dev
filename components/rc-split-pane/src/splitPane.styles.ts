import { css } from '@crab-dev/css';
import token from './token.js';

export const rootStyle = css`
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
`;

export const rootVerticalStyle = css`
    flex-direction: column;
`;

export const paneStyle = css`
    min-width: 0;
    min-height: 0;
`;

export const primaryPaneStyle = css`
    flex-shrink: 0;
`;

export const flexPaneStyle = css`
    flex: 1;
`;

export const separatorStyle = css`
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    touch-action: none; /* 触屏拖动调宽，不触发页面滚动 */
    user-select: none;

    &::before {
        content: '';
        position: absolute;
        background: ${token.separator.line["background-color"]};
        transition: ${token.separator.transition};
    }

    &::after {
        content: '';
        position: absolute;
        inset: 50% auto auto 50%;
        width: ${token.separator.grip.width};
        height: ${token.separator.grip.height};
        border-radius: ${token.separator.grip['border-radius']};
        background: ${token.separator.line['background-color']};
        transform: translate(-50%, -50%);
        transition: ${token.separator.transition};
        pointer-events: none;
    }

    &:hover::before,
    &[data-dragging]::before,
    &:hover::after,
    &[data-dragging]::after {
        background: ${token.separator.line['background-color-active']};
    }

    &:focus-visible {
        outline: ${token.separator['outline-width-focus']} solid ${token.separator['outline-color-focus']};
        box-shadow: ${token.separator['box-shadow-focus']};
    }
    @media (forced-colors: active) {
        &::before, &::after { background: CanvasText; }
        &:focus-visible { outline: ${token.separator['outline-width-focus']} solid Highlight; }
    }

    @media (prefers-reduced-motion: reduce) {
        &::before, &::after {
            transition: none;
        }
    }
`;

export const separatorHorizontalStyle = css`
    width: ${token.separator.vertical.width};
    @media (pointer: coarse) { width: ${token.separator.touch.width}; }
    cursor: col-resize;

    &::before {
        top: 0;
        bottom: 0;
        left: 50%;
        width: ${token.separator.line.width};
        transform: translateX(-50%);
    }
`;

export const separatorVerticalStyle = css`
    height: ${token.separator.horizontal.height};
    @media (pointer: coarse) { height: ${token.separator.touch.width}; }
    cursor: row-resize;

    &::after {
        transform: translate(-50%, -50%) rotate(90deg);
    }

    &::before {
        left: 0;
        right: 0;
        top: 50%;
        height: ${token.separator.line.width};
        transform: translateY(-50%);
    }
`;

export const separatorDisabledStyle = css`
    cursor: not-allowed;
    opacity: ${token.separator['opacity-disabled']};
    pointer-events: none;
`;
