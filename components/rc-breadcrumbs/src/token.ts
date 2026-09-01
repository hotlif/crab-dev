/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'font.size': '--breadcrumbs-font-size',
    'line.height': '--breadcrumbs-line-height',
    'gap': '--breadcrumbs-gap',
    'item.color': '--breadcrumbs-item-color',
    'item.color-hover': '--breadcrumbs-item-color-hover',
    'item.color-active': '--breadcrumbs-item-color-active',
    'item.color-disabled': '--breadcrumbs-item-color-disabled',
    'separator.color': '--breadcrumbs-separator-color',
    'separator.padding': '--breadcrumbs-separator-padding',
    'ellipsis.color': '--breadcrumbs-ellipsis-color'
});

const token = defineTokens({
    'font': {
        'size': `var(${vars['font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
    },
    'line': {
        'height': `var(${vars['line.height']}, 1.5)`
    },
    'gap': `var(${vars['gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-active': `var(${vars['item.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'separator': {
        'color': `var(${vars['separator.color']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'padding': `var(${vars['separator.padding']}, 0 4px)`
    },
    'ellipsis': {
        'color': `var(${vars['ellipsis.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`
    }
});

export default token;
