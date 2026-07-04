/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'panel.padding.y': '--color-picker-panel-padding-y',
    'panel.padding.x': '--color-picker-panel-padding-x',
    'panel.gap': '--color-picker-panel-gap',
    'panel.preview.height': '--color-picker-panel-preview-height',
    'panel.preview.width': '--color-picker-panel-preview-width',
    'panel.preview.border.radius': '--color-picker-panel-preview-border-radius',
    'panel.preview.border.color': '--color-picker-panel-preview-border-color',
    'panel.preview.margin.top': '--color-picker-panel-preview-margin-top',
    'panel.slider.container.gap': '--color-picker-panel-slider-container-gap',
    'slider.thumb.stroke.color': '--color-picker-slider-thumb-stroke-color',
    'slider.alpha.checker.color': '--color-picker-slider-alpha-checker-color',
    'trigger.border.color': '--color-picker-trigger-border-color',
    'trigger.border.radius': '--color-picker-trigger-border-radius',
    'trigger.padding': '--color-picker-trigger-padding',
    'trigger.gap': '--color-picker-trigger-gap',
    'trigger.focus.color': '--color-picker-trigger-focus-color',
    'trigger.disabled.background': '--color-picker-trigger-disabled-background',
    'trigger.disabled.border.color': '--color-picker-trigger-disabled-border-color',
    'trigger.swatch.size.small': '--color-picker-trigger-swatch-size-small',
    'trigger.swatch.size.medium': '--color-picker-trigger-swatch-size-medium',
    'trigger.swatch.size.large': '--color-picker-trigger-swatch-size-large',
    'input.gap': '--color-picker-input-gap',
    'swatch.size': '--color-picker-swatch-size',
    'swatch.gap': '--color-picker-swatch-gap',
    'swatch.border.color': '--color-picker-swatch-border-color',
    'swatch.border.radius': '--color-picker-swatch-border-radius',
    'swatch.group.label.color': '--color-picker-swatch-group-label-color'
};

const token = {
    'panel': {
        'padding': {
            'y': `var(${vars['panel.padding.y']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'x': `var(${vars['panel.padding.x']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'gap': `var(${vars['panel.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'preview': {
            'height': `var(${vars['panel.preview.height']}, 5rem)`,
            'width': `var(${vars['panel.preview.width']}, 100%)`,
            'border': {
                'radius': `var(${vars['panel.preview.border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
                'color': `var(${vars['panel.preview.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
            },
            'margin': {
                'top': `var(${vars['panel.preview.margin.top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            }
        },
        'slider': {
            'container': {
                'gap': `var(${vars['panel.slider.container.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            }
        }
    },
    'slider': {
        'thumb': {
            'stroke': {
                'color': `var(${vars['slider.thumb.stroke.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
            }
        },
        'alpha': {
            'checker': {
                'color': `var(${vars['slider.alpha.checker.color']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
            }
        }
    },
    'trigger': {
        'border': {
            'color': `var(${vars['trigger.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'radius': `var(${vars['trigger.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
        },
        'padding': `var(${vars['trigger.padding']}, 0.25rem)`,
        'gap': `var(${vars['trigger.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'focus': {
            'color': `var(${vars['trigger.focus.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        },
        'disabled': {
            'background': `var(${vars['trigger.disabled.background']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
            'border': {
                'color': `var(${vars['trigger.disabled.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
            }
        },
        'swatch': {
            'size': {
                'small': `var(${vars['trigger.swatch.size.small']}, 16px)`,
                'medium': `var(${vars['trigger.swatch.size.medium']}, 24px)`,
                'large': `var(${vars['trigger.swatch.size.large']}, 32px)`
            }
        }
    },
    'input': {
        'gap': `var(${vars['input.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    },
    'swatch': {
        'size': `var(${vars['swatch.size']}, 20px)`,
        'gap': `var(${vars['swatch.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'border': {
            'color': `var(${vars['swatch.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'radius': `var(${vars['swatch.border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
        },
        'group': {
            'label': {
                'color': `var(${vars['swatch.group.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
            }
        }
    }
};

export default token;
