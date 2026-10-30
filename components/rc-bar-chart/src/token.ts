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
    'legend.item.padding': '--bar-chart-legend-item-padding',
    'legend.item.background-color-pressed': '--bar-chart-legend-item-background-color-pressed',
    'legend.swatch.inline-size': '--bar-chart-legend-swatch-inline-size',
    'legend.swatch.block-size': '--bar-chart-legend-swatch-block-size',
    'legend.swatch.border-radius': '--bar-chart-legend-swatch-border-radius',
    'legend.label.color': '--bar-chart-legend-label-color',
    'legend.label.font-size': '--bar-chart-legend-label-font-size',
    'root.box-shadow-focus': '--bar-chart-root-box-shadow-focus',
    'root.outline-color-focus': '--bar-chart-root-outline-color-focus',
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
    'tooltip.value.font-weight': '--bar-chart-tooltip-value-font-weight',
    'tooltip.value.padding-inline-start': '--bar-chart-tooltip-value-padding-inline-start',
    'tooltip.line-height': '--bar-chart-tooltip-line-height',
    'tooltip.key.inline-size': '--bar-chart-tooltip-key-inline-size',
    'tooltip.key.block-size': '--bar-chart-tooltip-key-block-size',
    'tooltip.key.border-radius': '--bar-chart-tooltip-key-border-radius',
    'tooltip.border-color': '--bar-chart-tooltip-border-color',
    'tooltip.border-width': '--bar-chart-tooltip-border-width',
    'bar.border-radius': '--bar-chart-bar-border-radius'
});

const token = defineTokens({
    'palette': {
        'series': {
            'blue': {
                'color': `var(${vars['palette.series.blue.color']}, var(--token-semantic-data-chart-series-1, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
            },
            'orange': {
                'color': `var(${vars['palette.series.orange.color']}, var(--token-semantic-data-chart-series-2, var(--token-global-material-tertiary-40, oklch(0.49038805 0.06053149 358.445477))))`
            },
            'aqua': {
                'color': `var(${vars['palette.series.aqua.color']}, var(--token-semantic-data-chart-series-3, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
            },
            'yellow': {
                'color': `var(${vars['palette.series.yellow.color']}, var(--token-semantic-data-chart-series-4, var(--token-global-amber-600, oklch(0.666 0.179 73))))`
            },
            'magenta': {
                'color': `var(${vars['palette.series.magenta.color']}, var(--token-semantic-data-chart-series-5, var(--token-global-material-secondary-40, oklch(0.48593316 0.03575478 299.614802))))`
            },
            'green': {
                'color': `var(${vars['palette.series.green.color']}, var(--token-semantic-data-chart-series-6, var(--token-global-green-600, oklch(0.627 0.194 153))))`
            },
            'violet': {
                'color': `var(${vars['palette.series.violet.color']}, var(--token-semantic-data-chart-series-7, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
            },
            'red': {
                'color': `var(${vars['palette.series.red.color']}, var(--token-semantic-data-chart-series-8, var(--token-global-red-600, oklch(0.577 0.245 25))))`
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
        'gap': `var(${vars['legend.gap']}, var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))))`,
        'column-gap': `var(${vars['legend.column-gap']}, var(--bar-chart-legend-item-gap, var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px)))))`,
        'row-gap': `var(${vars['legend.row-gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`,
        'item': {
            'gap': `var(${vars['legend.item.gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`,
            'border-radius': `var(${vars['legend.item.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px)))`,
            'background-color-hover': `var(${vars['legend.item.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
            'transition': `var(${vars['legend.item.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
            'opacity-hidden': `var(${vars['legend.item.opacity-hidden']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
            'touch': {
                'min-width': `var(${vars['legend.item.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
                'min-height': `var(${vars['legend.item.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
            },
            'padding': `var(${vars['legend.item.padding']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 4) var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))))`,
            'background-color-pressed': `var(${vars['legend.item.background-color-pressed']}, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`
        },
        'swatch': {
            'inline-size': `var(${vars['legend.swatch.inline-size']}, 10px)`,
            'block-size': `var(${vars['legend.swatch.block-size']}, 10px)`,
            'border-radius': `var(${vars['legend.swatch.border-radius']}, 2px)`
        },
        'label': {
            'color': `var(${vars['legend.label.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['legend.label.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
        }
    },
    'root': {
        'box-shadow-focus': `var(${vars['root.box-shadow-focus']}, var(--token-semantic-shadow-focus-ring, 0 0 0 3px color-mix(in oklch, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))) 20%, transparent)))`,
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`
    },
    'tooltip': {
        'background-color': `var(${vars['tooltip.background-color']}, var(--token-semantic-overlay-popover-background, var(--token-semantic-color-surface-container, var(--token-global-material-neutral-94, oklch(0.95362610 0.01470533 312.243326)))))`,
        'border-radius': `var(${vars['tooltip.border-radius']}, var(--token-semantic-overlay-popover-shape, var(--token-global-radius-2, 4px)))`,
        'box-shadow': `var(${vars['tooltip.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`,
        'padding': `var(${vars['tooltip.padding']}, var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) var(--token-semantic-density-padding, var(--token-semantic-density-standard-padding, var(--token-global-space-3, 12px))))`,
        'rows': {
            'row-gap': `var(${vars['tooltip.rows.row-gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`
        },
        'row': {
            'column-gap': `var(${vars['tooltip.row.column-gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`
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
            'font-weight': `var(${vars['tooltip.value.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
            'padding-inline-start': `var(${vars['tooltip.value.padding-inline-start']}, var(--token-semantic-density-padding, var(--token-semantic-density-standard-padding, var(--token-global-space-3, 12px))))`
        },
        'line-height': `var(${vars['tooltip.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'key': {
            'inline-size': `var(${vars['tooltip.key.inline-size']}, 10px)`,
            'block-size': `var(${vars['tooltip.key.block-size']}, 3px)`,
            'border-radius': `var(${vars['tooltip.key.border-radius']}, 1.5px)`
        },
        'border-color': `var(${vars['tooltip.border-color']}, var(--token-semantic-overlay-popover-border, transparent))`,
        'border-width': `var(${vars['tooltip.border-width']}, 1px)`
    },
    'bar': {
        'border-radius': `var(${vars['bar.border-radius']}, 2px)`
    }
});

export default token;
