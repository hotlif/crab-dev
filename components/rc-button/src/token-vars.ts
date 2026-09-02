import { vars as generatedVars } from './token.js';

type LegacyButtonKey =
    | 'transition'
    | 'opacity.loading'
    | 'opacity.disabled'
    | 'size.large.border.radius'
    | 'size.large.font.size'
    | 'size.middle.border.radius'
    | 'size.middle.font.size'
    | 'size.small.border.radius'
    | 'size.small.font.size'
    | 'primary.background.color'
    | 'primary.background.color-disabled'
    | 'primary.background.color-hover'
    | 'primary.background.color-active'
    | 'link.background.color'
    | 'link.background.color-disabled'
    | 'link.text.underline-offset'
    | 'link.text.decoration.color'
    | 'link.text.decoration.width'
    | 'text.background.color-hover'
    | 'text.background.color-active'
    | 'dashed.background.color'
    | 'dashed.background.color-disabled'
    | 'subtle.background.color'
    | 'subtle.background.color-disabled'
    | 'danger.background.color'
    | 'danger.background.color-disabled'
    | 'danger.background.color-hover'
    | 'danger.background.color-active'
    | 'selected.background.color'
    | 'selected.color'
    | 'selected.border-color';

/** @deprecated Prefer TokenVars. Legacy keys remain until the next major version. */
export const vars: typeof generatedVars & Readonly<Record<LegacyButtonKey, string>> = {
    ...generatedVars,
    transition: '--button-transition',
    'opacity.loading': '--button-opacity-loading',
    'opacity.disabled': '--button-opacity-disabled',
    'size.large.border.radius': '--button-size-large-border-radius',
    'size.large.font.size': '--button-size-large-font-size',
    'size.middle.border.radius': '--button-size-middle-border-radius',
    'size.middle.font.size': '--button-size-middle-font-size',
    'size.small.border.radius': '--button-size-small-border-radius',
    'size.small.font.size': '--button-size-small-font-size',
    'primary.background.color': '--button-primary-background-color',
    'primary.background.color-disabled': '--button-primary-background-color-disabled',
    'primary.background.color-hover': '--button-primary-background-color-hover',
    'primary.background.color-active': '--button-primary-background-color-active',
    'link.background.color': '--button-link-background-color',
    'link.background.color-disabled': '--button-link-background-color-disabled',
    'link.text.underline-offset': '--button-link-text-underline-offset',
    'link.text.decoration.color': '--button-link-text-decoration-color',
    'link.text.decoration.width': '--button-link-text-decoration-width',
    'text.background.color-hover': '--button-text-background-color-hover',
    'text.background.color-active': '--button-text-background-color-active',
    'dashed.background.color': '--button-dashed-background-color',
    'dashed.background.color-disabled': '--button-dashed-background-color-disabled',
    'subtle.background.color': '--button-subtle-background-color',
    'subtle.background.color-disabled': '--button-subtle-background-color-disabled',
    'danger.background.color': '--button-danger-background-color',
    'danger.background.color-disabled': '--button-danger-background-color-disabled',
    'danger.background.color-hover': '--button-danger-background-color-hover',
    'danger.background.color-active': '--button-danger-background-color-active',
    'selected.background.color': '--button-selected-background-color',
    'selected.color': '--button-selected-color',
    'selected.border-color': '--button-selected-border-color',
};
