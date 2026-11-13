import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";

// Only site-owned surfaces are styled here. Live demos inherit public themes
// through their Provider; no selector reaches into a component preview.
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
.crab-docs[data-crab-design="macos"] {
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
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-page-heading {
    box-shadow: ${token.shadow.control};
}
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.color.surface.low};
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.color.surface.content};
}
.crab-docs:is([data-crab-design="macos"], [data-crab-design="shadcn"]) .crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) {
    padding-inline: ${token.space["stack-gap"]};
}
.crab-docs:is([data-crab-design="macos"], [data-crab-design="shadcn"]) .crab-docs-section-pages {
    gap: ${globalToken.space["0-5"]};
}
.crab-docs-design-label {
    font-size: ${token.typography.label.medium["font-size"]};
    font-weight: ${token.font.weight.label};
    color: ${token.color.text.secondary};
}
.crab-docs-design-intro { max-width: 72ch; }
.crab-docs-component-guide { max-width: 72ch; }
.crab-docs-component-guide h3 { margin-block: ${token.space["section-gap"]} ${token.space["stack-gap"]}; }
.crab-docs-component-guide li + li { margin-block-start: ${token.space["component-gap"]}; }
.crab-docs-component-guide a { color: ${token.color.text.link}; text-decoration: underline; }

/* MD3: tonal navigation, generous content grouping and a clear headline. */
.crab-docs[data-crab-design="md3"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.color.surface.low}; border-inline-end-color: transparent;
}
.crab-docs[data-crab-design="md3"] .crab-docs-layout .crab-docs-page-heading {
    border-color: transparent; background: ${token.color.surface.container};
    padding-block: ${globalToken.space[10]}; border-radius: ${token.shape["extra-large"]};
}
.crab-docs[data-crab-design="md3"] .crab-docs-design-label { color: ${token.color.text.link}; }
.crab-docs[data-crab-design="md3"] .crab-docs-page-sections a[aria-current="location"] {
    color: ${token.navigation.item["selected-color"]}; background: ${token.navigation.item["selected-background"]};
    border-radius: ${token.shape.full}; text-decoration: none;
}
.crab-docs[data-crab-design="md3"] .crab-docs-layout .crab-docs-rail-search {
    border-color: transparent; border-radius: ${token.shape.full}; background: ${token.color.surface.high};
}

/* macOS: a material toolbar/sidebar around an opaque reading area. */
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-topbar,
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-sidebar {
    background: ${token.material.background}; background-image: ${token.material.sheen};
    backdrop-filter: ${token.material.filter}; border-color: ${token.color.border.subtle};
}
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-page-heading {
    padding: ${globalToken.space[6]} ${globalToken.space[4]};
    background: transparent; border: 0; border-bottom: 1px solid ${token.color.border.subtle};
    border-radius: 0; box-shadow: none;
}
.crab-docs[data-crab-design="macos"] .crab-docs-page-heading h1 {
    font-size: ${token.typography.headline.medium["font-size"]}; font-weight: ${token.font.weight.strong};
}
.crab-docs[data-crab-design="macos"] .crab-docs-sidebar .crab-docs-nav-page,
.crab-docs[data-crab-design="macos"] .crab-docs-sidebar .crab-docs-section-toggle {
    min-height: ${token.size.control}; padding-block: ${globalToken.space[1]};
    font-size: ${token.font.size.body};
}
.crab-docs[data-crab-design="macos"] .crab-docs-page-sections a[aria-current="location"] {
    background: ${token.color.background.selected}; color: ${token.color.selection.foreground};
    border-radius: ${token.navigation.item.radius}; text-decoration: none;
}
.crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-pager a {
    min-height: ${globalToken.space[16]}; background: ${token.color.surface.low}; box-shadow: ${token.shadow.control};
}
.crab-docs[data-crab-design="macos"] .crab-home-headline {
    font-size: clamp(2rem, 3.5vw, 3.5rem); font-weight: ${token.font.weight.strong}; letter-spacing: -.03em;
}
.crab-docs[data-crab-design="macos"] .crab-home-headline > span { color: ${token.color.text.primary}; }

/* shadcn: open typography, neutral boundaries and restrained emphasis. */
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-topbar {
    background: ${token.color.surface.content}; backdrop-filter: none;
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-page-heading {
    padding: ${globalToken.space[6]} 0; box-shadow: none;
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-page-heading h1 {
    font-weight: ${token.font.weight.strong}; letter-spacing: -.025em;
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-rail-search {
    background: ${token.color.surface.low}; box-shadow: none;
}
.crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-pager a {
    min-height: ${globalToken.space[16]}; box-shadow: none; background: transparent;
}
.crab-docs[data-crab-design="shadcn"] .crab-home-headline {
    font-weight: ${token.font.weight.strong}; letter-spacing: -.04em;
}
.crab-docs[data-crab-design="shadcn"] .crab-home-headline > span { color: ${token.color.text.primary}; }
@media (max-width: 599px) {
    .crab-docs[data-crab-design] .crab-docs-layout .crab-docs-page-heading { padding: ${globalToken.space[5]} ${globalToken.space[3]}; }
    .crab-docs[data-crab-design] .crab-home-headline { font-size: ${token.typography.headline.large["font-size"]}; }
}
@media (prefers-reduced-transparency: reduce) {
    .crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-topbar,
    .crab-docs[data-crab-design="macos"] .crab-docs-layout .crab-docs-sidebar {
        background: ${token.color.surface.low}; background-image: none; backdrop-filter: none;
    }
}
@media (pointer: coarse) {
    .crab-docs-theme-options button { min-height: ${token.size["touch-target"]}; }
    .crab-docs[data-crab-design] .crab-docs-sidebar .crab-docs-nav-page,
    .crab-docs[data-crab-design] .crab-docs-sidebar .crab-docs-section-toggle { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-docs[data-crab-design] .crab-docs-layout .crab-docs-topbar,
    .crab-docs[data-crab-design] .crab-docs-layout .crab-docs-sidebar {
        background: Canvas; background-image: none; backdrop-filter: none; border-color: CanvasText;
    }
    .crab-docs[data-crab-design] .crab-docs-layout .crab-docs-page-heading { border: 1px solid CanvasText; }
    .crab-docs[data-crab-design] .crab-docs-page-sections a[aria-current="location"] { outline: 2px solid Highlight; outline-offset: -2px; }
    .crab-docs-navigation .crab-docs-nav-page[aria-current="page"],
    .crab-docs-theme-options button[aria-checked="true"] { outline: ${globalToken.space["0-5"]} solid Highlight; outline-offset: -${globalToken.space["0-5"]}; }
}
`;
