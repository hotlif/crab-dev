/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'separator.vertical.width': '--split-pane-separator-vertical-width',
    'separator.horizontal.height': '--split-pane-separator-horizontal-height',
    'separator.line.width': '--split-pane-separator-line-width',
    'separator.line.background-color': '--split-pane-separator-line-background-color',
    'separator.line.background-color-active': '--split-pane-separator-line-background-color-active',
    'separator.transition': '--split-pane-separator-transition',
    'separator.box-shadow-focus': '--split-pane-separator-box-shadow-focus'
});

const token = defineTokens({
    'separator': {
        'vertical': {
            'width': `var(${vars['separator.vertical.width']}, var(--split-pane-separator-size, 7px))`
        },
        'horizontal': {
            'height': `var(${vars['separator.horizontal.height']}, var(--split-pane-separator-size, 7px))`
        },
        'line': {
            'width': `var(${vars['separator.line.width']}, 1px)`,
            'background-color': `var(${vars['separator.line.background-color']}, var(--split-pane-separator-line-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
            'background-color-active': `var(${vars['separator.line.background-color-active']}, var(--split-pane-separator-line-color-active, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
        },
        'transition': `var(${vars['separator.transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'box-shadow-focus': `var(${vars['separator.box-shadow-focus']}, var(--split-pane-focus-box-shadow, var(--split-pane-focus-ring, var(--token-semantic-shadow-focus-ring, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))) 20%, transparent)))))`
    }
});

export default token;
