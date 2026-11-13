import { css } from '@crab-dev/css';
import token from './token.js';

// Inline messages stay on the content plane. Status belongs to the icon;
// reading an entire red/green paragraph is not the macOS alert hierarchy.
export const macosAlertStyle = css`
    && {
        color: ${token.macos.root.color};
        background-color: ${token.macos.root['background-color']};
        border-color: ${token.macos.root['border-color']};
        @media (forced-colors: active) { color: CanvasText; background: Canvas; border-color: CanvasText; }
    }
`;
