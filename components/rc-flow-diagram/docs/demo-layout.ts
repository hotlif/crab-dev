import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// Preserve the two-dimensional node layout inside a named, keyboard-scrollable region.
export const diagramViewportStyle = css`
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
