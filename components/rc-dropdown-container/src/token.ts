/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'box-shadow': '--dropdown-container-box-shadow',
    'border-radius': '--dropdown-container-border-radius',
    'background-color': '--dropdown-container-background-color'
});

const token = defineTokens({
    'box-shadow': `var(${vars['box-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))`,
    'border-radius': `var(${vars['border-radius']}, 8px)`,
    'background-color': `var(${vars['background-color']}, #fff)`
});

export default token;
