/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background-color': '--tooltip-root-background-color',
    'root.color': '--tooltip-root-color',
    'root.padding-inline': '--tooltip-root-padding-inline',
    'root.padding-block': '--tooltip-root-padding-block',
    'root.font-size': '--tooltip-root-font-size',
    'root.line-height': '--tooltip-root-line-height',
    'root.border-radius': '--tooltip-root-border-radius',
    'root.max-width': '--tooltip-root-max-width',
    'root.z-index': '--tooltip-root-z-index',
    'motion.interaction': '--tooltip-motion-interaction'
});

const token = defineTokens({
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--tooltip-background-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'color': `var(${vars['root.color']}, var(--tooltip-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0)))))`,
        'padding-inline': `var(${vars['root.padding-inline']}, var(--tooltip-padding-inline, var(--tooltip-padding-x, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))))`,
        'padding-block': `var(${vars['root.padding-block']}, var(--tooltip-padding-block, var(--tooltip-padding-y, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))))`,
        'font-size': `var(${vars['root.font-size']}, var(--tooltip-font-size, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px))))`,
        'line-height': `var(${vars['root.line-height']}, var(--tooltip-line-height, 1.5))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--tooltip-border-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`,
        'max-width': `var(${vars['root.max-width']}, var(--tooltip-max-width, 250px))`,
        'z-index': `var(${vars['root.z-index']}, var(--tooltip-z-index, var(--token-semantic-z-index-elevated, var(--token-global-z-index-50, 1400))))`
    },
    'motion': {
        'interaction': `var(${vars['motion.interaction']}, var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`
    }
});

export default token;
