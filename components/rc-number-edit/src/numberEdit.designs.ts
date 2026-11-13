import { css } from '@crab-dev/css';
import token from './token.js';

// AppKit steppers are one compact vertical control. On touch, expand both real
// targets and place them side by side so their hit regions cannot overlap.
export const macosStepperStyle = css`
    && {
    display: inline-grid;
    grid-template-rows: repeat(2, 1fr);
    gap: 0;
    border: 1px solid ${token.macos.stepper['border-color']};
    border-radius: ${token.macos.stepper['border-radius']};
    background: ${token.macos.stepper['background-color']};
    box-shadow: ${token.macos.stepper['box-shadow']};
    @media (pointer: coarse) { grid-template-rows: none; grid-auto-flow: column; }
    }
`;
export const macosStepperActionStyle = css`
    &&& {
        width: ${token.macos.stepper.width};
        min-width: ${token.macos.stepper.width};
        height: ${token.macos.stepper.action.height};
        min-height: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        &:first-child { border-start-start-radius: ${token.macos.stepper['border-radius']}; border-start-end-radius: ${token.macos.stepper['border-radius']}; }
        &:last-child { border-end-start-radius: ${token.macos.stepper['border-radius']}; border-end-end-radius: ${token.macos.stepper['border-radius']}; }
        & svg { width: ${token.macos.stepper.icon.width}; height: ${token.macos.stepper.icon.width}; }
        &:focus-visible { outline-offset: -2px; }
        @media (pointer: coarse) {
            width: ${token.stepper.action.touch.width}; min-width: ${token.stepper.action.touch.width}; height: ${token.stepper.action.touch.height};
        }
    }
`;
