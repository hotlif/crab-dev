/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.box-shadow': '--dropdown-container-root-box-shadow',
    'root.border-radius': '--dropdown-container-root-border-radius',
    'root.background-color': '--dropdown-container-root-background-color',
    'root.border-color': '--dropdown-container-root-border-color',
    'root.z-index': '--dropdown-container-root-z-index',
    'motion.interaction': '--dropdown-container-motion-interaction',
    'motion.offset': '--dropdown-container-motion-offset'
});

const token = defineTokens({
    'root': {
        'box-shadow': `var(${vars['root.box-shadow']}, var(--dropdown-container-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--dropdown-container-border-radius, 8px))`,
        'background-color': `var(${vars['root.background-color']}, var(--dropdown-container-background-color, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'z-index': `var(${vars['root.z-index']}, var(--dropdown-container-z-index, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100))))`
    },
    'motion': {
        'interaction': `var(${vars['motion.interaction']}, var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`,
        'offset': `var(${vars['motion.offset']}, calc(var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) * -1))`
    }
});

export default token;
