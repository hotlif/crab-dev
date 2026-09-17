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
    'trigger.ring.color-focus': '--color-picker-trigger-ring-color-focus',
    'trigger.background-color-disabled': '--color-picker-trigger-background-color-disabled',
    'trigger.border-color-disabled': '--color-picker-trigger-border-color-disabled',
    'trigger.swatch.small.width': '--color-picker-trigger-swatch-small-width',
    'trigger.swatch.medium.width': '--color-picker-trigger-swatch-medium-width',
    'trigger.swatch.large.width': '--color-picker-trigger-swatch-large-width',
    'input.gap': '--color-picker-input-gap',
    'swatch.width': '--color-picker-swatch-width',
    'swatch.gap': '--color-picker-swatch-gap',
    'swatch.border-color': '--color-picker-swatch-border-color',
    'swatch.border-radius': '--color-picker-swatch-border-radius',
    'swatch.group.label.color': '--color-picker-swatch-group-label-color'
});

const token = defineTokens({
    'panel': {
        'padding-block': `var(${vars['panel.padding-block']}, var(--color-picker-panel-padding-y, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px))))`,
        'padding-inline': `var(${vars['panel.padding-inline']}, var(--color-picker-panel-padding-x, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`,
        'gap': `var(${vars['panel.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'preview': {
            'height': `var(${vars['panel.preview.height']}, 5rem)`,
            'width': `var(${vars['panel.preview.width']}, 100%)`,
            'border-radius': `var(${vars['panel.preview.border-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
            'border-color': `var(${vars['panel.preview.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
            'margin-top': `var(${vars['panel.preview.margin-top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'slider': {
            'container': {
                'gap': `var(${vars['panel.slider.container.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            },
            'label': {
                'width': `var(${vars['panel.slider.label.width']}, 4em)`,
                'font-size': `var(${vars['panel.slider.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
                'font-weight': `var(${vars['panel.slider.label.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
                'line-height': `var(${vars['panel.slider.label.line-height']}, var(--token-semantic-font-line-height-body, var(--token-global-line-height-normal, 1.5)))`
            }
        }
    },
    'slider': {
        'thumb': {
            'stroke-color': `var(${vars['slider.thumb.stroke-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        },
        'alpha': {
            'checker': {
                'color': `var(${vars['slider.alpha.checker.color']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
            }
        }
    },
    'trigger': {
        'border-color': `var(${vars['trigger.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'border-radius': `var(${vars['trigger.border-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'padding': `var(${vars['trigger.padding']}, 0.25rem)`,
        'gap': `var(${vars['trigger.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'ring': {
            'color-focus': `var(${vars['trigger.ring.color-focus']}, var(--color-picker-trigger-focus-ring-color, var(--color-picker-trigger-focus-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))))`
        },
        'background-color-disabled': `var(${vars['trigger.background-color-disabled']}, var(--color-picker-trigger-disabled-background, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'border-color-disabled': `var(${vars['trigger.border-color-disabled']}, var(--color-picker-trigger-disabled-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'swatch': {
            'small': {
                'width': `var(${vars['trigger.swatch.small.width']}, var(--color-picker-trigger-swatch-size-small, 16px))`
            },
            'medium': {
                'width': `var(${vars['trigger.swatch.medium.width']}, var(--color-picker-trigger-swatch-size-medium, 24px))`
            },
            'large': {
                'width': `var(${vars['trigger.swatch.large.width']}, var(--color-picker-trigger-swatch-size-large, 32px))`
            }
        }
    },
    'input': {
        'gap': `var(${vars['input.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    },
    'swatch': {
        'width': `var(${vars['swatch.width']}, var(--color-picker-swatch-size, 20px))`,
        'gap': `var(${vars['swatch.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'border-color': `var(${vars['swatch.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'border-radius': `var(${vars['swatch.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'group': {
            'label': {
                'color': `var(${vars['swatch.group.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
            }
        }
    }
});

export default token;
