import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";

// Designs share the same navigation and layout; tokens supply their visual differences.
// Colors, shapes and interaction states use the shared component contracts.
globalStyle`
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) {
    --button-root-border-radius-active: ${token.navigation.item.radius};
    border-radius: ${token.navigation.item.radius};
}
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:is(:active,:focus-visible) {
    background: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.pressed} * 100%), ${token.navigation.item["selected-background"]});
}
.crab-docs-theme-options button {
    border-radius: ${token.navigation.item.radius};
    min-height: ${token.size.navigation};
}
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"],
.crab-docs-theme-options button[aria-checked="true"] {
    background: ${token.navigation.item["selected-background"]};
    color: ${token.navigation.item["selected-color"]};
    ${buttonVars['text.background-color-hover']}: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.hover} * 100%), ${token.navigation.item["selected-background"]});
    ${buttonVars['text.background-color-focus']}: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.focus} * 100%), ${token.navigation.item["selected-background"]});
    ${buttonVars['text.background-color-active']}: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.pressed} * 100%), ${token.navigation.item["selected-background"]});
}
@media (forced-colors: none) {
    .crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:focus-visible,
    .crab-docs-theme-options button[aria-checked="true"]:focus-visible { outline-color: ${token.navigation.item["selected-color"]}; }
}
.crab-docs[data-crab-design="apple"] {
    --component-preview-card-box-shadow: ${token.shadow.control};
    --component-preview-card-box-shadow-hover: ${token.shadow.control};
    --component-preview-meta-info-background-color: ${token.color.surface.low};
    --component-preview-meta-actions-background-color: ${token.color.surface.low};
}
.crab-docs[data-crab-design="md3"] {
    --component-preview-card-box-shadow: ${token.shadow.card};
    --component-preview-card-box-shadow-hover: ${token.shadow.card};
    --component-preview-card-border-color: transparent;
    --component-preview-card-border-color-hover: transparent;
    --component-preview-meta-info-background-color: ${token.color.surface.low};
    --component-preview-meta-actions-background-color: ${token.color.surface.low};
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-page-heading {
    border-color: transparent;
    border-bottom-color: ${token.color.border.subtle};
    border-radius: 0;
    background: transparent;
}
.crab-docs[data-crab-design="apple"] .crab-docs-layout .crab-docs-page-heading {
    box-shadow: ${token.shadow.control};
}
.crab-docs[data-crab-design="apple"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.color.surface.low};
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.color.surface.content};
}
.crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) {
    padding-inline: ${token.space["stack-gap"]};
}
.crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-section-pages {
    gap: ${globalToken.space["0-5"]};
}
@media (pointer: coarse) {
    .crab-docs-theme-options button { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-docs-navigation .crab-docs-nav-page[aria-current="page"],
    .crab-docs-theme-options button[aria-checked="true"] { outline: ${globalToken.space["0-5"]} solid Highlight; outline-offset: -${globalToken.space["0-5"]}; }
}
`;
