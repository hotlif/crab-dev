import { css } from '@crab-dev/css';
import token from './token.js';

export const cardStyle = css`
    position: relative;
    min-width: 0;
    max-width: 100%;
    border: 1px solid ${token.card['border-color']};
    border-radius: ${token.card['border-radius']};
    background-color: ${token.card['background-color']};
    box-shadow: ${token.card['box-shadow']};
    overflow: hidden;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }

    /* The container is passive; its toolbar owns interactive state feedback. */
    @media (forced-colors: active) {
        border-color: CanvasText;
    }
`;

export const stageStyle = css`
    position: relative;
    padding: ${token.stage.padding};
    min-height: ${token.stage['min-height']};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-x: auto;
    background-color: ${token.stage['background-color']};
`;

export const stageContentStyle = css`
    width: 100%;
    min-width: 0;
`;

export const stageCompactStyle = css`
    padding: 16px 18px;
    min-height: 88px;
`;

export const stageSpaciousStyle = css`
    padding: 30px 24px;
    min-height: 156px;
`;

export const metaInfoStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.meta.info.gap};
    padding: 16px 20px;
    background-color: ${token.meta.info['background-color']};
    min-width: 0;
    border-bottom: 1px ${token.meta.info.divider['border-style']} ${token.meta['border-color']};
`;

export const metaTitleRowStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;

    &::after {
        content: '';
        flex: 1 1 auto;
        height: 0;
        border-top: 1px ${token.meta.info.divider['border-style']} ${token.meta['border-color']};
    }
`;

export const metaTitleStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${token.meta.title.color};
    font-size: ${token.meta.title['font-size']};
    font-weight: ${token.meta.title['font-weight']};
    letter-spacing: ${token.meta.title['letter-spacing']};
    line-height: ${token.meta.title['line-height']};
`;

export const metaDescStyle = css`
    color: ${token.meta.desc.color};
    font-size: ${token.meta.desc['font-size']};
    line-height: ${token.meta.desc['line-height']};

    > p {
        margin: 0;
    }
    > p + p {
        margin-top: 6px;
    }
    code {
        padding: ${token.meta.desc.code.padding};
        border-radius: ${token.meta.desc.code['border-radius']};
        background-color: ${token.meta.desc.code['background-color']};
        color: ${token.meta.desc.code.color};
        font-family: ${token.source['font-family']};
        font-size: 0.92em;
    }
    a {
        color: ${token.meta.title.color};
        text-decoration: underline;
        text-decoration-color: ${token.meta['border-color']};
        text-underline-offset: 3px;
        transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    }
    a:hover {
        text-decoration-color: currentColor;
    }
`;

export const metaActionsStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.meta.actions.gap};
    padding: ${token.meta.actions.padding};
    background-color: ${token.meta.actions['background-color']};
    border-top: 1px ${token.meta.actions['border-style']} ${token.meta['border-color']};

    & > :is(button, a) {
        min-width: ${token.meta.actions['min-width']};
        min-height: ${token.meta.actions['min-height']};
    }

    @media (max-width: 520px) {
        justify-content: stretch;
        flex-wrap: wrap;
    }
`;

export const sourceFrameStyle = css`
    position: relative;
    display: grid;
    grid-template-rows: 0fr;
    background-color: ${token.source['background-color']};
    overflow: hidden;
    transition: ${token.source.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const sourceFrameExpandedStyle = css`
    grid-template-rows: 1fr;
`;

export const sourceFrameDarkStyle = css`
    && { background-color: ${token.source.dark['background-color']}; }
    && .linenumber { color: ${token.source.dark.gutter.color} !important; }
`;

export const sourceClipStyle = css`
    min-height: 0;
    overflow: hidden;
`;

export const sourceScrollStyle = css`
    box-sizing: border-box;
    padding: 1rem;
    border-top: 1px solid ${token.source['border-color']};
    min-width: 0;
    max-width: 100%;
    max-height: ${token.source.expanded['max-height']};
    overflow: auto;
    scrollbar-gutter: stable;

    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${token.source.scrollbar.color};
        border-radius: 6px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: ${token.source.scrollbar['color-hover']};
    }

    pre {
        margin: 0 !important;
        background: transparent !important;
        font-variant-ligatures: contextual !important;
        font-feature-settings: 'liga' 1, 'calt' 1 !important;
    }

    .linenumber {
        display: inline-block !important;
        min-width: ${token.source.gutter['min-width']} !important;
        padding-right: ${token.source.gutter['padding-right']} !important;
        margin-right: ${token.source.gutter['margin-right']} !important;
        text-align: right !important;
        color: ${token.source.gutter.color} !important;
        user-select: none;
        font-variant-numeric: tabular-nums;
    }
`;

export const sourceLoadingStyle = css`
    display: grid;
    min-height: 7rem;
    place-items: center;
    color: ${token.source.gutter.color};
    font-size: ${token.meta.desc['font-size']};
`;

export const sourceLoadingDarkStyle = css`
    && { color: ${token.source.dark.gutter.color}; }
`;
