/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--number-edit-root-transition',
    'root.opacity-disabled': '--number-edit-root-opacity-disabled',
    'stepper.color': '--number-edit-stepper-color',
    'stepper.color-hover': '--number-edit-stepper-color-hover',
    'stepper.color-disabled': '--number-edit-stepper-color-disabled',
    'stepper.background-color-hover': '--number-edit-stepper-background-color-hover',
    'stepper.background-color-active': '--number-edit-stepper-background-color-active',
    'stepper.divider.color': '--number-edit-stepper-divider-color',
    'stepper.border-radius': '--number-edit-stepper-border-radius',
    'stepper.width': '--number-edit-stepper-width',
    'stepper.gap': '--number-edit-stepper-gap',
    'stepper.action.min-width': '--number-edit-stepper-action-min-width',
    'stepper.action.width': '--number-edit-stepper-action-width',
    'stepper.action.height': '--number-edit-stepper-action-height',
    'stepper.action.touch.min-width': '--number-edit-stepper-action-touch-min-width',
    'stepper.action.touch.width': '--number-edit-stepper-action-touch-width',
    'stepper.action.touch.height': '--number-edit-stepper-action-touch-height',
    'stepper.icon.width': '--number-edit-stepper-icon-width',
    'display.background-color': '--number-edit-display-background-color',
    'display.color': '--number-edit-display-color',
    'display.superscript.font-size': '--number-edit-display-superscript-font-size',
    'icon.gap': '--number-edit-icon-gap',
    'size.small.action.width': '--number-edit-size-small-action-width',
    'size.middle.action.width': '--number-edit-size-middle-action-width',
    'size.large.action.width': '--number-edit-size-large-action-width'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    },
    'stepper': {
        'color': `var(${vars['stepper.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['stepper.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['stepper.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color-hover': `var(${vars['stepper.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'background-color-active': `var(${vars['stepper.background-color-active']}, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'divider': {
            'color': `var(${vars['stepper.divider.color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
        },
        'border-radius': `var(${vars['stepper.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`,
        'width': `var(${vars['stepper.width']}, 24px)`,
        'gap': `var(${vars['stepper.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'action': {
            'min-width': `var(${vars['stepper.action.min-width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'width': `var(${vars['stepper.action.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'height': `var(${vars['stepper.action.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'touch': {
                'min-width': `var(${vars['stepper.action.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
                'width': `var(${vars['stepper.action.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
                'height': `var(${vars['stepper.action.touch.height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
            }
        },
        'icon': {
            'width': `var(${vars['stepper.icon.width']}, 24px)`
        }
    },
    'display': {
        'background-color': `var(${vars['display.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'color': `var(${vars['display.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'superscript': {
            'font-size': `var(${vars['display.superscript.font-size']}, 0.75em)`
        }
    },
    'icon': {
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'size': {
        'small': {
            'action': {
                'width': `var(${vars['size.small.action.width']}, var(--token-semantic-sizing-small-action, var(--token-global-size-32, 32px)))`
            }
        },
        'middle': {
            'action': {
                'width': `var(${vars['size.middle.action.width']}, var(--token-semantic-sizing-middle-action, var(--token-global-size-40, 40px)))`
            }
        },
        'large': {
            'action': {
                'width': `var(${vars['size.large.action.width']}, var(--token-semantic-sizing-large-action, var(--token-global-size-48, 48px)))`
            }
        }
    }
});

export default token;
