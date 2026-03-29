/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--button-transition',
    'opacity.loading': '--button-opacity-loading',
    'opacity.disabled': '--button-opacity-disabled',
    'size.large.gap': '--button-size-large-gap',
    'size.large.height': '--button-size-large-height',
    'size.large.padding': '--button-size-large-padding',
    'size.large.border.radius': '--button-size-large-border-radius',
    'size.large.font.size': '--button-size-large-font-size',
    'size.middle.gap': '--button-size-middle-gap',
    'size.middle.height': '--button-size-middle-height',
    'size.middle.padding': '--button-size-middle-padding',
    'size.middle.border.radius': '--button-size-middle-border-radius',
    'size.middle.font.size': '--button-size-middle-font-size',
    'size.small.gap': '--button-size-small-gap',
    'size.small.height': '--button-size-small-height',
    'size.small.padding': '--button-size-small-padding',
    'size.small.border.radius': '--button-size-small-border-radius',
    'size.small.font.size': '--button-size-small-font-size',
    'primary.color': '--button-primary-color',
    'primary.background.color': '--button-primary-background-color',
    'primary.background.color-disabled': '--button-primary-background-color-disabled',
    'primary.background.color-hover': '--button-primary-background-color-hover',
    'primary.background.color-active': '--button-primary-background-color-active',
    'primary.box-shadow': '--button-primary-box-shadow',
    'link.color': '--button-link-color',
    'link.color-hover': '--button-link-color-hover',
    'link.color-active': '--button-link-color-active',
    'link.background.color': '--button-link-background-color',
    'link.background.color-disabled': '--button-link-background-color-disabled',
    'link.text.underline-offset': '--button-link-text-underline-offset',
    'link.text.decoration.color': '--button-link-text-decoration-color',
    'link.text.decoration.width': '--button-link-text-decoration-width',
    'text.background.color-hover': '--button-text-background-color-hover',
    'text.background.color-active': '--button-text-background-color-active',
    'dashed.color': '--button-dashed-color',
    'dashed.color-hover': '--button-dashed-color-hover',
    'dashed.color-active': '--button-dashed-color-active',
    'dashed.background.color': '--button-dashed-background-color',
    'dashed.background.color-disabled': '--button-dashed-background-color-disabled',
    'dashed.box-shadow': '--button-dashed-box-shadow',
    'dashed.border-width': '--button-dashed-border-width',
    'dashed.border-style': '--button-dashed-border-style',
    'dashed.border-color': '--button-dashed-border-color',
    'dashed.border-color-hover': '--button-dashed-border-color-hover',
    'dashed.border-color-active': '--button-dashed-border-color-active',
    'subtle.color': '--button-subtle-color',
    'subtle.color-hover': '--button-subtle-color-hover',
    'subtle.color-active': '--button-subtle-color-active',
    'subtle.background.color': '--button-subtle-background-color',
    'subtle.background.color-disabled': '--button-subtle-background-color-disabled',
    'subtle.border-width': '--button-subtle-border-width',
    'subtle.border-style': '--button-subtle-border-style',
    'subtle.border-color': '--button-subtle-border-color',
    'subtle.border-color-hover': '--button-subtle-border-color-hover',
    'subtle.border-color-active': '--button-subtle-border-color-active',
    'subtle.box-shadow': '--button-subtle-box-shadow'
};

const token = {
    'transition': `var(${vars['transition']}, transform 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1), background-color 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'opacity': {
        'loading': `var(${vars['opacity.loading']}, 0.65)`,
        'disabled': `var(${vars['opacity.disabled']}, 0.4)`
    },
    'size': {
        'large': {
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'height': `var(${vars['size.large.height']}, 40px)`,
            'padding': `var(${vars['size.large.padding']}, 0 var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'border': {
                'radius': `var(${vars['size.large.border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
            },
            'font': {
                'size': `var(${vars['size.large.font.size']}, 18px)`
            }
        },
        'middle': {
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'padding': `var(${vars['size.middle.padding']}, 0 var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'border': {
                'radius': `var(${vars['size.middle.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
            },
            'font': {
                'size': `var(${vars['size.middle.font.size']}, 14px)`
            }
        },
        'small': {
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'height': `var(${vars['size.small.height']}, 24px)`,
            'padding': `var(${vars['size.small.padding']}, 0 var(--token-semantic-space-control-padding-y, var(--token-global-space-1-5, 6px)))`,
            'border': {
                'radius': `var(${vars['size.small.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
            },
            'font': {
                'size': `var(${vars['size.small.font.size']}, 14px)`
            }
        }
    },
    'primary': {
        'color': `var(${vars['primary.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'background': {
            'color': `var(${vars['primary.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
            'color-disabled': `var(${vars['primary.background.color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
            'color-hover': `var(${vars['primary.background.color-hover']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286))))`,
            'color-active': `var(${vars['primary.background.color-active']}, var(--token-semantic-color-brand-primary-active, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        },
        'box-shadow': `var(${vars['primary.box-shadow']}, none)`
    },
    'link': {
        'color': `var(${vars['link.color']}, var(--token-semantic-color-text-link, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'color-hover': `var(${vars['link.color-hover']}, var(--token-semantic-color-text-link-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-active': `var(${vars['link.color-active']}, var(--token-semantic-color-text-link, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'background': {
            'color': `var(${vars['link.background.color']}, transparent)`,
            'color-disabled': `var(${vars['link.background.color-disabled']}, transparent)`
        },
        'text': {
            'underline-offset': `var(${vars['link.text.underline-offset']}, -4px)`,
            'decoration': {
                'color': `var(${vars['link.text.decoration.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
                'width': `var(${vars['link.text.decoration.width']}, 2px)`
            }
        }
    },
    'text': {
        'background': {
            'color-hover': `var(${vars['text.background.color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
            'color-active': `var(${vars['text.background.color-active']}, oklch(0 0 0 / 0.06))`
        }
    },
    'dashed': {
        'color': `var(${vars['dashed.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-hover': `var(${vars['dashed.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-active': `var(${vars['dashed.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': {
            'color': `var(${vars['dashed.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
            'color-disabled': `var(${vars['dashed.background.color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'box-shadow': `var(${vars['dashed.box-shadow']}, none)`,
        'border-width': `var(${vars['dashed.border-width']}, 1px)`,
        'border-style': `var(${vars['dashed.border-style']}, dashed)`,
        'border-color': `var(${vars['dashed.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'border-color-hover': `var(${vars['dashed.border-color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'border-color-active': `var(${vars['dashed.border-color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'subtle': {
        'color': `var(${vars['subtle.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-hover': `var(${vars['subtle.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-active': `var(${vars['subtle.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': {
            'color': `var(${vars['subtle.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
            'color-disabled': `var(${vars['subtle.background.color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'border-width': `var(${vars['subtle.border-width']}, 1px)`,
        'border-style': `var(${vars['subtle.border-style']}, solid)`,
        'border-color': `var(${vars['subtle.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'border-color-hover': `var(${vars['subtle.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'border-color-active': `var(${vars['subtle.border-color-active']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'box-shadow': `var(${vars['subtle.box-shadow']}, none)`
    }
};

export default token;
