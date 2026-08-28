/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--select-transition',
    'border.width': '--select-border-width',
    'border.style': '--select-border-style',
    'border.color': '--select-border-color',
    'border.color-hover': '--select-border-color-hover',
    'border.color-focus': '--select-border-color-focus',
    'border.color-error': '--select-border-color-error',
    'border.color-warning': '--select-border-color-warning',
    'border.radius': '--select-border-radius',
    'background.color': '--select-background-color',
    'background.color-disabled': '--select-background-color-disabled',
    'text.color': '--select-text-color',
    'text.color-placeholder': '--select-text-color-placeholder',
    'text.color-disabled': '--select-text-color-disabled',
    'option.color-hover': '--select-option-color-hover',
    'option.color-selected': '--select-option-color-selected',
    'option.background-selected': '--select-option-background-selected',
    'option.color-disabled': '--select-option-color-disabled',
    'option.highlight-background': '--select-option-highlight-background',
    'shadow.default': '--select-shadow-default',
    'shadow.focus': '--select-shadow-focus',
    'shadow.focus-error': '--select-shadow-focus-error',
    'shadow.focus-warning': '--select-shadow-focus-warning',
    'tag.background': '--select-tag-background',
    'tag.color': '--select-tag-color',
    'tag.close-hover': '--select-tag-close-hover',
    'clear.color': '--select-clear-color',
    'clear.color-hover': '--select-clear-color-hover',
    'group.color': '--select-group-color',
    'group.font-size': '--select-group-font-size',
    'loading.color': '--select-loading-color',
    'size.large.height': '--select-size-large-height',
    'size.large.padding': '--select-size-large-padding',
    'size.large.font.size': '--select-size-large-font-size',
    'size.large.line-height': '--select-size-large-line-height',
    'size.middle.height': '--select-size-middle-height',
    'size.middle.padding': '--select-size-middle-padding',
    'size.middle.font.size': '--select-size-middle-font-size',
    'size.middle.line-height': '--select-size-middle-line-height',
    'size.small.height': '--select-size-small-height',
    'size.small.padding': '--select-size-small-padding',
    'size.small.font.size': '--select-size-small-font-size',
    'size.small.line-height': '--select-size-small-line-height',
    'dropdown.offset': '--select-dropdown-offset',
    'dropdown.max-height': '--select-dropdown-max-height',
    'dropdown.padding': '--select-dropdown-padding',
    'dropdown.option.padding': '--select-dropdown-option-padding',
    'dropdown.z-index': '--select-dropdown-z-index'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'border': {
        'width': `var(${vars['border.width']}, 1px)`,
        'style': `var(${vars['border.style']}, solid)`,
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-hover': `var(${vars['border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'color-focus': `var(${vars['border.color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-error': `var(${vars['border.color-error']}, var(--token-semantic-color-border-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`,
        'color-warning': `var(${vars['border.color-warning']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`,
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'color-disabled': `var(${vars['background.color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-placeholder': `var(${vars['text.color-placeholder']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-disabled': `var(${vars['text.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'option': {
        'color-hover': `var(${vars['option.color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'color-selected': `var(${vars['option.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'background-selected': `var(${vars['option.background-selected']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-disabled': `var(${vars['option.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'highlight-background': `var(${vars['option.highlight-background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
    },
    'shadow': {
        'default': `var(${vars['shadow.default']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
        'focus': `var(${vars['shadow.focus']}, var(--token-semantic-shadow-focus-ring, 0 0 0 3px oklch(0.140 0.004 286 / 0.25)))`,
        'focus-error': `var(${vars['shadow.focus-error']}, 0 0 0 3px oklch(0.637 0.237 24 / 0.25))`,
        'focus-warning': `var(${vars['shadow.focus-warning']}, 0 0 0 3px oklch(0.769 0.188 75 / 0.25))`
    },
    'tag': {
        'background': `var(${vars['tag.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'color': `var(${vars['tag.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'close-hover': `var(${vars['tag.close-hover']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'clear': {
        'color': `var(${vars['clear.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['clear.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'group': {
        'color': `var(${vars['group.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'font-size': `var(${vars['group.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
    },
    'loading': {
        'color': `var(${vars['loading.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.large.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            },
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.middle.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    },
    'dropdown': {
        'offset': `var(${vars['dropdown.offset']}, 6px)`,
        'max-height': `var(${vars['dropdown.max-height']}, 240px)`,
        'padding': `var(${vars['dropdown.padding']}, 4px)`,
        'option': {
            'padding': `var(${vars['dropdown.option.padding']}, 8px)`
        },
        'z-index': `var(${vars['dropdown.z-index']}, 1000)`
    }
});

export default token;
