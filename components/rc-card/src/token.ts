/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'surface.background': '--card-surface-background',
    'border.color': '--card-border-color',
    'border.color-hover': '--card-border-color-hover',
    'filled.background': '--card-filled-background',
    'filled.background-hover': '--card-filled-background-hover',
    'elevation.rest': '--card-elevation-rest',
    'elevation.hover': '--card-elevation-hover',
    'elevation.active': '--card-elevation-active',
    'lift.hover': '--card-lift-hover',
    'lift.active': '--card-lift-active',
    'size.large.padding': '--card-size-large-padding',
    'size.large.gap': '--card-size-large-gap',
    'size.large.radius': '--card-size-large-radius',
    'size.large.title-size': '--card-size-large-title-size',
    'size.middle.padding': '--card-size-middle-padding',
    'size.middle.gap': '--card-size-middle-gap',
    'size.middle.radius': '--card-size-middle-radius',
    'size.middle.title-size': '--card-size-middle-title-size',
    'size.small.padding': '--card-size-small-padding',
    'size.small.gap': '--card-size-small-gap',
    'size.small.radius': '--card-size-small-radius',
    'size.small.title-size': '--card-size-small-title-size',
    'header.title-color': '--card-header-title-color',
    'header.title-weight': '--card-header-title-weight',
    'body.color': '--card-body-color',
    'body.font-size': '--card-body-font-size',
    'body.line-height': '--card-body-line-height',
    'cover.background': '--card-cover-background',
    'footer.divider-color': '--card-footer-divider-color',
    'footer.padding-y': '--card-footer-padding-y',
    'footer.gap': '--card-footer-gap',
    'meta.gap': '--card-meta-gap',
    'meta.text-gap': '--card-meta-text-gap',
    'meta.title-color': '--card-meta-title-color',
    'meta.title-weight': '--card-meta-title-weight',
    'meta.title-size': '--card-meta-title-size',
    'meta.desc-color': '--card-meta-desc-color',
    'meta.desc-size': '--card-meta-desc-size',
    'motion.lift': '--card-motion-lift',
    'motion.cover': '--card-motion-cover',
    'focus.ring.color': '--card-focus-ring-color',
    'disabled.opacity': '--card-disabled-opacity'
};

const token = {
    'surface': {
        'background': `var(${vars['surface.background']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'border': {
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-hover': `var(${vars['border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'filled': {
        'background': `var(${vars['filled.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'background-hover': `var(${vars['filled.background-hover']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
    },
    'elevation': {
        'rest': `var(${vars['elevation.rest']}, 0 1px 2px 0 oklch(0 0 0 / 0.05), 0 1px 3px 0 oklch(0 0 0 / 0.08))`,
        'hover': `var(${vars['elevation.hover']}, 0 4px 12px -2px oklch(0 0 0 / 0.10), 0 8px 24px -8px oklch(0 0 0 / 0.07))`,
        'active': `var(${vars['elevation.active']}, 0 2px 6px -1px oklch(0 0 0 / 0.08), 0 3px 10px -4px oklch(0 0 0 / 0.06))`
    },
    'lift': {
        'hover': `var(${vars['lift.hover']}, -2px)`,
        'active': `var(${vars['lift.active']}, 0)`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'radius': `var(${vars['size.large.radius']}, var(--token-semantic-radius-xl, var(--token-global-radius-6, 12px)))`,
            'title-size': `var(${vars['size.large.title-size']}, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px)))`
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'radius': `var(${vars['size.middle.radius']}, var(--token-semantic-radius-xl, var(--token-global-radius-6, 12px)))`,
            'title-size': `var(${vars['size.middle.title-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'radius': `var(${vars['size.small.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
            'title-size': `var(${vars['size.small.title-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        }
    },
    'header': {
        'title-color': `var(${vars['header.title-color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'title-weight': `var(${vars['header.title-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`
    },
    'body': {
        'color': `var(${vars['body.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'font-size': `var(${vars['body.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'line-height': `var(${vars['body.line-height']}, 1.6)`
    },
    'cover': {
        'background': `var(${vars['cover.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
    },
    'footer': {
        'divider-color': `var(${vars['footer.divider-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'padding-y': `var(${vars['footer.padding-y']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'gap': `var(${vars['footer.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'meta': {
        'gap': `var(${vars['meta.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'text-gap': `var(${vars['meta.text-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'title-color': `var(${vars['meta.title-color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'title-weight': `var(${vars['meta.title-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'title-size': `var(${vars['meta.title-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'desc-color': `var(${vars['meta.desc-color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'desc-size': `var(${vars['meta.desc-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
    },
    'motion': {
        'lift': `var(${vars['motion.lift']}, transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms cubic-bezier(0.16, 1, 0.3, 1))`,
        'cover': `var(${vars['motion.cover']}, transform 320ms cubic-bezier(0.16, 1, 0.3, 1))`
    },
    'focus': {
        'ring': {
            'color': `var(${vars['focus.ring.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        }
    },
    'disabled': {
        'opacity': `var(${vars['disabled.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    }
};

export default token;
