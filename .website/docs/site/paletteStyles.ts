import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// Public rc-theme owns all L2 colors, including portals and forced-colors.
// Site aliases describe reading surfaces without overriding the theme contract.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-docs[data-theme], .crab-docs-dialog[data-theme],
.crab-language[data-theme], .crab-language-overlay[data-theme] {
    --crab-docs-nav-hover: ${token.color.background["hover-subtle"]};
    --crab-docs-nav-selected: ${token.color.selection.background};
    --crab-docs-code-background: ${token.color.background.surface};
}
`;
