/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'line.border-color': '--divider-line-border-color',
    'line.border-width': '--divider-line-border-width',
    'spacing.none.margin': '--divider-spacing-none-margin',
    'spacing.small.margin': '--divider-spacing-small-margin',
    'spacing.middle.margin': '--divider-spacing-middle-margin',
    'spacing.large.margin': '--divider-spacing-large-margin',
    'text.color': '--divider-text-color',
    'text.color-plain': '--divider-text-color-plain',
    'text.font-size': '--divider-text-font-size',
    'text.font-weight': '--divider-text-font-weight',
    'text.font-weight-plain': '--divider-text-font-weight-plain',
    'text.gap': '--divider-text-gap',
    'text.flex-basis': '--divider-text-flex-basis',
    'vertical.block-size': '--divider-vertical-block-size'
});

const token = defineTokens({
    'line': {
        'border-color': `var(${vars['line.border-color']}, var(--divider-line-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`,
        'border-width': `var(${vars['line.border-width']}, var(--divider-line-width, 1px))`
    },
    'spacing': {
        'none': {
            'margin': `var(${vars['spacing.none.margin']}, var(--divider-spacing-none, 0px))`
        },
        'small': {
            'margin': `var(${vars['spacing.small.margin']}, var(--divider-spacing-small, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`
        },
        'middle': {
            'margin': `var(${vars['spacing.middle.margin']}, var(--divider-spacing-middle, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`
        },
        'large': {
            'margin': `var(${vars['spacing.large.margin']}, var(--divider-spacing-large, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px))))`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-plain': `var(${vars['text.color-plain']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'font-size': `var(${vars['text.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'font-weight': `var(${vars['text.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'font-weight-plain': `var(${vars['text.font-weight-plain']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`,
        'gap': `var(${vars['text.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'flex-basis': `var(${vars['text.flex-basis']}, var(--divider-text-offset, 5%))`
    },
    'vertical': {
        'block-size': `var(${vars['vertical.block-size']}, var(--divider-vertical-size, 1em))`
    }
});

export default token;
