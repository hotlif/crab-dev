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
    'size.large.action.width': '--line-edit-size-large-action-width',
    'size.middle.height': '--line-edit-size-middle-height',
    'size.middle.padding': '--line-edit-size-middle-padding',
    'size.middle.font-size': '--line-edit-size-middle-font-size',
    'size.middle.line-height': '--line-edit-size-middle-line-height',
    'size.middle.action.width': '--line-edit-size-middle-action-width',
    'size.small.height': '--line-edit-size-small-height',
    'size.small.padding': '--line-edit-size-small-padding',
    'size.small.font-size': '--line-edit-size-small-font-size',
    'size.small.line-height': '--line-edit-size-small-line-height',
    'size.small.action.width': '--line-edit-size-small-action-width',
    'field.gap': '--line-edit-field-gap',
    'field.padding-inline': '--line-edit-field-padding-inline',
    'field.label.top': '--line-edit-field-label-top',
    'field.label.padding-inline': '--line-edit-field-label-padding-inline',
    'field.label.font-size': '--line-edit-field-label-font-size',
    'field.label.line-height': '--line-edit-field-label-line-height',
    'field.label.color': '--line-edit-field-label-color',
    'field.label.color-focus': '--line-edit-field-label-color-focus',
    'field.prefix.left': '--line-edit-field-prefix-left',
    'field.input.padding-top': '--line-edit-field-input-padding-top',
    'field.transition': '--line-edit-field-transition',
    'field.filled.background-color': '--line-edit-field-filled-background-color',
    'field.filled.background-color-hover': '--line-edit-field-filled-background-color-hover',
    'field.indicator.border-color': '--line-edit-field-indicator-border-color',
    'field.indicator.box-shadow-focus': '--line-edit-field-indicator-box-shadow-focus',
    'field.indicator.box-shadow-error': '--line-edit-field-indicator-box-shadow-error',
    'field.indicator.box-shadow-warning': '--line-edit-field-indicator-box-shadow-warning',
    'field.color-error': '--line-edit-field-color-error',
    'field.color-warning': '--line-edit-field-color-warning',
    'field.support.line-height': '--line-edit-field-support-line-height'
});

const token = defineTokens({
    'root': {
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'touch': {
            'min-height': `var(${vars['root.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'transition': `var(${vars['root.transition']}, border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), opacity var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px)))`,
        'border-width': `var(${vars['root.border-width']}, 1px)`,
        'border-style': `var(${vars['root.border-style']}, solid)`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'border-color-focus': `var(${vars['root.border-color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, none)`,
        'box-shadow-focus-within': `var(${vars['root.box-shadow-focus-within']}, inset 0 0 0 2px var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'background-color': `var(${vars['root.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
    },
    'action': {
        'min-width': `var(${vars['action.min-width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'height': `var(${vars['action.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'opacity-disabled': `var(${vars['action.opacity-disabled']}, 1)`,
        'touch': {
            'min-width': `var(${vars['action.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'height': `var(${vars['action.touch.height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'placeholder': {
        'color': `var(${vars['placeholder.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'status': {
        'border-color-error': `var(${vars['status.border-color-error']}, var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'box-shadow-error': `var(${vars['status.box-shadow-error']}, inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'warning': {
            'border-color': `var(${vars['status.warning.border-color']}, var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`,
            'box-shadow-focus-within': `var(${vars['status.warning.box-shadow-focus-within']}, inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['count.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, var(--token-semantic-sizing-large-field, var(--token-global-size-64, 64px)))`,
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.large.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.large.action.width']}, var(--token-semantic-sizing-large-action, var(--token-global-size-48, 48px)))`
            }
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, var(--token-semantic-sizing-middle-field, var(--token-global-size-56, 56px)))`,
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.middle.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.middle.action.width']}, var(--token-semantic-sizing-middle-action, var(--token-global-size-40, 40px)))`
            }
        },
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-sizing-small-field, var(--token-global-size-48, 48px)))`,
            'padding': `var(${vars['size.small.padding']}, 0 var(--token-semantic-space-control-padding-x-small, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.small.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.small.action.width']}, var(--token-semantic-sizing-small-action, var(--token-global-size-32, 32px)))`
            }
        }
    },
    'field': {
        'gap': `var(${vars['field.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'padding-inline': `var(${vars['field.padding-inline']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'label': {
            'top': `var(${vars['field.label.top']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'padding-inline': `var(${vars['field.label.padding-inline']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'font-size': `var(${vars['field.label.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['field.label.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`,
            'color': `var(${vars['field.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'color-focus': `var(${vars['field.label.color-focus']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'prefix': {
            'left': `var(${vars['field.prefix.left']}, calc(var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) + var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) + var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px))))`
        },
        'input': {
            'padding-top': `var(${vars['field.input.padding-top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'transition': `var(${vars['field.transition']}, top var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), font-size var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'filled': {
            'background-color': `var(${vars['field.filled.background-color']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
            'background-color-hover': `var(${vars['field.filled.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144)))))`
        },
        'indicator': {
            'border-color': `var(${vars['field.indicator.border-color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'box-shadow-focus': `var(${vars['field.indicator.box-shadow-focus']}, inset 0 -2px 0 var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'box-shadow-error': `var(${vars['field.indicator.box-shadow-error']}, inset 0 -2px 0 var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
            'box-shadow-warning': `var(${vars['field.indicator.box-shadow-warning']}, inset 0 -2px 0 var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        },
        'color-error': `var(${vars['field.color-error']}, var(--token-semantic-color-feedback-error-text, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))`,
        'color-warning': `var(${vars['field.color-warning']}, var(--token-semantic-color-feedback-warning-text, var(--token-global-amber-900, oklch(0.414 0.112 68))))`,
        'support': {
            'line-height': `var(${vars['field.support.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`
        }
    }
});

export default token;
