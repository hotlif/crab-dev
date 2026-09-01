/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'overlay.width': '--cron-picker-overlay-width',
    'overlay.padding': '--cron-picker-overlay-padding',
    'field.gap': '--cron-picker-field-gap',
    'mode-row.gap': '--cron-picker-mode-row-gap',
    'mode-row.text.color': '--cron-picker-mode-row-text-color',
    'mode-row.font.size': '--cron-picker-mode-row-font-size',
    'mode-row.opacity-inactive': '--cron-picker-mode-row-opacity-inactive',
    'value-grid.gap': '--cron-picker-value-grid-gap',
    'expression.font-size': '--cron-picker-expression-font-size',
    'expression.color': '--cron-picker-expression-color',
    'expression.background': '--cron-picker-expression-background',
    'expression.radius': '--cron-picker-expression-radius',
    'expression.padding': '--cron-picker-expression-padding',
    'describe.color': '--cron-picker-describe-color',
    'describe.font.size': '--cron-picker-describe-font-size',
    'preview.color': '--cron-picker-preview-color',
    'preview.font.size': '--cron-picker-preview-font-size',
    'preview.time.color': '--cron-picker-preview-time-color',
    'divider.color': '--cron-picker-divider-color',
    'transition': '--cron-picker-transition'
});

const token = defineTokens({
    'overlay': {
        'width': `var(${vars['overlay.width']}, 420px)`,
        'padding': `var(${vars['overlay.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
    },
    'field': {
        'gap': `var(${vars['field.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'mode-row': {
        'gap': `var(${vars['mode-row.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'text': {
            'color': `var(${vars['mode-row.text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        },
        'font': {
            'size': `var(${vars['mode-row.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'opacity-inactive': `var(${vars['mode-row.opacity-inactive']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    },
    'value-grid': {
        'gap': `var(${vars['value-grid.gap']}, 4px)`
    },
    'expression': {
        'font-size': `var(${vars['expression.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'color': `var(${vars['expression.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': `var(${vars['expression.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'radius': `var(${vars['expression.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'padding': `var(${vars['expression.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`
    },
    'describe': {
        'color': `var(${vars['describe.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'font': {
            'size': `var(${vars['describe.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        }
    },
    'preview': {
        'color': `var(${vars['preview.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'font': {
            'size': `var(${vars['preview.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        },
        'time': {
            'color': `var(${vars['preview.time.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        }
    },
    'divider': {
        'color': `var(${vars['divider.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
    },
    'transition': `var(${vars['transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
});

export default token;
