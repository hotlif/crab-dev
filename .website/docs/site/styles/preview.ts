import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-docs-demo { margin-block: ${token["space"]["group-gap"]}; min-width: 0; }
.crab-docs-demo-viewport { min-width: 0; max-width: 100%; overflow-x: auto; margin-inline: auto; }
.crab-docs-demo-viewport[data-viewport="tablet"] { width: 768px; }
.crab-docs-demo-viewport[data-viewport="mobile"] { width: 390px; }
.crab-docs-demo-viewport[data-padding="default"] { padding: ${token.space["section-gap"]}; }
.crab-docs-demo-viewport[data-background="transparent"] { background: transparent; }
.crab-docs-demo-viewport[data-background="light"] { background: ${token.color.background.surface}; }
.crab-docs-demo-viewport[data-background="dark"] { background: ${token.color.background.inverse}; }
.crab-docs-demo > .crab-docs-actions { margin-top: ${token["space"]["section-gap"]}; }
.crab-docs-fullscreen { width: calc(100vw - 2rem); }
.crab-docs-inline-toc { display: none; }
[data-tutorial] { container-type: inline-size; }
[data-tutorial] :is(section,article,figure) { min-width: 0; }
[data-tutorial] pre { tab-size: 4; }
[data-crab-preview="true"] { box-sizing: border-box; min-width: 0; width: 100%; padding: ${token["space"]["section-gap"]}; }
`;
