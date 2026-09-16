/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--select-root-transition',
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
    'text.color': '--select-text-color',
    'text.color-placeholder': '--select-text-color-placeholder',
    'text.color-disabled': '--select-text-color-disabled',
    'option.background-color-hover': '--select-option-background-color-hover',
    'option.color-selected': '--select-option-color-selected',
    'option.background-color-selected': '--select-option-background-color-selected',
    'option.color-disabled': '--select-option-color-disabled',
    'option.highlight.background-color': '--select-option-highlight-background-color',
    'tag.background-color': '--select-tag-background-color',
    'tag.color': '--select-tag-color',
    'tag.close.color-hover': '--select-tag-close-color-hover',
    'clear.color': '--select-clear-color',
    'clear.color-hover': '--select-clear-color-hover',
    'group.color': '--select-group-color',
    'group.font-size': '--select-group-font-size',
    'size.large.height': '--select-size-large-height',
    'size.large.padding': '--select-size-large-padding',
    'size.large.font-size': '--select-size-large-font-size',
    'size.large.line-height': '--select-size-large-line-height',
    'size.middle.height': '--select-size-middle-height',
    'size.middle.padding': '--select-size-middle-padding',
    'size.middle.font-size': '--select-size-middle-font-size',
    'size.middle.line-height': '--select-size-middle-line-height',
    'size.small.height': '--select-size-small-height',
    'size.small.padding': '--select-size-small-padding',
    'size.small.font-size': '--select-size-small-font-size',
    'size.small.line-height': '--select-size-small-line-height',
    'dropdown.margin': '--select-dropdown-margin',
    'dropdown.max-height': '--select-dropdown-max-height',
    'dropdown.padding': '--select-dropdown-padding',
    'dropdown.option.padding': '--select-dropdown-option-padding'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--select-transition, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1)))`,
        'border-width': `var(${vars['root.border-width']}, var(--select-border-width, 1px))`,
        'border-style': `var(${vars['root.border-style']}, var(--select-border-style, solid))`,
        'border-color': `var(${vars['root.border-color']}, var(--select-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--select-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`,
        'border-color-focus': `var(${vars['root.border-color-focus']}, var(--select-border-color-focus, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'border-color-error': `var(${vars['root.border-color-error']}, var(--select-border-color-error, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25))))))`,
        'border-color-warning': `var(${vars['root.border-color-warning']}, var(--select-border-color-warning, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71))))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--select-border-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`,
        'background-color': `var(${vars['root.background-color']}, var(--select-background-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`,
        'background-color-disabled': `var(${vars['root.background-color-disabled']}, var(--select-background-color-disabled, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--select-box-shadow, var(--select-shadow-default, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))))`,
        'box-shadow-focus': `var(${vars['root.box-shadow-focus']}, var(--select-box-shadow-focus, var(--select-shadow-focus, var(--token-semantic-shadow-focus-ring, 0 0 0 3px var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))))`,
        'validation': {
            'box-shadow-error': `var(${vars['root.validation.box-shadow-error']}, var(--select-root-box-shadow-focus-error, var(--select-box-shadow-focus-error, var(--select-shadow-focus-error, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))) 25%, transparent)))))`,
            'box-shadow-warning': `var(${vars['root.validation.box-shadow-warning']}, var(--select-root-box-shadow-focus-warning, var(--select-box-shadow-focus-warning, var(--select-shadow-focus-warning, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))) 25%, transparent)))))`
        },
        'color-loading': `var(${vars['root.color-loading']}, var(--select-color-loading, var(--select-loading-color, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-placeholder': `var(${vars['text.color-placeholder']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-disabled': `var(${vars['text.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'option': {
        'background-color-hover': `var(${vars['option.background-color-hover']}, var(--select-option-color-hover, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'color-selected': `var(${vars['option.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'background-color-selected': `var(${vars['option.background-color-selected']}, var(--select-option-background-selected, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286)))))`,
        'color-disabled': `var(${vars['option.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'highlight': {
            'background-color': `var(${vars['option.highlight.background-color']}, var(--select-option-highlight-background, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`
        }
    },
    'tag': {
        'background-color': `var(${vars['tag.background-color']}, var(--select-tag-background, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'color': `var(${vars['tag.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'close': {
            'color-hover': `var(${vars['tag.close.color-hover']}, var(--select-tag-close-hover, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286)))))`
        }
    },
    'clear': {
        'color': `var(${vars['clear.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-hover': `var(${vars['clear.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'group': {
        'color': `var(${vars['group.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'font-size': `var(${vars['group.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
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
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    },
    'dropdown': {
        'margin': `var(${vars['dropdown.margin']}, var(--select-dropdown-offset, 6px))`,
        'max-height': `var(${vars['dropdown.max-height']}, 240px)`,
        'padding': `var(${vars['dropdown.padding']}, 4px)`,
        'option': {
            'padding': `var(${vars['dropdown.option.padding']}, 8px)`
        }
    }
});

export default token;
