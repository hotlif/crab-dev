/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'panel.padding': '--color-picker-panel-padding',
    'panel.gap': '--color-picker-panel-gap',
    'panel.preview.height': '--color-picker-panel-preview-height',
    'panel.preview.width': '--color-picker-panel-preview-width',
    'panel.preview.border.radius': '--color-picker-panel-preview-border-radius',
    'panel.preview.margin.top': '--color-picker-panel-preview-margin-top',
    'panel.slider.container.gap': '--color-picker-panel-slider-container-gap'
};

const token = {
    'panel': {
        'padding': `var(${vars['panel.padding']}, 16px)`,
        'gap': `var(${vars['panel.gap']}, 1rem)`,
        'preview': {
            'height': `var(${vars['panel.preview.height']}, 5rem)`,
            'width': `var(${vars['panel.preview.width']}, 100%)`,
            'border': {
                'radius': `var(${vars['panel.preview.border.radius']}, 8px)`
            },
            'margin': {
                'top': `var(${vars['panel.preview.margin.top']}, 1rem)`
            }
        },
        'slider': {
            'container': {
                'gap': `var(${vars['panel.slider.container.gap']}, 1rem)`
            }
        }
    }
};

export default token;
