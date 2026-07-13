/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'line.color': '--divider-line-color',
    'line.width': '--divider-line-width',
    'spacing.none': '--divider-spacing-none',
    'spacing.small': '--divider-spacing-small',
    'spacing.middle': '--divider-spacing-middle',
    'spacing.large': '--divider-spacing-large',
    'text.color': '--divider-text-color',
    'text.color-plain': '--divider-text-color-plain',
    'text.font-size': '--divider-text-font-size',
    'text.font-weight': '--divider-text-font-weight',
    'text.font-weight-plain': '--divider-text-font-weight-plain',
    'text.gap': '--divider-text-gap',
    'text.offset': '--divider-text-offset',
    'vertical.size': '--divider-vertical-size'
};

const token = {
    'line': {
        'color': `var(${vars['line.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'width': `var(${vars['line.width']}, 1px)`
    },
    'spacing': {
        'none': `var(${vars['spacing.none']}, 0px)`,
        'small': `var(${vars['spacing.small']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'middle': `var(${vars['spacing.middle']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`,
        'large': `var(${vars['spacing.large']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-plain': `var(${vars['text.color-plain']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'font-size': `var(${vars['text.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'font-weight': `var(${vars['text.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'font-weight-plain': `var(${vars['text.font-weight-plain']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`,
        'gap': `var(${vars['text.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'offset': `var(${vars['text.offset']}, 5%)`
    },
    'vertical': {
        'size': `var(${vars['vertical.size']}, 1em)`
    }
};

export default token;
