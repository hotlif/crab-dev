/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'surface.background-color': '--card-surface-background-color',
    'elevated.background-color': '--card-elevated-background-color',
    'root.border-color': '--card-root-border-color',
    'root.border-color-hover': '--card-root-border-color-hover',
    'root.box-shadow': '--card-root-box-shadow',
    'root.box-shadow-hover': '--card-root-box-shadow-hover',
    'root.box-shadow-active': '--card-root-box-shadow-active',
    'root.transform-hover': '--card-root-transform-hover',
    'root.transform-active': '--card-root-transform-active',
    'root.transition': '--card-root-transition',
    'root.opacity-disabled': '--card-root-opacity-disabled',
    'filled.background-color': '--card-filled-background-color',
    'filled.background-color-hover': '--card-filled-background-color-hover',
    'filled.box-shadow-hover': '--card-filled-box-shadow-hover',
    'filled.box-shadow-active': '--card-filled-box-shadow-active',
    'outlined.box-shadow-hover': '--card-outlined-box-shadow-hover',
    'outlined.box-shadow-active': '--card-outlined-box-shadow-active',
    'outlined.border-color-focus': '--card-outlined-border-color-focus',
    'state-layer.color': '--card-state-layer-color',
    'state-layer.opacity-hover': '--card-state-layer-opacity-hover',
    'state-layer.opacity-focus': '--card-state-layer-opacity-focus',
    'state-layer.opacity-pressed': '--card-state-layer-opacity-pressed',
    'state-layer.transition': '--card-state-layer-transition',
    'size.large.padding': '--card-size-large-padding',
    'size.large.gap': '--card-size-large-gap',
    'size.large.border-radius': '--card-size-large-border-radius',
    'size.large.title.font-size': '--card-size-large-title-font-size',
    'size.middle.padding': '--card-size-middle-padding',
    'size.middle.gap': '--card-size-middle-gap',
    'size.middle.border-radius': '--card-size-middle-border-radius',
    'size.middle.title.font-size': '--card-size-middle-title-font-size',
    'size.small.padding': '--card-size-small-padding',
    'size.small.gap': '--card-size-small-gap',
    'size.small.border-radius': '--card-size-small-border-radius',
    'size.small.title.font-size': '--card-size-small-title-font-size',
    'header.title.color': '--card-header-title-color',
    'header.title.font-weight': '--card-header-title-font-weight',
    'body.color': '--card-body-color',
    'body.font-size': '--card-body-font-size',
    'body.font-family': '--card-body-font-family',
    'body.line-height': '--card-body-line-height',
    'cover.background-color': '--card-cover-background-color',
    'cover.transition': '--card-cover-transition',
    'footer.divider.border-color': '--card-footer-divider-border-color',
    'footer.padding-block': '--card-footer-padding-block',
    'footer.gap': '--card-footer-gap',
    'meta.gap': '--card-meta-gap',
    'meta.text.gap': '--card-meta-text-gap',
    'meta.title.color': '--card-meta-title-color',
    'meta.title.font-weight': '--card-meta-title-font-weight',
    'meta.title.font-size': '--card-meta-title-font-size',
    'meta.desc.color': '--card-meta-desc-color',
    'meta.desc.font-size': '--card-meta-desc-font-size',
    'ring.color-focus': '--card-ring-color-focus',
    'interaction.touch.min-width': '--card-interaction-touch-min-width',
    'interaction.touch.min-height': '--card-interaction-touch-min-height',
    'interaction.outline-color-focus': '--card-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--card-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--card-interaction-outline-offset-focus'
});

