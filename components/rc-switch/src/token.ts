/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--switch-transition',
    'label.gap': '--switch-label-gap',
    'label.font.size': '--switch-label-font-size',
    'label.color': '--switch-label-color',
    'label.color-disabled': '--switch-label-color-disabled',
    'size.large.track.width': '--switch-size-large-track-width',
    'size.large.track.height': '--switch-size-large-track-height',
    'size.large.track.border.radius': '--switch-size-large-track-border-radius',
    'size.large.handle.size': '--switch-size-large-handle-size',
    'size.large.handle.offset': '--switch-size-large-handle-offset',
    'size.middle.track.width': '--switch-size-middle-track-width',
    'size.middle.track.height': '--switch-size-middle-track-height',
    'size.middle.track.border.radius': '--switch-size-middle-track-border-radius',
    'size.middle.handle.size': '--switch-size-middle-handle-size',
    'size.middle.handle.offset': '--switch-size-middle-handle-offset',
    'size.small.track.width': '--switch-size-small-track-width',
    'size.small.track.height': '--switch-size-small-track-height',
    'size.small.track.border.radius': '--switch-size-small-track-border-radius',
    'size.small.handle.size': '--switch-size-small-handle-size',
    'size.small.handle.offset': '--switch-size-small-handle-offset',
    'track.background.color': '--switch-track-background-color',
    'track.background.color-hover': '--switch-track-background-color-hover',
    'checked.track.background.color': '--switch-checked-track-background-color',
    'checked.track.background.color-hover': '--switch-checked-track-background-color-hover',
    'handle.background.color': '--switch-handle-background-color',
    'handle.box-shadow': '--switch-handle-box-shadow',
    'disabled.track.background.color': '--switch-disabled-track-background-color',
    'disabled.checked.track.background.color': '--switch-disabled-checked-track-background-color',
    'disabled.handle.background.color': '--switch-disabled-handle-background-color'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font': {
            'size': `var(${vars['label.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'size': {
        'large': {
            'track': {
                'width': `var(${vars['size.large.track.width']}, 52px)`,
                'height': `var(${vars['size.large.track.height']}, 28px)`,
                'border': {
                    'radius': `var(${vars['size.large.track.border.radius']}, 14px)`
                }
            },
            'handle': {
                'size': `var(${vars['size.large.handle.size']}, 24px)`,
                'offset': `var(${vars['size.large.handle.offset']}, 2px)`
            }
        },
        'middle': {
            'track': {
                'width': `var(${vars['size.middle.track.width']}, 44px)`,
                'height': `var(${vars['size.middle.track.height']}, 22px)`,
                'border': {
                    'radius': `var(${vars['size.middle.track.border.radius']}, 11px)`
                }
            },
            'handle': {
                'size': `var(${vars['size.middle.handle.size']}, 18px)`,
                'offset': `var(${vars['size.middle.handle.offset']}, 2px)`
            }
        },
        'small': {
            'track': {
                'width': `var(${vars['size.small.track.width']}, 28px)`,
                'height': `var(${vars['size.small.track.height']}, 16px)`,
                'border': {
                    'radius': `var(${vars['size.small.track.border.radius']}, 8px)`
                }
            },
            'handle': {
                'size': `var(${vars['size.small.handle.size']}, 12px)`,
                'offset': `var(${vars['size.small.handle.offset']}, 2px)`
            }
        }
    },
    'track': {
        'background': {
            'color': `var(${vars['track.background.color']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'color-hover': `var(${vars['track.background.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
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
    'handle': {
        'background': {
            'color': `var(${vars['handle.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        },
        'box-shadow': `var(${vars['handle.box-shadow']}, 0 1px 2px oklch(0 0 0 / 0.2))`
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
});

export default token;
