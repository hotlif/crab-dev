/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'option.checkbox.width': '--select-option-checkbox-width',
    'option.background-color-hover': '--select-option-background-color-hover',
    'option.color-selected': '--select-option-color-selected',
    'option.background-color-selected': '--select-option-background-color-selected',
    'option.color-disabled': '--select-option-color-disabled',
    'option.highlight.background-color': '--select-option-highlight-background-color',
    'option.background-color-active': '--select-option-background-color-active',
    'option.height': '--select-option-height',
    'option.padding-block': '--select-option-padding-block',
    'option.font-size': '--select-option-font-size',
    'option.line-height': '--select-option-line-height',
    'root.transition': '--select-root-transition',
    'root.opacity-disabled': '--select-root-opacity-disabled',
    'root.touch.min-height': '--select-root-touch-min-height',
    'root.outline-width-focus': '--select-root-outline-width-focus',
    'root.outline-offset-focus': '--select-root-outline-offset-focus',
    'root.border-width': '--select-root-border-width',
    'root.border-style': '--select-root-border-style',
    'root.border-color': '--select-root-border-color',
    'root.border-color-hover': '--select-root-border-color-hover',
    'root.border-color-focus': '--select-root-border-color-focus',
    'root.border-color-error': '--select-root-border-color-error',
    'root.border-color-warning': '--select-root-border-color-warning',
    'root.border-radius': '--select-root-border-radius',
    'root.background-color': '--select-root-background-color',
    'root.background-color-disabled': '--select-root-background-color-disabled',
    'root.box-shadow': '--select-root-box-shadow',
    'root.box-shadow-focus': '--select-root-box-shadow-focus',
    'root.validation.box-shadow-error': '--select-root-validation-box-shadow-error',
    'root.validation.box-shadow-warning': '--select-root-validation-box-shadow-warning',
    'root.color-loading': '--select-root-color-loading',
    'motion.interaction.transition': '--select-motion-interaction-transition',
    'motion.spatial.transition': '--select-motion-spatial-transition',
    'text.color': '--select-text-color',
    'text.color-placeholder': '--select-text-color-placeholder',
    'text.color-disabled': '--select-text-color-disabled',
    'tag.background-color': '--select-tag-background-color',
    'tag.color': '--select-tag-color',
    'tag.close.color-hover': '--select-tag-close-color-hover',
    'clear.color': '--select-clear-color',
    'clear.color-hover': '--select-clear-color-hover',
    'clear.width': '--select-clear-width',
    'clear.height': '--select-clear-height',
    'clear.touch.width': '--select-clear-touch-width',
    'clear.box-shadow-focus': '--select-clear-box-shadow-focus',
    'icon.width': '--select-icon-width',
    'icon.color': '--select-icon-color',
    'field.gap': '--select-field-gap',
    'field.padding-inline': '--select-field-padding-inline',
    'field.label.top': '--select-field-label-top',
    'field.label.padding-inline': '--select-field-label-padding-inline',
    'field.label.font-size': '--select-field-label-font-size',
    'field.label.line-height': '--select-field-label-line-height',
    'field.label.color': '--select-field-label-color',
    'field.label.color-focus': '--select-field-label-color-focus',
    'field.input.padding-top': '--select-field-input-padding-top',
    'field.transition': '--select-field-transition',
    'field.filled.background-color': '--select-field-filled-background-color',
    'field.filled.background-color-hover': '--select-field-filled-background-color-hover',
    'field.indicator.border-color': '--select-field-indicator-border-color',
    'field.indicator.box-shadow-focus': '--select-field-indicator-box-shadow-focus',
    'field.indicator.box-shadow-error': '--select-field-indicator-box-shadow-error',
    'field.indicator.box-shadow-warning': '--select-field-indicator-box-shadow-warning',
    'field.color-error': '--select-field-color-error',
    'field.color-warning': '--select-field-color-warning',
    'field.support.line-height': '--select-field-support-line-height',
    'group.color': '--select-group-color',
    'group.font-size': '--select-group-font-size',
    'size.large.height': '--select-size-large-height',
    'size.large.padding': '--select-size-large-padding',
    'size.large.font-size': '--select-size-large-font-size',
    'size.large.line-height': '--select-size-large-line-height',
    'size.large.action.width': '--select-size-large-action-width',
    'size.middle.height': '--select-size-middle-height',
    'size.middle.padding': '--select-size-middle-padding',
    'size.middle.font-size': '--select-size-middle-font-size',
    'size.middle.line-height': '--select-size-middle-line-height',
    'size.middle.action.width': '--select-size-middle-action-width',
    'size.small.height': '--select-size-small-height',
    'size.small.padding': '--select-size-small-padding',
    'size.small.font-size': '--select-size-small-font-size',
    'size.small.line-height': '--select-size-small-line-height',
    'size.small.action.width': '--select-size-small-action-width',
    'dropdown.margin': '--select-dropdown-margin',
    'dropdown.max-height': '--select-dropdown-max-height',
    'dropdown.padding': '--select-dropdown-padding',
    'dropdown.option.padding': '--select-dropdown-option-padding',
    'dropdown.border-radius': '--select-dropdown-border-radius'
});

