/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'panel.padding-block': '--color-picker-panel-padding-block',
    'panel.padding-inline': '--color-picker-panel-padding-inline',
    'panel.gap': '--color-picker-panel-gap',
    'panel.preview.height': '--color-picker-panel-preview-height',
    'panel.preview.width': '--color-picker-panel-preview-width',
    'panel.preview.border-radius': '--color-picker-panel-preview-border-radius',
    'panel.preview.border-color': '--color-picker-panel-preview-border-color',
    'panel.preview.margin-top': '--color-picker-panel-preview-margin-top',
    'panel.slider.container.gap': '--color-picker-panel-slider-container-gap',
    'panel.slider.label.width': '--color-picker-panel-slider-label-width',
    'panel.slider.label.font-size': '--color-picker-panel-slider-label-font-size',
    'panel.slider.label.font-weight': '--color-picker-panel-slider-label-font-weight',
    'panel.slider.label.line-height': '--color-picker-panel-slider-label-line-height',
    'slider.thumb.stroke-color': '--color-picker-slider-thumb-stroke-color',
    'slider.alpha.checker.color': '--color-picker-slider-alpha-checker-color',
    'trigger.border-color': '--color-picker-trigger-border-color',
    'trigger.border-radius': '--color-picker-trigger-border-radius',
    'trigger.padding': '--color-picker-trigger-padding',
    'trigger.gap': '--color-picker-trigger-gap',
    'trigger.touch.min-width': '--color-picker-trigger-touch-min-width',
    'trigger.touch.min-height': '--color-picker-trigger-touch-min-height',
    'trigger.opacity-disabled': '--color-picker-trigger-opacity-disabled',
    'trigger.ring.color-focus': '--color-picker-trigger-ring-color-focus',
    'trigger.background-color-disabled': '--color-picker-trigger-background-color-disabled',
    'trigger.border-color-disabled': '--color-picker-trigger-border-color-disabled',
    'trigger.swatch.small.width': '--color-picker-trigger-swatch-small-width',
    'trigger.swatch.medium.width': '--color-picker-trigger-swatch-medium-width',
    'trigger.swatch.large.width': '--color-picker-trigger-swatch-large-width',
    'input.gap': '--color-picker-input-gap',
    'swatch.width': '--color-picker-swatch-width',
    'swatch.touch.width': '--color-picker-swatch-touch-width',
    'swatch.border-width': '--color-picker-swatch-border-width',
    'swatch.gap': '--color-picker-swatch-gap',
    'swatch.border-color': '--color-picker-swatch-border-color',
    'swatch.border-radius': '--color-picker-swatch-border-radius',
    'swatch.group.label.color': '--color-picker-swatch-group-label-color',
    'swatch.group.label.font-size': '--color-picker-swatch-group-label-font-size'
});

const token = defineTokens({
    'panel': {
        'padding-block': `var(${vars['panel.padding-block']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'padding-inline': `var(${vars['panel.padding-inline']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'gap': `var(${vars['panel.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'preview': {
            'height': `var(${vars['panel.preview.height']}, 5rem)`,
            'width': `var(${vars['panel.preview.width']}, 100%)`,
            'border-radius': `var(${vars['panel.preview.border-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-6, 12px)))`,
            'border-color': `var(${vars['panel.preview.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
            'margin-top': `var(${vars['panel.preview.margin-top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'slider': {
            'container': {
                'gap': `var(${vars['panel.slider.container.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            },
            'label': {
                'width': `var(${vars['panel.slider.label.width']}, 4em)`,
                'font-size': `var(${vars['panel.slider.label.font-size']}, var(--token-semantic-typography-label-font-size, var(--token-global-font-size-sm, 14px)))`,
                'font-weight': `var(${vars['panel.slider.label.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
                'line-height': `var(${vars['panel.slider.label.line-height']}, var(--token-semantic-typography-label-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`
            }
        }
    },
    'slider': {
        'thumb': {
            'stroke-color': `var(${vars['slider.thumb.stroke-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
        },
        'alpha': {
            'checker': {
                'color': `var(${vars['slider.alpha.checker.color']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
            }
        }
    },
    'trigger': {
        'border-color': `var(${vars['trigger.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-radius': `var(${vars['trigger.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`,
        'padding': `var(${vars['trigger.padding']}, 0.25rem)`,
        'gap': `var(${vars['trigger.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'touch': {
            'min-width': `var(${vars['trigger.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['trigger.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'opacity-disabled': `var(${vars['trigger.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'ring': {
            'color-focus': `var(${vars['trigger.ring.color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
        },
        'background-color-disabled': `var(${vars['trigger.background-color-disabled']}, var(--token-semantic-color-background-disabled, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'border-color-disabled': `var(${vars['trigger.border-color-disabled']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'swatch': {
            'small': {
                'width': `var(${vars['trigger.swatch.small.width']}, 16px)`
            },
            'medium': {
                'width': `var(${vars['trigger.swatch.medium.width']}, 24px)`
            },
            'large': {
                'width': `var(${vars['trigger.swatch.large.width']}, 32px)`
            }
        }
    },
    'input': {
        'gap': `var(${vars['input.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    },
    'swatch': {
        'width': `var(${vars['swatch.width']}, 20px)`,
        'touch': {
            'width': `var(${vars['swatch.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'border-width': `var(${vars['swatch.border-width']}, 1px)`,
        'gap': `var(${vars['swatch.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'border-color': `var(${vars['swatch.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-radius': `var(${vars['swatch.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px)))`,
        'group': {
            'label': {
                'color': `var(${vars['swatch.group.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
                'font-size': `var(${vars['swatch.group.label.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`
            }
        }
    }
});

export default token;
