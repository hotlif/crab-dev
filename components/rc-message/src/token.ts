/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'padding': '--message-padding',
    'border.radius': '--message-border-radius',
    'font.size': '--message-font-size',
    'line.height': '--message-line-height',
    'background.color': '--message-background-color',
    'box-shadow': '--message-box-shadow',
    'icon.size': '--message-icon-size',
    'icon.margin.right': '--message-icon-margin-right',
    'success.color': '--message-success-color',
    'warning.color': '--message-warning-color',
    'error.color': '--message-error-color',
    'info.color': '--message-info-color',
    'text.color': '--message-text-color',
    'progress.start.color': '--message-progress-start-color',
    'progress.end.color': '--message-progress-end-color',
    'progress.height': '--message-progress-height'
};

const token = {
    'padding': `var(${vars['padding']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
    },
    'font': {
        'size': `var(${vars['font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
    },
    'line': {
        'height': `var(${vars['line.height']}, 1.625)`
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'box-shadow': `var(${vars['box-shadow']}, 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05))`,
    'icon': {
        'size': `var(${vars['icon.size']}, 18px)`,
        'margin': {
            'right': `var(${vars['icon.margin.right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
    },
    'error': {
        'color': `var(${vars['error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
    },
    'info': {
        'color': `var(${vars['info.color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    }
};

export default token;
