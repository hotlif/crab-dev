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
    'field.action.width': '--date-picker-field-action-width',
    'field.action.touch.width': '--date-picker-field-action-touch-width',
    'field.action.color': '--date-picker-field-action-color',
    'field.icon.width': '--date-picker-field-icon-width',
    'time.padding': '--date-picker-time-padding',
    'time.input.width': '--date-picker-time-input-width',
    'time.input.height': '--date-picker-time-input-height',
    'time.input.gap': '--date-picker-time-input-gap',
    'time.input.font-size': '--date-picker-time-input-font-size',
    'time.input.font-weight': '--date-picker-time-input-font-weight',
    'time.input.line-height': '--date-picker-time-input-line-height',
    'time.input.border-radius': '--date-picker-time-input-border-radius',
    'time.input.background': '--date-picker-time-input-background',
    'time.input.color': '--date-picker-time-input-color',
    'time.input.background-selected': '--date-picker-time-input-background-selected',
    'time.input.color-selected': '--date-picker-time-input-color-selected',
    'time.input.outline-color': '--date-picker-time-input-outline-color',
    'time.input.outline-width': '--date-picker-time-input-outline-width',
    'time.input.color-error': '--date-picker-time-input-color-error',
    'time.section.gap': '--date-picker-time-section-gap',
    'time.title.color': '--date-picker-time-title-color',
    'time.title.font-size': '--date-picker-time-title-font-size',
    'time.title.font-weight': '--date-picker-time-title-font-weight',
    'time.title.line-height': '--date-picker-time-title-line-height',
    'time.support.color': '--date-picker-time-support-color',
    'time.support.font-size': '--date-picker-time-support-font-size',
    'time.support.line-height': '--date-picker-time-support-line-height',
    'time.support.gap': '--date-picker-time-support-gap',
    'time.separator.width': '--date-picker-time-separator-width',
    'time.dial.width': '--date-picker-time-dial-width',
    'time.dial.field.width': '--date-picker-time-dial-field-width',
    'time.dial.field.height': '--date-picker-time-dial-field-height',
    'time.dial.font-size': '--date-picker-time-dial-font-size',
    'time.dial.line-height': '--date-picker-time-dial-line-height',
    'time.dial.label.font-size': '--date-picker-time-dial-label-font-size',
    'time.dial.handle.width': '--date-picker-time-dial-handle-width',
    'time.dial.track.width': '--date-picker-time-dial-track-width',
    'time.dial.background-selected': '--date-picker-time-dial-background-selected',
    'time.dial.color-selected': '--date-picker-time-dial-color-selected',
    'time.period.width': '--date-picker-time-period-width',
    'time.period.color': '--date-picker-time-period-color',
    'time.period.background-selected': '--date-picker-time-period-background-selected',
    'time.period.color-selected': '--date-picker-time-period-color-selected',
    'time.period.outline-color': '--date-picker-time-period-outline-color',
    'time.period.outline-width': '--date-picker-time-period-outline-width',
    'time.period.font-size': '--date-picker-time-period-font-size',
    'time.period.font-weight': '--date-picker-time-period-font-weight',
    'time.opacity-hover': '--date-picker-time-opacity-hover',
    'time.pressed.opacity': '--date-picker-time-pressed-opacity',
    'time.action.width': '--date-picker-time-action-width'
});

