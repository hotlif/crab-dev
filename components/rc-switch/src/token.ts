/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--switch-transition',
    'track.width': '--switch-track-width',
    'track.height': '--switch-track-height',
    'track.border.radius': '--switch-track-border-radius',
    'track.background.color': '--switch-track-background-color',
    'track.background.color-hover': '--switch-track-background-color-hover',
    'handle.size': '--switch-handle-size',
    'handle.offset': '--switch-handle-offset',
    'handle.background.color': '--switch-handle-background-color',
    'handle.box-shadow': '--switch-handle-box-shadow',
    'label.gap': '--switch-label-gap',
    'label.font.size': '--switch-label-font-size',
    'label.color': '--switch-label-color',
    'label.color-disabled': '--switch-label-color-disabled',
    'small.track.width': '--switch-small-track-width',
    'small.track.height': '--switch-small-track-height',
    'small.track.border.radius': '--switch-small-track-border-radius',
    'small.handle.size': '--switch-small-handle-size',
    'small.handle.offset': '--switch-small-handle-offset',
    'checked.track.background.color': '--switch-checked-track-background-color',
    'checked.track.background.color-hover': '--switch-checked-track-background-color-hover',
    'disabled.track.background.color': '--switch-disabled-track-background-color',
    'disabled.checked.track.background.color': '--switch-disabled-checked-track-background-color',
    'disabled.handle.background.color': '--switch-disabled-handle-background-color'
};

const token = {
    'transition': `var(${vars['transition']}, background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'track': {
        'width': `var(${vars['track.width']}, 44px)`,
        'height': `var(${vars['track.height']}, 22px)`,
        'border': {
            'radius': `var(${vars['track.border.radius']}, 11px)`
        },
        'background': {
            'color': `var(${vars['track.background.color']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'color-hover': `var(${vars['track.background.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
        }
    },
    'handle': {
        'size': `var(${vars['handle.size']}, 18px)`,
        'offset': `var(${vars['handle.offset']}, 2px)`,
        'background': {
            'color': `var(${vars['handle.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        },
        'box-shadow': `var(${vars['handle.box-shadow']}, 0 1px 2px oklch(0 0 0 / 0.2))`
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font': {
            'size': `var(${vars['label.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'small': {
        'track': {
            'width': `var(${vars['small.track.width']}, 28px)`,
            'height': `var(${vars['small.track.height']}, 16px)`,
            'border': {
                'radius': `var(${vars['small.track.border.radius']}, 8px)`
            }
        },
        'handle': {
            'size': `var(${vars['small.handle.size']}, 12px)`,
            'offset': `var(${vars['small.handle.offset']}, 2px)`
        }
    },
    'checked': {
        'track': {
            'background': {
                'color': `var(${vars['checked.track.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
                'color-hover': `var(${vars['checked.track.background.color-hover']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286))))`
            }
        }
    },
    'disabled': {
        'track': {
            'background': {
                'color': `var(${vars['disabled.track.background.color']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
            }
        },
        'checked': {
            'track': {
                'background': {
                    'color': `var(${vars['disabled.checked.track.background.color']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
                }
            }
        },
        'handle': {
            'background': {
                'color': `var(${vars['disabled.handle.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
            }
        }
    }
};

export default token;
