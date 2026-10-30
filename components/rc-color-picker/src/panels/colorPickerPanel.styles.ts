import { css } from "@crab-dev/css";
import { CanonicalTokenVars as TokenVars } from '@crab-dev/rc-slider';
import token from "../token.js";

export const sliderContainerStyle = css`
    display: grid;
    grid-template-columns: ${token.panel.slider.label.width} minmax(0, 1fr);
    align-items: center;
    gap: ${token.panel.slider.container.gap};
    > label {
        font-size: ${token.panel.slider.label['font-size']};
        font-weight: ${token.panel.slider.label['font-weight']};
        line-height: ${token.panel.slider.label['line-height']};
        overflow-wrap: anywhere;
    }
    > div {
        min-width: 0;
    }
`;

export const commonSliderStyle = css`
    --color-picker-gradient-direction: to right;
    &:dir(rtl) { --color-picker-gradient-direction: to left; }
    ${TokenVars["rail.height"]}: ${token.panel.rail.height};
    ${TokenVars['thumb.stroke-color']}: ${token.slider.thumb['stroke-color']};
    ${TokenVars['rail.fill-active']}: transparent;
    ${TokenVars["thumb.fill"]}: transparent;
    > [data-slot="slider-rail"] {
        inset-inline: 0;
        border-radius: var(${TokenVars["rail.border-radius"]});
    }
`;

export const rootStyle = css`
    min-width: min(${token.panel['min-width']}, 100%);
    width: ${token.panel['min-width']};
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${token.panel.gap};
`;

export const previewStyle = css`
    /* The selected color is data, like the preset swatches, not a UI surface. */
    forced-color-adjust: none;
    box-sizing: border-box;
    width: ${token.panel.preview.width};
    height: ${token.panel.preview.height};
    border-radius: ${token.panel.preview['border-radius']};
    border: 1px solid ${token.panel.preview['border-color']};
    margin-top: ${token.panel.preview['margin-top']};
`;

export const hueRailStyle = css`
    ${TokenVars['rail.fill-inactive']}: linear-gradient(var(--color-picker-gradient-direction),
        oklch(0.7 0.15 0),
        oklch(0.7 0.15 60),
        oklch(0.7 0.15 120),
        oklch(0.7 0.15 180),
        oklch(0.7 0.15 240),
        oklch(0.7 0.15 300),
        oklch(0.7 0.15 360)
    );
`;