const token = defineTokens({
    'surface': {
        'background-color': `var(${vars['surface.background-color']}, var(--card-surface-background, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`
    },
    'elevated': {
        'background-color': `var(${vars['elevated.background-color']}, var(--card-surface-background-color, var(--card-surface-background, var(--token-semantic-color-surface-low, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082))))))`
    },
    'root': {
        'border-color': `var(${vars['root.border-color']}, var(--card-border-color, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--card-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--card-box-shadow, var(--card-elevation-rest, var(--token-semantic-shadow-control, var(--token-global-shadow-material-1, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 1px 3px 1px oklch(0 0 0 / 0.15))))))`,
        'box-shadow-hover': `var(${vars['root.box-shadow-hover']}, var(--card-box-shadow-hover, var(--card-elevation-hover, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))))`,
        'box-shadow-active': `var(${vars['root.box-shadow-active']}, var(--card-box-shadow-active, var(--card-elevation-active, var(--token-semantic-shadow-control, var(--token-global-shadow-material-1, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 1px 3px 1px oklch(0 0 0 / 0.15))))))`,
        'transform-hover': `var(${vars['root.transform-hover']}, translateY(var(--card-root-translate-y-hover, var(--card-lift-hover, 0px))))`,
        'transform-active': `var(${vars['root.transform-active']}, translateY(var(--card-root-translate-y-active, var(--card-lift-active, 0px))))`,
        'transition': `var(${vars['root.transition']}, var(--card-motion-lift, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--card-opacity-disabled, var(--card-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))))`
    },
    'filled': {
        'background-color': `var(${vars['filled.background-color']}, var(--card-filled-background, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144)))))`,
        'background-color-hover': `var(${vars['filled.background-color-hover']}, var(--card-filled-background-hover, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
        'box-shadow-hover': `var(${vars['filled.box-shadow-hover']}, var(--token-semantic-shadow-control, var(--token-global-shadow-material-1, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 1px 3px 1px oklch(0 0 0 / 0.15))))`,
        'box-shadow-active': `var(${vars['filled.box-shadow-active']}, none)`
    },
    'outlined': {
        'box-shadow-hover': `var(${vars['outlined.box-shadow-hover']}, var(--token-semantic-shadow-control, var(--token-global-shadow-material-1, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 1px 3px 1px oklch(0 0 0 / 0.15))))`,
        'box-shadow-active': `var(${vars['outlined.box-shadow-active']}, none)`,
        'border-color-focus': `var(${vars['outlined.border-color-focus']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'state-layer': {
        'color': `var(${vars['state-layer.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'opacity-hover': `var(${vars['state-layer.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
        'opacity-focus': `var(${vars['state-layer.opacity-focus']}, var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)))`,
        'opacity-pressed': `var(${vars['state-layer.opacity-pressed']}, var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)))`,
        'transition': `var(${vars['state-layer.transition']}, opacity var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'border-radius': `var(${vars['size.large.border-radius']}, var(--card-size-large-radius, var(--token-semantic-shape-card, var(--token-global-radius-6, 12px))))`,
            'title': {
                'font-size': `var(${vars['size.large.title.font-size']}, var(--card-size-large-title-size, var(--token-semantic-font-size-heading, var(--token-global-font-size-22, 22px))))`
            }
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'border-radius': `var(${vars['size.middle.border-radius']}, var(--card-size-middle-radius, var(--token-semantic-shape-card, var(--token-global-radius-6, 12px))))`,
            'title': {
                'font-size': `var(${vars['size.middle.title.font-size']}, var(--card-size-middle-title-size, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px))))`
            }
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'border-radius': `var(${vars['size.small.border-radius']}, var(--card-size-small-radius, var(--token-semantic-shape-card, var(--token-global-radius-6, 12px))))`,
            'title': {
                'font-size': `var(${vars['size.small.title.font-size']}, var(--card-size-small-title-size, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px))))`
            }
        }
    },
    'header': {
        'title': {
            'color': `var(${vars['header.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-weight': `var(${vars['header.title.font-weight']}, var(--card-header-title-weight, var(--token-semantic-typography-title-large-emphasized-font-weight, var(--token-global-font-weight-medium, 500))))`
        }
    },
    'body': {
        'color': `var(${vars['body.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'font-size': `var(${vars['body.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`,
        'font-family': `var(${vars['body.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'line-height': `var(${vars['body.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'cover': {
        'background-color': `var(${vars['cover.background-color']}, var(--card-cover-background, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'transition': `var(${vars['cover.transition']}, var(--card-motion-cover, transform var(--token-semantic-motion-expand, var(--token-global-duration-500, 500ms) var(--token-global-easing-expressive-spatial-default, cubic-bezier(0.38, 1.21, 0.22, 1.00)))))`
    },
    'footer': {
        'divider': {
            'border-color': `var(${vars['footer.divider.border-color']}, var(--card-footer-divider-color, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`
        },
        'padding-block': `var(${vars['footer.padding-block']}, var(--card-footer-padding-y, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`,
        'gap': `var(${vars['footer.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'meta': {
        'gap': `var(${vars['meta.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'text': {
            'gap': `var(${vars['meta.text.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'title': {
            'color': `var(${vars['meta.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-weight': `var(${vars['meta.title.font-weight']}, var(--card-meta-title-weight, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500))))`,
            'font-size': `var(${vars['meta.title.font-size']}, var(--card-meta-title-size, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px))))`
        },
        'desc': {
            'color': `var(${vars['meta.desc.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['meta.desc.font-size']}, var(--card-meta-desc-size, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px))))`
        }
    },
    'ring': {
        'color-focus': `var(${vars['ring.color-focus']}, var(--card-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`
    },
    'interaction': {
        'touch': {
            'min-width': `var(${vars['interaction.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['interaction.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['interaction.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['interaction.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['interaction.outline-offset-focus']}, 2px)`
    }
});

export default token;
