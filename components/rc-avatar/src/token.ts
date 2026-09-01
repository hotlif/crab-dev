/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--avatar-transition',
    'size.small.value': '--avatar-size-small-value',
    'size.small.font.size': '--avatar-size-small-font-size',
    'size.middle.value': '--avatar-size-middle-value',
    'size.middle.font.size': '--avatar-size-middle-font-size',
    'size.large.value': '--avatar-size-large-value',
    'size.large.font.size': '--avatar-size-large-font-size',
    'icon.size.small': '--avatar-icon-size-small',
    'icon.size.middle': '--avatar-icon-size-middle',
    'icon.size.large': '--avatar-icon-size-large',
    'content.max-width': '--avatar-content-max-width',
    'content.font.weight': '--avatar-content-font-weight',
    'shape.square.radius': '--avatar-shape-square-radius',
    'border.color': '--avatar-border-color',
    'border.hover': '--avatar-border-hover',
    'focus.ring.color': '--avatar-focus-ring-color',
    'disabled.opacity': '--avatar-disabled-opacity',
    'default.color': '--avatar-default-color',
    'default.background.color': '--avatar-default-background-color',
    'primary.color': '--avatar-primary-color',
    'primary.background.color': '--avatar-primary-background-color',
    'success.color': '--avatar-success-color',
    'success.background.color': '--avatar-success-background-color',
    'warning.color': '--avatar-warning-color',
    'warning.background.color': '--avatar-warning-background-color',
    'error.color': '--avatar-error-color',
    'error.background.color': '--avatar-error-background-color',
    'group.overlap': '--avatar-group-overlap',
    'group.transition': '--avatar-group-transition',
    'group.hover.translate.y': '--avatar-group-hover-translate-y',
    'group.item.ring.width': '--avatar-group-item-ring-width',
    'group.item.border.color': '--avatar-group-item-border-color'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, box-shadow 120ms cubic-bezier(0.4, 0, 0.2, 1), transform 120ms cubic-bezier(0.4, 0, 0.2, 1), background-color 120ms cubic-bezier(0.4, 0, 0.2, 1), color 120ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'size': {
        'small': {
            'value': `var(${vars['size.small.value']}, 28px)`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            }
        },
        'middle': {
            'value': `var(${vars['size.middle.value']}, 40px)`,
            'font': {
                'size': `var(${vars['size.middle.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        },
        'large': {
            'value': `var(${vars['size.large.value']}, 48px)`,
            'font': {
                'size': `var(${vars['size.large.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            }
        }
    },
    'icon': {
        'size': {
            'small': `var(${vars['icon.size.small']}, 14px)`,
            'middle': `var(${vars['icon.size.middle']}, 18px)`,
            'large': `var(${vars['icon.size.large']}, 22px)`
        }
    },
    'content': {
        'max-width': `var(${vars['content.max-width']}, 70%)`,
        'font': {
            'weight': `var(${vars['content.font.weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
        }
    },
    'shape': {
        'square': {
            'radius': `var(${vars['shape.square.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
        }
    },
    'border': {
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'hover': `var(${vars['border.hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'focus': {
        'ring': {
            'color': `var(${vars['focus.ring.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        }
    },
    'disabled': {
        'opacity': `var(${vars['disabled.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    },
    'default': {
        'color': `var(${vars['default.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': {
            'color': `var(${vars['default.background.color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        }
    },
    'primary': {
        'color': `var(${vars['primary.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'background': {
            'color': `var(${vars['primary.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        }
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`,
        'background': {
            'color': `var(${vars['success.background.color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`
        }
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`,
        'background': {
            'color': `var(${vars['warning.background.color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`
        }
    },
    'error': {
        'color': `var(${vars['error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`,
        'background': {
            'color': `var(${vars['error.background.color']}, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17))))`
        }
    },
    'group': {
        'overlap': `var(${vars['group.overlap']}, -8px)`,
        'transition': `var(${vars['group.transition']}, transform 180ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'hover': {
            'translate': {
                'y': `var(${vars['group.hover.translate.y']}, -2px)`
            }
        },
        'item': {
            'ring': {
                'width': `var(${vars['group.item.ring.width']}, 2px)`
            },
            'border': {
                'color': `var(${vars['group.item.border.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
            }
        }
    }
});

export default token;
