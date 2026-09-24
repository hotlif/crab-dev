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
    'root.box-shadow': '--tooltip-root-box-shadow',
    'root.outline-width': '--tooltip-root-outline-width',
    'motion.interaction.transition': '--tooltip-motion-interaction-transition',
    'interaction.touch.min-width': '--tooltip-interaction-touch-min-width',
    'interaction.touch.min-height': '--tooltip-interaction-touch-min-height',
    'interaction.outline-color-focus': '--tooltip-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--tooltip-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--tooltip-interaction-outline-offset-focus'
});

const token = defineTokens({
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--token-semantic-color-background-inverse, var(--token-global-material-neutral-20, oklch(0.31065597 0.01134802 308.055889))))`,
        'color': `var(${vars['root.color']}, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))))`,
        'padding-inline': `var(${vars['root.padding-inline']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'padding-block': `var(${vars['root.padding-block']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font-size': `var(${vars['root.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px)))`,
        'max-width': `var(${vars['root.max-width']}, 250px)`,
        'z-index': `var(${vars['root.z-index']}, var(--token-semantic-z-index-elevated, var(--token-global-z-index-50, 1400)))`,
        'box-shadow': `var(${vars['root.box-shadow']}, none)`,
        'outline-width': `var(${vars['root.outline-width']}, 1px)`
    },
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
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
