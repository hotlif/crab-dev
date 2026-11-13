import { css } from '@crab-dev/css';
import token from '../token.js';

// Compact digital fields and a horizontal period control are the Mac default.
// An explicitly requested dial remains a library extension, not an AppKit dial.
export const macosTimePanelStyle = css`
    && [data-time-field] {
        background: ${token.macos.time['background-color']};
        color: ${token.macos.time.color};
        border: 1px solid ${token.macos.time['border-color']};
        box-shadow: ${token.macos.time['box-shadow']};
        &:has(input:focus-visible) { outline-offset: 2px; }
        @media (forced-colors: active) { background: Canvas; color: CanvasText; border-color: CanvasText; box-shadow: none; }
    }
    && [data-period] {
        flex-direction: row;
        width: auto;
        & button { min-width: ${token.macos.period['min-width']}; }
        & button:first-child { border-radius: 0; border-start-start-radius: inherit; border-end-start-radius: inherit; border-bottom: 0; }
        & button:last-child { border-radius: 0; border-start-end-radius: inherit; border-end-end-radius: inherit; }
    }
`;
