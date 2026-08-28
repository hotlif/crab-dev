/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'vertical.item.inline-indent': '--menu-vertical-item-inline-indent',
    'vertical.item.title.width': '--menu-vertical-item-title-width',
    'vertical.item.title.height': '--menu-vertical-item-title-height',
    'vertical.item.title.color': '--menu-vertical-item-title-color',
    'vertical.item.title.font-size': '--menu-vertical-item-title-font-size',
    'vertical.item.title.padding-inline-start': '--menu-vertical-item-title-padding-inline-start',
    'vertical.item.title.padding-inline-end': '--menu-vertical-item-title-padding-inline-end',
    'vertical.item.title.margin-top': '--menu-vertical-item-title-margin-top',
    'vertical.item.title.margin-bottom': '--menu-vertical-item-title-margin-bottom',
    'vertical.item.title.border-radius': '--menu-vertical-item-title-border-radius',
    'vertical.item.title.transition': '--menu-vertical-item-title-transition',
    'vertical.item.title.background-color-hover': '--menu-vertical-item-title-background-color-hover',
    'vertical.item.title.background-color-active': '--menu-vertical-item-title-background-color-active',
    'vertical.item.title.background-color-select': '--menu-vertical-item-title-background-color-select',
    'vertical.item.title.background-color-open': '--menu-vertical-item-title-background-color-open',
    'vertical.item.title.color-hover': '--menu-vertical-item-title-color-hover',
    'vertical.item.title.color-active': '--menu-vertical-item-title-color-active',
    'vertical.item.title.color-select': '--menu-vertical-item-title-color-select',
    'vertical.item.title.color-open': '--menu-vertical-item-title-color-open',
    'vertical.item.title.font-weight-select': '--menu-vertical-item-title-font-weight-select',
    'vertical.item.children.background-color': '--menu-vertical-item-children-background-color',
    'vertical.item.children.padding': '--menu-vertical-item-children-padding',
    'vertical.item.icon.size': '--menu-vertical-item-icon-size',
    'vertical.item.icon.margin-right': '--menu-vertical-item-icon-margin-right',
    'vertical.item-group.title.color': '--menu-vertical-item-group-title-color',
    'vertical.item-group.title.height': '--menu-vertical-item-group-title-height',
    'vertical.item-group.title.font-size': '--menu-vertical-item-group-title-font-size',
    'vertical.item-group.title.font-weight': '--menu-vertical-item-group-title-font-weight',
    'vertical.item-group.title.letter-spacing': '--menu-vertical-item-group-title-letter-spacing',
    'vertical.item-group.title.text-transform': '--menu-vertical-item-group-title-text-transform',
    'vertical.collapsed.width': '--menu-vertical-collapsed-width',
    'vertical.collapsed.item.title.height': '--menu-vertical-collapsed-item-title-height',
    'vertical.collapsed.item.title.padding-inline': '--menu-vertical-collapsed-item-title-padding-inline',
    'vertical.collapsed.item.icon.size': '--menu-vertical-collapsed-item-icon-size',
    'vertical.collapsed.transition': '--menu-vertical-collapsed-transition',
    'vertical.submenu.background-color': '--menu-vertical-submenu-background-color',
    'vertical.submenu.box-shadow': '--menu-vertical-submenu-box-shadow',
    'vertical.submenu.padding': '--menu-vertical-submenu-padding',
    'vertical.submenu.border-radius': '--menu-vertical-submenu-border-radius',
    'vertical.submenu.min-width': '--menu-vertical-submenu-min-width',
    'vertical.submenu.z-index': '--menu-vertical-submenu-z-index',
    'vertical.submenu.offset': '--menu-vertical-submenu-offset',
    'vertical.tooltip.background-color': '--menu-vertical-tooltip-background-color',
    'vertical.tooltip.color': '--menu-vertical-tooltip-color',
    'vertical.tooltip.padding-inline': '--menu-vertical-tooltip-padding-inline',
    'vertical.tooltip.padding-block': '--menu-vertical-tooltip-padding-block',
    'vertical.tooltip.border-radius': '--menu-vertical-tooltip-border-radius',
    'vertical.tooltip.font-size': '--menu-vertical-tooltip-font-size',
    'vertical.tooltip.z-index': '--menu-vertical-tooltip-z-index',
    'horizontal.border-color': '--menu-horizontal-border-color',
    'horizontal.item.font-size': '--menu-horizontal-item-font-size',
    'horizontal.item.transition': '--menu-horizontal-item-transition',
    'horizontal.item.color-hover': '--menu-horizontal-item-color-hover',
    'horizontal.item.content.height': '--menu-horizontal-item-content-height',
    'horizontal.item.content.padding-left': '--menu-horizontal-item-content-padding-left',
    'horizontal.item.content.font-size': '--menu-horizontal-item-content-font-size',
    'horizontal.item.content.background-color-hover': '--menu-horizontal-item-content-background-color-hover',
    'horizontal.item.icon.margin-right': '--menu-horizontal-item-icon-margin-right',
    'horizontal.submenu.background-color': '--menu-horizontal-submenu-background-color',
    'horizontal.submenu.box-shadow': '--menu-horizontal-submenu-box-shadow',
    'horizontal.submenu.padding': '--menu-horizontal-submenu-padding',
    'horizontal.submenu.line-height': '--menu-horizontal-submenu-line-height',
    'horizontal.submenu.border-radius': '--menu-horizontal-submenu-border-radius',
    'horizontal.submenu.z-index': '--menu-horizontal-submenu-z-index',
    'horizontal.group-item.indent-base': '--menu-horizontal-group-item-indent-base',
    'horizontal.group-item.indent-scale': '--menu-horizontal-group-item-indent-scale',
    'horizontal.group-item.font-size': '--menu-horizontal-group-item-font-size',
    'horizontal.group-item.margin': '--menu-horizontal-group-item-margin',
    'horizontal.group-item.transition': '--menu-horizontal-group-item-transition',
    'horizontal.group-item.title.color': '--menu-horizontal-group-item-title-color',
    'horizontal.group-item.title.font-weight': '--menu-horizontal-group-item-title-font-weight',
    'horizontal.group-item.header.padding-inline': '--menu-horizontal-group-item-header-padding-inline',
    'horizontal.group-item.icon.color': '--menu-horizontal-group-item-icon-color',
    'horizontal.group-item.icon.margin-right': '--menu-horizontal-group-item-icon-margin-right'
});

