/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'axis.label.color': '--bar-chart-axis-label-color',
    'legend.gap': '--bar-chart-legend-gap',
    'legend.item-gap': '--bar-chart-legend-item-gap',
    'legend.swatch-gap': '--bar-chart-legend-swatch-gap',
    'legend.swatch-size': '--bar-chart-legend-swatch-size',
    'legend.label.color': '--bar-chart-legend-label-color',
    'legend.label.font.size': '--bar-chart-legend-label-font-size',
    'tooltip.background': '--bar-chart-tooltip-background',
    'tooltip.radius': '--bar-chart-tooltip-radius',
    'tooltip.shadow': '--bar-chart-tooltip-shadow',
    'tooltip.padding': '--bar-chart-tooltip-padding',
    'tooltip.row-gap': '--bar-chart-tooltip-row-gap',
    'tooltip.key-gap': '--bar-chart-tooltip-key-gap',
    'tooltip.font.size': '--bar-chart-tooltip-font-size',
    'tooltip.category.color': '--bar-chart-tooltip-category-color',
    'tooltip.name.color': '--bar-chart-tooltip-name-color',
    'tooltip.value.color': '--bar-chart-tooltip-value-color',
    'tooltip.value.font.weight': '--bar-chart-tooltip-value-font-weight'
};

const token = {
    'axis': {
        'label': {
            'color': `var(${vars['axis.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        }
    },
    'legend': {
        'gap': `var(${vars['legend.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'item-gap': `var(${vars['legend.item-gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'swatch-gap': `var(${vars['legend.swatch-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'swatch-size': `var(${vars['legend.swatch-size']}, 10px)`,
        'label': {
            'color': `var(${vars['legend.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
            'font': {
                'size': `var(${vars['legend.label.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            }
        }
    },
    'tooltip': {
        'background': `var(${vars['tooltip.background']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
        'radius': `var(${vars['tooltip.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'shadow': `var(${vars['tooltip.shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
        'padding': `var(${vars['tooltip.padding']}, 8px 12px)`,
        'row-gap': `var(${vars['tooltip.row-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'key-gap': `var(${vars['tooltip.key-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font': {
            'size': `var(${vars['tooltip.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        },
        'category': {
            'color': `var(${vars['tooltip.category.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        },
        'name': {
            'color': `var(${vars['tooltip.name.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        },
        'value': {
            'color': `var(${vars['tooltip.value.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'font': {
                'weight': `var(${vars['tooltip.value.font.weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
            }
        }
    }
};

export default token;
