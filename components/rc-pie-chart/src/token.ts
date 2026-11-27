/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'palette.series.1.color': '--pie-chart-palette-series-1-color',
    'palette.series.2.color': '--pie-chart-palette-series-2-color',
    'palette.series.3.color': '--pie-chart-palette-series-3-color',
    'palette.series.4.color': '--pie-chart-palette-series-4-color',
    'palette.series.5.color': '--pie-chart-palette-series-5-color',
    'palette.series.6.color': '--pie-chart-palette-series-6-color',
    'palette.series.7.color': '--pie-chart-palette-series-7-color',
    'palette.series.8.color': '--pie-chart-palette-series-8-color',
    'palette.canvas.background-color': '--pie-chart-palette-canvas-background-color',
    'root.font-family': '--pie-chart-root-font-family',
    'root.line-height': '--pie-chart-root-line-height',
    'root.font-size': '--pie-chart-root-font-size',
    'root.gap': '--pie-chart-root-gap',
    'root.outline-color-focus': '--pie-chart-root-outline-color-focus',
    'root.outline-width-focus': '--pie-chart-root-outline-width-focus',
    'legend.row-gap': '--pie-chart-legend-row-gap',
    'legend.item.gap': '--pie-chart-legend-item-gap',
    'legend.item.padding': '--pie-chart-legend-item-padding',
    'legend.item.border-radius': '--pie-chart-legend-item-border-radius',
    'legend.item.color': '--pie-chart-legend-item-color',
    'legend.item.background-color-hover': '--pie-chart-legend-item-background-color-hover',
    'legend.item.background-color-pressed': '--pie-chart-legend-item-background-color-pressed',
    'legend.item.transition': '--pie-chart-legend-item-transition',
    'legend.item.touch.min-width': '--pie-chart-legend-item-touch-min-width',
    'legend.item.touch.min-height': '--pie-chart-legend-item-touch-min-height',
    'swatch.inline-size': '--pie-chart-swatch-inline-size',
    'swatch.block-size': '--pie-chart-swatch-block-size',
    'tooltip.padding': '--pie-chart-tooltip-padding',
    'tooltip.gap': '--pie-chart-tooltip-gap',
    'tooltip.color': '--pie-chart-tooltip-color',
    'tooltip.background-color': '--pie-chart-tooltip-background-color',
    'tooltip.border-color': '--pie-chart-tooltip-border-color',
    'tooltip.border-radius': '--pie-chart-tooltip-border-radius',
    'tooltip.box-shadow': '--pie-chart-tooltip-box-shadow',
    'tooltip.value.color': '--pie-chart-tooltip-value-color',
    'tooltip.value.font-weight': '--pie-chart-tooltip-value-font-weight'
});

const token = defineTokens({
    'palette': {
        'series': {
            '1': {
                'color': `var(${vars['palette.series.1.color']}, var(--token-semantic-data-chart-series-1, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
            },
            '2': {
                'color': `var(${vars['palette.series.2.color']}, var(--token-semantic-data-chart-series-2, var(--token-global-material-tertiary-40, oklch(0.49038805 0.06053149 358.445477))))`
            },
            '3': {
                'color': `var(${vars['palette.series.3.color']}, var(--token-semantic-data-chart-series-3, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
            },
            '4': {
                'color': `var(${vars['palette.series.4.color']}, var(--token-semantic-data-chart-series-4, var(--token-global-amber-600, oklch(0.666 0.179 73))))`
            },
            '5': {
                'color': `var(${vars['palette.series.5.color']}, var(--token-semantic-data-chart-series-5, var(--token-global-material-secondary-40, oklch(0.48593316 0.03575478 299.614802))))`
            },
            '6': {
                'color': `var(${vars['palette.series.6.color']}, var(--token-semantic-data-chart-series-6, var(--token-global-green-600, oklch(0.627 0.194 153))))`
            },
            '7': {
                'color': `var(${vars['palette.series.7.color']}, var(--token-semantic-data-chart-series-7, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
            },
            '8': {
                'color': `var(${vars['palette.series.8.color']}, var(--token-semantic-data-chart-series-8, var(--token-global-red-600, oklch(0.577 0.245 25))))`
            }
        },
        'canvas': {
            'background-color': `var(${vars['palette.canvas.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
        }
    },
    'root': {
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'font-size': `var(${vars['root.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
        'gap': `var(${vars['root.gap']}, var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))))`,
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`
    },
    'legend': {
        'row-gap': `var(${vars['legend.row-gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`,
        'item': {
            'gap': `var(${vars['legend.item.gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`,
            'padding': `var(${vars['legend.item.padding']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 4) var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))))`,
            'border-radius': `var(${vars['legend.item.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px)))`,
            'color': `var(${vars['legend.item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'background-color-hover': `var(${vars['legend.item.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
            'background-color-pressed': `var(${vars['legend.item.background-color-pressed']}, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
            'transition': `var(${vars['legend.item.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
            'touch': {
                'min-width': `var(${vars['legend.item.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
                'min-height': `var(${vars['legend.item.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
            }
        }
    },
    'swatch': {
        'inline-size': `var(${vars['swatch.inline-size']}, 10px)`,
        'block-size': `var(${vars['swatch.block-size']}, 10px)`
    },
    'tooltip': {
        'padding': `var(${vars['tooltip.padding']}, var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) var(--token-semantic-density-padding, var(--token-semantic-density-standard-padding, var(--token-global-space-3, 12px))))`,
        'gap': `var(${vars['tooltip.gap']}, calc(var(--token-semantic-density-gap, var(--token-semantic-density-standard-gap, var(--token-global-space-2, 8px))) / 2))`,
        'color': `var(${vars['tooltip.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'background-color': `var(${vars['tooltip.background-color']}, var(--token-semantic-overlay-popover-background, var(--token-semantic-color-surface-container, var(--token-global-material-neutral-94, oklch(0.95362610 0.01470533 312.243326)))))`,
        'border-color': `var(${vars['tooltip.border-color']}, var(--token-semantic-overlay-popover-border, transparent))`,
        'border-radius': `var(${vars['tooltip.border-radius']}, var(--token-semantic-overlay-popover-shape, var(--token-global-radius-2, 4px)))`,
        'box-shadow': `var(${vars['tooltip.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`,
        'value': {
            'color': `var(${vars['tooltip.value.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-weight': `var(${vars['tooltip.value.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`
        }
    }
});

export default token;
