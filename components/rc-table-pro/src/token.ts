/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'surface.background-color': '--table-pro-surface-background-color',
    'chrome.background-color': '--table-pro-chrome-background-color',
    'root.border-color': '--table-pro-root-border-color',
    'overlay.background-color-loading': '--table-pro-overlay-background-color-loading',
    'overlay.background-color-error': '--table-pro-overlay-background-color-error',
    'icon.color': '--table-pro-icon-color',
    'icon.color-hover': '--table-pro-icon-color-hover',
    'icon.background-color-hover': '--table-pro-icon-background-color-hover',
    'icon.background-color-selected': '--table-pro-icon-background-color-selected',
    'icon.color-selected': '--table-pro-icon-color-selected',
    'icon.selection.background-color-hover': '--table-pro-icon-selection-background-color-hover',
    'icon.selection.color-hover': '--table-pro-icon-selection-color-hover',
    'sort.color-selected': '--table-pro-sort-color-selected',
    'sort.selection.color-hover': '--table-pro-sort-selection-color-hover',
    'sort.selection.background-color-hover': '--table-pro-sort-selection-background-color-hover',
    'text.secondary.color': '--table-pro-text-secondary-color',
    'text.tertiary.color': '--table-pro-text-tertiary-color',
    'control.background-color-hover': '--table-pro-control-background-color-hover',
    'control.opacity-disabled': '--table-pro-control-opacity-disabled',
    'failure.icon.color': '--table-pro-failure-icon-color',
    'failure.text.color': '--table-pro-failure-text-color',
    'failure.border-color': '--table-pro-failure-border-color',
    'failure.background-color-hover': '--table-pro-failure-background-color-hover'
});

const token = defineTokens({
    'surface': {
        'background-color': `var(${vars['surface.background-color']}, var(--crab-rc-table-bg-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`
    },
    'chrome': {
        'background-color': `var(${vars['chrome.background-color']}, var(--crab-rc-table-header-bg-color, var(--token-semantic-color-background-sunken, var(--token-global-zinc-50, oklch(0.980 0.002 286)))))`
    },
    'root': {
        'border-color': `var(${vars['root.border-color']}, var(--crab-rc-table-border-color, var(--token-semantic-color-border-subtle, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))))`
    },
    'overlay': {
        'background-color-loading': `var(${vars['overlay.background-color-loading']}, color-mix(in oklch, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))) 65%, transparent))`,
        'background-color-error': `var(${vars['overlay.background-color-error']}, color-mix(in oklch, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))) 92%, transparent))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'color-hover': `var(${vars['icon.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background-color-hover': `var(${vars['icon.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'background-color-selected': `var(${vars['icon.background-color-selected']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`,
        'color-selected': `var(${vars['icon.color-selected']}, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811))))`,
        'selection': {
            'background-color-hover': `var(${vars['icon.selection.background-color-hover']}, var(--token-semantic-color-highlight-background-active, var(--token-global-amber-300, oklch(0.879 0.169 79))))`,
            'color-hover': `var(${vars['icon.selection.color-hover']}, var(--token-semantic-color-highlight-foreground, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        }
    },
    'sort': {
        'color-selected': `var(${vars['sort.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'selection': {
            'color-hover': `var(${vars['sort.selection.color-hover']}, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811))))`,
            'background-color-hover': `var(${vars['sort.selection.background-color-hover']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`
        }
    },
    'text': {
        'secondary': {
            'color': `var(${vars['text.secondary.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
        },
        'tertiary': {
            'color': `var(${vars['text.tertiary.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`
        }
    },
    'control': {
        'background-color-hover': `var(${vars['control.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'opacity-disabled': `var(${vars['control.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    },
    'failure': {
        'icon': {
            'color': `var(${vars['failure.icon.color']}, var(--token-semantic-color-feedback-error-icon, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`
        },
        'text': {
            'color': `var(${vars['failure.text.color']}, var(--token-semantic-color-feedback-error-text, var(--token-semantic-color-feedback-error, var(--token-global-red-800, oklch(0.444 0.177 26)))))`
        },
        'border-color': `var(${vars['failure.border-color']}, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))`,
        'background-color-hover': `var(${vars['failure.background-color-hover']}, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17))))`
    }
});

export default token;
