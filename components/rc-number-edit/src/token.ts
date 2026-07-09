/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--number-edit-transition',
    'stepper.color': '--number-edit-stepper-color',
    'stepper.color-hover': '--number-edit-stepper-color-hover',
    'stepper.color-disabled': '--number-edit-stepper-color-disabled',
    'stepper.background-hover': '--number-edit-stepper-background-hover',
    'stepper.background-active': '--number-edit-stepper-background-active',
    'stepper.divider.color': '--number-edit-stepper-divider-color',
    'stepper.radius': '--number-edit-stepper-radius',
    'stepper.width': '--number-edit-stepper-width',
    'stepper.icon-size': '--number-edit-stepper-icon-size',
    'display.background': '--number-edit-display-background',
    'display.color': '--number-edit-display-color',
    'display.superscript.font-size': '--number-edit-display-superscript-font-size',
    'disabled.opacity': '--number-edit-disabled-opacity',
    'icon.gap': '--number-edit-icon-gap'
};

const token = {
    'transition': `var(${vars['transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
    'stepper': {
        'color': `var(${vars['stepper.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['stepper.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['stepper.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'background-hover': `var(${vars['stepper.background-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'background-active': `var(${vars['stepper.background-active']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'divider': {
            'color': `var(${vars['stepper.divider.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'radius': `var(${vars['stepper.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'width': `var(${vars['stepper.width']}, 24px)`,
        'icon-size': `var(${vars['stepper.icon-size']}, 12px)`
    },
    'display': {
        'background': `var(${vars['display.background']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'color': `var(${vars['display.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'superscript': {
            'font-size': `var(${vars['display.superscript.font-size']}, 0.75em)`
        }
    },
    'disabled': {
        'opacity': `var(${vars['disabled.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    },
    'icon': {
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    }
};

export default token;
