import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// The same navigation/content nodes persist across designs. Only the shell layout changes.
// Colors, shapes and interaction states use the shared component contracts.
globalStyle`
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) {
    --button-root-border-radius-active: ${token.navigation.item.radius};
    border-radius: ${token.navigation.item.radius};
}
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"] {
    background: ${token.navigation.item["selected-background"]};
    color: ${token.navigation.item["selected-color"]};
}
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:hover {
    background: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.hover} * 100%), ${token.navigation.item["selected-background"]});
}
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:is(:active,:focus-visible) {
    background: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.pressed} * 100%), ${token.navigation.item["selected-background"]});
}
.crab-docs-theme-options button {
    border-radius: ${token.navigation.item.radius};
    min-height: ${token.size.navigation};
}
.crab-docs-theme-options button[aria-checked="true"] {
    background: ${token.navigation.item["selected-background"]};
    color: ${token.navigation.item["selected-color"]};
}
.crab-docs-theme-options button[aria-checked="true"]:hover {
    background: color-mix(in oklch, ${token.navigation.item["selected-color"]} calc(${token.state.opacity.hover} * 100%), ${token.navigation.item["selected-background"]});
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
/* Material retains the compact documentation rail; desktop themes use a toolbar/sidebar split. */
@media (min-width: 1280px) {
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout,
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout[data-navigation-open="true"] {
        padding-inline-start: calc(${token.size[64]} * 4);
        padding-block-start: ${token.size[64]};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-topbar {
        inset: 0 0 auto;
        width: 100%;
        height: ${token.size[64]};
        border-inline-end: 0;
        border-bottom: ${globalToken.space.px} solid ${token.color.border.subtle};
    }
    .crab-docs[data-crab-design="apple"] .crab-docs-layout .crab-docs-topbar {
        background: ${token.color.surface.low};
        box-shadow: ${token.shadow.control};
    }
    .crab-docs[data-crab-design="shadcn"] .crab-docs-layout .crab-docs-topbar {
        background: ${token.color.surface.content};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-header.crab-docs-rail {
        flex-direction: row;
        height: 100%;
        min-height: 0;
        max-width: none;
        padding: ${token.space["stack-gap"]} ${token.space["section-gap"]};
        gap: ${token.space["section-gap"]};
        overflow: visible;
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-rail-search {
        order: 2;
        margin: 0;
        width: ${token.size.control};
        height: ${token.size.control};
        min-height: ${token.size.control};
        box-shadow: ${token.navigation.button["outlined-shadow"]};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header :is(.crab-docs-brand, .crab-docs-rail-item) {
        flex-direction: row;
        width: auto;
        height: ${token.size.control};
        min-height: ${token.size.control};
        padding-inline: ${token.space["stack-gap"]};
        gap: ${token.space["component-gap"]};
        font-size: ${token.font.size.body};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-brand {
        justify-content: start;
        width: calc(${token.size[64]} * 4 - ${token.space["section-gap"]} * 2);
        color: ${token.color.text.primary};
        font-weight: ${token.font.weight.strong};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-brand-desktop { display: none; }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-brand-mobile { display: inline; }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-header-links {
        flex-direction: row;
        flex: 1;
        width: auto;
        gap: ${token.space["component-gap"]};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-rail-indicator {
        width: ${token.size[20]};
        height: ${token.size[20]};
        border-radius: 0;
        background: transparent;
        color: inherit;
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header :is(.crab-docs-brand, .crab-docs-rail-item):hover {
        background: ${token.color.background["hover-subtle"]};
        color: ${token.color.text.primary};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header :is(.crab-docs-brand, .crab-docs-rail-item):is(:hover, :active) .crab-docs-rail-indicator {
        background: transparent;
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-header .crab-docs-rail-item[data-active="true"] {
        background: ${token.color.background.selected};
        color: ${token.color.selection.foreground};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-header-tools {
        flex-direction: row;
        order: 3;
        margin: 0;
        padding: 0;
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-sidebar {
        inset: ${token.size[64]} auto 0 0;
        width: calc(${token.size[64]} * 4);
        height: calc(100dvh - ${token.size[64]});
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-layout .crab-docs-page {
        min-height: calc(100dvh - ${token.size[64]});
        padding: ${token.space["stack-gap"]};
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-page[data-reading="true"] .crab-docs-prose :is(h2,h3,[data-docs-example-anchor])[id] {
        scroll-margin-top: calc(${token.size[64]} + ${token.space["group-gap"]});
    }
    .crab-docs:is([data-crab-design="apple"], [data-crab-design="shadcn"]) .crab-docs-reading-body[data-wide="true"] .crab-docs-page-outline {
        top: calc(${token.size[64]} + ${token.space["group-gap"]});
        max-height: calc(100dvh - ${token.size[64]} - ${token.space["page-padding"]});
    }
}
@media (pointer: coarse) {
    .crab-docs-theme-options button { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-docs-navigation .crab-docs-nav-page[aria-current="page"],
    .crab-docs-theme-options button[aria-checked="true"] { outline: ${globalToken.space["0-5"]} solid Highlight; outline-offset: -${globalToken.space["0-5"]}; }
}
`;
