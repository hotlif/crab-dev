/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--line-edit-transition',
    'border.radius': '--line-edit-border-radius',
    'border.width': '--line-edit-border-width',
    'border.style': '--line-edit-border-style',
    'border.color': '--line-edit-border-color',
    'border.color-focus': '--line-edit-border-color-focus',
    'box-shadow.default': '--line-edit-box-shadow-default',
    'box-shadow.focus-within': '--line-edit-box-shadow-focus-within',
    'background.color': '--line-edit-background-color',
    'placeholder.color': '--line-edit-placeholder-color',
    'icon.color': '--line-edit-icon-color',
    'icon.margin-right': '--line-edit-icon-margin-right',
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
    'transition': `var(${vars['transition']}, $ref(motion.fade))`,
    'border': {
        'radius': `var(${vars['border.radius']}, $ref(radius.md))`,
        'width': `var(${vars['border.width']}, 1px)`,
        'style': `var(${vars['border.style']}, solid)`,
        'color': `var(${vars['border.color']}, $ref(color.border.default))`,
        'color-focus': `var(${vars['border.color-focus']}, $ref(color.border.focus))`
    },
    'box-shadow': {
        'default': `var(${vars['box-shadow.default']}, $ref(shadow.float))`,
        'focus-within': `var(${vars['box-shadow.focus-within']}, $ref(shadow.float))`
    },
    'background': {
        'color': `var(${vars['background.color']}, transparent)`
    },
    'placeholder': {
        'color': `var(${vars['placeholder.color']}, $ref(color.text.secondary))`
    },
    'icon': {
        'color': `var(${vars['icon.color']}, $ref(color.text.secondary))`,
        'margin-right': `var(${vars['icon.margin-right']}, $ref(space.component-gap))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'padding': `var(${vars['size.large.padding']}, $ref(space.inline-gap) $ref(space.control-padding-x))`,
            'font': {
                'size': `var(${vars['size.large.font.size']}, $ref(font.size.subhead))`
            },
            'line-height': `var(${vars['size.large.line-height']}, 1.5rem)`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'padding': `var(${vars['size.middle.padding']}, $ref(space.inline-gap) $ref(space.control-padding-x))`,
            'font': {
                'size': `var(${vars['size.middle.font.size']}, $ref(font.size.body))`
            },
            'line-height': `var(${vars['size.middle.line-height']}, 1.25rem)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'padding': `var(${vars['size.small.padding']}, $ref(space.inline-gap) $ref(space.control-padding-x))`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, $ref(font.size.body))`
            },
            'line-height': `var(${vars['size.small.line-height']}, 1.25rem)`
        }
    }
};

export default token;
