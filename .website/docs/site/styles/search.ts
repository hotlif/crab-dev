import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-docs-dialog { min-width: 0 !important; width: min(40rem, calc(100vw - 2rem)); max-width: calc(100vw - 2rem); }
.crab-docs-dialog > div { min-width: 0; max-width: 100%; }
.crab-docs-search-dialog { --crab-docs-search-edge: max(${globalToken.space[4]}, env(safe-area-inset-bottom, 0px)); --dialog-root-top: max(env(safe-area-inset-top, 0px), clamp(${globalToken.space[4]}, 8dvh, ${globalToken.space[20]})); --dialog-root-padding: 0; --dialog-root-max-height: calc(100dvh - var(--dialog-root-top) - var(--crab-docs-search-edge)); max-height: var(--dialog-root-max-height); width: min(42rem, calc(100vw - 2rem)); }
.crab-docs-search-dialog button { min-height: 2.75rem; }
.crab-docs-search { display: flex; flex-direction: column; min-height: 0; height: min(36rem, calc(100dvh - var(--dialog-root-top) - var(--crab-docs-search-edge) - 2px)); padding: ${globalToken.space[5]}; }
.crab-docs-search-heading { display: flex; flex: none; align-items: center; justify-content: space-between; gap: ${token.space["stack-gap"]}; margin-bottom: ${token.space["stack-gap"]}; }
.crab-docs-search-heading h2 { margin: 0; font-size: ${token.typography.title.medium["font-size"]}; font-weight: ${token.font.weight.strong}; line-height: ${token.typography.title.medium["line-height"]}; }
.crab-docs-search-heading .crab-docs-search-close { width: 2.75rem; height: 2.75rem; padding: 0; flex: none; color: ${token.color.text.secondary}; }
.crab-docs-mobile-drawer { width: 100vw; max-width: none; background: transparent; --drawer-root-border-radius: ${token.navigation.drawer.radius}; --drawer-close-width: ${token.size.control}; --drawer-close-icon-width: ${globalToken.space[6]}; }
.crab-docs-search-field { flex: none; padding-inline: ${token.space["control-padding-x"]}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; background: var(--crab-docs-nav-hover); }
.crab-docs-search-field:focus-within { border-color: transparent; outline: 2px solid ${token.color.focus.ring}; outline-offset: 1px; }
/* The host owns the single outline; LineEdit paints its ring on the root, not the input. */
.crab-docs-search-field .crab-docs-search-input:has(input:focus-visible),
.crab-docs-search-field input:focus-visible { outline: none; }
@media (forced-colors: active) { .crab-docs-search-field:focus-within { outline-color: Highlight; } }
.crab-docs-search-input { width: 100%; min-height: ${globalToken.space[12]}; font-size: ${token.font.size.subhead}; line-height: 1.5; }
.crab-docs-search-icon { display: block; width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; color: ${token.color.text.secondary}; }
.crab-docs-search-field .crab-docs-search-clear { width: 2.75rem; height: 2.75rem; padding: 0; }
.crab-docs-search-meta { display: flex; justify-content: space-between; gap: ${token.space["stack-gap"]}; padding: ${token.space["section-gap"]} ${token.space["inline-gap"]} ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; flex: none; }
.crab-docs-search-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: ${token.space["inline-gap"]}; }
.crab-docs-search-pending { display: flex; justify-content: center; align-items: center; gap: ${token.space["stack-gap"]}; min-height: ${globalToken.space[24]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-docs-results { display: grid; grid-template-columns: minmax(0, 1fr); gap: ${token.space["inline-gap"]}; list-style: none; padding: 0; margin: 0; }
.crab-docs-results > li { min-width: 0; }
.crab-docs-results button { display: block; position: relative; width: 100%; height: auto; min-height: ${globalToken.space[20]}; border: 1px solid transparent; border-radius: ${token.shape.control}; color: ${token.color.text.primary}; background: transparent; box-shadow: none; white-space: normal; text-align: left; padding: ${token.space["stack-gap"]} ${globalToken.space[10]} ${token.space["stack-gap"]} ${token.space["stack-gap"]}; line-height: 1.5; }
.crab-docs-results button > span { display: block; min-width: 0; }
.crab-docs-results .crab-docs-result-heading { display: flex; align-items: baseline; gap: ${token.space["stack-gap"]}; }
.crab-docs-results strong { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-width: 0; flex: 1; font-size: ${token.font.size.body}; font-weight: ${token.font.weight.strong}; line-height: 1.5; overflow-wrap: anywhere; }
.crab-docs-result-kind { flex: none; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; }
.crab-docs-result-detail { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.5; margin-top: ${token.space["inline-gap"]}; overflow-wrap: anywhere; }
.crab-docs-result-source { display: block; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; line-height: 1.5; margin-top: ${token.space["inline-gap"]}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.crab-docs-result-enter { position: absolute; right: ${token.space["stack-gap"]}; top: 50%; transform: translateY(-50%); color: ${token.color.text.link}; visibility: hidden; font-size: ${token.font.size.subhead}; }
.crab-docs-results button:hover { background: var(--crab-docs-nav-hover); box-shadow: none; }
.crab-docs-results button[aria-selected="true"] { background: var(--crab-docs-nav-selected); box-shadow: none; }
.crab-docs-results button[aria-selected="true"] strong { color: ${token.color.selection.foreground}; }
.crab-docs-results [aria-selected="true"] .crab-docs-result-enter { visibility: visible; }
.crab-docs-search-help { display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["section-gap"]}; padding-top: ${token.space["stack-gap"]}; margin-top: ${token.space["component-gap"]}; border-top: 1px solid ${token.color.border.subtle}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; flex: none; }
.crab-docs-search-help kbd { display: inline-flex; justify-content: center; min-width: ${globalToken.space[5]}; padding-inline: ${token.space["inline-gap"]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.sm}; font: inherit; line-height: 1.5; }
@media (max-width: 1023px) {
    .crab-docs-search { padding: ${globalToken.space[4]}; }
    .crab-docs-search-help { gap: ${token.space["component-gap"]}; }
    .crab-docs-result-heading { flex-wrap: wrap; }
}
@media (max-height: 480px) {
    .crab-docs-search-dialog { --dialog-root-top: max(${globalToken.space[2]}, env(safe-area-inset-top, 0px)); }
    .crab-docs-search { padding: ${globalToken.space[3]}; }
    .crab-docs-search-heading { margin-bottom: ${globalToken.space[2]}; }
    .crab-docs-search-meta { padding-block: ${globalToken.space[1]}; }
    .crab-docs-search-help { margin-top: ${globalToken.space[1]}; padding-top: ${globalToken.space[1]}; }
}
`;
