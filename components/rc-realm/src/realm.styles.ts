import { css } from '@crab-dev/css';
import token from './token.js';

export const hostStyle = css`position: relative; display: block;`;

// Loading is owned by Spin. This finite transition only introduces ready content.
export const appearStyle = css`
    animation: rc-realm-appear ${token.root.animation} both;
    @keyframes rc-realm-appear { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export const placeholderStyle = css`min-block-size: ${token.placeholder['min-block-size']};`;
