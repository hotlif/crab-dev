/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'background.color': '--notification-background-color',
    'text.color': '--notification-text-color',
    'padding': '--notification-padding',
    'border.radius': '--notification-border-radius',
    'title.margin.bottom': '--notification-title-margin-bottom',
    'title.font.size': '--notification-title-font-size',
    'title.line.height': '--notification-title-line-height',
    'content.font.size': '--notification-content-font-size',
    'progress.start.color': '--notification-progress-start-color',
    'progress.end.color': '--notification-progress-end-color',
    'progress.height': '--notification-progress-height',
    'close.opacity': '--notification-close-opacity'
};

const token = {
    'background': {
        'color': `var(${vars['background.color']}, $ref(color.background.elevated))`
    },
    'text': {
        'color': `var(${vars['text.color']}, $ref(color.text.primary))`
    },
    'padding': `var(${vars['padding']}, $ref(space.card-padding) $ref(space.dialog-padding))`,
    'border': {
        'radius': `var(${vars['border.radius']}, $ref(radius.lg))`
    },
    'title': {
        'margin': {
            'bottom': `var(${vars['title.margin.bottom']}, $ref(space.component-gap))`
        },
        'font': {
            'size': `var(${vars['title.font.size']}, $ref(font.size.subhead))`
        },
        'line': {
            'height': `var(${vars['title.line.height']}, 1.5)`
        }
    },
    'content': {
        'font': {
            'size': `var(${vars['content.font.size']}, $ref(font.size.body))`
        }
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, $ref(color.feedback.success))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, $ref(color.feedback.success))`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    },
    'close': {
        'opacity': `var(${vars['close.opacity']}, $ref(opacity.tertiary))`
    }
};

export default token;
