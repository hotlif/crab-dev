/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--text-edit-transition',
    'border.radius': '--text-edit-border-radius',
    'border.width': '--text-edit-border-width',
    'border.style': '--text-edit-border-style',
    'border.color': '--text-edit-border-color',
    'border.color-hover': '--text-edit-border-color-hover',
    'border.color-focus': '--text-edit-border-color-focus',
    'box-shadow.default': '--text-edit-box-shadow-default',
    'box-shadow.focus-within': '--text-edit-box-shadow-focus-within',
    'background.color': '--text-edit-background-color',
    'text.color': '--text-edit-text-color',
    'placeholder.color': '--text-edit-placeholder-color',
    'icon.color': '--text-edit-icon-color',
    'icon.gap': '--text-edit-icon-gap',
    'clear.inset-block-start': '--text-edit-clear-inset-block-start',
    'clear.inset-inline-end': '--text-edit-clear-inset-inline-end',
    'status.error.border.color': '--text-edit-status-error-border-color',
    'status.error.box-shadow.focus-within': '--text-edit-status-error-box-shadow-focus-within',
    'status.warning.border.color': '--text-edit-status-warning-border-color',
    'status.warning.box-shadow.focus-within': '--text-edit-status-warning-box-shadow-focus-within',
    'count.color': '--text-edit-count-color',
    'count.font-size': '--text-edit-count-font-size',
    'size.large.padding': '--text-edit-size-large-padding',
    'size.large.font.size': '--text-edit-size-large-font-size',
    'size.large.line-height': '--text-edit-size-large-line-height',
    'size.middle.padding': '--text-edit-size-middle-padding',
    'size.middle.font.size': '--text-edit-size-middle-font-size',
    'size.middle.line-height': '--text-edit-size-middle-line-height',
    'size.small.padding': '--text-edit-size-small-padding',
    'size.small.font.size': '--text-edit-size-small-font-size',
    'size.small.line-height': '--text-edit-size-small-line-height'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'width': `var(${vars['border.width']}, 1px)`,
        'style': `var(${vars['border.style']}, solid)`,
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-hover': `var(${vars['border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'color-focus': `var(${vars['border.color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'box-shadow': {
        'default': `var(${vars['box-shadow.default']}, none)`,
        'focus-within': `var(${vars['box-shadow.focus-within']}, var(--token-semantic-shadow-focus-ring, 0 0 0 3px oklch(0.140 0.004 286 / 0.25)))`
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'placeholder': {
        'color': `var(${vars['placeholder.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'clear': {
        'inset-block-start': `var(${vars['clear.inset-block-start']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'inset-inline-end': `var(${vars['clear.inset-inline-end']}, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`
    },
    'status': {
        'error': {
            'border': {
                'color': `var(${vars['status.error.border.color']}, var(--token-semantic-color-border-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
            },
            'box-shadow': {
                'focus-within': `var(${vars['status.error.box-shadow.focus-within']}, 0 0 0 3px oklch(0.637 0.237 24 / 0.25))`
            }
        },
        'warning': {
            'border': {
                'color': `var(${vars['status.warning.border.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
            },
            'box-shadow': {
                'focus-within': `var(${vars['status.warning.box-shadow.focus-within']}, 0 0 0 3px oklch(0.769 0.188 75 / 0.25))`
            }
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`,
        'font-size': `var(${vars['count.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
    },
    'size': {
        'large': {
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.large.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            },
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.middle.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    }
});

export default token;
