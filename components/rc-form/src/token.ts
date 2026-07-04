/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'item.gap': '--form-item-gap',
    'row.gap': '--form-row-gap',
    'label.color': '--form-label-color',
    'label.font-size': '--form-label-font-size',
    'label.font-weight': '--form-label-font-weight',
    'required.color': '--form-required-color',
    'required.gap': '--form-required-gap',
    'status.size': '--form-status-size',
    'status.error.color': '--form-status-error-color',
    'status.warning.color': '--form-status-warning-color',
    'status.success.color': '--form-status-success-color',
    'status.validating.color': '--form-status-validating-color'
};

const token = {
    'item': {
        'gap': `var(${vars['item.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'row': {
        'gap': `var(${vars['row.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'label': {
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'font-size': `var(${vars['label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'font-weight': `var(${vars['label.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'required': {
        'color': `var(${vars['required.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`,
        'gap': `var(${vars['required.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    },
    'status': {
        'size': `var(${vars['status.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'error': {
            'color': `var(${vars['status.error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
        },
        'warning': {
            'color': `var(${vars['status.warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
        },
        'success': {
            'color': `var(${vars['status.success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'validating': {
            'color': `var(${vars['status.validating.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
        }
    }
};

export default token;
