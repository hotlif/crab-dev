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
    'field.gap': '--text-edit-field-gap',
    'field.padding-inline': '--text-edit-field-padding-inline',
    'field.label.top': '--text-edit-field-label-top',
    'field.label.padding-inline': '--text-edit-field-label-padding-inline',
    'field.label.font-size': '--text-edit-field-label-font-size',
    'field.label.line-height': '--text-edit-field-label-line-height',
    'field.label.color': '--text-edit-field-label-color',
    'field.label.color-focus': '--text-edit-field-label-color-focus',
    'field.filled.label.top': '--text-edit-field-filled-label-top',
    'field.filled.input.padding-top': '--text-edit-field-filled-input-padding-top',
    'field.filled.background-color': '--text-edit-field-filled-background-color',
    'field.filled.background-color-hover': '--text-edit-field-filled-background-color-hover',
    'field.input.padding-top': '--text-edit-field-input-padding-top',
    'field.transition': '--text-edit-field-transition',
    'field.indicator.border-color': '--text-edit-field-indicator-border-color',
    'field.indicator.box-shadow-focus': '--text-edit-field-indicator-box-shadow-focus',
    'field.indicator.box-shadow-error': '--text-edit-field-indicator-box-shadow-error',
    'field.indicator.box-shadow-warning': '--text-edit-field-indicator-box-shadow-warning',
    'field.color-error': '--text-edit-field-color-error',
    'field.color-warning': '--text-edit-field-color-warning',
    'field.support.line-height': '--text-edit-field-support-line-height',
    'status.border-color-error': '--text-edit-status-border-color-error',
    'status.box-shadow-error': '--text-edit-status-box-shadow-error',
    'status.border-color-warning': '--text-edit-status-border-color-warning',
    'status.box-shadow-warning': '--text-edit-status-box-shadow-warning',
    'count.color': '--text-edit-count-color',
    'count.font-size': '--text-edit-count-font-size',
    'size.large.padding': '--text-edit-size-large-padding',
    'size.large.font-size': '--text-edit-size-large-font-size',
    'size.large.line-height': '--text-edit-size-large-line-height',
    'size.large.action.width': '--text-edit-size-large-action-width',
    'size.middle.padding': '--text-edit-size-middle-padding',
    'size.middle.font-size': '--text-edit-size-middle-font-size',
    'size.middle.line-height': '--text-edit-size-middle-line-height',
    'size.middle.action.width': '--text-edit-size-middle-action-width',
    'size.small.padding': '--text-edit-size-small-padding',
    'size.small.font-size': '--text-edit-size-small-font-size',
    'size.small.line-height': '--text-edit-size-small-line-height',
    'size.small.action.width': '--text-edit-size-small-action-width'
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
    'clear': {
        'width': `var(${vars['clear.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'height': `var(${vars['clear.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'touch': {
            'width': `var(${vars['clear.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'height': `var(${vars['clear.touch.height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'inset-block-start': `var(${vars['clear.inset-block-start']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'inset-inline-end': `var(${vars['clear.inset-inline-end']}, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`
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
    'field': {
        'gap': `var(${vars['field.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'padding-inline': `var(${vars['field.padding-inline']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'label': {
            'top': `var(${vars['field.label.top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
            'padding-inline': `var(${vars['field.label.padding-inline']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'font-size': `var(${vars['field.label.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['field.label.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`,
            'color': `var(${vars['field.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'color-focus': `var(${vars['field.label.color-focus']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'filled': {
            'label': {
                'top': `var(${vars['field.filled.label.top']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
            },
            'input': {
                'padding-top': `var(${vars['field.filled.input.padding-top']}, calc(var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) + var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)) * var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333))))`
            },
            'background-color': `var(${vars['field.filled.background-color']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
            'background-color-hover': `var(${vars['field.filled.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144)))))`
        },
        'input': {
            'padding-top': `var(${vars['field.input.padding-top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'transition': `var(${vars['field.transition']}, top var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), font-size var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
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
    },
    'status': {
        'border-color-error': `var(${vars['status.border-color-error']}, var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'box-shadow-error': `var(${vars['status.box-shadow-error']}, inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'border-color-warning': `var(${vars['status.border-color-warning']}, var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`,
        'box-shadow-warning': `var(${vars['status.box-shadow-warning']}, inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['count.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.large.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.large.action.width']}, var(--token-semantic-sizing-large-action, var(--token-global-size-48, 48px)))`
            }
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.middle.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.middle.action.width']}, var(--token-semantic-sizing-middle-action, var(--token-global-size-40, 40px)))`
            }
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, calc(var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) / 2) var(--token-semantic-space-control-padding-x-small, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
            'line-height': `var(${vars['size.small.line-height']}, calc(var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)) * var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5))))`,
            'action': {
                'width': `var(${vars['size.small.action.width']}, var(--token-semantic-sizing-small-action, var(--token-global-size-32, 32px)))`
            }
        }
    }
});

export default token;
