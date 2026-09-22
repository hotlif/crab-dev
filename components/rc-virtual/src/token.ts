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
        'transition': `var(${vars['scrollbar.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'thumb': {
            'background-color': `var(${vars['scrollbar.thumb.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 50%, transparent))`
        }
    }
});

export default token;
