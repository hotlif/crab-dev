/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'overlay.background-color': '--dialog-overlay-background-color',
    'root.background-color': '--dialog-root-background-color',
    'root.top': '--dialog-root-top',
    'root.min-width': '--dialog-root-min-width',
    'root.padding': '--dialog-root-padding',
    'root.border-radius': '--dialog-root-border-radius',
    'root.box-shadow': '--dialog-root-box-shadow',
    'confirm.min-width': '--dialog-confirm-min-width',
    'heading.margin-bottom': '--dialog-heading-margin-bottom',
    'heading.font-weight': '--dialog-heading-font-weight',
    'heading.font-size': '--dialog-heading-font-size',
    'heading.line-height': '--dialog-heading-line-height',
    'footer.margin-top': '--dialog-footer-margin-top',
    'footer.button.margin': '--dialog-footer-button-margin'
});

const token = defineTokens({
    'overlay': {
        'background-color': `var(${vars['overlay.background-color']}, var(--token-semantic-color-background-overlay, color-mix(in oklch, var(--token-global-black, oklch(0.000 0 0)) 45%, transparent)))`
    },
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--dialog-background-color, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'top': `var(${vars['root.top']}, var(--dialog-top, 100px))`,
        'min-width': `var(${vars['root.min-width']}, var(--dialog-min-width, 520px))`,
        'padding': `var(${vars['root.padding']}, var(--dialog-padding, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--dialog-border-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--dialog-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`
    },
    'confirm': {
        'min-width': `var(${vars['confirm.min-width']}, 22rem)`
    },
    'heading': {
        'margin-bottom': `var(${vars['heading.margin-bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'font-weight': `var(${vars['heading.font-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`,
        'font-size': `var(${vars['heading.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['heading.line-height']}, 1.5)`
    },
    'footer': {
        'margin-top': `var(${vars['footer.margin-top']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'button': {
            'margin': `var(${vars['footer.button.margin']}, var(--dialog-footer-button-spacing, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`
        }
    }
});

export default token;
