/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'overlay.background-color': '--dialog-overlay-background-color',
    'root.background-color': '--dialog-root-background-color',
    'root.top': '--dialog-root-top',
    'root.transform': '--dialog-root-transform',
    'root.min-width': '--dialog-root-min-width',
    'root.max-width': '--dialog-root-max-width',
    'root.max-height': '--dialog-root-max-height',
    'root.padding': '--dialog-root-padding',
    'root.border-radius': '--dialog-root-border-radius',
    'root.box-shadow': '--dialog-root-box-shadow',
    'confirm.min-width': '--dialog-confirm-min-width',
    'heading.margin-bottom': '--dialog-heading-margin-bottom',
    'heading.font-weight': '--dialog-heading-font-weight',
    'heading.font-size': '--dialog-heading-font-size',
    'heading.line-height': '--dialog-heading-line-height',
    'heading.gap': '--dialog-heading-gap',
    'close.width': '--dialog-close-width',
    'close.height': '--dialog-close-height',
    'close.touch.min-width': '--dialog-close-touch-min-width',
    'close.touch.min-height': '--dialog-close-touch-min-height',
    'footer.margin-top': '--dialog-footer-margin-top',
    'footer.button.margin': '--dialog-footer-button-margin',
    'footer.button.min-height': '--dialog-footer-button-min-height',
    'footer.button.padding-block': '--dialog-footer-button-padding-block',
    'motion.fade.transition': '--dialog-motion-fade-transition',
    'motion.interaction.transition': '--dialog-motion-interaction-transition',
    'motion.offset.translate': '--dialog-motion-offset-translate',
    'motion.spatial.transition': '--dialog-motion-spatial-transition'
});

const token = defineTokens({
    'overlay': {
        'background-color': `var(${vars['overlay.background-color']}, var(--token-semantic-color-background-overlay, color-mix(in oklch, var(--token-global-black, oklch(0.000 0 0)) 32%, transparent)))`
    },
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--token-semantic-color-surface-high, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074))))`,
        'top': `var(${vars['root.top']}, 50%)`,
        'transform': `var(${vars['root.transform']}, translateY(calc(var(--dialog-root-top, 0px) - var(--dialog-root-top, 50%))))`,
        'min-width': `var(${vars['root.min-width']}, 280px)`,
        'max-width': `var(${vars['root.max-width']}, calc(100vw - var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) * 2))`,
        'max-height': `var(${vars['root.max-height']}, calc(100dvh - var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) * 2))`,
        'padding': `var(${vars['root.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-overlay, var(--token-global-radius-14, 28px)))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15))))`
    },
    'confirm': {
        'min-width': `var(${vars['confirm.min-width']}, 22rem)`
    },
    'heading': {
        'margin-bottom': `var(${vars['heading.margin-bottom']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'font-weight': `var(${vars['heading.font-weight']}, var(--token-semantic-typography-headline-small-emphasized-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'font-size': `var(${vars['heading.font-size']}, var(--token-semantic-typography-headline-small-font-size, var(--token-global-font-size-2xl, 24px)))`,
        'line-height': `var(${vars['heading.line-height']}, var(--token-semantic-typography-headline-small-line-height, var(--token-global-line-height-24-32, 1.3333333333333333)))`,
        'gap': `var(${vars['heading.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'close': {
        'width': `var(${vars['close.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'height': `var(${vars['close.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'touch': {
            'min-width': `var(${vars['close.touch.min-width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['close.touch.min-height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
        }
    },
    'footer': {
        'margin-top': `var(${vars['footer.margin-top']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'button': {
            'margin': `var(${vars['footer.button.margin']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'min-height': `var(${vars['footer.button.min-height']}, var(--token-semantic-size-control, var(--token-global-size-40, 40px)))`,
            'padding-block': `var(${vars['footer.button.padding-block']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        }
    },
    'motion': {
        'fade': {
            'transition': `var(${vars['motion.fade.transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-expressive-effects-default, cubic-bezier(0.34, 0.80, 0.34, 1.00))))`
        },
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
        },
        'offset': {
            'translate': `var(${vars['motion.offset.translate']}, calc(var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) * -1))`
        },
        'spatial': {
            'transition': `var(${vars['motion.spatial.transition']}, var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
        }
    }
});

export default token;
