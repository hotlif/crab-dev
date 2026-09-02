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
    'header.padding': '--date-picker-header-padding',
    'header.cell.height': '--date-picker-header-cell-height',
    'header.font-size': '--date-picker-header-font-size',
    'header.font-weight': '--date-picker-header-font-weight',
    'action.bar.margin-top': '--date-picker-action-bar-margin-top',
    'action.bar.gap': '--date-picker-action-bar-gap',
    'panel.font-size': '--date-picker-panel-font-size',
    'timezone.font-size': '--date-picker-timezone-font-size',
    'timezone.opacity': '--date-picker-timezone-opacity',
    'out-of-range.opacity': '--date-picker-out-of-range-opacity',
    'icon.opacity': '--date-picker-icon-opacity',
    'icon.opacity-hover': '--date-picker-icon-opacity-hover'
});

const token = defineTokens({
    'root': {
        'background-color-selected': `var(${vars['root.background-color-selected']}, var(--date-picker-background-color-selected, var(--date-picker-selected-background-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))))`,
        'color-selected': `var(${vars['root.color-selected']}, var(--date-picker-color-selected, var(--date-picker-selected-color, var(--date-picker-selected-text-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286)))))))`
    },
    'cell': {
        'background-color-hover': `var(${vars['cell.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'color-hover': `var(${vars['cell.color-hover']}, var(--date-picker-cell-text-color-hover, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`,
        'color-disabled': `var(${vars['cell.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'padding': `var(${vars['cell.padding']}, 3px 4px)`,
        'border-radius': `var(${vars['cell.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'content': {
            'width': `var(${vars['cell.content.width']}, var(--date-picker-cell-content-size, 24px))`
        },
        'font-size': `var(${vars['cell.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'font-weight': `var(${vars['cell.font-weight']}, 400)`,
        'transition': `var(${vars['cell.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
    },
    'header': {
        'padding': `var(${vars['header.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'cell': {
            'height': `var(${vars['header.cell.height']}, 40px)`
        },
        'font-size': `var(${vars['header.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'font-weight': `var(${vars['header.font-weight']}, 400)`
    },
    'action': {
        'bar': {
            'margin-top': `var(${vars['action.bar.margin-top']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'gap': `var(${vars['action.bar.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'panel': {
        'font-size': `var(${vars['panel.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
    },
    'timezone': {
        'font-size': `var(${vars['timezone.font-size']}, 10px)`,
        'opacity': `var(${vars['timezone.opacity']}, var(--date-picker-opacity-timezone, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7))))`
    },
    'out-of-range': {
        'opacity': `var(${vars['out-of-range.opacity']}, var(--date-picker-opacity-out-of-range, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3))))`
    },
    'icon': {
        'opacity': `var(${vars['icon.opacity']}, var(--date-picker-opacity-icon, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5))))`,
        'opacity-hover': `var(${vars['icon.opacity-hover']}, var(--date-picker-opacity-icon-hover, var(--token-semantic-opacity-hover, var(--token-global-opacity-80, 0.8))))`
    }
});

export default token;
