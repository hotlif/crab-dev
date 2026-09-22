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
    'mode-row.font-size': '--cron-picker-mode-row-font-size',
    'mode-row.opacity-inactive': '--cron-picker-mode-row-opacity-inactive',
    'value-grid.gap': '--cron-picker-value-grid-gap',
    'expression.font-size': '--cron-picker-expression-font-size',
    'expression.color': '--cron-picker-expression-color',
    'expression.background-color': '--cron-picker-expression-background-color',
    'expression.border-radius': '--cron-picker-expression-border-radius',
    'expression.padding': '--cron-picker-expression-padding',
    'describe.color': '--cron-picker-describe-color',
    'describe.font-size': '--cron-picker-describe-font-size',
    'preview.color': '--cron-picker-preview-color',
    'preview.font-size': '--cron-picker-preview-font-size',
    'preview.time.color': '--cron-picker-preview-time-color',
    'divider.color': '--cron-picker-divider-color',
    'root.transition': '--cron-picker-root-transition'
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
            'color': `var(${vars['mode-row.text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
        },
        'font-size': `var(${vars['mode-row.font-size']}, var(--token-semantic-typography-label-font-size, var(--token-global-font-size-sm, 14px)))`,
        'opacity-inactive': `var(${vars['mode-row.opacity-inactive']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    },
    'value-grid': {
        'gap': `var(${vars['value-grid.gap']}, 4px)`
    },
    'expression': {
        'font-size': `var(${vars['expression.font-size']}, var(--token-semantic-typography-label-font-size, var(--token-global-font-size-sm, 14px)))`,
        'color': `var(${vars['expression.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['expression.background-color']}, var(--cron-picker-expression-background, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-radius': `var(${vars['expression.border-radius']}, var(--cron-picker-expression-radius, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px))))`,
        'padding': `var(${vars['expression.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`
    },
    'describe': {
        'color': `var(${vars['describe.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['describe.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
    },
    'preview': {
        'color': `var(${vars['preview.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['preview.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
        'time': {
            'color': `var(${vars['preview.time.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
        }
    },
    'divider': {
        'color': `var(${vars['divider.color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
    },
    'root': {
        'transition': `var(${vars['root.transition']}, var(--cron-picker-transition, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`
    }
});

export default token;
