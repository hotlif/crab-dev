import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

globalStyle`
.crab-docs[data-crab-design="md3"] .crab-docs-topbar { background: ${token.color.surface.low}; }
.crab-docs[data-crab-design="md3"] .crab-docs-sidebar .crab-docs-nav-page { border-radius: ${token.shape.full}; }
.crab-docs[data-crab-design="macos"] .crab-docs-topbar { background: ${token.material.background}; background-image: ${token.material.sheen}; backdrop-filter: ${token.material.filter}; }
.crab-docs[data-crab-design="macos"] .crab-docs-page-heading { box-shadow: ${token.shadow.card}; }
.crab-docs[data-crab-design="shadcn"] :is(.crab-docs-topbar,.crab-docs-page-heading) { border-color: ${token.color.border.default}; }
.crab-docs[data-crab-design="shadcn"] .crab-docs-page-heading { background: ${token.color.surface.content}; }
.crab-docs-code figcaption { min-height: ${token.size[48]}; gap: ${globalToken.space[3]}; background: ${token.color.surface.low}; }
.crab-docs-code figcaption button { flex: none; }
.crab-docs-demo > .crab-docs-actions { gap: ${globalToken.space[2]}; padding: ${globalToken.space[3]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.low}; }
.crab-docs-demo .crab-docs-code:not([hidden]) { animation: crab-site-fade ${token.motion.effects.default} backwards; }
.crab-docs-document-state-panel { background: ${token.color.surface.low}; }
.crab-docs-search-field { background: ${token.color.surface.content}; }
.crab-docs-search-heading { padding-bottom: ${globalToken.space[3]}; border-bottom: 1px solid ${token.color.border.subtle}; }
.crab-docs-results button[aria-selected="true"] { border-color: ${token.color.border.subtle}; }
.crab-docs-prose > .table-scroll { border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; }
@media (prefers-reduced-motion: reduce) { .crab-docs-demo .crab-docs-code:not([hidden]) { animation: none; } }
@media (forced-colors: active) {
    .crab-docs[data-crab-design] .crab-docs-topbar { background: Canvas; backdrop-filter: none; border-color: CanvasText; }
    .crab-docs[data-crab-design] .crab-docs-page-heading, .crab-docs-results button[aria-selected="true"] { border-color: CanvasText; }
}
`;
