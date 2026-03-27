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
            'color': `var(${vars['overlay.background.color']}, rgba(0,0,0,0.45))`
        }
    },
    'background': {
        'color': `var(${vars['background.color']}, #fff)`
    },
    'top': `var(${vars['top']}, 100px)`,
    'padding': `var(${vars['padding']}, 20px 24px)`,
    'border': {
        'radius': `var(${vars['border.radius']}, 8px)`
    },
    'box': {
        'shadow': `var(${vars['box.shadow']}, 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05))`
    },
    'heading': {
        'margin': {
            'bottom': `var(${vars['heading.margin.bottom']}, 15px)`
        },
        'font': {
            'weight': `var(${vars['heading.font.weight']}, 600)`,
            'size': `var(${vars['heading.font.size']}, 16px)`
        },
        'line': {
            'height': `var(${vars['heading.line.height']}, 1.5)`
        }
    },
    'footer': {
        'margin': {
            'top': `var(${vars['footer.margin.top']}, 12px)`
        },
        'button': {
            'spacing': `var(${vars['footer.button.spacing']}, 8px)`
        }
    }
};

export default token;
