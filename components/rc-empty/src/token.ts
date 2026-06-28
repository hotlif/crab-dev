/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'container.padding': '--empty-container-padding',
    'container.min-height': '--empty-container-min-height',
    'image.size': '--empty-image-size',
    'image.color': '--empty-image-color',
    'image.margin-bottom': '--empty-image-margin-bottom',
    'title.color': '--empty-title-color',
    'title.font-size': '--empty-title-font-size',
    'title.font-weight': '--empty-title-font-weight',
    'title.margin-bottom': '--empty-title-margin-bottom',
    'description.color': '--empty-description-color',
    'description.font-size': '--empty-description-font-size',
    'description.margin-bottom': '--empty-description-margin-bottom'
};

const token = {
    'container': {
        'padding': `var(${vars['container.padding']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'min-height': `var(${vars['container.min-height']}, 200px)`
    },
    'image': {
        'size': `var(${vars['image.size']}, 80px)`,
        'color': `var(${vars['image.color']}, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'margin-bottom': `var(${vars['image.margin-bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'title': {
        'color': `var(${vars['title.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'font-weight': `var(${vars['title.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'description': {
        'color': `var(${vars['description.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`,
        'font-size': `var(${vars['description.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'margin-bottom': `var(${vars['description.margin-bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    }
};

export default token;
