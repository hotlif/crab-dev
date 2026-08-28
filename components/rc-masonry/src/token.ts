/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--masonry-transition',
    'gutter': '--masonry-gutter'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'gutter': `var(${vars['gutter']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
});

export default token;
