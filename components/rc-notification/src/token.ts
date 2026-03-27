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
        'color': `var(${vars['background.color']}, white)`
    },
    'text': {
        'color': `var(${vars['text.color']}, rgba(0,0,0,0.88))`
    },
    'padding': `var(${vars['padding']}, 20px 24px)`,
    'border': {
        'radius': `var(${vars['border.radius']}, 8px)`
    },
    'title': {
        'margin': {
            'bottom': `var(${vars['title.margin.bottom']}, 10px)`
        },
        'font': {
            'size': `var(${vars['title.font.size']}, 16px)`
        },
        'line': {
            'height': `var(${vars['title.line.height']}, 1.5)`
        }
    },
    'content': {
        'font': {
            'size': `var(${vars['content.font.size']}, 14px)`
        }
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, #22c55e)`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, #16a34a)`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    },
    'close': {
        'opacity': `var(${vars['close.opacity']}, 0.7)`
    }
};

export default token;
