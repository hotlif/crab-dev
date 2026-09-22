/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--masonry-root-transition',
    'root.gap': '--masonry-root-gap'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--masonry-transition, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), opacity var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`,
        'gap': `var(${vars['root.gap']}, var(--masonry-gutter, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`
    }
});

export default token;
