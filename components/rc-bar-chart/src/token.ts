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
    'legend.item.touch.min-width': '--bar-chart-legend-item-touch-min-width',
    'legend.item.touch.min-height': '--bar-chart-legend-item-touch-min-height',
    'legend.swatch.inline-size': '--bar-chart-legend-swatch-inline-size',
    'legend.swatch.block-size': '--bar-chart-legend-swatch-block-size',
    'legend.label.color': '--bar-chart-legend-label-color',
    'legend.label.font-size': '--bar-chart-legend-label-font-size',
    'root.box-shadow-focus': '--bar-chart-root-box-shadow-focus',
    'root.font-family': '--bar-chart-root-font-family',
    'root.line-height': '--bar-chart-root-line-height',
    'root.outline-width-focus': '--bar-chart-root-outline-width-focus',
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
            'color': `var(${vars['palette.gridline.color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`
        },
        'baseline': {
            'color': `var(${vars['palette.baseline.color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
        },
        'axis-label': {
            'color': `var(${vars['palette.axis-label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'canvas': {
            'background-color': `var(${vars['palette.canvas.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
        }
    },
    'legend': {
        'gap': `var(${vars['legend.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'column-gap': `var(${vars['legend.column-gap']}, var(--bar-chart-legend-item-gap, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px))))`,
        'row-gap': `var(${vars['legend.row-gap']}, var(--bar-chart-legend-swatch-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
        'item': {
            'gap': `var(${vars['legend.item.gap']}, var(--bar-chart-legend-swatch-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
            'border-radius': `var(${vars['legend.item.border-radius']}, var(--bar-chart-legend-item-radius, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px))))`,
            'background-color-hover': `var(${vars['legend.item.background-color-hover']}, var(--bar-chart-legend-item-color-hover, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
            'transition': `var(${vars['legend.item.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
            'opacity-hidden': `var(${vars['legend.item.opacity-hidden']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
            'touch': {
                'min-width': `var(${vars['legend.item.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
                'min-height': `var(${vars['legend.item.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
            }
        },
        'swatch': {
            'inline-size': `var(${vars['legend.swatch.inline-size']}, var(--bar-chart-legend-swatch-size, 10px))`,
            'block-size': `var(${vars['legend.swatch.block-size']}, var(--bar-chart-legend-swatch-size, 10px))`
        },
        'label': {
            'color': `var(${vars['legend.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['legend.label.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
        }
    },
    'root': {
        'box-shadow-focus': `var(${vars['root.box-shadow-focus']}, var(--bar-chart-focus-ring, var(--token-semantic-shadow-focus-ring, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))) 20%, transparent))))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-16-24, 1.5)))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`
    },
    'tooltip': {
        'background-color': `var(${vars['tooltip.background-color']}, var(--bar-chart-tooltip-background, var(--token-semantic-color-surface-overlay, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074)))))`,
        'border-radius': `var(${vars['tooltip.border-radius']}, var(--bar-chart-tooltip-radius, var(--token-semantic-shape-overlay, var(--token-global-radius-14, 28px))))`,
        'box-shadow': `var(${vars['tooltip.box-shadow']}, var(--bar-chart-tooltip-shadow, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15)))))`,
        'padding': `var(${vars['tooltip.padding']}, 8px 12px)`,
        'rows': {
            'row-gap': `var(${vars['tooltip.rows.row-gap']}, var(--bar-chart-tooltip-row-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`
        },
        'row': {
            'column-gap': `var(${vars['tooltip.row.column-gap']}, var(--bar-chart-tooltip-key-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`
        },
        'font-size': `var(${vars['tooltip.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
        'category': {
            'color': `var(${vars['tooltip.category.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'name': {
            'color': `var(${vars['tooltip.name.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'value': {
            'color': `var(${vars['tooltip.value.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-weight': `var(${vars['tooltip.value.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`
        }
    }
});

export default token;
