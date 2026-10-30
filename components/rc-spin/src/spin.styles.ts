import { css } from '@crab-dev/css';
import token from './token.js';

export const spinnerStyle = css`
    display: inline-flex;
    min-inline-size: 0;
    max-inline-size: 100%;
    font-family: ${token.root['font-family']};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${token.tip.gap};
    animation: rc-spin-appear ${token.root.animation} both;

    @keyframes rc-spin-appear {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* 淡入只是修饰, reduce 下直接去掉；旋转不同（见 indicator.tsx）, 那是唯一的进行中反馈 */
    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

export const tipStyle = css`
    color: ${token.tip.color};
    font-size: var(--rc-spin-font-size, ${token.size.medium['font-size']});
    line-height: 1.4;
    text-align: center;
    max-inline-size: 100%;
    overflow-wrap: anywhere;
`;

export const containerStyle = css`
    position: relative;
`;

export const contentStyle = css`
    transition: opacity ${token.content.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const contentMaskedStyle = css`
    opacity: ${token.content.opacity};
    filter: ${token.content.filter};
    user-select: none;
`;

export const overlayStyle = css`
    position: absolute;
    inset: 0;
    z-index: ${token.overlay['z-index']};
    display: flex;
    align-items: center;
    justify-content: center;
    /* 遮罩层自身不吃事件；内容的不可交互由 inert 保证, 而非靠一层拦截板 */
    pointer-events: none;
`;
