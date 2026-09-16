/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.outline-color-focus': '--text-edit-root-outline-color-focus',
    'root.outline-width-focus': '--text-edit-root-outline-width-focus',
    'root.outline-offset-focus': '--text-edit-root-outline-offset-focus',
    'root.opacity-disabled': '--text-edit-root-opacity-disabled',
    'root.touch.min-height': '--text-edit-root-touch-min-height',
    'root.transition': '--text-edit-root-transition',
    'root.border-radius': '--text-edit-root-border-radius',
    'root.border-width': '--text-edit-root-border-width',
    'root.border-style': '--text-edit-root-border-style',
    'root.border-color': '--text-edit-root-border-color',
    'root.border-color-hover': '--text-edit-root-border-color-hover',
    'root.border-color-focus': '--text-edit-root-border-color-focus',
    'root.box-shadow': '--text-edit-root-box-shadow',
    'root.box-shadow-focus-within': '--text-edit-root-box-shadow-focus-within',
    'root.background-color': '--text-edit-root-background-color',
    'clear.width': '--text-edit-clear-width',
    'clear.height': '--text-edit-clear-height',
    'clear.touch.width': '--text-edit-clear-touch-width',
    'clear.touch.height': '--text-edit-clear-touch-height',
    'clear.inset-block-start': '--text-edit-clear-inset-block-start',
    'clear.inset-inline-end': '--text-edit-clear-inset-inline-end',
    'text.color': '--text-edit-text-color',
    'placeholder.color': '--text-edit-placeholder-color',
    'icon.color': '--text-edit-icon-color',
    'icon.gap': '--text-edit-icon-gap',
    'status.border-color-error': '--text-edit-status-border-color-error',
    'status.box-shadow-error': '--text-edit-status-box-shadow-error',
    'status.border-color-warning': '--text-edit-status-border-color-warning',
    'status.box-shadow-warning': '--text-edit-status-box-shadow-warning',
    'count.color': '--text-edit-count-color',
    'count.font-size': '--text-edit-count-font-size',
    'size.large.padding': '--text-edit-size-large-padding',
    'size.large.font-size': '--text-edit-size-large-font-size',
    'size.large.line-height': '--text-edit-size-large-line-height',
    'size.middle.padding': '--text-edit-size-middle-padding',
    'size.middle.font-size': '--text-edit-size-middle-font-size',
    'size.middle.line-height': '--text-edit-size-middle-line-height',
    'size.small.padding': '--text-edit-size-small-padding',
    'size.small.font-size': '--text-edit-size-small-font-size',
    'size.small.line-height': '--text-edit-size-small-line-height'
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
        'transition': `var(${vars['root.transition']}, var(--text-edit-transition, border-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), opacity var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--text-edit-border-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`,
        'border-width': `var(${vars['root.border-width']}, var(--text-edit-border-width, 1px))`,
        'border-style': `var(${vars['root.border-style']}, var(--text-edit-border-style, solid))`,
        'border-color': `var(${vars['root.border-color']}, var(--text-edit-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--text-edit-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`,
        'border-color-focus': `var(${vars['root.border-color-focus']}, var(--text-edit-border-color-focus, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--text-edit-box-shadow, var(--text-edit-box-shadow-default, none)))`,
        'box-shadow-focus-within': `var(${vars['root.box-shadow-focus-within']}, var(--text-edit-box-shadow-focus-within, var(--token-semantic-shadow-focus-ring, 0 0 0 3px var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`,
        'background-color': `var(${vars['root.background-color']}, var(--text-edit-background-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`
    },
    'clear': {
        'width': `var(${vars['clear.width']}, 24px)`,
        'height': `var(${vars['clear.height']}, 24px)`,
        'touch': {
            'width': `var(${vars['clear.touch.width']}, 44px)`,
            'height': `var(${vars['clear.touch.height']}, 44px)`
        },
        'inset-block-start': `var(${vars['clear.inset-block-start']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'inset-inline-end': `var(${vars['clear.inset-inline-end']}, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`
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
        'border-color-error': `var(${vars['status.border-color-error']}, var(--text-edit-status-error-border-color, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25))))))`,
        'box-shadow-error': `var(${vars['status.box-shadow-error']}, var(--text-edit-status-error-box-shadow-focus-within, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))) 25%, transparent)))`,
        'border-color-warning': `var(${vars['status.border-color-warning']}, var(--text-edit-status-warning-border-color, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71))))))`,
        'box-shadow-warning': `var(${vars['status.box-shadow-warning']}, var(--text-edit-status-warning-box-shadow-focus-within, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))) 25%, transparent)))`
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'font-size': `var(${vars['count.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    }
});

export default token;
