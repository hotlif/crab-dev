/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--line-edit-transition',
    'border.radius': '--line-edit-border-radius',
    'border.width': '--line-edit-border-width',
    'border.style': '--line-edit-border-style',
    'border.color': '--line-edit-border-color',
    'border.color-hover': '--line-edit-border-color-hover',
    'border.color-focus': '--line-edit-border-color-focus',
    'box-shadow.default': '--line-edit-box-shadow-default',
    'box-shadow.focus-within': '--line-edit-box-shadow-focus-within',
    'background.color': '--line-edit-background-color',
    'text.color': '--line-edit-text-color',
    'placeholder.color': '--line-edit-placeholder-color',
    'icon.color': '--line-edit-icon-color',
    'icon.gap': '--line-edit-icon-gap',
    'size.large.height': '--line-edit-size-large-height',
    'size.large.padding': '--line-edit-size-large-padding',
    'size.large.font.size': '--line-edit-size-large-font-size',
    'size.large.line-height': '--line-edit-size-large-line-height',
    'size.middle.height': '--line-edit-size-middle-height',
    'size.middle.padding': '--line-edit-size-middle-padding',
    'size.middle.font.size': '--line-edit-size-middle-font-size',
    'size.middle.line-height': '--line-edit-size-middle-line-height',
    'size.small.height': '--line-edit-size-small-height',
    'size.small.padding': '--line-edit-size-small-padding',
    'size.small.font.size': '--line-edit-size-small-font-size',
    'size.small.line-height': '--line-edit-size-small-line-height'
};

const token = {
    'transition': `var(${vars['transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'width': `var(${vars['border.width']}, 1px)`,
        'style': `var(${vars['border.style']}, solid)`,
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-hover': `var(${vars['border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'color-focus': `var(${vars['border.color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'box-shadow': {
        'default': `var(${vars['box-shadow.default']}, none)`,
        'focus-within': `var(${vars['box-shadow.focus-within']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'placeholder': {
        'color': `var(${vars['placeholder.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'gap': `var(${vars['icon.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'padding': `var(${vars['size.large.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.large.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
            },
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'padding': `var(${vars['size.middle.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.middle.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'padding': `var(${vars['size.small.padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)) var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    }
};

export default token;
