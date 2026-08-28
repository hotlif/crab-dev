/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'separator.size': '--split-pane-separator-size',
    'separator.line.width': '--split-pane-separator-line-width',
    'separator.line.color': '--split-pane-separator-line-color',
    'separator.line.color-active': '--split-pane-separator-line-color-active',
    'separator.transition': '--split-pane-separator-transition',
    'focus.ring': '--split-pane-focus-ring'
});

const token = defineTokens({
    'separator': {
        'size': `var(${vars['separator.size']}, 7px)`,
        'line': {
            'width': `var(${vars['separator.line.width']}, 1px)`,
            'color': `var(${vars['separator.line.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'color-active': `var(${vars['separator.line.color-active']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'transition': `var(${vars['separator.transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1))`
    },
    'focus': {
        'ring': `var(${vars['focus.ring']}, var(--token-semantic-shadow-focus-ring, 0 0 0 3px oklch(0.140 0.004 286 / 0.25)))`
    }
});

export default token;
