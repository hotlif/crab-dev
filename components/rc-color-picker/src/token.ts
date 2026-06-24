/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'panel.padding.y': '--color-picker-panel-padding-y',
    'panel.padding.x': '--color-picker-panel-padding-x',
    'panel.gap': '--color-picker-panel-gap',
    'panel.preview.height': '--color-picker-panel-preview-height',
    'panel.preview.width': '--color-picker-panel-preview-width',
    'panel.preview.border.radius': '--color-picker-panel-preview-border-radius',
    'panel.preview.margin.top': '--color-picker-panel-preview-margin-top',
    'panel.slider.container.gap': '--color-picker-panel-slider-container-gap'
};

const token = {
    'panel': {
        'padding': {
            'y': `var(${vars['panel.padding.y']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`,
            'x': `var(${vars['panel.padding.x']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
        },
        'gap': `var(${vars['panel.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'preview': {
            'height': `var(${vars['panel.preview.height']}, 5rem)`,
            'width': `var(${vars['panel.preview.width']}, 100%)`,
            'border': {
                'radius': `var(${vars['panel.preview.border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
            },
            'margin': {
                'top': `var(${vars['panel.preview.margin.top']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            }
        },
        'slider': {
            'container': {
                'gap': `var(${vars['panel.slider.container.gap']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
            }
        }
    }
};

export default token;
