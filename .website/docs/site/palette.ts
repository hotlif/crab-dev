import { defineTokens } from "@crab-dev/css";
import global from "@crab-dev/rc-token-global";
import { themeColorContract as theme } from "@crab-dev/rc-token-semantic";

/**
 * Documentation-only L1 candidates: Material Web v0.192 baseline, converted to OKLCh.
 * Source: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-ref-palette.scss
 * Purple is public L1; other Material values below are reference samples, not theme overrides.
 */
export const material = defineTokens({
    primary: global.purple,
    secondary: {
        10: "oklch(0.22720107 0.03472821 293.650491)", // #1D192B
        30: "oklch(0.40051726 0.03400329 298.591155)", // #4A4458
        90: "oklch(0.91633372 0.03651492 303.106047)", // #E8DEF8
    },
    tertiary: {
        20: "oklch(0.31707471 0.05705134 357.820836)", // #492532
        40: "oklch(0.49038805 0.06053149 358.445477)", // #7D5260
        80: "oklch(0.83670391 0.06656148 359.427110)", // #EFB8C8
        100: "oklch(0.99999999 0.00000004 0.000000)", // #FFFFFF
    },
    neutral: {
        6: "oklch(0.18737531 0.01240815 300.422032)", // #141218
        10: "oklch(0.22652446 0.00999107 303.713695)", // #1D1B20
        17: "oklch(0.28590291 0.01292568 298.632643)", // #2B2930
        90: "oklch(0.91401081 0.01366394 314.754144)", // #E6E0E9
        92: "oklch(0.93250577 0.01478797 312.240074)", // #ECE6F0
        96: "oklch(0.96728288 0.01181410 313.217082)", // #F7F2FA
        98: "oklch(0.98379491 0.01284496 321.893957)", // #FEF7FF
    },
    variant: {
        30: "oklch(0.39805288 0.01735545 303.720936)", // #49454F
        50: "oklch(0.56674707 0.01627446 308.142182)", // #79747E
        60: "oklch(0.65664348 0.01530769 304.011222)", // #938F99
        80: "oklch(0.82874810 0.01775809 308.222736)", // #CAC4D0
    },
    error: {
        10: "oklch(0.25390329 0.07937181 27.605486)", // #410E0B
        20: "oklch(0.32453655 0.10920306 28.011391)", // #601410
        30: "oklch(0.42004860 0.14731394 28.135269)", // #8C1D18
        40: "oklch(0.50128208 0.17831791 28.704727)", // #B3261E
        80: "oklch(0.83448797 0.06771254 22.011824)", // #F2B8B5
        90: "oklch(0.92214553 0.03006356 22.785053)", // #F9DEDC
        100: "oklch(0.99999999 0.00000004 0.000000)", // #FFFFFF
    },
});

export const stateLayers = defineTokens({ hover: "8%", pressed: "12%" });

/** View-model aliases only: actual theme roles are owned by public L2 and rc-theme. */
export const colors = defineTokens({
    light: {
        brand: theme.light.brand.primary, hover: theme.light.brand.hover, active: theme.light.brand.active, onBrand: theme.light.text.onBrand,
        canvas: theme.light.background.sunken, surface: theme.light.background.surface, elevated: theme.light.background.elevated,
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
        canvas: theme.dark.background.sunken, surface: theme.dark.background.surface, elevated: theme.dark.background.elevated,
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