const token = defineTokens({
    'root': {
        'background-color-selected': `var(${vars['root.background-color-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'color-selected': `var(${vars['root.color-selected']}, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'cell': {
        'background-color-hover': `var(${vars['cell.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'color-hover': `var(${vars['cell.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['cell.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'padding': `var(${vars['cell.padding']}, 0px)`,
        'border-radius': `var(${vars['cell.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'content': {
            'width': `var(${vars['cell.content.width']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`
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
        'width': `var(${vars['navigation.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
    },
    'timezone': {
        'font-size': `var(${vars['timezone.font-size']}, var(--token-semantic-typography-label-medium-font-size, var(--token-global-font-size-xs, 12px)))`,
        'opacity': `var(${vars['timezone.opacity']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    },
    'out-of-range': {
        'opacity': `var(${vars['out-of-range.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    },
    'icon': {
        'opacity': `var(${vars['icon.opacity']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
        'opacity-hover': `var(${vars['icon.opacity-hover']}, var(--token-semantic-opacity-hover, var(--token-global-opacity-80, 0.8)))`
    },
    'field': {
        'action': {
            'width': `var(${vars['field.action.width']}, var(--token-semantic-sizing-middle-action, var(--token-global-size-40, 40px)))`,
            'touch': {
                'width': `var(${vars['field.action.touch.width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
            },
            'color': `var(${vars['field.action.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'icon': {
            'width': `var(${vars['field.icon.width']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`
        }
    },
    'time': {
        'padding': `var(${vars['time.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'input': {
            'width': `var(${vars['time.input.width']}, var(--token-semantic-size-96, var(--token-global-size-96, 96px)))`,
            'height': `var(${vars['time.input.height']}, calc(var(--token-semantic-size-48, var(--token-global-size-48, 48px)) + var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px))))`,
            'gap': `var(${vars['time.input.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['time.input.font-size']}, var(--token-semantic-typography-display-medium-font-size, var(--token-global-font-size-45, 45px)))`,
            'font-weight': `var(${vars['time.input.font-weight']}, var(--token-semantic-typography-display-medium-font-weight, var(--token-global-font-weight-regular, 400)))`,
            'line-height': `var(${vars['time.input.line-height']}, var(--token-semantic-typography-display-medium-line-height, var(--token-global-line-height-45-52, 1.1555555555555554)))`,
            'border-radius': `var(${vars['time.input.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`,
            'background': `var(${vars['time.input.background']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
            'color': `var(${vars['time.input.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'background-selected': `var(${vars['time.input.background-selected']}, var(--token-semantic-color-brand-container, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510)))))`,
            'color-selected': `var(${vars['time.input.color-selected']}, var(--token-semantic-color-brand-on-container, var(--token-semantic-color-selection-foreground, var(--token-global-purple-10, oklch(0.24199786 0.14038488 286.089811)))))`,
            'outline-color': `var(${vars['time.input.outline-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'outline-width': `var(${vars['time.input.outline-width']}, 2px)`,
            'color-error': `var(${vars['time.input.color-error']}, var(--token-semantic-color-border-error, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`
        },
        'section': {
            'gap': `var(${vars['time.section.gap']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`
        },
        'title': {
            'color': `var(${vars['time.title.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['time.title.font-size']}, var(--token-semantic-typography-label-medium-font-size, var(--token-global-font-size-xs, 12px)))`,
            'font-weight': `var(${vars['time.title.font-weight']}, var(--token-semantic-typography-label-medium-font-weight, var(--token-global-font-weight-medium, 500)))`,
            'line-height': `var(${vars['time.title.line-height']}, var(--token-semantic-typography-label-medium-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`
        },
        'support': {
            'color': `var(${vars['time.support.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['time.support.font-size']}, var(--token-semantic-typography-body-small-font-size, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['time.support.line-height']}, var(--token-semantic-typography-body-small-line-height, var(--token-global-line-height-12-16, 1.3333333333333333)))`,
            'gap': `var(${vars['time.support.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'separator': {
            'width': `var(${vars['time.separator.width']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`
        },
        'dial': {
            'width': `var(${vars['time.dial.width']}, calc(var(--token-semantic-size-64, var(--token-global-size-64, 64px)) * 4))`,
            'field': {
                'width': `var(${vars['time.dial.field.width']}, 114px)`,
                'height': `var(${vars['time.dial.field.height']}, calc(var(--token-semantic-size-40, var(--token-global-size-40, 40px)) * 2))`
            },
            'font-size': `var(${vars['time.dial.font-size']}, var(--token-semantic-typography-display-large-font-size, var(--token-global-font-size-57, 57px)))`,
            'line-height': `var(${vars['time.dial.line-height']}, var(--token-semantic-typography-display-large-line-height, var(--token-global-line-height-57-64, 1.1228070175438596)))`,
            'label': {
                'font-size': `var(${vars['time.dial.label.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`
            },
            'handle': {
                'width': `var(${vars['time.dial.handle.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
            },
            'track': {
                'width': `var(${vars['time.dial.track.width']}, 2px)`
            },
            'background-selected': `var(${vars['time.dial.background-selected']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'color-selected': `var(${vars['time.dial.color-selected']}, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))`
        },
        'period': {
            'width': `var(${vars['time.period.width']}, calc(var(--token-semantic-size-48, var(--token-global-size-48, 48px)) + var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
            'color': `var(${vars['time.period.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'background-selected': `var(${vars['time.period.background-selected']}, var(--token-semantic-color-tertiary-container, var(--token-global-material-tertiary-90, oklch(0.91836530 0.04597837 357.575729))))`,
            'color-selected': `var(${vars['time.period.color-selected']}, var(--token-semantic-color-tertiary-on-container, var(--token-global-material-tertiary-10, oklch(0.23230182 0.05433227 358.610728))))`,
            'outline-color': `var(${vars['time.period.outline-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
            'outline-width': `var(${vars['time.period.outline-width']}, 1px)`,
            'font-size': `var(${vars['time.period.font-size']}, var(--token-semantic-typography-title-medium-font-size, var(--token-global-font-size-md, 16px)))`,
            'font-weight': `var(${vars['time.period.font-weight']}, var(--token-semantic-typography-title-medium-font-weight, var(--token-global-font-weight-medium, 500)))`
        },
        'opacity-hover': `var(${vars['time.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
        'pressed': {
            'opacity': `var(${vars['time.pressed.opacity']}, var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)))`
        },
        'action': {
            'width': `var(${vars['time.action.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
        }
    }
});

export default token;
