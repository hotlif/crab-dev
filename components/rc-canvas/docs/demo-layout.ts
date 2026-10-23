import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// Drawing coordinates remain unchanged; only the documentation viewport scrolls.
export const canvasViewportStyle = css`
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    overflow: auto;
    &:focus-visible {
        outline: 2px solid ${token.color.focus.ring};
        outline-offset: -2px;
    }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
    }
`;

export const canvasFrameStyle = css`
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.card};
    background: ${token.color.workspace.content};
`;
export const demoStackStyle = css`display: flex; flex-direction: column; gap: ${token.space['component-gap']};`;
export const demoHintStyle = css`
    font-size: ${token.typography.caption['font-size']}; color: ${token.color.text.secondary};
    padding-block: ${token.space['inline-gap']};
`;
