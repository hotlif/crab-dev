/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'surface.background-color': '--card-surface-background-color',
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
    'ring.color-focus': '--card-ring-color-focus'
});

const token = defineTokens({
    'surface': {
        'background-color': `var(${vars['surface.background-color']}, var(--card-surface-background, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`
    },
    'root': {
        'border-color': `var(${vars['root.border-color']}, var(--card-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--card-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--card-box-shadow, var(--card-elevation-rest, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))))`,
        'box-shadow-hover': `var(${vars['root.box-shadow-hover']}, var(--card-box-shadow-hover, var(--card-elevation-hover, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))))`,
        'box-shadow-active': `var(${vars['root.box-shadow-active']}, var(--card-box-shadow-active, var(--card-elevation-active, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))))`,
        'transform-hover': `var(${vars['root.transform-hover']}, var(--card-root-translate-y-hover, translateY(var(--card-root-translate-y-hover, var(--card-translate-y-hover, var(--card-lift-hover, -2px))))))`,
        'transform-active': `var(${vars['root.transform-active']}, var(--card-root-translate-y-active, translateY(var(--card-root-translate-y-active, var(--card-translate-y-active, var(--card-lift-active, 0))))))`,
        'transition': `var(${vars['root.transition']}, var(--card-motion-lift, transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--card-opacity-disabled, var(--card-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))))`
    },
    'filled': {
        'background-color': `var(${vars['filled.background-color']}, var(--card-filled-background, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'background-color-hover': `var(${vars['filled.background-color-hover']}, var(--card-filled-background-hover, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286)))))`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'border-radius': `var(${vars['size.large.border-radius']}, var(--card-size-large-radius, var(--token-semantic-radius-xl, var(--token-global-radius-6, 12px))))`,
            'title': {
                'font-size': `var(${vars['size.large.title.font-size']}, var(--card-size-large-title-size, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px))))`
            }
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'border-radius': `var(${vars['size.middle.border-radius']}, var(--card-size-middle-radius, var(--token-semantic-radius-xl, var(--token-global-radius-6, 12px))))`,
            'title': {
                'font-size': `var(${vars['size.middle.title.font-size']}, var(--card-size-middle-title-size, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px))))`
            }
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'border-radius': `var(${vars['size.small.border-radius']}, var(--card-size-small-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
            'title': {
                'font-size': `var(${vars['size.small.title.font-size']}, var(--card-size-small-title-size, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px))))`
            }
        }
    },
    'header': {
        'title': {
            'color': `var(${vars['header.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'font-weight': `var(${vars['header.title.font-weight']}, var(--card-header-title-weight, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600))))`
        }
    },
    'body': {
        'color': `var(${vars['body.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'font-size': `var(${vars['body.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'line-height': `var(${vars['body.line-height']}, 1.6)`
    },
    'cover': {
        'background-color': `var(${vars['cover.background-color']}, var(--card-cover-background, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'transition': `var(${vars['cover.transition']}, var(--card-motion-cover, transform 320ms cubic-bezier(0.16, 1, 0.3, 1)))`
    },
    'footer': {
        'divider': {
            'border-color': `var(${vars['footer.divider.border-color']}, var(--card-footer-divider-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`
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
            'color': `var(${vars['meta.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'font-weight': `var(${vars['meta.title.font-weight']}, var(--card-meta-title-weight, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500))))`,
            'font-size': `var(${vars['meta.title.font-size']}, var(--card-meta-title-size, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px))))`
        },
        'desc': {
            'color': `var(${vars['meta.desc.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
            'font-size': `var(${vars['meta.desc.font-size']}, var(--card-meta-desc-size, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px))))`
        }
    },
    'ring': {
        'color-focus': `var(${vars['ring.color-focus']}, var(--card-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-blue-600, oklch(0.546 0.245 262))))))`
    }
});

export default token;
