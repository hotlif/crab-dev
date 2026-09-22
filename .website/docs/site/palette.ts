import { defineTokens } from "@crab-dev/css";
import global from "@crab-dev/rc-token-global";
import token, { themeColorContract as theme } from "@crab-dev/rc-token-semantic";

/** Public Material primitives shared with component themes. */
export const material = defineTokens({
    ...global.material,
    primary: global.purple,
    variant: global.material['neutral-variant'],
});

export const stateLayers = defineTokens({ hover: `calc(${token.state.opacity.hover} * 100%)`, pressed: `calc(${token.state.opacity.pressed} * 100%)` });

/** View-model aliases only: actual theme roles are owned by public L2 and rc-theme. */
export const colors = defineTokens({
    light: {
        brand: theme.light.brand.primary, hover: theme.light.brand.hover, active: theme.light.brand.active, onBrand: theme.light.text.onBrand,
        canvas: theme.light.surface.canvas, surface: theme.light.surface.content, elevated: theme.light.surface.raised,
        text: theme.light.text.primary, secondary: theme.light.text.secondary, muted: theme.light.text.tertiary,
        border: theme.light.border.default, divider: theme.light.border.subtle,
        selected: theme.light.selection.background, onSelected: theme.light.selection.foreground, focus: theme.light.focusRing,
        primaryContainer: theme.light.selection.background, onPrimaryContainer: theme.light.selection.foreground,
        tertiary: theme.light.brand.primary, onTertiary: theme.light.text.onBrand,
        neutralHover: theme.light.background.hoverSubtle, neutralActive: theme.light.background.activeSubtle,
        inactive: theme.light.fill.inactive,
        feedback: {
            error: {
                text: theme.light.feedback.error.text, background: theme.light.feedback.error.background,
                icon: theme.light.feedback.error.icon, border: theme.light.feedback.error.border,
                solid: theme.light.feedback.error.solid, onSolid: theme.light.feedback.error.onSolid,
                hover: theme.light.feedback.error.solidHover, active: theme.light.feedback.error.solidActive,
            },
            success: {
                text: theme.light.feedback.success.text, background: theme.light.feedback.success.background,
                icon: theme.light.feedback.success.icon, border: theme.light.feedback.success.border,
                solid: theme.light.feedback.success.solid, onSolid: theme.light.feedback.success.onSolid,
                hover: theme.light.feedback.success.solidHover, active: theme.light.feedback.success.solidActive,
            },
            warning: {
                text: theme.light.feedback.warning.text, background: theme.light.feedback.warning.background,
                icon: theme.light.feedback.warning.icon, border: theme.light.feedback.warning.border,
                solid: theme.light.feedback.warning.solid, onSolid: theme.light.feedback.warning.onSolid,
                hover: theme.light.feedback.warning.solidHover, active: theme.light.feedback.warning.solidActive,
            },
            info: {
                text: theme.light.feedback.info.text, background: theme.light.feedback.info.background,
                icon: theme.light.feedback.info.icon, border: theme.light.feedback.info.border,
                solid: theme.light.feedback.info.solid, onSolid: theme.light.feedback.info.onSolid,
                hover: theme.light.feedback.info.solidHover, active: theme.light.feedback.info.solidActive,
            },
        },
    },
    dark: {
        brand: theme.dark.brand.primary, hover: theme.dark.brand.hover, active: theme.dark.brand.active, onBrand: theme.dark.text.onBrand,
        canvas: theme.dark.surface.canvas, surface: theme.dark.surface.content, elevated: theme.dark.surface.raised,
        text: theme.dark.text.primary, secondary: theme.dark.text.secondary, muted: theme.dark.text.tertiary,
        border: theme.dark.border.default, divider: theme.dark.border.subtle,
        selected: theme.dark.selection.background, onSelected: theme.dark.selection.foreground, focus: theme.dark.focusRing,
        primaryContainer: theme.dark.selection.background, onPrimaryContainer: theme.dark.selection.foreground,
        tertiary: theme.dark.brand.primary, onTertiary: theme.dark.text.onBrand,
        neutralHover: theme.dark.background.hoverSubtle, neutralActive: theme.dark.background.activeSubtle,
        inactive: theme.dark.fill.inactive,
        feedback: {
            error: {
                text: theme.dark.feedback.error.text, background: theme.dark.feedback.error.background,
                icon: theme.dark.feedback.error.icon, border: theme.dark.feedback.error.border,
                solid: theme.dark.feedback.error.solid, onSolid: theme.dark.feedback.error.onSolid,
                hover: theme.dark.feedback.error.solidHover, active: theme.dark.feedback.error.solidActive,
            },
            success: {
                text: theme.dark.feedback.success.text, background: theme.dark.feedback.success.background,
                icon: theme.dark.feedback.success.icon, border: theme.dark.feedback.success.border,
                solid: theme.dark.feedback.success.solid, onSolid: theme.dark.feedback.success.onSolid,
                hover: theme.dark.feedback.success.solidHover, active: theme.dark.feedback.success.solidActive,
            },
            warning: {
                text: theme.dark.feedback.warning.text, background: theme.dark.feedback.warning.background,
                icon: theme.dark.feedback.warning.icon, border: theme.dark.feedback.warning.border,
                solid: theme.dark.feedback.warning.solid, onSolid: theme.dark.feedback.warning.onSolid,
                hover: theme.dark.feedback.warning.solidHover, active: theme.dark.feedback.warning.solidActive,
            },
            info: {
                text: theme.dark.feedback.info.text, background: theme.dark.feedback.info.background,
                icon: theme.dark.feedback.info.icon, border: theme.dark.feedback.info.border,
                solid: theme.dark.feedback.info.solid, onSolid: theme.dark.feedback.info.onSolid,
                hover: theme.dark.feedback.info.solidHover, active: theme.dark.feedback.info.solidActive,
            },
        },
    },
});
