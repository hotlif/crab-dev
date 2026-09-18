/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.outline-color-focus': '--checkbox-root-outline-color-focus',
    'root.outline-width-focus': '--checkbox-root-outline-width-focus',
    'root.outline-offset-focus': '--checkbox-root-outline-offset-focus',
    'root.touch.min-width': '--checkbox-root-touch-min-width',
    'root.touch.min-height': '--checkbox-root-touch-min-height',
    'root.line-height': '--checkbox-root-line-height',
    'root.opacity-disabled': '--checkbox-root-opacity-disabled',
    'control.transition': '--checkbox-control-transition',
    'control.target.width': '--checkbox-control-target-width',
    'control.background-color-error': '--checkbox-control-background-color-error',
    'control.border-color-error': '--checkbox-control-border-color-error',
    'control.border-width': '--checkbox-control-border-width',
    'control.border-style': '--checkbox-control-border-style',
    'control.border-color': '--checkbox-control-border-color',
    'control.border-color-hover': '--checkbox-control-border-color-hover',
    'control.background-color': '--checkbox-control-background-color',
    'control.checked.background-color': '--checkbox-control-checked-background-color',
    'control.checked.background-color-hover': '--checkbox-control-checked-background-color-hover',
    'control.checked.border-color': '--checkbox-control-checked-border-color',
    'control.indeterminate.background-color': '--checkbox-control-indeterminate-background-color',
    'control.indeterminate.border-color': '--checkbox-control-indeterminate-border-color',
    'control.background-color-disabled': '--checkbox-control-background-color-disabled',
    'control.selection.background-color-disabled': '--checkbox-control-selection-background-color-disabled',
    'control.border-color-disabled': '--checkbox-control-border-color-disabled',
    'icon.color-error': '--checkbox-icon-color-error',
    'icon.stroke-width': '--checkbox-icon-stroke-width',
    'icon.transition': '--checkbox-icon-transition',
    'icon.scale-hidden': '--checkbox-icon-scale-hidden',
    'icon.scale': '--checkbox-icon-scale',
    'icon.checked.color': '--checkbox-icon-checked-color',
    'icon.indeterminate.color': '--checkbox-icon-indeterminate-color',
    'icon.color-disabled': '--checkbox-icon-color-disabled',
    'state-layer.width': '--checkbox-state-layer-width',
    'state-layer.border-radius': '--checkbox-state-layer-border-radius',
    'state-layer.color': '--checkbox-state-layer-color',
    'state-layer.color-selected': '--checkbox-state-layer-color-selected',
    'state-layer.color-error': '--checkbox-state-layer-color-error',
    'state-layer.opacity-hover': '--checkbox-state-layer-opacity-hover',
    'state-layer.opacity-focus': '--checkbox-state-layer-opacity-focus',
    'state-layer.opacity-active': '--checkbox-state-layer-opacity-active',
    'state-layer.transition': '--checkbox-state-layer-transition',
    'label.gap': '--checkbox-label-gap',
    'label.color': '--checkbox-label-color',
    'label.color-disabled': '--checkbox-label-color-disabled',
    'group.gap': '--checkbox-group-gap',
    'size.large.box.width': '--checkbox-size-large-box-width',
    'size.large.box.border-radius': '--checkbox-size-large-box-border-radius',
    'size.large.icon.width': '--checkbox-size-large-icon-width',
    'size.large.label.font-size': '--checkbox-size-large-label-font-size',
    'size.large.indeterminate.width': '--checkbox-size-large-indeterminate-width',
    'size.large.indeterminate.height': '--checkbox-size-large-indeterminate-height',
    'size.middle.box.width': '--checkbox-size-middle-box-width',
    'size.middle.box.border-radius': '--checkbox-size-middle-box-border-radius',
    'size.middle.icon.width': '--checkbox-size-middle-icon-width',
    'size.middle.label.font-size': '--checkbox-size-middle-label-font-size',
    'size.middle.indeterminate.width': '--checkbox-size-middle-indeterminate-width',
    'size.middle.indeterminate.height': '--checkbox-size-middle-indeterminate-height',
    'size.small.box.width': '--checkbox-size-small-box-width',
    'size.small.box.border-radius': '--checkbox-size-small-box-border-radius',
    'size.small.icon.width': '--checkbox-size-small-icon-width',
    'size.small.label.font-size': '--checkbox-size-small-label-font-size',
    'size.small.indeterminate.width': '--checkbox-size-small-indeterminate-width',
    'size.small.indeterminate.height': '--checkbox-size-small-indeterminate-height'
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
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, 0.38)`
    },
    'control': {
        'transition': `var(${vars['control.transition']}, var(--checkbox-root-transition, var(--checkbox-transition, background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), border-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))))`,
        'target': {
            'width': `var(${vars['control.target.width']}, var(--checkbox-control-target-size, 40px))`
        },
        'background-color-error': `var(${vars['control.background-color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`,
        'border-color-error': `var(${vars['control.border-color-error']}, var(--token-semantic-color-border-error, var(--token-global-red-600, oklch(0.577 0.245 25))))`,
        'border-width': `var(${vars['control.border-width']}, var(--checkbox-root-border-width, var(--checkbox-border-width, 2px)))`,
        'border-style': `var(${vars['control.border-style']}, var(--checkbox-root-border-style, var(--checkbox-border-style, solid)))`,
        'border-color': `var(${vars['control.border-color']}, var(--checkbox-root-border-color, var(--checkbox-border-color, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))))`,
        'border-color-hover': `var(${vars['control.border-color-hover']}, var(--checkbox-root-border-color-hover, var(--checkbox-border-color-hover, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))))`,
        'background-color': `var(${vars['control.background-color']}, var(--checkbox-root-background-color, var(--checkbox-background-color, transparent)))`,
        'checked': {
            'background-color': `var(${vars['control.checked.background-color']}, var(--checkbox-root-background-color-checked, var(--checkbox-background-color-checked, var(--checkbox-checked-background-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`,
            'background-color-hover': `var(${vars['control.checked.background-color-hover']}, var(--checkbox-root-background-color-hover-checked, var(--checkbox-background-color-hover-checked, var(--checkbox-checked-background-color-hover, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`,
            'border-color': `var(${vars['control.checked.border-color']}, var(--checkbox-root-border-color-checked, var(--checkbox-border-color-checked, var(--checkbox-checked-border-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`
        },
        'indeterminate': {
            'background-color': `var(${vars['control.indeterminate.background-color']}, var(--checkbox-root-background-color-indeterminate, var(--checkbox-background-color-indeterminate, var(--checkbox-indeterminate-background-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`,
            'border-color': `var(${vars['control.indeterminate.border-color']}, var(--checkbox-root-border-color-indeterminate, var(--checkbox-border-color-indeterminate, var(--checkbox-indeterminate-border-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`
        },
        'background-color-disabled': `var(${vars['control.background-color-disabled']}, var(--checkbox-root-background-color-disabled, var(--checkbox-background-color-disabled, var(--checkbox-disabled-background-color, transparent))))`,
        'selection': {
            'background-color-disabled': `var(${vars['control.selection.background-color-disabled']}, var(--checkbox-control-background-color-disabled-selected, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
        },
        'border-color-disabled': `var(${vars['control.border-color-disabled']}, var(--checkbox-root-border-color-disabled, var(--checkbox-border-color-disabled, var(--checkbox-disabled-border-color, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))))`
    },
    'icon': {
        'color-error': `var(${vars['icon.color-error']}, var(--token-semantic-color-feedback-error-on-solid, var(--token-global-white, oklch(1.000 0 0))))`,
        'stroke-width': `var(${vars['icon.stroke-width']}, 2px)`,
        'transition': `var(${vars['icon.transition']}, opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), scale var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`,
        'scale-hidden': `var(${vars['icon.scale-hidden']}, 0.6)`,
        'scale': `var(${vars['icon.scale']}, var(--checkbox-icon-scale-visible, 1))`,
        'checked': {
            'color': `var(${vars['icon.checked.color']}, var(--checkbox-icon-color-checked, var(--checkbox-checked-icon-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))))`
        },
        'indeterminate': {
            'color': `var(${vars['icon.indeterminate.color']}, var(--checkbox-icon-color-indeterminate, var(--checkbox-indeterminate-icon-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))))`
        },
        'color-disabled': `var(${vars['icon.color-disabled']}, var(--checkbox-disabled-icon-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`
    },
    'state-layer': {
        'width': `var(${vars['state-layer.width']}, var(--checkbox-state-layer-size, 40px))`,
        'border-radius': `var(${vars['state-layer.border-radius']}, var(--checkbox-state-layer-radius, var(--token-semantic-radius-pill, var(--token-global-radius-full, 9999px))))`,
        'color': `var(${vars['state-layer.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-selected': `var(${vars['state-layer.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'color-error': `var(${vars['state-layer.color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`,
        'opacity-hover': `var(${vars['state-layer.opacity-hover']}, 0.08)`,
        'opacity-focus': `var(${vars['state-layer.opacity-focus']}, 0.12)`,
        'opacity-active': `var(${vars['state-layer.opacity-active']}, var(--checkbox-state-layer-opacity-pressed, 0.12))`,
        'transition': `var(${vars['state-layer.transition']}, opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`
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
                'width': `var(${vars['size.large.box.width']}, var(--checkbox-size-large-box-size, 20px))`,
                'border-radius': `var(${vars['size.large.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.large.icon.width']}, var(--checkbox-size-large-icon-size, 20px))`
            },
            'label': {
                'font-size': `var(${vars['size.large.label.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.large.indeterminate.width']}, 10px)`,
                'height': `var(${vars['size.large.indeterminate.height']}, 2px)`
            }
        },
        'middle': {
            'box': {
                'width': `var(${vars['size.middle.box.width']}, var(--checkbox-size-middle-box-size, 18px))`,
                'border-radius': `var(${vars['size.middle.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.middle.icon.width']}, var(--checkbox-size-middle-icon-size, 18px))`
            },
            'label': {
                'font-size': `var(${vars['size.middle.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.middle.indeterminate.width']}, 10px)`,
                'height': `var(${vars['size.middle.indeterminate.height']}, 2px)`
            }
        },
        'small': {
            'box': {
                'width': `var(${vars['size.small.box.width']}, var(--checkbox-size-small-box-size, 16px))`,
                'border-radius': `var(${vars['size.small.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.small.icon.width']}, var(--checkbox-size-small-icon-size, 16px))`
            },
            'label': {
                'font-size': `var(${vars['size.small.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.small.indeterminate.width']}, 8px)`,
                'height': `var(${vars['size.small.indeterminate.height']}, 2px)`
            }
        }
    }
});

export default token;
