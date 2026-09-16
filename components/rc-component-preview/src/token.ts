/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--component-preview-root-transition',
    'source.transition': '--component-preview-source-transition',
    'source.background-color': '--component-preview-source-background-color',
    'source.padding-block': '--component-preview-source-padding-block',
    'source.font-size': '--component-preview-source-font-size',
    'source.font-family': '--component-preview-source-font-family',
    'source.line-height': '--component-preview-source-line-height',
    'source.tab-size': '--component-preview-source-tab-size',
    'source.border-color': '--component-preview-source-border-color',
    'source.collapsed.max-height': '--component-preview-source-collapsed-max-height',
    'source.expanded.max-height': '--component-preview-source-expanded-max-height',
    'source.scrollbar.color': '--component-preview-source-scrollbar-color',
    'source.scrollbar.color-hover': '--component-preview-source-scrollbar-color-hover',
    'source.gutter.color': '--component-preview-source-gutter-color',
    'source.gutter.min-width': '--component-preview-source-gutter-min-width',
    'source.gutter.padding-right': '--component-preview-source-gutter-padding-right',
    'source.gutter.margin-right': '--component-preview-source-gutter-margin-right',
    'card.background-color': '--component-preview-card-background-color',
    'card.border-color': '--component-preview-card-border-color',
    'card.border-color-hover': '--component-preview-card-border-color-hover',
    'card.border-radius': '--component-preview-card-border-radius',
    'card.box-shadow': '--component-preview-card-box-shadow',
    'card.box-shadow-hover': '--component-preview-card-box-shadow-hover',
    'stage.padding': '--component-preview-stage-padding',
    'stage.min-height': '--component-preview-stage-min-height',
    'stage.background-color': '--component-preview-stage-background-color',
    'meta.border-color': '--component-preview-meta-border-color',
    'meta.info.padding': '--component-preview-meta-info-padding',
    'meta.info.background-color': '--component-preview-meta-info-background-color',
    'meta.info.divider.border-style': '--component-preview-meta-info-divider-border-style',
    'meta.info.gap': '--component-preview-meta-info-gap',
    'meta.title.padding': '--component-preview-meta-title-padding',
    'meta.title.top': '--component-preview-meta-title-top',
    'meta.title.color': '--component-preview-meta-title-color',
    'meta.title.font-size': '--component-preview-meta-title-font-size',
    'meta.title.font-weight': '--component-preview-meta-title-font-weight',
    'meta.title.letter-spacing': '--component-preview-meta-title-letter-spacing',
    'meta.title.line-height': '--component-preview-meta-title-line-height',
    'meta.actions.padding': '--component-preview-meta-actions-padding',
    'meta.actions.background-color': '--component-preview-meta-actions-background-color',
    'meta.actions.border-style': '--component-preview-meta-actions-border-style',
    'meta.actions.gap': '--component-preview-meta-actions-gap',
    'meta.actions.icon.width': '--component-preview-meta-actions-icon-width',
    'meta.desc.color': '--component-preview-meta-desc-color',
    'meta.desc.font-size': '--component-preview-meta-desc-font-size',
    'meta.desc.line-height': '--component-preview-meta-desc-line-height',
    'meta.desc.code.color': '--component-preview-meta-desc-code-color',
    'meta.desc.code.background-color': '--component-preview-meta-desc-code-background-color',
    'meta.desc.code.padding': '--component-preview-meta-desc-code-padding',
    'meta.desc.code.border-radius': '--component-preview-meta-desc-code-border-radius',
    'action.height': '--component-preview-action-height',
    'action.padding': '--component-preview-action-padding',
    'action.gap': '--component-preview-action-gap',
    'action.border-radius': '--component-preview-action-border-radius',
    'action.font-size': '--component-preview-action-font-size',
    'action.font-weight': '--component-preview-action-font-weight',
    'action.color': '--component-preview-action-color',
    'action.color-hover': '--component-preview-action-color-hover',
    'action.color-active': '--component-preview-action-color-active',
    'action.background-color': '--component-preview-action-background-color',
    'action.background-color-hover': '--component-preview-action-background-color-hover',
    'action.background-color-active': '--component-preview-action-background-color-active',
    'action.border-color': '--component-preview-action-border-color',
    'action.border-color-hover': '--component-preview-action-border-color-hover',
    'action.border-color-active': '--component-preview-action-border-color-active',
    'action.border-color-focus': '--component-preview-action-border-color-focus',
    'action.box-shadow-active': '--component-preview-action-box-shadow-active',
    'feedback.success.color': '--component-preview-feedback-success-color'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--component-preview-transition, color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), background-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), border-color var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), transform var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`
    },
    'source': {
        'transition': `var(${vars['source.transition']}, var(--component-preview-root-transition-expand, var(--component-preview-transition-expand, grid-template-rows var(--token-semantic-motion-expand, var(--token-global-duration-slow, 300ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))))`,
        'background-color': `var(${vars['source.background-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'padding-block': `var(${vars['source.padding-block']}, 16px)`,
        'font-size': `var(${vars['source.font-size']}, 13px)`,
        'font-family': `var(${vars['source.font-family']}, ui-monospace, 'SFMono-Regular', 'Menlo', 'Cascadia Code', 'Fira Code', monospace)`,
        'line-height': `var(${vars['source.line-height']}, 1.7)`,
        'tab-size': `var(${vars['source.tab-size']}, 4)`,
        'border-color': `var(${vars['source.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'collapsed': {
            'max-height': `var(${vars['source.collapsed.max-height']}, var(--component-preview-source-collapsed-height, 0px))`
        },
        'expanded': {
            'max-height': `var(${vars['source.expanded.max-height']}, var(--component-preview-source-expanded-height, 520px))`
        },
        'scrollbar': {
            'color': `var(${vars['source.scrollbar.color']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
            'color-hover': `var(${vars['source.scrollbar.color-hover']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`
        },
        'gutter': {
            'color': `var(${vars['source.gutter.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
            'min-width': `var(${vars['source.gutter.min-width']}, 2.5em)`,
            'padding-right': `var(${vars['source.gutter.padding-right']}, 16px)`,
            'margin-right': `var(${vars['source.gutter.margin-right']}, 20px)`
        }
    },
    'card': {
        'background-color': `var(${vars['card.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
        'border-color': `var(${vars['card.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'border-color-hover': `var(${vars['card.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'border-radius': `var(${vars['card.border-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
        'box-shadow': `var(${vars['card.box-shadow']}, var(--component-preview-card-shadow, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)))))`,
        'box-shadow-hover': `var(${vars['card.box-shadow-hover']}, var(--component-preview-card-shadow-hover, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`
    },
    'stage': {
        'padding': `var(${vars['stage.padding']}, 56px 24px)`,
        'min-height': `var(${vars['stage.min-height']}, 220px)`,
        'background-color': `var(${vars['stage.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'meta': {
        'border-color': `var(${vars['meta.border-color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'info': {
            'padding': `var(${vars['meta.info.padding']}, 0 20px 16px)`,
            'background-color': `var(${vars['meta.info.background-color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
            'divider': {
                'border-style': `var(${vars['meta.info.divider.border-style']}, var(--component-preview-meta-info-divider-style, solid))`
            },
            'gap': `var(${vars['meta.info.gap']}, 6px)`
        },
        'title': {
            'padding': `var(${vars['meta.title.padding']}, 0 12px)`,
            'top': `var(${vars['meta.title.top']}, var(--component-preview-meta-title-offset, 24px))`,
            'color': `var(${vars['meta.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'font-size': `var(${vars['meta.title.font-size']}, 15px)`,
            'font-weight': `var(${vars['meta.title.font-weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`,
            'letter-spacing': `var(${vars['meta.title.letter-spacing']}, -0.01em)`,
            'line-height': `var(${vars['meta.title.line-height']}, 1.4)`
        },
        'actions': {
            'padding': `var(${vars['meta.actions.padding']}, 10px 14px)`,
            'background-color': `var(${vars['meta.actions.background-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
            'border-style': `var(${vars['meta.actions.border-style']}, solid)`,
            'gap': `var(${vars['meta.actions.gap']}, 4px)`,
            'icon': {
                'width': `var(${vars['meta.actions.icon.width']}, var(--component-preview-meta-actions-icon-size, 18px))`
            }
        },
        'desc': {
            'color': `var(${vars['meta.desc.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
            'font-size': `var(${vars['meta.desc.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['meta.desc.line-height']}, 1.6)`,
            'code': {
                'color': `var(${vars['meta.desc.code.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
                'background-color': `var(${vars['meta.desc.code.background-color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
                'padding': `var(${vars['meta.desc.code.padding']}, 1px 6px)`,
                'border-radius': `var(${vars['meta.desc.code.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            }
        }
    },
    'action': {
        'height': `var(${vars['action.height']}, 30px)`,
        'padding': `var(${vars['action.padding']}, 0 12px)`,
        'gap': `var(${vars['action.gap']}, 6px)`,
        'border-radius': `var(${vars['action.border-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'font-size': `var(${vars['action.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'font-weight': `var(${vars['action.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'color': `var(${vars['action.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-hover': `var(${vars['action.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-active': `var(${vars['action.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background-color': `var(${vars['action.background-color']}, transparent)`,
        'background-color-hover': `var(${vars['action.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'background-color-active': `var(${vars['action.background-color-active']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
        'border-color': `var(${vars['action.border-color']}, transparent)`,
        'border-color-hover': `var(${vars['action.border-color-hover']}, transparent)`,
        'border-color-active': `var(${vars['action.border-color-active']}, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'border-color-focus': `var(${vars['action.border-color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'box-shadow-active': `var(${vars['action.box-shadow-active']}, var(--component-preview-action-shadow-active, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)))))`
    },
    'feedback': {
        'success': {
            'color': `var(${vars['feedback.success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-semantic-color-feedback-success, var(--token-global-green-800, oklch(0.448 0.119 155)))))`
        }
    }
});

export default token;
