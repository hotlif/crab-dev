/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.outline-color-focus': '--radio-root-outline-color-focus',
    'root.outline-width-focus': '--radio-root-outline-width-focus',
    'root.outline-offset-focus': '--radio-root-outline-offset-focus',
    'root.touch.min-width': '--radio-root-touch-min-width',
    'root.touch.min-height': '--radio-root-touch-min-height',
    'root.line-height': '--radio-root-line-height',
    'root.opacity-disabled': '--radio-root-opacity-disabled',
    'control.transition': '--radio-control-transition',
    'control.target.width': '--radio-control-target-width',
    'control.border-color-error': '--radio-control-border-color-error',
    'control.border-width': '--radio-control-border-width',
    'control.border-style': '--radio-control-border-style',
    'control.border-color': '--radio-control-border-color',
    'control.border-color-hover': '--radio-control-border-color-hover',
    'control.background-color': '--radio-control-background-color',
    'control.checked.background-color': '--radio-control-checked-background-color',
    'control.checked.background-color-hover': '--radio-control-checked-background-color-hover',
    'control.checked.border-color': '--radio-control-checked-border-color',
    'control.background-color-disabled': '--radio-control-background-color-disabled',
    'control.border-color-disabled': '--radio-control-border-color-disabled',
    'dot.color-error': '--radio-dot-color-error',
    'dot.checked.color': '--radio-dot-checked-color',
    'dot.scale-hidden': '--radio-dot-scale-hidden',
    'dot.scale': '--radio-dot-scale',
    'dot.transition': '--radio-dot-transition',
    'dot.color-disabled': '--radio-dot-color-disabled',
    'state-layer.width': '--radio-state-layer-width',
    'state-layer.border-radius': '--radio-state-layer-border-radius',
    'state-layer.color': '--radio-state-layer-color',
    'state-layer.color-selected': '--radio-state-layer-color-selected',
    'state-layer.color-error': '--radio-state-layer-color-error',
    'state-layer.opacity-hover': '--radio-state-layer-opacity-hover',
    'state-layer.opacity-focus': '--radio-state-layer-opacity-focus',
    'state-layer.opacity-active': '--radio-state-layer-opacity-active',
    'state-layer.transition': '--radio-state-layer-transition',
    'label.gap': '--radio-label-gap',
    'label.color': '--radio-label-color',
    'label.color-disabled': '--radio-label-color-disabled',
    'group.gap': '--radio-group-gap',
    'size.large.box.width': '--radio-size-large-box-width',
    'size.large.dot.width': '--radio-size-large-dot-width',
    'size.large.label.font-size': '--radio-size-large-label-font-size',
    'size.middle.box.width': '--radio-size-middle-box-width',
    'size.middle.dot.width': '--radio-size-middle-dot-width',
    'size.middle.label.font-size': '--radio-size-middle-label-font-size',
    'size.small.box.width': '--radio-size-small-box-width',
    'size.small.dot.width': '--radio-size-small-dot-width',
    'size.small.label.font-size': '--radio-size-small-label-font-size'
});

