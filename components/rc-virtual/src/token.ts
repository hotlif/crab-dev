/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'scrollbar.thumb.background-color': '--virtual-scrollbar-thumb-background-color'
});

const token = defineTokens({
    'scrollbar': {
        'thumb': {
            'background-color': `var(${vars['scrollbar.thumb.background-color']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))) 50%, transparent))`
        }
    }
});

export default token;
