/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'scrollbar.opacity': '--virtual-scrollbar-opacity',
    'scrollbar.transition': '--virtual-scrollbar-transition',
    'scrollbar.thumb.background-color': '--virtual-scrollbar-thumb-background-color'
});

const token = defineTokens({
    'scrollbar': {
        'opacity': `var(${vars['scrollbar.opacity']}, 0)`,
        'transition': `var(${vars['scrollbar.transition']}, var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`,
        'thumb': {
            'background-color': `var(${vars['scrollbar.thumb.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))) 50%, transparent))`
        }
    }
});

export default token;
