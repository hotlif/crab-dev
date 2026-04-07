/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--tag-transition',
    'size.large.height': '--tag-size-large-height',
    'size.large.padding': '--tag-size-large-padding',
    'size.large.border.radius': '--tag-size-large-border-radius',
    'size.large.font.size': '--tag-size-large-font-size',
    'size.large.gap': '--tag-size-large-gap',
    'size.middle.height': '--tag-size-middle-height',
    'size.middle.padding': '--tag-size-middle-padding',
    'size.middle.border.radius': '--tag-size-middle-border-radius',
    'size.middle.font.size': '--tag-size-middle-font-size',
    'size.middle.gap': '--tag-size-middle-gap',
    'size.small.height': '--tag-size-small-height',
    'size.small.padding': '--tag-size-small-padding',
    'size.small.border.radius': '--tag-size-small-border-radius',
    'size.small.font.size': '--tag-size-small-font-size',
    'size.small.gap': '--tag-size-small-gap',
    'default.color': '--tag-default-color',
    'default.background.color': '--tag-default-background-color',
    'default.border-color': '--tag-default-border-color',
    'primary.color': '--tag-primary-color',
    'primary.background.color': '--tag-primary-background-color',
    'primary.border-color': '--tag-primary-border-color',
    'success.color': '--tag-success-color',
    'success.background.color': '--tag-success-background-color',
    'success.border-color': '--tag-success-border-color',
    'warning.color': '--tag-warning-color',
    'warning.background.color': '--tag-warning-background-color',
    'warning.border-color': '--tag-warning-border-color',
    'error.color': '--tag-error-color',
    'error.background.color': '--tag-error-background-color',
    'error.border-color': '--tag-error-border-color',
    'close.size': '--tag-close-size',
    'close.color': '--tag-close-color',
    'close.color-hover': '--tag-close-color-hover'
};

const token = {
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 32px)`,
            'padding': `var(${vars['size.large.padding']}, 0 10px)`,
            'border': {
                'radius': `var(${vars['size.large.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
            },
            'font': {
                'size': `var(${vars['size.large.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 24px)`,
            'padding': `var(${vars['size.middle.padding']}, 0 8px)`,
            'border': {
                'radius': `var(${vars['size.middle.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
            },
            'font': {
                'size': `var(${vars['size.middle.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            },
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 20px)`,
            'padding': `var(${vars['size.small.padding']}, 0 6px)`,
            'border': {
                'radius': `var(${vars['size.small.border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            },
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        }
    },
    'default': {
        'color': `var(${vars['default.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': {
            'color': `var(${vars['default.background.color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'border-color': `var(${vars['default.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
    },
    'primary': {
        'color': `var(${vars['primary.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'background': {
            'color': `var(${vars['primary.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'border-color': `var(${vars['primary.border-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`,
        'background': {
            'color': `var(${vars['success.background.color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`
        },
        'border-color': `var(${vars['success.border-color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`,
        'background': {
            'color': `var(${vars['warning.background.color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`
        },
        'border-color': `var(${vars['warning.border-color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
    },
    'error': {
        'color': `var(${vars['error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`,
        'background': {
            'color': `var(${vars['error.background.color']}, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17))))`
        },
        'border-color': `var(${vars['error.border-color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
    },
    'close': {
        'size': `var(${vars['close.size']}, 14px)`,
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    }
};

export default token;
