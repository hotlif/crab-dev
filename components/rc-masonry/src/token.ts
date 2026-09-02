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
        'transition': `var(${vars['root.transition']}, var(--masonry-transition, transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)))`,
        'gap': `var(${vars['root.gap']}, var(--masonry-gutter, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`
    }
});

export default token;