const token = defineTokens({
    'root': {
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'touch': {
            'min-width': `var(${vars['root.touch.min-width']}, 48px)`,
            'min-height': `var(${vars['root.touch.min-height']}, 48px)`
        },
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-font-line-height-body, var(--token-global-line-height-normal, 1.5)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    },
    'control': {
        'transition': `var(${vars['control.transition']}, var(--radio-root-transition, var(--radio-transition, background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), border-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))))`,
        'target': {
            'width': `var(${vars['control.target.width']}, var(--radio-control-target-size, 40px))`
        },
        'border-color-error': `var(${vars['control.border-color-error']}, var(--token-semantic-color-border-error, var(--token-global-red-600, oklch(0.577 0.245 25))))`,
        'border-width': `var(${vars['control.border-width']}, var(--radio-root-border-width, var(--radio-border-width, 2px)))`,
        'border-style': `var(${vars['control.border-style']}, var(--radio-root-border-style, var(--radio-border-style, solid)))`,
        'border-color': `var(${vars['control.border-color']}, var(--radio-root-border-color, var(--radio-border-color, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))))`,
        'border-color-hover': `var(${vars['control.border-color-hover']}, var(--radio-root-border-color-hover, var(--radio-border-color-hover, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))))`,
        'background-color': `var(${vars['control.background-color']}, var(--radio-root-background-color, var(--radio-background-color, transparent)))`,
        'checked': {
            'background-color': `var(${vars['control.checked.background-color']}, var(--radio-root-background-color-checked, var(--radio-background-color-checked, var(--radio-checked-background-color, transparent))))`,
            'background-color-hover': `var(${vars['control.checked.background-color-hover']}, var(--radio-root-background-color-hover-checked, var(--radio-background-color-hover-checked, var(--radio-checked-background-color-hover, transparent))))`,
            'border-color': `var(${vars['control.checked.border-color']}, var(--radio-root-border-color-checked, var(--radio-border-color-checked, var(--radio-checked-border-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`
        },
        'background-color-disabled': `var(${vars['control.background-color-disabled']}, var(--radio-root-background-color-disabled, var(--radio-background-color-disabled, var(--radio-disabled-background-color, transparent))))`,
        'border-color-disabled': `var(${vars['control.border-color-disabled']}, var(--radio-root-border-color-disabled, var(--radio-border-color-disabled, var(--radio-disabled-border-color, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))))`
    },
    'dot': {
        'color-error': `var(${vars['dot.color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`,
        'checked': {
            'color': `var(${vars['dot.checked.color']}, var(--radio-dot-color-checked, var(--radio-checked-dot-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`
        },
        'scale-hidden': `var(${vars['dot.scale-hidden']}, 0.6)`,
        'scale': `var(${vars['dot.scale']}, var(--radio-dot-scale-visible, 1))`,
        'transition': `var(${vars['dot.transition']}, opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), scale var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`,
        'color-disabled': `var(${vars['dot.color-disabled']}, var(--radio-disabled-dot-color, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
    },
    'state-layer': {
        'width': `var(${vars['state-layer.width']}, var(--radio-state-layer-size, 40px))`,
        'border-radius': `var(${vars['state-layer.border-radius']}, var(--radio-state-layer-radius, var(--token-semantic-radius-pill, var(--token-global-radius-full, 9999px))))`,
        'color': `var(${vars['state-layer.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-selected': `var(${vars['state-layer.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'color-error': `var(${vars['state-layer.color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`,
        'opacity-hover': `var(${vars['state-layer.opacity-hover']}, 0.08)`,
        'opacity-focus': `var(${vars['state-layer.opacity-focus']}, 0.12)`,
        'opacity-active': `var(${vars['state-layer.opacity-active']}, var(--radio-state-layer-opacity-pressed, 0.12))`,
        'transition': `var(${vars['state-layer.transition']}, opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'size': {
        'large': {
            'box': {
                'width': `var(${vars['size.large.box.width']}, var(--radio-size-large-box-size, 24px))`
            },
            'dot': {
                'width': `var(${vars['size.large.dot.width']}, var(--radio-size-large-dot-size, 12px))`
            },
            'label': {
                'font-size': `var(${vars['size.large.label.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            }
        },
        'middle': {
            'box': {
                'width': `var(${vars['size.middle.box.width']}, var(--radio-size-middle-box-size, 20px))`
            },
            'dot': {
                'width': `var(${vars['size.middle.dot.width']}, var(--radio-size-middle-dot-size, 10px))`
            },
            'label': {
                'font-size': `var(${vars['size.middle.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        },
        'small': {
            'box': {
                'width': `var(${vars['size.small.box.width']}, var(--radio-size-small-box-size, 16px))`
            },
            'dot': {
                'width': `var(${vars['size.small.dot.width']}, var(--radio-size-small-dot-size, 8px))`
            },
            'label': {
                'font-size': `var(${vars['size.small.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        }
    }
});

export default token;
