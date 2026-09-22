/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'overlay.background-color': '--drawer-overlay-background-color',
    'root.background-color': '--drawer-root-background-color',
    'root.box-shadow': '--drawer-root-box-shadow',
    'root.border-radius': '--drawer-root-border-radius',
    'size.small.width': '--drawer-size-small-width',
    'size.small.height': '--drawer-size-small-height',
    'size.medium.width': '--drawer-size-medium-width',
    'size.medium.height': '--drawer-size-medium-height',
    'size.large.width': '--drawer-size-large-width',
    'size.large.height': '--drawer-size-large-height',
    'header.padding': '--drawer-header-padding',
    'header.border-color': '--drawer-header-border-color',
    'header.title.font-weight': '--drawer-header-title-font-weight',
    'header.title.font-size': '--drawer-header-title-font-size',
    'header.title.color': '--drawer-header-title-color',
    'header.title.line-height': '--drawer-header-title-line-height',
    'header.title.letter-spacing': '--drawer-header-title-letter-spacing',
    'body.padding': '--drawer-body-padding',
    'footer.padding': '--drawer-footer-padding',
    'footer.border-color': '--drawer-footer-border-color',
    'footer.gap': '--drawer-footer-gap',
    'close.width': '--drawer-close-width',
    'close.icon.width': '--drawer-close-icon-width',
    'close.color': '--drawer-close-color',
    'close.color-hover': '--drawer-close-color-hover',
    'close.background-color-hover': '--drawer-close-background-color-hover',
    'close.border-radius': '--drawer-close-border-radius',
    'panel.animation-duration': '--drawer-panel-animation-duration',
    'panel.animation-timing-function': '--drawer-panel-animation-timing-function',
    'motion.fade.transition': '--drawer-motion-fade-transition',
    'motion.expand.transition': '--drawer-motion-expand-transition',
    'motion.exit.transition': '--drawer-motion-exit-transition'
});

const token = defineTokens({
    'overlay': {
        'background-color': `var(${vars['overlay.background-color']}, var(--token-semantic-color-background-overlay, color-mix(in oklch, var(--token-global-black, oklch(0.000 0 0)) 32%, transparent)))`
    },
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--drawer-background-color, var(--token-semantic-color-surface-low, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--drawer-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15)))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-shape-large, var(--token-global-radius-8, 16px)))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, 280px)`,
            'height': `var(${vars['size.small.height']}, 240px)`
        },
        'medium': {
            'width': `var(${vars['size.medium.width']}, 420px)`,
            'height': `var(${vars['size.medium.height']}, 360px)`
        },
        'large': {
            'width': `var(${vars['size.large.width']}, 560px)`,
            'height': `var(${vars['size.large.height']}, 480px)`
        }
    },
    'header': {
        'padding': `var(${vars['header.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'border-color': `var(${vars['header.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`,
        'title': {
            'font-weight': `var(${vars['header.title.font-weight']}, var(--token-semantic-typography-title-large-emphasized-font-weight, var(--token-global-font-weight-medium, 500)))`,
            'font-size': `var(${vars['header.title.font-size']}, var(--token-semantic-typography-title-font-size, var(--token-global-font-size-22, 22px)))`,
            'color': `var(${vars['header.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'line-height': `var(${vars['header.title.line-height']}, var(--token-semantic-typography-title-line-height, var(--token-global-line-height-22-28, 1.2727272727272727)))`,
            'letter-spacing': `var(${vars['header.title.letter-spacing']}, -0.01em)`
        }
    },
    'body': {
        'padding': `var(${vars['body.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`
    },
    'footer': {
        'padding': `var(${vars['footer.padding']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'border-color': `var(${vars['footer.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`,
        'gap': `var(${vars['footer.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'close': {
        'width': `var(${vars['close.width']}, var(--drawer-close-size, 32px))`,
        'icon': {
            'width': `var(${vars['close.icon.width']}, var(--drawer-close-icon-size, 16px))`
        },
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color-hover': `var(${vars['close.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-radius': `var(${vars['close.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`
    },
    'panel': {
        'animation-duration': `var(${vars['panel.animation-duration']}, var(--drawer-transition-duration, 280ms))`,
        'animation-timing-function': `var(${vars['panel.animation-timing-function']}, var(--drawer-transition-easing, cubic-bezier(0.32, 0.72, 0, 1)))`
    },
    'motion': {
        'fade': {
            'transition': `var(${vars['motion.fade.transition']}, var(--drawer-motion-fade, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-expressive-effects-default, cubic-bezier(0.34, 0.80, 0.34, 1.00)))))`
        },
        'expand': {
            'transition': `var(${vars['motion.expand.transition']}, var(--drawer-motion-expand, var(--token-semantic-motion-slide-enter, var(--token-global-duration-500, 500ms) var(--token-global-easing-expressive-spatial-default, cubic-bezier(0.38, 1.21, 0.22, 1.00)))))`
        },
        'exit': {
            'transition': `var(${vars['motion.exit.transition']}, var(--drawer-motion-exit, var(--token-semantic-motion-slide-exit, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90)))))`
        }
    }
});

export default token;
