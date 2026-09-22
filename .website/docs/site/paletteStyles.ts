import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// Site surfaces use the same public Material roles as components and portals.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-docs[data-theme], .crab-docs-dialog[data-theme] {
    --crab-docs-nav-hover: ${token.color.background["hover-subtle"]};
    --crab-docs-nav-selected: ${token.color.secondary.container};
    --crab-docs-code-background: ${token.color.surface.container};
}
`;
