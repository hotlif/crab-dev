/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--badge-transition',
    'size.default.height': '--badge-size-default-height',
    'size.default.min-width': '--badge-size-default-min-width',
    'size.default.padding': '--badge-size-default-padding',
    'size.default.font.size': '--badge-size-default-font-size',
    'size.default.border.width': '--badge-size-default-border-width',
    'size.small.height': '--badge-size-small-height',
    'size.small.min-width': '--badge-size-small-min-width',
    'size.small.padding': '--badge-size-small-padding',
    'size.small.font.size': '--badge-size-small-font-size',
    'size.small.border.width': '--badge-size-small-border-width',
    'dot.size.default': '--badge-dot-size-default',
    'dot.size.small': '--badge-dot-size-small',
    'count.color': '--badge-count-color',
    'count.background.color': '--badge-count-background-color',
    'count.border-color': '--badge-count-border-color',
    'count.font.weight': '--badge-count-font-weight',
    'status.default.color': '--badge-status-default-color',
    'status.primary.color': '--badge-status-primary-color',
    'status.processing.color': '--badge-status-processing-color',
    'status.success.color': '--badge-status-success-color',
    'status.warning.color': '--badge-status-warning-color',
    'status.error.color': '--badge-status-error-color',
    'status.text.color': '--badge-status-text-color',
    'status.text.gap': '--badge-status-text-gap',
    'status.text.font.size': '--badge-status-text-font-size',
    'offset.x': '--badge-offset-x',
    'offset.y': '--badge-offset-y'
};

const token = {
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1), transform 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'size': {
        'default': {
            'height': `var(${vars['size.default.height']}, 20px)`,
            'min-width': `var(${vars['size.default.min-width']}, 20px)`,
            'padding': `var(${vars['size.default.padding']}, 0 6px)`,
            'font': {
                'size': `var(${vars['size.default.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            },
            'border': {
                'width': `var(${vars['size.default.border.width']}, 2px)`
            }
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 14px)`,
            'min-width': `var(${vars['size.small.min-width']}, 14px)`,
            'padding': `var(${vars['size.small.padding']}, 0 4px)`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            },
            'border': {
                'width': `var(${vars['size.small.border.width']}, 1px)`
            }
        }
    },
    'dot': {
        'size': {
            'default': `var(${vars['dot.size.default']}, 8px)`,
            'small': `var(${vars['dot.size.small']}, 6px)`
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'background': {
            'color': `var(${vars['count.background.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
        },
        'border-color': `var(${vars['count.border-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'font': {
            'weight': `var(${vars['count.font.weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
        }
    },
    'status': {
        'default': {
            'color': `var(${vars['status.default.color']}, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'primary': {
            'color': `var(${vars['status.primary.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'processing': {
            'color': `var(${vars['status.processing.color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`
        },
        'success': {
            'color': `var(${vars['status.success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'warning': {
            'color': `var(${vars['status.warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
        },
        'error': {
            'color': `var(${vars['status.error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
        },
        'text': {
            'color': `var(${vars['status.text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'gap': `var(${vars['status.text.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font': {
                'size': `var(${vars['status.text.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        }
    },
    'offset': {
        'x': `var(${vars['offset.x']}, 50%)`,
        'y': `var(${vars['offset.y']}, -50%)`
    }
};

export default token;
