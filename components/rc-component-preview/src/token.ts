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
    'meta.actions.min-width': '--component-preview-meta-actions-min-width',
    'meta.actions.min-height': '--component-preview-meta-actions-min-height',
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
        'transition': `var(${vars['root.transition']}, color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
    },
    'source': {
        'transition': `var(${vars['source.transition']}, grid-template-rows var(--token-semantic-motion-expand, var(--token-global-duration-500, 500ms) var(--token-global-easing-expressive-spatial-default, cubic-bezier(0.38, 1.21, 0.22, 1.00))))`,
        'background-color': `var(${vars['source.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'padding-block': `var(${vars['source.padding-block']}, 16px)`,
        'font-size': `var(${vars['source.font-size']}, 13px)`,
        'font-family': `var(${vars['source.font-family']}, ui-monospace, 'SFMono-Regular', 'Menlo', 'Cascadia Code', 'Fira Code', monospace)`,
        'line-height': `var(${vars['source.line-height']}, 1.7)`,
        'tab-size': `var(${vars['source.tab-size']}, 4)`,
        'border-color': `var(${vars['source.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'collapsed': {
            'max-height': `var(${vars['source.collapsed.max-height']}, 0px)`
        },
        'expanded': {
            'max-height': `var(${vars['source.expanded.max-height']}, 520px)`
        },
        'scrollbar': {
            'color': `var(${vars['source.scrollbar.color']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'color-hover': `var(${vars['source.scrollbar.color-hover']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        },
        'gutter': {
            'color': `var(${vars['source.gutter.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'min-width': `var(${vars['source.gutter.min-width']}, 2.5em)`,
            'padding-right': `var(${vars['source.gutter.padding-right']}, 16px)`,
            'margin-right': `var(${vars['source.gutter.margin-right']}, 20px)`
        }
    },
    'card': {
        'background-color': `var(${vars['card.background-color']}, var(--token-semantic-color-surface-low, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082))))`,
        'border-color': `var(${vars['card.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`,
        'border-color-hover': `var(${vars['card.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'border-radius': `var(${vars['card.border-radius']}, var(--token-semantic-shape-medium, var(--token-global-radius-6, 12px)))`,
        'box-shadow': `var(${vars['card.box-shadow']}, none)`,
        'box-shadow-hover': `var(${vars['card.box-shadow-hover']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15))))`
    },
    'stage': {
        'padding': `var(${vars['stage.padding']}, 56px 24px)`,
        'min-height': `var(${vars['stage.min-height']}, 220px)`,
        'background-color': `var(${vars['stage.background-color']}, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`
    },
    'meta': {
        'border-color': `var(${vars['meta.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'info': {
            'padding': `var(${vars['meta.info.padding']}, 0 20px 16px)`,
            'background-color': `var(${vars['meta.info.background-color']}, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`,
            'divider': {
                'border-style': `var(${vars['meta.info.divider.border-style']}, solid)`
            },
            'gap': `var(${vars['meta.info.gap']}, 6px)`
        },
        'title': {
            'padding': `var(${vars['meta.title.padding']}, 0 12px)`,
            'top': `var(${vars['meta.title.top']}, 24px)`,
            'color': `var(${vars['meta.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'font-size': `var(${vars['meta.title.font-size']}, 15px)`,
            'font-weight': `var(${vars['meta.title.font-weight']}, var(--token-semantic-typography-title-large-emphasized-font-weight, var(--token-global-font-weight-medium, 500)))`,
            'letter-spacing': `var(${vars['meta.title.letter-spacing']}, -0.01em)`,
            'line-height': `var(${vars['meta.title.line-height']}, 1.4)`
        },
        'actions': {
            'padding': `var(${vars['meta.actions.padding']}, 10px 14px)`,
            'background-color': `var(${vars['meta.actions.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
            'border-style': `var(${vars['meta.actions.border-style']}, solid)`,
            'gap': `var(${vars['meta.actions.gap']}, 4px)`,
            'min-width': `var(${vars['meta.actions.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['meta.actions.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'icon': {
                'width': `var(${vars['meta.actions.icon.width']}, 18px)`
            }
        },
        'desc': {
            'color': `var(${vars['meta.desc.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
            'font-size': `var(${vars['meta.desc.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
            'line-height': `var(${vars['meta.desc.line-height']}, 1.6)`,
            'code': {
                'color': `var(${vars['meta.desc.code.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
                'background-color': `var(${vars['meta.desc.code.background-color']}, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
                'padding': `var(${vars['meta.desc.code.padding']}, 1px 6px)`,
                'border-radius': `var(${vars['meta.desc.code.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px)))`
            }
        }
    },
    'action': {
        'height': `var(${vars['action.height']}, 30px)`,
        'padding': `var(${vars['action.padding']}, 0 12px)`,
        'gap': `var(${vars['action.gap']}, 6px)`,
        'border-radius': `var(${vars['action.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`,
        'font-size': `var(${vars['action.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
        'font-weight': `var(${vars['action.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'color': `var(${vars['action.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['action.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-active': `var(${vars['action.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['action.background-color']}, transparent)`,
        'background-color-hover': `var(${vars['action.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'background-color-active': `var(${vars['action.background-color-active']}, var(--token-semantic-color-surface-raised, var(--token-semantic-color-background-elevated, var(--token-global-material-neutral-96, oklch(0.96728288 0.01181410 313.217082)))))`,
        'border-color': `var(${vars['action.border-color']}, transparent)`,
        'border-color-hover': `var(${vars['action.border-color-hover']}, transparent)`,
        'border-color-active': `var(${vars['action.border-color-active']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-focus': `var(${vars['action.border-color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'box-shadow-active': `var(${vars['action.box-shadow-active']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`
    },
    'feedback': {
        'success': {
            'color': `var(${vars['feedback.success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-global-green-800, oklch(0.448 0.119 155))))`
        }
    }
});

export default token;
