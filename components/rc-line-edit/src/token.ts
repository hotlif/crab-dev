/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.outline-color-focus': '--line-edit-root-outline-color-focus',
    'root.outline-width-focus': '--line-edit-root-outline-width-focus',
    'root.outline-offset-focus': '--line-edit-root-outline-offset-focus',
    'root.opacity-disabled': '--line-edit-root-opacity-disabled',
    'root.touch.min-height': '--line-edit-root-touch-min-height',
    'root.transition': '--line-edit-root-transition',
    'root.border-radius': '--line-edit-root-border-radius',
    'root.border-width': '--line-edit-root-border-width',
    'root.border-style': '--line-edit-root-border-style',
    'root.border-color': '--line-edit-root-border-color',
    'root.border-color-hover': '--line-edit-root-border-color-hover',
    'root.border-color-focus': '--line-edit-root-border-color-focus',
    'root.box-shadow': '--line-edit-root-box-shadow',
    'root.box-shadow-focus-within': '--line-edit-root-box-shadow-focus-within',
    'root.background-color': '--line-edit-root-background-color',
    'action.min-width': '--line-edit-action-min-width',
    'action.height': '--line-edit-action-height',
    'action.opacity-disabled': '--line-edit-action-opacity-disabled',
    'action.touch.min-width': '--line-edit-action-touch-min-width',
    'action.touch.height': '--line-edit-action-touch-height',
    'text.color': '--line-edit-text-color',
    'placeholder.color': '--line-edit-placeholder-color',
    'icon.color': '--line-edit-icon-color',
    'icon.gap': '--line-edit-icon-gap',
    'status.border-color-error': '--line-edit-status-border-color-error',
    'status.box-shadow-error': '--line-edit-status-box-shadow-error',
    'status.warning.border-color': '--line-edit-status-warning-border-color',
    'status.warning.box-shadow-focus-within': '--line-edit-status-warning-box-shadow-focus-within',
    'count.color': '--line-edit-count-color',
    'count.font-size': '--line-edit-count-font-size',
    'size.large.height': '--line-edit-size-large-height',
    'size.large.padding': '--line-edit-size-large-padding',
    'size.large.font-size': '--line-edit-size-large-font-size',
    'size.large.line-height': '--line-edit-size-large-line-height',
    'size.middle.height': '--line-edit-size-middle-height',
    'size.middle.padding': '--line-edit-size-middle-padding',
    'size.middle.font-size': '--line-edit-size-middle-font-size',
    'size.middle.line-height': '--line-edit-size-middle-line-height',
    'size.small.height': '--line-edit-size-small-height',
    'size.small.padding': '--line-edit-size-small-padding',
    'size.small.font-size': '--line-edit-size-small-font-size',
    'size.small.line-height': '--line-edit-size-small-line-height'
});

const token = defineTokens({
    'root': {
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`,
        'touch': {
            'min-height': `var(${vars['root.touch.min-height']}, 44px)`
        },
        'transition': `var(${vars['root.transition']}, var(--line-edit-transition, border-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--line-edit-border-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`,
        'border-width': `var(${vars['root.border-width']}, var(--line-edit-border-width, 1px))`,
        'border-style': `var(${vars['root.border-style']}, var(--line-edit-border-style, solid))`,
        'border-color': `var(${vars['root.border-color']}, var(--line-edit-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--line-edit-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`,
        'border-color-focus': `var(${vars['root.border-color-focus']}, var(--line-edit-border-color-focus, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--line-edit-box-shadow, var(--line-edit-box-shadow-default, none)))`,
        'box-shadow-focus-within': `var(${vars['root.box-shadow-focus-within']}, var(--line-edit-box-shadow-focus-within, var(--token-semantic-shadow-focus-ring, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))) 20%, transparent))))`,
        'background-color': `var(${vars['root.background-color']}, var(--line-edit-background-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`
    },
    'action': {
        'min-width': `var(${vars['action.min-width']}, 24px)`,
        'height': `var(${vars['action.height']}, 24px)`,
        'opacity-disabled': `var(${vars['action.opacity-disabled']}, 1)`,
        'touch': {
            'min-width': `var(${vars['action.touch.min-width']}, 44px)`,
            'height': `var(${vars['action.touch.height']}, 44px)`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'placeholder': {
        'color': `var(${vars['placeholder.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'status': {
        'border-color-error': `var(${vars['status.border-color-error']}, var(--line-edit-status-error-border-color, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25))))))`,
        'box-shadow-error': `var(${vars['status.box-shadow-error']}, var(--line-edit-status-error-box-shadow-focus-within, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))) 25%, transparent)))`,
        'warning': {
            'border-color': `var(${vars['status.warning.border-color']}, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))))`,
            'box-shadow-focus-within': `var(${vars['status.warning.box-shadow-focus-within']}, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))) 25%, transparent))`
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'font-size': `var(${vars['count.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'padding': `var(${vars['size.small.padding']}, 0 var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    }
});

export default token;
