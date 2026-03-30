/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'overlay.background.color': '--dialog-overlay-background-color',
    'background.color': '--dialog-background-color',
    'top': '--dialog-top',
    'padding': '--dialog-padding',
    'border.radius': '--dialog-border-radius',
    'box.shadow': '--dialog-box-shadow',
    'heading.margin.bottom': '--dialog-heading-margin-bottom',
    'heading.font.weight': '--dialog-heading-font-weight',
    'heading.font.size': '--dialog-heading-font-size',
    'heading.line.height': '--dialog-heading-line-height',
    'footer.margin.top': '--dialog-footer-margin-top',
    'footer.button.spacing': '--dialog-footer-button-spacing'
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
    'top': `var(${vars['top']}, 100px)`,
    'padding': `var(${vars['padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
    },
    'box': {
        'shadow': `var(${vars['box.shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1))))`
    },
    'heading': {
        'margin': {
            'bottom': `var(${vars['heading.margin.bottom']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
        },
        'font': {
            'weight': `var(${vars['heading.font.weight']}, var(--token-semantic-font-weight-heading, var(--token-global-font-weight-semibold, 600)))`,
            'size': `var(${vars['heading.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        },
        'line': {
            'height': `var(${vars['heading.line.height']}, 1.5)`
        }
    },
    'footer': {
        'margin': {
            'top': `var(${vars['footer.margin.top']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
        },
        'button': {
            'spacing': `var(${vars['footer.button.spacing']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    }
};

export default token;
