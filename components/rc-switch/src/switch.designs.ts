import { css } from '@crab-dev/css';
import token from './token.js';

// Tahoe's knob becomes glass during interaction; there is no Material halo.
export const macosSwitchStyle = css`
    &[data-switch-design="macos"] {
        &::after { display: none; }
        @media (forced-colors: none) {
            &:active:not(:disabled) > span {
                background-color: ${token.material.knob['background-color']};
                background-image: ${token.material['background-image']};
                backdrop-filter: ${token.material['backdrop-filter']};
                scale: ${token.material.knob.scale};
            }
        }
        @media (prefers-reduced-motion: reduce) { &:active:not(:disabled) > span { scale: 1; } }
    }
`;
