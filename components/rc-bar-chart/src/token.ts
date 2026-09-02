/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'palette.series.blue.color': '--bar-chart-palette-series-blue-color',
    'palette.series.orange.color': '--bar-chart-palette-series-orange-color',
    'palette.series.aqua.color': '--bar-chart-palette-series-aqua-color',
    'palette.series.yellow.color': '--bar-chart-palette-series-yellow-color',
    'palette.series.magenta.color': '--bar-chart-palette-series-magenta-color',
    'palette.series.green.color': '--bar-chart-palette-series-green-color',
    'palette.series.violet.color': '--bar-chart-palette-series-violet-color',
    'palette.series.red.color': '--bar-chart-palette-series-red-color',
    'palette.gridline.color': '--bar-chart-palette-gridline-color',
    'palette.baseline.color': '--bar-chart-palette-baseline-color',
    'palette.axis-label.color': '--bar-chart-palette-axis-label-color',
    'palette.canvas.background-color': '--bar-chart-palette-canvas-background-color',
    'legend.gap': '--bar-chart-legend-gap',
    'legend.column-gap': '--bar-chart-legend-column-gap',
    'legend.row-gap': '--bar-chart-legend-row-gap',
    'legend.item.gap': '--bar-chart-legend-item-gap',
    'legend.item.border-radius': '--bar-chart-legend-item-border-radius',
    'legend.item.background-color-hover': '--bar-chart-legend-item-background-color-hover',
    'legend.item.transition': '--bar-chart-legend-item-transition',
    'legend.item.opacity-hidden': '--bar-chart-legend-item-opacity-hidden',
    'legend.swatch.inline-size': '--bar-chart-legend-swatch-inline-size',
    'legend.swatch.block-size': '--bar-chart-legend-swatch-block-size',
    'legend.label.color': '--bar-chart-legend-label-color',
    'legend.label.font-size': '--bar-chart-legend-label-font-size',
    'root.box-shadow-focus': '--bar-chart-root-box-shadow-focus',
    'tooltip.background-color': '--bar-chart-tooltip-background-color',
    'tooltip.border-radius': '--bar-chart-tooltip-border-radius',
    'tooltip.box-shadow': '--bar-chart-tooltip-box-shadow',
    'tooltip.padding': '--bar-chart-tooltip-padding',
    'tooltip.rows.row-gap': '--bar-chart-tooltip-rows-row-gap',
    'tooltip.row.column-gap': '--bar-chart-tooltip-row-column-gap',
    'tooltip.font-size': '--bar-chart-tooltip-font-size',
    'tooltip.category.color': '--bar-chart-tooltip-category-color',
    'tooltip.name.color': '--bar-chart-tooltip-name-color',
    'tooltip.value.color': '--bar-chart-tooltip-value-color',
    'tooltip.value.font-weight': '--bar-chart-tooltip-value-font-weight'
});

const token = defineTokens({
    'palette': {
        'series': {
            'blue': {
                'color': `var(${vars['palette.series.blue.color']}, oklch(0.5753 0.1626 255.53))`
            },
            'orange': {
                'color': `var(${vars['palette.series.orange.color']}, oklch(0.6708 0.175 40.64))`
            },
            'aqua': {
                'color': `var(${vars['palette.series.aqua.color']}, oklch(0.669 0.1408 162.11))`
            },
            'yellow': {
                'color': `var(${vars['palette.series.yellow.color']}, oklch(0.7644 0.1612 75.12))`
            },
            'magenta': {
                'color': `var(${vars['palette.series.magenta.color']}, oklch(0.7163 0.1412 357.39))`
            },
            'green': {
                'color': `var(${vars['palette.series.green.color']}, oklch(0.5285 0.1798 142.5))`
            },
            'violet': {
                'color': `var(${vars['palette.series.violet.color']}, oklch(0.4331 0.1671 283.62))`
            },
            'red': {
                'color': `var(${vars['palette.series.red.color']}, oklch(0.6226 0.1909 24.91))`
            }
        },
        'gridline': {
            'color': `var(${vars['palette.gridline.color']}, var(--token-semantic-color-border-subtle, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286)))))`
        },
        'baseline': {
            'color': `var(${vars['palette.baseline.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        },
        'axis-label': {
            'color': `var(${vars['palette.axis-label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
        },
        'canvas': {
            'background-color': `var(${vars['palette.canvas.background-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        }
    },
    'legend': {
        'gap': `var(${vars['legend.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'column-gap': `var(${vars['legend.column-gap']}, var(--bar-chart-legend-item-gap, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`,
        'row-gap': `var(${vars['legend.row-gap']}, var(--bar-chart-legend-swatch-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
        'item': {
            'gap': `var(${vars['legend.item.gap']}, var(--bar-chart-legend-swatch-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
            'border-radius': `var(${vars['legend.item.border-radius']}, var(--bar-chart-legend-item-radius, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px))))`,
            'background-color-hover': `var(${vars['legend.item.background-color-hover']}, var(--bar-chart-legend-item-color-hover, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
            'transition': `var(${vars['legend.item.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
            'opacity-hidden': `var(${vars['legend.item.opacity-hidden']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`
        },
        'swatch': {
            'inline-size': `var(${vars['legend.swatch.inline-size']}, var(--bar-chart-legend-swatch-size, 10px))`,
            'block-size': `var(${vars['legend.swatch.block-size']}, var(--bar-chart-legend-swatch-size, 10px))`
        },
        'label': {
            'color': `var(${vars['legend.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
            'font-size': `var(${vars['legend.label.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        }
    },
    'root': {
        'box-shadow-focus': `var(${vars['root.box-shadow-focus']}, var(--bar-chart-focus-ring, var(--token-semantic-shadow-focus-ring, 0 0 0 3px var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-blue-600, oklch(0.546 0.245 262)))))))`
    },
    'tooltip': {
        'background-color': `var(${vars['tooltip.background-color']}, var(--bar-chart-tooltip-background, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'border-radius': `var(${vars['tooltip.border-radius']}, var(--bar-chart-tooltip-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`,
        'box-shadow': `var(${vars['tooltip.box-shadow']}, var(--bar-chart-tooltip-shadow, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)))))`,
        'padding': `var(${vars['tooltip.padding']}, 8px 12px)`,
        'rows': {
            'row-gap': `var(${vars['tooltip.rows.row-gap']}, var(--bar-chart-tooltip-row-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`
        },
        'row': {
            'column-gap': `var(${vars['tooltip.row.column-gap']}, var(--bar-chart-tooltip-key-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`
        },
        'font-size': `var(${vars['tooltip.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'category': {
            'color': `var(${vars['tooltip.category.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
        },
        'name': {
            'color': `var(${vars['tooltip.name.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
        },
        'value': {
            'color': `var(${vars['tooltip.value.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'font-weight': `var(${vars['tooltip.value.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
        }
    }
});

export default token;
