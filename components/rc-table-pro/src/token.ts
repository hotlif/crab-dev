/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'motion.interaction.transition': '--table-pro-motion-interaction-transition',
    'surface.background-color': '--table-pro-surface-background-color',
    'chrome.background-color': '--table-pro-chrome-background-color',
    'root.border-color': '--table-pro-root-border-color',
    'overlay.background-color-loading': '--table-pro-overlay-background-color-loading',
    'overlay.background-color-error': '--table-pro-overlay-background-color-error',
    'icon.color': '--table-pro-icon-color',
    'icon.color-hover': '--table-pro-icon-color-hover',
    'icon.background-color-hover': '--table-pro-icon-background-color-hover',
    'icon.background-color-selected': '--table-pro-icon-background-color-selected',
    'icon.color-selected': '--table-pro-icon-color-selected',
    'icon.selection.background-color-hover': '--table-pro-icon-selection-background-color-hover',
    'icon.selection.color-hover': '--table-pro-icon-selection-color-hover',
    'sort.color-selected': '--table-pro-sort-color-selected',
    'sort.selection.color-hover': '--table-pro-sort-selection-color-hover',
    'sort.selection.background-color-hover': '--table-pro-sort-selection-background-color-hover',
    'text.secondary.color': '--table-pro-text-secondary-color',
    'text.tertiary.color': '--table-pro-text-tertiary-color',
    'control.background-color-hover': '--table-pro-control-background-color-hover',
    'control.opacity-disabled': '--table-pro-control-opacity-disabled',
    'failure.icon.color': '--table-pro-failure-icon-color',
    'failure.text.color': '--table-pro-failure-text-color',
    'failure.border-color': '--table-pro-failure-border-color',
    'failure.background-color-hover': '--table-pro-failure-background-color-hover'
});

const token = defineTokens({
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
        }
    },
    'surface': {
        'background-color': `var(${vars['surface.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
    },
    'chrome': {
        'background-color': `var(${vars['chrome.background-color']}, var(--token-semantic-color-surface-canvas, var(--token-semantic-color-background-sunken, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
    },
    'root': {
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`
    },
    'overlay': {
        'background-color-loading': `var(${vars['overlay.background-color-loading']}, color-mix(in oklch, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))) 65%, transparent))`,
        'background-color-error': `var(${vars['overlay.background-color-error']}, color-mix(in oklch, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))) 92%, transparent))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['icon.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color-hover': `var(${vars['icon.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'background-color-selected': `var(${vars['icon.background-color-selected']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`,
        'color-selected': `var(${vars['icon.color-selected']}, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811))))`,
        'selection': {
            'background-color-hover': `var(${vars['icon.selection.background-color-hover']}, var(--token-semantic-color-highlight-background-active, var(--token-global-amber-300, oklch(0.879 0.169 79))))`,
            'color-hover': `var(${vars['icon.selection.color-hover']}, var(--token-semantic-color-highlight-foreground, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        }
    },
    'sort': {
        'color-selected': `var(${vars['sort.color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'selection': {
            'color-hover': `var(${vars['sort.selection.color-hover']}, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811))))`,
            'background-color-hover': `var(${vars['sort.selection.background-color-hover']}, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510))))`
        }
    },
    'text': {
        'secondary': {
            'color': `var(${vars['text.secondary.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'tertiary': {
            'color': `var(${vars['text.tertiary.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        }
    },
    'control': {
        'background-color-hover': `var(${vars['control.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'opacity-disabled': `var(${vars['control.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    },
    'failure': {
        'icon': {
            'color': `var(${vars['failure.icon.color']}, var(--token-semantic-color-feedback-error-icon, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`
        },
        'text': {
            'color': `var(${vars['failure.text.color']}, var(--token-semantic-color-feedback-error-text, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))`
        },
        'border-color': `var(${vars['failure.border-color']}, var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'background-color-hover': `var(${vars['failure.background-color-hover']}, var(--token-semantic-color-feedback-error-background, var(--token-global-material-error-90, oklch(0.92214553 0.03006356 22.785053))))`
    }
});

export default token;
