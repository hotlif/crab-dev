/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'background-color': '--tooltip-background-color',
    'color': '--tooltip-color',
    'padding-x': '--tooltip-padding-x',
    'padding-y': '--tooltip-padding-y',
    'font-size': '--tooltip-font-size',
    'line-height': '--tooltip-line-height',
    'border-radius': '--tooltip-border-radius',
    'max-width': '--tooltip-max-width',
    'z-index': '--tooltip-z-index'
});

const token = defineTokens({
    'background-color': `var(${vars['background-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
    'color': `var(${vars['color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
    'padding-x': `var(${vars['padding-x']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
    'padding-y': `var(${vars['padding-y']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
    'font-size': `var(${vars['font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
    'line-height': `var(${vars['line-height']}, 1.5)`,
    'border-radius': `var(${vars['border-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
    'max-width': `var(${vars['max-width']}, 250px)`,
    'z-index': `var(${vars['z-index']}, var(--token-semantic-z-index-elevated, var(--token-global-z-index-50, 1400)))`
});

export default token;
