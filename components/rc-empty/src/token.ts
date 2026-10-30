/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'container.padding': '--empty-container-padding',
    'container.min-height': '--empty-container-min-height',
    'container.font-family': '--empty-container-font-family',
    'image.width': '--empty-image-width',
    'image.color': '--empty-image-color',
    'image.margin-bottom': '--empty-image-margin-bottom',
    'title.color': '--empty-title-color',
    'title.font-size': '--empty-title-font-size',
    'title.font-weight': '--empty-title-font-weight',
    'title.margin-bottom': '--empty-title-margin-bottom',
    'title.line-height': '--empty-title-line-height',
    'description.color': '--empty-description-color',
    'description.font-size': '--empty-description-font-size',
    'description.margin-bottom': '--empty-description-margin-bottom',
    'description.line-height': '--empty-description-line-height',
    'description.max-width': '--empty-description-max-width',
    'action.gap': '--empty-action-gap',
    'action.margin-top': '--empty-action-margin-top'
});

const token = defineTokens({
    'container': {
        'padding': `var(${vars['container.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-5, 20px)))`,
        'min-height': `var(${vars['container.min-height']}, 144px)`,
        'font-family': `var(${vars['container.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`
    },
    'image': {
        'width': `var(${vars['image.width']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
        'color': `var(${vars['image.color']}, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286)))))`,
        'margin-bottom': `var(${vars['image.margin-bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'title': {
        'color': `var(${vars['title.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'font-weight': `var(${vars['title.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'line-height': `var(${vars['title.line-height']}, var(--token-semantic-typography-title-medium-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'description': {
        'color': `var(${vars['description.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'font-size': `var(${vars['description.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
        'margin-bottom': `var(${vars['description.margin-bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
        'line-height': `var(${vars['description.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'max-width': `var(${vars['description.max-width']}, calc(var(--token-semantic-size-64, var(--token-global-size-64, 64px)) * 5))`
    },
    'action': {
        'gap': `var(${vars['action.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'margin-top': `var(${vars['action.margin-top']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    }
});

export default token;
