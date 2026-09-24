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
    'separator.box-shadow-focus': '--split-pane-separator-box-shadow-focus',
    'separator.touch.width': '--split-pane-separator-touch-width',
    'separator.opacity-disabled': '--split-pane-separator-opacity-disabled',
    'separator.outline-width-focus': '--split-pane-separator-outline-width-focus'
});

const token = defineTokens({
    'separator': {
        'vertical': {
            'width': `var(${vars['separator.vertical.width']}, 7px)`
        },
        'horizontal': {
            'height': `var(${vars['separator.horizontal.height']}, 7px)`
        },
        'line': {
            'width': `var(${vars['separator.line.width']}, 1px)`,
            'background-color': `var(${vars['separator.line.background-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
            'background-color-active': `var(${vars['separator.line.background-color-active']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'transition': `var(${vars['separator.transition']}, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'box-shadow-focus': `var(${vars['separator.box-shadow-focus']}, var(--token-semantic-shadow-focus-ring, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))) 20%, transparent)))`,
        'touch': {
            'width': `var(${vars['separator.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'opacity-disabled': `var(${vars['separator.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'outline-width-focus': `var(${vars['separator.outline-width-focus']}, 2px)`
    }
});

export default token;
