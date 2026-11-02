import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
/* M3 drawer destinations with non-interactive bilingual trailing text. */
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) { --button-root-border-radius-active: ${token.shape.full}; }
.crab-docs-navigation section { margin-bottom: ${token.space["section-gap"]}; }
.crab-docs-navigation h2 { margin: 0; min-height: ${token.size.control}; display: flex; align-items: center; padding-inline: ${token.space["section-gap"]}; font-size: ${token.typography.title.small["font-size"]}; font-weight: ${token.typography.title.small["font-weight"]}; line-height: ${token.typography.title.small["line-height"]}; color: ${token.color.text.secondary}; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) { display: flex; width: 100%; min-width: 0; justify-content: flex-start; text-align: left; white-space: nowrap; height: ${token.size.navigation}; min-height: ${token.size.navigation}; padding: 0 ${token.space["section-gap"]}; font-size: ${token.typography.label.large["font-size"]}; font-weight: ${token.typography.label.large["font-weight"]}; line-height: ${token.typography.label.large["line-height"]}; border: 0; border-radius: ${token.shape.full}; color: ${token.color.text.secondary}; background: transparent; box-shadow: none; gap: ${token.space["stack-gap"]}; transition: background ${token.motion.interaction}, color ${token.motion.interaction}; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) > span { min-width: 0; }
.crab-docs-navigation .crab-docs-nav-page > span:not([aria-hidden="true"]) { flex: 1; }
.crab-docs-nav-label { display: flex; align-items: center; justify-content: flex-start; min-width: 0; gap: ${token.space["stack-gap"]}; white-space: nowrap; }
.crab-docs-nav-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.crab-docs-nav-translation { flex: none; max-width: 50%; overflow: hidden; text-overflow: ellipsis; color: ${token.color.text.secondary}; font-size: ${token.typography.label.medium["font-size"]}; line-height: ${token.typography.label.medium["line-height"]}; font-weight: ${token.typography.body.small["font-weight"]}; }
.crab-docs-nav-page[aria-current="page"] .crab-docs-nav-translation { color: inherit; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle):hover { color: ${token.color.text.primary}; background: color-mix(in srgb, ${token.color.text.primary} calc(${token.state.opacity.hover} * 100%), transparent); box-shadow: none; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle):is(:focus-visible,:active) { color: ${token.color.text.primary}; background: color-mix(in srgb, ${token.color.text.primary} calc(${token.state.opacity.pressed} * 100%), transparent); }
.crab-docs-section-heading { margin: 0; }
.crab-docs-navigation .crab-docs-category { margin: 0; }
.crab-docs-navigation .crab-docs-category-heading { padding: 0; }
.crab-docs-navigation .crab-docs-category-heading > button { height: ${token.size.navigation}; min-height: ${token.size.navigation}; color: ${token.color.text.primary}; }
.crab-docs-category-content > section { margin-bottom: ${token.space["component-gap"]}; }
.crab-docs-category .crab-docs-nav-section { margin-top: 0; }
.crab-docs-category-content { padding-bottom: ${token.space["component-gap"]}; }
.crab-docs-category-content > section > .crab-docs-nav-page { margin-bottom: ${token.space["component-gap"]}; }

.crab-docs-navigation .crab-docs-section-toggle { justify-content: space-between; height: ${token.size.control}; min-height: ${token.size.control}; color: ${token.color.text.secondary}; }
.crab-docs-nav-section { margin-top: ${token.space["component-gap"]}; }
.crab-docs-nav-section + .crab-docs-nav-section { padding-top: ${token.space["component-gap"]}; border-top: 1px solid ${token.color.border.subtle}; }
.crab-docs-section-chevron { display: block; width: ${globalToken.space[6]}; height: ${globalToken.space[6]}; flex: none; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; color: inherit; transition: transform ${token.motion.spatial.fast}; }
.crab-docs-section-toggle[aria-expanded="true"] .crab-docs-section-chevron, .crab-docs-inline-toc[open] .crab-docs-section-chevron { transform: rotate(90deg); }
.crab-docs-section-pages { display: grid; gap: 0; margin: 0; padding: 0; }
.crab-docs-section-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows ${token.motion.spatial.default}; }
.crab-docs-section-collapse[data-expanded="true"] { grid-template-rows: 1fr; }
.crab-docs-section-clip { min-height: 0; overflow: hidden; }
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"] { font-weight: ${token.font.weight.strong}; color: ${token.color.secondary["on-container"]}; background: ${token.color.secondary.container}; box-shadow: none; }
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:hover { background: color-mix(in srgb, ${token.color.secondary["on-container"]} calc(${token.state.opacity.hover} * 100%), ${token.color.secondary.container}); }
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:is(:focus-visible,:active) { background: color-mix(in srgb, ${token.color.secondary["on-container"]} calc(${token.state.opacity.pressed} * 100%), ${token.color.secondary.container}); }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle):focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: -2px; }
@media (forced-colors: active) {
    .crab-docs-nav-section + .crab-docs-nav-section { border-color: GrayText; }
    .crab-docs-navigation .crab-docs-nav-page[aria-current="page"] { outline: 2px solid Highlight; outline-offset: -2px; }
}
.crab-docs-toc a { display: flex; width: 100%; min-width: 0; justify-content: flex-start; text-align: left; white-space: normal; height: auto; min-height: ${token.size.control}; line-height: ${token.typography.label.large["line-height"]}; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; border-radius: ${token.shape.full}; font-size: ${token.typography.label.large["font-size"]}; color: ${token.color.text.secondary}; }
.crab-docs-toc a > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.crab-docs-toc a:hover { background: var(--crab-docs-nav-hover); color: ${token.color.text.primary}; }
.crab-docs-toc a[aria-current="location"], [aria-label="本课步骤目录"] [aria-current="step"] { font-weight: ${token.typography.title.large.emphasized['font-weight']}; color: ${token.color.selection.foreground}; background: var(--crab-docs-nav-selected); box-shadow: none; }
.crab-docs-toc { display: grid; min-width: 0; gap: ${token.space["component-gap"]}; font-size: ${token.font.size.body}; }
.crab-docs-toc strong, [aria-label="本课步骤目录"] > strong { margin-bottom: ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; letter-spacing: .04em; color: ${token.color.text.secondary}; }
`;
