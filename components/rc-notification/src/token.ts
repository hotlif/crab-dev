/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'color.background': '--notification-color-background',
    'color.text': '--notification-color-text',
    'color.progress-start': '--notification-color-progress-start',
    'color.progress-end': '--notification-color-progress-end',
    'dimension.padding': '--notification-dimension-padding',
    'dimension.border-radius': '--notification-dimension-border-radius',
    'dimension.title-margin-bottom': '--notification-dimension-title-margin-bottom',
    'dimension.progress-height': '--notification-dimension-progress-height',
    'typography.title-font-size': '--notification-typography-title-font-size',
    'typography.title-line-height': '--notification-typography-title-line-height',
    'typography.content-font-size': '--notification-typography-content-font-size',
    'opacity.close': '--notification-opacity-close'
};

const token = {
    'color': {
        'background': `var(${vars['color.background']}, white)`,
        'text': `var(${vars['color.text']}, rgba(0,0,0,0.88))`,
        'progress-start': `var(${vars['color.progress-start']}, #22c55e)`,
        'progress-end': `var(${vars['color.progress-end']}, #16a34a)`
    },
    'dimension': {
        'padding': `var(${vars['dimension.padding']}, 20px 24px)`,
        'border-radius': `var(${vars['dimension.border-radius']}, 8px)`,
        'title-margin-bottom': `var(${vars['dimension.title-margin-bottom']}, 10px)`,
        'progress-height': `var(${vars['dimension.progress-height']}, 3px)`
    },
    'typography': {
        'title-font-size': `var(${vars['typography.title-font-size']}, 16px)`,
        'title-line-height': `var(${vars['typography.title-line-height']}, 1.5)`,
        'content-font-size': `var(${vars['typography.content-font-size']}, 14px)`
    },
    'motion': {

    },
    'elevation': {

    },
    'border': {

    },
    'opacity': {
        'close': `var(${vars['opacity.close']}, 0.7)`
    }
};

export default token;
