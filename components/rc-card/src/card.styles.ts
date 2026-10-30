import { css } from '@crab-dev/css';
import { TokenVars as skeletonVars } from '@crab-dev/rc-skeleton';
import token from './token.js';

export const cardBaseStyle = css`
    font-family: ${token.body['font-family']};
    color: ${token.body.color};
    &[role="button"], &[role="link"] {
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }
 }
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: var(--rc-card-radius, ${token.size.medium['border-radius']});
    background-color: ${token.surface['background-color']};
    --rc-card-cover-scale: 1;
    transition: ${token.root.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
    @media (forced-colors: active) {
        border-color: CanvasText;
    }
`;

export const variantElevatedStyle = css`
    background-color: ${token.elevated['background-color']};
    box-shadow: ${token.root['box-shadow']};
    --rc-card-shadow-hover: ${token.root['box-shadow-hover']};
    --rc-card-shadow-active: ${token.root['box-shadow-active']};
`;

export const variantDefaultStyle = css`
    background-color: ${token.elevated['background-color']};
    border-color: ${token.default['border-color']};
    box-shadow: ${token.default['box-shadow']};
    --rc-card-shadow-hover: ${token.default['box-shadow-hover']};
    --rc-card-shadow-active: ${token.default['box-shadow']};
`;

export const variantOutlinedStyle = css`
    border-color: ${token.root['border-color']};
    --rc-card-shadow-hover: ${token.outlined['box-shadow-hover']};
    --rc-card-shadow-active: ${token.outlined['box-shadow-active']};
`;

export const variantFilledStyle = css`
    background-color: ${token.filled['background-color']};
    --rc-card-shadow-hover: ${token.filled['box-shadow-hover']};
    --rc-card-shadow-active: ${token.filled['box-shadow-active']};
`;

export const sizeLargeStyle = css`
    --rc-card-pad: ${token.size.large.padding};
    --rc-card-gap: ${token.size.large.gap};
    --rc-card-radius: ${token.size.large['border-radius']};
    --rc-card-title-size: ${token.size.large.title['font-size']};
`;

export const sizeMiddleStyle = css`
    --rc-card-pad: ${token.size.medium.padding};
    --rc-card-gap: ${token.size.medium.gap};
    --rc-card-radius: ${token.size.medium['border-radius']};
    --rc-card-title-size: ${token.size.medium.title['font-size']};
`;

export const sizeSmallStyle = css`
    --rc-card-pad: ${token.size.small.padding};
    --rc-card-gap: ${token.size.small.gap};
    --rc-card-radius: ${token.size.small['border-radius']};
    --rc-card-title-size: ${token.size.small.title['font-size']};
`;

export const liftStyle = css`
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: ${token['state-layer'].color};
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:hover::after { opacity: ${token['state-layer']['opacity-hover']}; }
    &:focus-visible::after { opacity: ${token['state-layer']['opacity-focus']}; }
    &:active::after { opacity: ${token['state-layer']['opacity-pressed']}; }

    &:hover {
        transform: ${token.root['transform-hover']};
        box-shadow: var(--rc-card-shadow-hover);
    }

    @media (prefers-reduced-motion: reduce) {
        &::after { transition: none; }
        &:hover {
            transform: none;
        }
    }
    @media (forced-colors: active) {
        &::after { display: none; }
    }
`;

export const outlinedInteractiveStyle = css`
    &:focus-visible {
        border-color: ${token.outlined['border-color-focus']};
    }
`;

export const clickableStyle = css`
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    /* 键盘焦点意符（forced-colors 下 outline 保留） */
    &:focus-visible {
        outline: 2px solid ${token.ring['color-focus']};
        outline-offset: 2px;
    }

    /* 按压回落，短促过渡更跟手 */
    &:active {
        transform: ${token.root['transform-active']};
        box-shadow: var(--rc-card-shadow-active);
    }

    @media (prefers-reduced-motion: reduce) {
        &:active {
            transform: none;
        }
    }
`;

export const disabledStyle = css`
    cursor: not-allowed;
    opacity: ${token.root['opacity-disabled']};

    & > * {
        pointer-events: none;
    }
`;

export const loadingStyle = css`
    ${skeletonVars['root.background-color']}: ${token.loading['background-color']};
`;

export const loadingBodyStyle = css`
    display: flex;
    flex-direction: column;
    gap: var(--rc-card-gap, ${token.size.medium.gap});
    padding: var(--rc-card-pad, ${token.size.medium.padding});
`;
