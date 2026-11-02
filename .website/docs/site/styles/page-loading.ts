import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { docs } from "./metrics.js";

globalStyle`
.crab-docs-page-placeholder { position: relative; min-width: 0; min-height: calc(100dvh - ${docs.header}); padding: ${globalToken.space[2]}; background: ${token.color.surface.content}; }
.crab-docs-page-load-progress { position: absolute; inset: 0 0 auto; height: ${globalToken.space["0-5"]}; overflow: hidden; background: ${token.color.border.subtle}; }
.crab-docs-page-load-progress > span { display: block; height: 100%; width: 32%; background: ${token.color.brand.primary}; animation: crab-docs-page-progress 1.6s ease-in-out infinite; }
.crab-docs-page-placeholder[data-stage="waiting"] :is(.crab-docs-page-load-body,.crab-docs-page-load-progress,.crab-docs-page-load-artwork) { visibility: hidden; }
.crab-docs-page-placeholder[data-stage="waiting"] .crab-docs-page-load-progress > span { animation: none; }
.crab-docs-page-load-body { display: grid; grid-template-columns: minmax(0,1fr); gap: ${globalToken.space[6]}; max-width: ${docs.article}; margin: ${globalToken.space[6]} auto 0; padding: 0 ${globalToken.space[6]} ${globalToken.space[8]}; }
.crab-docs-page-load-copy { display: grid; min-width: 0; gap: ${globalToken.space[6]}; align-content: start; }
.crab-docs-page-load-example { display: grid; gap: ${globalToken.space[6]}; padding: ${globalToken.space[6]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; }
.crab-docs-page-load-outline { display: none; min-width: 0; align-content: start; gap: ${globalToken.space[6]}; }
.crab-docs-page-load-artwork { height: calc(${globalToken.space[24]} + ${globalToken.space[6]}); margin-inline: ${globalToken.space[6]}; overflow: hidden; border-radius: ${token.shape.card}; }
.crab-docs-page-load-message { grid-column: 1 / -1; max-width: ${docs.measure}; margin: 0; min-height: 3lh; font-size: ${token.font.size.body}; line-height: 1.7; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-docs-page-load-status { position: absolute; width: ${globalToken.space.px}; height: ${globalToken.space.px}; overflow: hidden; clip-path: inset(50%); margin: 0; white-space: nowrap; }
@keyframes crab-docs-page-progress {
    from { transform: translateX(-100%); }
    to { transform: translateX(315%); }
}
@media (min-width: 1280px) {
    .crab-docs-page-load-body[data-outline="true"] { max-width: calc(${docs.article} + ${globalToken.space[24]}); grid-template-columns: minmax(0,1fr) ${docs.outline}; }
    .crab-docs-page-load-outline { display: grid; }
}
@media (max-width: 599px) {
    .crab-docs-page-load-body { padding-inline: ${globalToken.space[4]}; }
}
@media (prefers-reduced-motion: reduce) {
    .crab-docs-page-load-progress > span { animation: none; width: 100%; }
}
@media (forced-colors: active) {
    .crab-docs-page-load-progress { background: Canvas; }
    .crab-docs-page-load-progress > span { background: Highlight; }
    .crab-docs-page-load-example { border-color: CanvasText; }
}
`;
