import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { docs } from "./metrics.js";

globalStyle`
.crab-docs-document-state { min-width: 0; min-height: calc(100dvh - ${docs.header}); padding: ${globalToken.space[8]} ${globalToken.space[6]}; background: ${token.color.surface.content}; }
.crab-docs-document-state-panel { display: grid; gap: ${globalToken.space[6]}; width: 100%; max-width: 48rem; margin: clamp(${globalToken.space[4]}, 8dvh, ${globalToken.space[20]}) auto; padding: ${globalToken.space[8]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; }
.crab-docs-document-state-message { display: grid; gap: ${globalToken.space[4]}; }
.crab-docs-document-state-label { font-size: ${token.typography.label.large["font-size"]}; line-height: ${token.typography.label.large["line-height"]}; color: ${token.color.text.secondary}; }
.crab-docs-document-state-message h1 { margin: 0; color: ${token.color.text.primary}; font-size: ${token.typography.headline.medium["font-size"]}; line-height: ${token.typography.headline.medium["line-height"]}; font-weight: ${token.typography.headline.medium["font-weight"]}; overflow-wrap: anywhere; }
.crab-docs-document-state-message p { max-width: 60ch; margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; overflow-wrap: anywhere; }
.crab-docs-feedback { display: grid; min-width: 0; gap: ${globalToken.space[4]}; margin-block: ${globalToken.space[4]}; }
.crab-docs-feedback-actions { display: flex; flex-wrap: wrap; align-items: center; gap: ${globalToken.space[3]}; min-width: 0; }
.crab-docs-feedback-actions :is(a,button) { max-width: 100%; height: auto; min-height: ${token.size.control}; white-space: normal; text-align: start; }
.crab-docs-empty-feedback { min-width: 0; padding: ${globalToken.space[6]}; margin-block: ${globalToken.space[4]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; }
.crab-docs-empty-feedback .crab-docs-feedback-actions { justify-content: center; }
.crab-docs-error-details { min-width: 0; max-width: 100%; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; color: ${token.color.text.secondary}; }
.crab-docs-error-details > summary { display: flex; align-items: center; min-height: ${token.size.control}; padding: ${globalToken.space[2]} ${globalToken.space[3]}; cursor: pointer; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; }
.crab-docs-error-details-marker { margin-inline-end: ${globalToken.space[2]}; }
.crab-docs-error-details-marker::before { content: "+"; }
.crab-docs-error-details[open] .crab-docs-error-details-marker::before { content: "−"; }
.crab-docs-error-details > pre { margin: 0; max-height: 16rem; padding: ${globalToken.space[3]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font: ${token.font.size.caption}/1.7 ${globalToken.font.family.mono}; }
.crab-docs-copy-feedback { margin-block: ${globalToken.space[3]}; font-size: ${token.font.size.body}; line-height: 1.7; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-docs-search-scroll > .crab-docs-empty-feedback { margin: ${globalToken.space[2]} 0; padding: ${globalToken.space[6]} ${globalToken.space[4]}; }
@media (max-width: 599px) {
    .crab-docs-document-state { padding: ${globalToken.space[4]}; }
    .crab-docs-document-state-panel { margin-block: ${globalToken.space[4]}; padding: ${globalToken.space[6]}; }
    .crab-docs-document-state-panel .crab-docs-feedback-actions { align-items: stretch; flex-direction: column; }
    .crab-docs-document-state-panel .crab-docs-feedback-actions :is(a,button) { width: 100%; justify-content: center; }
}
@media (pointer: coarse) {
    .crab-docs-feedback-actions :is(a,button),.crab-docs-error-details > summary { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-docs-document-state-panel,.crab-docs-empty-feedback,.crab-docs-error-details { border-color: CanvasText; }
}
`;
