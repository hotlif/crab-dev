/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'scrollbar.opacity': '--virtual-scrollbar-opacity',
    'scrollbar.transition': '--virtual-scrollbar-transition',
    'scrollbar.thumb.background-color': '--virtual-scrollbar-thumb-background-color',
    'scrollbar.thumb.background-color-hover': '--virtual-scrollbar-thumb-background-color-hover',
    'scrollbar.border-radius': '--virtual-scrollbar-border-radius',
    'scrollbar.width': '--virtual-scrollbar-width'
});

const token = defineTokens({
    'scrollbar': {
        'opacity': `var(${vars['scrollbar.opacity']}, 0)`,
        'transition': `var(${vars['scrollbar.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'thumb': {
            'background-color': `var(${vars['scrollbar.thumb.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 50%, transparent))`,
            'background-color-hover': `var(${vars['scrollbar.thumb.background-color-hover']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'border-radius': `var(${vars['scrollbar.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'width': `var(${vars['scrollbar.width']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    }
});

export default token;
