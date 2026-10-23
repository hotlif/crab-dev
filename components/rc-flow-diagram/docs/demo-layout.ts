import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// Preserve the two-dimensional node layout inside a named, keyboard-scrollable region.
export const diagramViewportStyle = css`
    min-width: 0;
    max-width: 100%;
    overflow: auto;
    & > div {
        background-color: ${token.color.surface.canvas};
        border: 1px solid ${token.color.border.default};
        border-radius: ${token.shape.card};
    }
    &:focus-visible {
        outline: 2px solid ${token.color.focus.ring};
        outline-offset: -2px;
    }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
    }
`;

export const demoStackStyle = css`display: flex; flex-direction: column; gap: ${token.space['group-gap']};`;
export const demoToolbarStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['group-gap']};`;
export const demoHintStyle = css`
    font-size: ${token.typography.caption['font-size']};
    color: ${token.color.text.secondary}; padding-block: ${token.space['inline-gap']};
`;
export const demoLegendStyle = css`
    display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['group-gap']};
    font-size: ${token.typography.caption['font-size']}; color: ${token.color.text.secondary};
`;
export const demoLegendItemStyle = css`display: inline-flex; align-items: center; gap: ${token.space['inline-gap']};`;
export const demoLegendLabelStyle = css`font-weight: ${token.typography.label['font-weight']}; color: ${token.color.text.primary};`;
export const demoSwatchStyle = css`width: ${token.space['component-gap']}; height: ${token.space['component-gap']}; flex-shrink: 0; border-radius: ${token.radius.sm};`;
