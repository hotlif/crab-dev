/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'placeholder.min-block-size': '--realm-placeholder-min-block-size',
    'motion.appear': '--realm-motion-appear'
});

const token = defineTokens({
    'placeholder': {
        'min-block-size': `var(${vars['placeholder.min-block-size']}, 80px)`
    },
    'motion': {
        'appear': `var(${vars['motion.appear']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
    }
});

export default token;
