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
    'root.max-width': '--dropdown-container-root-max-width',
    'motion.interaction.transition': '--dropdown-container-motion-interaction-transition',
    'motion.offset.translate': '--dropdown-container-motion-offset-translate',
    'motion.spatial.transition': '--dropdown-container-motion-spatial-transition',
    'interaction.touch.min-width': '--dropdown-container-interaction-touch-min-width',
    'interaction.touch.min-height': '--dropdown-container-interaction-touch-min-height',
    'interaction.outline-color-focus': '--dropdown-container-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--dropdown-container-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--dropdown-container-interaction-outline-offset-focus'
});

const token = defineTokens({
    'root': {
        'box-shadow': `var(${vars['root.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px)))`,
        'background-color': `var(${vars['root.background-color']}, var(--token-semantic-color-surface-container, var(--token-global-material-neutral-94, oklch(0.95362610 0.01470533 312.243326))))`,
        'border-color': `var(${vars['root.border-color']}, transparent)`,
        'z-index': `var(${vars['root.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100)))`,
        'max-width': `var(${vars['root.max-width']}, calc(100vw - var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`
    },
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
        },
        'offset': {
            'translate': `var(${vars['motion.offset.translate']}, calc(var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) * -1))`
        },
        'spatial': {
            'transition': `var(${vars['motion.spatial.transition']}, var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
        }
    },
    'interaction': {
        'touch': {
            'min-width': `var(${vars['interaction.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['interaction.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['interaction.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['interaction.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['interaction.outline-offset-focus']}, 2px)`
    }
});

export default token;
