/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'overlay.background.color': '--drawer-overlay-background-color',
    'background.color': '--drawer-background-color',
    'box.shadow': '--drawer-box-shadow',
    'size.small.width': '--drawer-size-small-width',
    'size.small.height': '--drawer-size-small-height',
    'size.medium.width': '--drawer-size-medium-width',
    'size.medium.height': '--drawer-size-medium-height',
    'size.large.width': '--drawer-size-large-width',
    'size.large.height': '--drawer-size-large-height',
    'header.padding': '--drawer-header-padding',
    'header.border.color': '--drawer-header-border-color',
    'header.title.font.weight': '--drawer-header-title-font-weight',
    'header.title.font.size': '--drawer-header-title-font-size',
    'header.title.color': '--drawer-header-title-color',
    'header.title.line.height': '--drawer-header-title-line-height',
    'header.title.letter.spacing': '--drawer-header-title-letter-spacing',
    'body.padding': '--drawer-body-padding',
    'footer.padding': '--drawer-footer-padding',
    'footer.border.color': '--drawer-footer-border-color',
    'footer.gap': '--drawer-footer-gap',
    'close.size': '--drawer-close-size',
    'close.icon.size': '--drawer-close-icon-size',
    'close.color': '--drawer-close-color',
    'close.color-hover': '--drawer-close-color-hover',
    'close.background.color-hover': '--drawer-close-background-color-hover',
    'close.border.radius': '--drawer-close-border-radius',
    'transition.duration': '--drawer-transition-duration',
    'transition.easing': '--drawer-transition-easing'
};

const token = {
    'overlay': {
        'background': {
            'color': `var(${vars['overlay.background.color']}, var(--token-semantic-color-background-overlay, oklch(0 0 0 / 0.45)))`
        }
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'box': {
        'shadow': `var(${vars['box.shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, 280px)`,
            'height': `var(${vars['size.small.height']}, 240px)`
        },
        'medium': {
            'width': `var(${vars['size.medium.width']}, 420px)`,
            'height': `var(${vars['size.medium.height']}, 360px)`
        },
        'large': {
            'width': `var(${vars['size.large.width']}, 560px)`,
            'height': `var(${vars['size.large.height']}, 480px)`
        }
    },
    'header': {
        'padding': `var(${vars['header.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'border': {
            'color': `var(${vars['header.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'title': {
            'font': {
                'weight': `var(${vars['header.title.font.weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`,
                'size': `var(${vars['header.title.font.size']}, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px)))`
            },
            'color': `var(${vars['header.title.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'line': {
                'height': `var(${vars['header.title.line.height']}, 1.35)`
            },
            'letter': {
                'spacing': `var(${vars['header.title.letter.spacing']}, -0.01em)`
            }
        }
    },
    'body': {
        'padding': `var(${vars['body.padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`
    },
    'footer': {
        'padding': `var(${vars['footer.padding']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
        'border': {
            'color': `var(${vars['footer.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'gap': `var(${vars['footer.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'close': {
        'size': `var(${vars['close.size']}, 32px)`,
        'icon': {
            'size': `var(${vars['close.icon.size']}, 16px)`
        },
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background': {
            'color-hover': `var(${vars['close.background.color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'border': {
            'radius': `var(${vars['close.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
        }
    },
    'transition': {
        'duration': `var(${vars['transition.duration']}, 280ms)`,
        'easing': `var(${vars['transition.easing']}, cubic-bezier(0.32, 0.72, 0, 1))`
    }
};

export default token;
