/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background-color-selected': '--date-picker-root-background-color-selected',
    'root.color-selected': '--date-picker-root-color-selected',
    'cell.background-color-hover': '--date-picker-cell-background-color-hover',
    'cell.color-hover': '--date-picker-cell-color-hover',
    'cell.color-disabled': '--date-picker-cell-color-disabled',
    'cell.padding': '--date-picker-cell-padding',
    'cell.border-radius': '--date-picker-cell-border-radius',
    'cell.content.width': '--date-picker-cell-content-width',
    'cell.font-size': '--date-picker-cell-font-size',
    'cell.font-weight': '--date-picker-cell-font-weight',
    'cell.transition': '--date-picker-cell-transition',
    'cell.touch.width': '--date-picker-cell-touch-width',
    'header.padding': '--date-picker-header-padding',
    'header.cell.height': '--date-picker-header-cell-height',
    'header.font-size': '--date-picker-header-font-size',
    'header.line-height': '--date-picker-header-line-height',
    'header.font-weight': '--date-picker-header-font-weight',
    'action.bar.margin-top': '--date-picker-action-bar-margin-top',
    'action.bar.gap': '--date-picker-action-bar-gap',
    'panel.font-size': '--date-picker-panel-font-size',
    'panel.padding': '--date-picker-panel-padding',
    'panel.narrow.padding': '--date-picker-panel-narrow-padding',
    'panel.max-width': '--date-picker-panel-max-width',
    'panel.background-color': '--date-picker-panel-background-color',
    'panel.border-radius': '--date-picker-panel-border-radius',
    'navigation.width': '--date-picker-navigation-width',
    'timezone.font-size': '--date-picker-timezone-font-size',
    'timezone.opacity': '--date-picker-timezone-opacity',
    'out-of-range.opacity': '--date-picker-out-of-range-opacity',
    'icon.opacity': '--date-picker-icon-opacity',
    'icon.opacity-hover': '--date-picker-icon-opacity-hover',
    'time.input.width': '--date-picker-time-input-width',
    'time.input.gap': '--date-picker-time-input-gap',
    'time.section.gap': '--date-picker-time-section-gap',
    'time.title.color': '--date-picker-time-title-color',
    'time.title.font-size': '--date-picker-time-title-font-size',
    'time.title.font-weight': '--date-picker-time-title-font-weight',
    'time.title.line-height': '--date-picker-time-title-line-height',
    'time.support.color': '--date-picker-time-support-color',
    'time.support.font-size': '--date-picker-time-support-font-size',
    'time.support.line-height': '--date-picker-time-support-line-height'
});

const token = defineTokens({
    'root': {
        'background-color-selected': `var(${vars['root.background-color-selected']}, var(--date-picker-background-color-selected, var(--date-picker-selected-background-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`,
        'color-selected': `var(${vars['root.color-selected']}, var(--date-picker-color-selected, var(--date-picker-selected-color, var(--date-picker-selected-text-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0)))))))`
    },
    'cell': {
        'background-color-hover': `var(${vars['cell.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'color-hover': `var(${vars['cell.color-hover']}, var(--date-picker-cell-text-color-hover, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'color-disabled': `var(${vars['cell.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'padding': `var(${vars['cell.padding']}, 0px)`,
        'border-radius': `var(${vars['cell.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'content': {
            'width': `var(${vars['cell.content.width']}, var(--date-picker-cell-content-size, var(--token-semantic-size-40, var(--token-global-size-40, 40px))))`
        },
        'font-size': `var(${vars['cell.font-size']}, var(--token-semantic-typography-label-font-size, var(--token-global-font-size-sm, 14px)))`,
        'font-weight': `var(${vars['cell.font-weight']}, 400)`,
        'transition': `var(${vars['cell.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'touch': {
            'width': `var(${vars['cell.touch.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
        }
    },
    'header': {
        'padding': `var(${vars['header.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'cell': {
            'height': `var(${vars['header.cell.height']}, 40px)`
        },
        'font-size': `var(${vars['header.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['header.line-height']}, 1.4)`,
        'font-weight': `var(${vars['header.font-weight']}, 400)`
    },
    'action': {
        'bar': {
            'margin-top': `var(${vars['action.bar.margin-top']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'gap': `var(${vars['action.bar.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'panel': {
        'font-size': `var(${vars['panel.font-size']}, var(--token-semantic-typography-label-font-size, var(--token-global-font-size-sm, 14px)))`,
        'padding': `var(${vars['panel.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'narrow': {
            'padding': `var(${vars['panel.narrow.padding']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'max-width': `var(${vars['panel.max-width']}, calc(100vw - var(--token-semantic-size-48, var(--token-global-size-48, 48px))))`,
        'background-color': `var(${vars['panel.background-color']}, var(--token-semantic-color-surface-high, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074))))`,
        'border-radius': `var(${vars['panel.border-radius']}, var(--token-semantic-shape-extra-large, var(--token-global-radius-14, 28px)))`
    },
    'navigation': {
        'width': `var(${vars['navigation.width']}, var(--date-picker-navigation-size, var(--token-semantic-size-48, var(--token-global-size-48, 48px))))`
    },
    'timezone': {
        'font-size': `var(${vars['timezone.font-size']}, var(--token-semantic-typography-label-medium-font-size, var(--token-global-font-size-xs, 12px)))`,
        'opacity': `var(${vars['timezone.opacity']}, var(--date-picker-opacity-timezone, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7))))`
    },
    'out-of-range': {
        'opacity': `var(${vars['out-of-range.opacity']}, var(--date-picker-opacity-out-of-range, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38))))`
    },
    'icon': {
        'opacity': `var(${vars['icon.opacity']}, var(--date-picker-opacity-icon, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5))))`,
        'opacity-hover': `var(${vars['icon.opacity-hover']}, var(--date-picker-opacity-icon-hover, var(--token-semantic-opacity-hover, var(--token-global-opacity-80, 0.8))))`
    },
    'time': {
        'input': {
            'width': `var(${vars['time.input.width']}, 80px)`,
            'gap': `var(${vars['time.input.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'section': {
            'gap': `var(${vars['time.section.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'title': {
            'color': `var(${vars['time.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-size': `var(${vars['time.title.font-size']}, var(--token-semantic-typography-title-large-font-size, var(--token-global-font-size-22, 22px)))`,
            'font-weight': `var(${vars['time.title.font-weight']}, var(--token-semantic-typography-title-large-font-weight, var(--token-global-font-weight-regular, 400)))`,
            'line-height': `var(${vars['time.title.line-height']}, var(--token-semantic-typography-title-large-line-height, var(--token-global-line-height-22-28, 1.2727272727272727)))`
        },
        'support': {
            'color': `var(${vars['time.support.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['time.support.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['time.support.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`
        }
    }
});

export default token;