const token = defineTokens({
    'vertical': {
        'item': {
            'inline-indent': `var(${vars['vertical.item.inline-indent']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
            'title': {
                'width': `var(${vars['vertical.item.title.width']}, 100%)`,
                'height': `var(${vars['vertical.item.title.height']}, 2.5rem)`,
                'color': `var(${vars['vertical.item.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'font-size': `var(${vars['vertical.item.title.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
                'padding-inline-start': `var(${vars['vertical.item.title.padding-inline-start']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
                'padding-inline-end': `var(${vars['vertical.item.title.padding-inline-end']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
                'margin-top': `var(${vars['vertical.item.title.margin-top']}, 0.125rem)`,
                'margin-bottom': `var(${vars['vertical.item.title.margin-bottom']}, 0.125rem)`,
                'border-radius': `var(${vars['vertical.item.title.border-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
                'transition': `var(${vars['vertical.item.title.transition']}, background-color var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))), color var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
                'background-color-hover': `var(${vars['vertical.item.title.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
                'background-color-active': `var(${vars['vertical.item.title.background-color-active']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
                'background-color-select': `var(${vars['vertical.item.title.background-color-select']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
                'background-color-open': `var(${vars['vertical.item.title.background-color-open']}, transparent)`,
                'color-hover': `var(${vars['vertical.item.title.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'color-active': `var(${vars['vertical.item.title.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'color-select': `var(${vars['vertical.item.title.color-select']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'color-open': `var(${vars['vertical.item.title.color-open']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'font-weight-select': `var(${vars['vertical.item.title.font-weight-select']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
            },
            'children': {
                'background-color': `var(${vars['vertical.item.children.background-color']}, transparent)`,
                'padding': `var(${vars['vertical.item.children.padding']}, 0px)`
            },
            'icon': {
                'size': `var(${vars['vertical.item.icon.size']}, 1rem)`,
                'margin-right': `var(${vars['vertical.item.icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
            }
        },
        'item-group': {
            'title': {
                'color': `var(${vars['vertical.item-group.title.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`,
                'height': `var(${vars['vertical.item-group.title.height']}, 2rem)`,
                'font-size': `var(${vars['vertical.item-group.title.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
                'font-weight': `var(${vars['vertical.item-group.title.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
                'letter-spacing': `var(${vars['vertical.item-group.title.letter-spacing']}, 0.04em)`,
                'text-transform': `var(${vars['vertical.item-group.title.text-transform']}, uppercase)`
            }
        },
        'collapsed': {
            'width': `var(${vars['vertical.collapsed.width']}, 4rem)`,
            'item': {
                'title': {
                    'height': `var(${vars['vertical.collapsed.item.title.height']}, 2.5rem)`,
                    'padding-inline': `var(${vars['vertical.collapsed.item.title.padding-inline']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
                },
                'icon': {
                    'size': `var(${vars['vertical.collapsed.item.icon.size']}, 1.125rem)`
                }
            },
            'transition': `var(${vars['vertical.collapsed.transition']}, width var(--token-semantic-motion-expand, var(--token-global-duration-slow, 300ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), padding var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
        },
        'submenu': {
            'background-color': `var(${vars['vertical.submenu.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
            'box-shadow': `var(${vars['vertical.submenu.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
            'padding': `var(${vars['vertical.submenu.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'border-radius': `var(${vars['vertical.submenu.border-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
            'min-width': `var(${vars['vertical.submenu.min-width']}, 10rem)`,
            'z-index': `var(${vars['vertical.submenu.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-10, 1000)))`,
            'offset': `var(${vars['vertical.submenu.offset']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'tooltip': {
            'background-color': `var(${vars['vertical.tooltip.background-color']}, var(--token-semantic-color-background-overlay, oklch(0 0 0 / 0.45)))`,
            'color': `var(${vars['vertical.tooltip.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
            'padding-inline': `var(${vars['vertical.tooltip.padding-inline']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'padding-block': `var(${vars['vertical.tooltip.padding-block']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'border-radius': `var(${vars['vertical.tooltip.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
            'font-size': `var(${vars['vertical.tooltip.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'z-index': `var(${vars['vertical.tooltip.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-10, 1000)))`
        }
    },
    'horizontal': {
        'border-color': `var(${vars['horizontal.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'item': {
            'font-size': `var(${vars['horizontal.item.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'transition': `var(${vars['horizontal.item.transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
            'color-hover': `var(${vars['horizontal.item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'content': {
                'height': `var(${vars['horizontal.item.content.height']}, 2.5rem)`,
                'padding-left': `var(${vars['horizontal.item.content.padding-left']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
                'font-size': `var(${vars['horizontal.item.content.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
                'background-color-hover': `var(${vars['horizontal.item.content.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
            },
            'icon': {
                'margin-right': `var(${vars['horizontal.item.icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
            }
        },
        'submenu': {
            'background-color': `var(${vars['horizontal.submenu.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
            'box-shadow': `var(${vars['horizontal.submenu.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
            'padding': `var(${vars['horizontal.submenu.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'line-height': `var(${vars['horizontal.submenu.line-height']}, 2.5rem)`,
            'border-radius': `var(${vars['horizontal.submenu.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
            'z-index': `var(${vars['horizontal.submenu.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-10, 1000)))`
        },
        'group-item': {
            'indent-base': `var(${vars['horizontal.group-item.indent-base']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'indent-scale': `var(${vars['horizontal.group-item.indent-scale']}, 1)`,
            'font-size': `var(${vars['horizontal.group-item.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'margin': `var(${vars['horizontal.group-item.margin']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) 0px)`,
            'transition': `var(${vars['horizontal.group-item.transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
            'title': {
                'color': `var(${vars['horizontal.group-item.title.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
                'font-weight': `var(${vars['horizontal.group-item.title.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
            },
            'header': {
                'padding-inline': `var(${vars['horizontal.group-item.header.padding-inline']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            },
            'icon': {
                'color': `var(${vars['horizontal.group-item.icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
                'margin-right': `var(${vars['horizontal.group-item.icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
            }
        }
    }
});

export default token;