const token = defineTokens({
    'option': {
        'checkbox': {
            'width': `var(${vars['option.checkbox.width']}, 18px)`
        },
        'background-color-hover': `var(${vars['option.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'color-selected': `var(${vars['option.color-selected']}, var(--token-semantic-color-brand-on-container, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811)))))`,
        'background-color-selected': `var(${vars['option.background-color-selected']}, var(--token-semantic-color-brand-container, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510)))))`,
        'color-disabled': `var(${vars['option.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'highlight': {
            'background-color': `var(${vars['option.highlight.background-color']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`
        },
        'background-color-active': `var(${vars['option.background-color-active']}, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'height': `var(${vars['option.height']}, var(--token-semantic-density-item, var(--token-global-size-48, 48px)))`,
        'padding-block': `var(${vars['option.padding-block']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'font-size': `var(${vars['option.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['option.line-height']}, var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'root': {
        'transition': `var(${vars['root.transition']}, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'touch': {
            'min-height': `var(${vars['root.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'border-width': `var(${vars['root.border-width']}, 1px)`,
        'border-style': `var(${vars['root.border-style']}, solid)`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'border-color-focus': `var(${vars['root.border-color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'border-color-error': `var(${vars['root.border-color-error']}, var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'border-color-warning': `var(${vars['root.border-color-warning']}, var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px)))`,
        'background-color': `var(${vars['root.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'background-color-disabled': `var(${vars['root.background-color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, none)`,
        'box-shadow-focus': `var(${vars['root.box-shadow-focus']}, inset 0 0 0 2px var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'validation': {
            'box-shadow-error': `var(${vars['root.validation.box-shadow-error']}, inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
            'box-shadow-warning': `var(${vars['root.validation.box-shadow-warning']}, inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        },
        'color-loading': `var(${vars['root.color-loading']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
    },
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
        },
        'spatial': {
            'transition': `var(${vars['motion.spatial.transition']}, var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-placeholder': `var(${vars['text.color-placeholder']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-disabled': `var(${vars['text.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'tag': {
        'background-color': `var(${vars['tag.background-color']}, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'color': `var(${vars['tag.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'close': {
            'color-hover': `var(${vars['tag.close.color-hover']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        }
    },
    'clear': {
        'color': `var(${vars['clear.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['clear.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'width': `var(${vars['clear.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'height': `var(${vars['clear.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'touch': {
            'width': `var(${vars['clear.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'box-shadow-focus': `var(${vars['clear.box-shadow-focus']}, inset 0 0 0 1px var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
    },
    'icon': {
        'width': `var(${vars['icon.width']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`,
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
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
    },
    'group': {
        'color': `var(${vars['group.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['group.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
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
    'dropdown': {
        'margin': `var(${vars['dropdown.margin']}, 6px)`,
        'max-height': `var(${vars['dropdown.max-height']}, 240px)`,
        'padding': `var(${vars['dropdown.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'option': {
            'padding': `var(${vars['dropdown.option.padding']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'border-radius': `var(${vars['dropdown.border-radius']}, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px)))`
    }
});

export default token;
