import { css } from '@crab-dev/css';
import token from './token.js';

// A continuous capsule track stays underneath the translucent knob. Material's
// split track and unequal inner/outer radii are not used by macOS.
export const macosSliderStyle = css`
    > [data-slot="slider-rail"] {
        inset-inline-start: 0;
        border-radius: ${token.macos.track['border-radius']};
        &:dir(rtl) { border-radius: ${token.macos.track['border-radius']}; }
    }
    > [data-slot="slider-track"] {
        width: var(--slider-position, 0%);
        border-radius: ${token.macos.track['border-radius']};
        &:dir(rtl) { border-radius: ${token.macos.track['border-radius']}; }
    }
`;

// macOS uses a rounded knob, which widens and reveals the track during drag.
export const macosSliderHandleStyle = css`
    @media (forced-colors: none) {
        &[data-slider-design="macos"][data-is-dragging="true"] {
            background-color: ${token.material.knob['background-color']};
            background-image: ${token.material['background-image']};
            backdrop-filter: ${token.material['backdrop-filter']};
        }
    }
`;
