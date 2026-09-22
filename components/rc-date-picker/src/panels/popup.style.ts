import { css } from '@crab-dev/css';
import token from '../token.js';

// The floating frame owns clipping and elevation, so its shape must match the panel.
export const popupFrameStyle = css`
    border-radius: ${token.panel['border-radius']};
    background-color: ${token.panel['background-color']};
`;

export const popupContentStyle = css`
    padding: ${token.panel.padding};
    background-color: ${token.panel['background-color']};
    border-radius: ${token.panel['border-radius']};
    @media (max-width: 400px) { padding: ${token.panel.narrow.padding}; }
`;
