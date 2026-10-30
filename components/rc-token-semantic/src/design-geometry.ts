import type { DesignSystem } from "./design-system.js";
import palette from "@crab-dev/rc-token-global";
import { defineTokens } from "@crab-dev/css";

/** Component geometry stays in L2 so nested design boundaries restore every role. */
export const designMetricsContract: Record<DesignSystem, DesignMetrics> = defineTokens({
    md3: {
        tab: { small: palette.size[32], medium: palette.size[48], large: palette.size[48], icon: palette.space[6], gap: palette.space[2] },
        dialog: { padding: palette.space[6], fontSize: palette.font.size["2xl"], lineHeight: palette.line.height["24-32"], fontWeight: palette.font.weight.regular },
        toggle: {
            small: { width: palette.space[7], height: palette.space[4], handle: palette.space[3], inset: palette.space["0-5"] },
            medium: { width: palette.size[52], height: palette.size[32], handle: palette.space[6], inset: palette.space[1] },
            large: { width: palette.size[52], height: palette.size[32], handle: palette.space[6], inset: palette.space[1] },
            stateLayer: palette.size[40], border: palette.space["0-5"],
        },
    },
    shadcn: {
        tab: { small: palette.size[32], medium: palette.size[36], large: palette.size[40], icon: palette.space[4], gap: palette.space[1] },
        dialog: { padding: palette.space[5], fontSize: palette.font.size.md, lineHeight: palette.line.height["16-24"], fontWeight: palette.font.weight.medium },
        toggle: {
            small: { width: palette.space[7], height: palette.space[4], handle: palette.space[3], inset: palette.space["0-5"] },
            medium: { width: palette.size[32], height: `calc(${palette.space[5]} - ${palette.space["0-5"]})`, handle: palette.space["3-5"], inset: palette.space["0-5"] },
            large: { width: palette.size[36], height: palette.space[5], handle: palette.space[4], inset: palette.space["0-5"] },
            stateLayer: palette.space[0], border: palette.space.px,
        },
    },
    apple: {
        tab: { small: palette.size[32], medium: palette.size[36], large: palette.size[40], icon: palette.space[4], gap: palette.space[1] },
        dialog: { padding: palette.space[6], fontSize: palette.font.size.md, lineHeight: palette.line.height["16-24"], fontWeight: palette.font.weight.semibold },
        toggle: {
            small: { width: palette.space[7], height: palette.space[4], handle: palette.space[3], inset: palette.space["0-5"] },
            medium: { width: palette.size[36], height: palette.size[22], handle: `calc(${palette.space[4]} + ${palette.space["0-5"]})`, inset: palette.space["0-5"] },
            large: { width: palette.size[44], height: `calc(${palette.space[6]} + ${palette.space["0-5"]})`, handle: palette.size[22], inset: palette.space["0-5"] },
            stateLayer: palette.space[0], border: palette.space.px,
        },
    },
});

/** Complete text-field layout roles; nested design boundaries reset each role. */
export const designFieldContract: Record<DesignSystem, DesignField> = defineTokens({
    md3: {
        formLayoutColumns: `auto minmax(0, 1fr) auto`,
        formFieldColumns: `minmax(0, 1fr)`,
        formFieldControlColumn: `1 / -1`,
        formFieldInline: `0`,
        layoutControlRow: `1`,
        layoutLabelRow: `1`,
        layoutSupportRow: `2`,
        layoutRowGap: `${palette.space["1"]}`,
        controlMinHeight: `${palette.size["56"]}`,
        controlPaddingInline: `${palette.space["4"]}`,
        controlIconPaddingInline: `${palette.space["3"]}`,
        iconSize: `${palette.space["6"]}`,
        iconGap: `${palette.space["4"]}`,
        inputFontSize: `${palette.font.size.md}`,
        inputLineHeight: `${palette.space["6"]}`,
        inputFilledPaddingTop: `${palette.space["4"]}`,
        labelAlign: `center`,
        labelMarginInline: `${palette.space["4"]}`,
        labelPrefixMarginInline: `calc(${palette.space["3"]} + ${palette.space["6"]} + ${palette.space["4"]})`,
        labelFontSize: `${palette.font.size.md}`,
        labelLineHeight: `${palette.space["6"]}`,
        labelEmptyPlaceholderColor: `transparent`,
        labelEmptyPlaceholderColorDisabled: `transparent`,
        labelMultilineOffset: `${palette.space["4"]}`,
        labelFloatingAlign: `start`,
        labelFloatingMarginInline: `${palette.space["4"]}`,
        labelFloatingFontSize: `${palette.font.size.xs}`,
        labelFloatingLineHeight: `${palette.space["4"]}`,
        labelFloatingTransform: `translateY(-50%)`,
        labelFilledOffset: `${palette.space["2"]}`,
        // Reset the custom property at this boundary so its consuming color uses
        // the token's `inherit` fallback, rather than an outer design's error color.
        requiredColor: `initial`,
        requiredOrder: `1`,
        requiredGap: `${palette.space["1"]}`,
        outlineDisplay: `block`,
        outlineLegendMargin: `${palette.space["3"]}`,
        outlineLegendPadding: `${palette.space["1"]}`,
        outlinedBorderColor: `transparent`,
        outlinedBorderColorHover: `transparent`,
        outlinedBorderColorFocus: `transparent`,
        outlinedShadowFocus: `none`,
        outlinedBorderColorError: `transparent`,
        outlinedBorderColorWarning: `transparent`,
        outlinedShadowError: `none`,
        outlinedShadowWarning: `none`,
        filledBorderRadius: `${palette.radius["2"]} ${palette.radius["2"]} 0 0`,
        filledBorderWidth: `0 0 1px`,
        filledBackgroundColor: `var(--token-semantic-color-surface-highest, ${palette.material.neutral["90"]})`,
        filledBackgroundColorHover: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]}) 8%, var(--token-semantic-color-surface-highest, ${palette.material.neutral["90"]}))`,
        filledBorderColor: `var(--token-semantic-color-text-secondary, ${palette.material["neutral-variant"]["30"]})`,
        filledBorderColorHover: `var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]})`,
        filledBorderColorFocus: `var(--token-semantic-color-border-focus, ${palette.purple["40"]})`,
        filledShadowFocus: `inset 0 -2px 0 var(--token-semantic-color-border-focus, ${palette.purple["40"]})`,
        filledShadowError: `inset 0 -2px 0 var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        filledShadowWarning: `inset 0 -2px 0 var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        supportPaddingInline: `${palette.space["4"]}`,
        disabledColor: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]}) 38%, transparent)`,
        disabledBorderColor: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]}) 12%, transparent)`,
        disabledFilledBorderColor: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]}) 38%, transparent)`,
        disabledFilledBackground: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.material.neutral["10"]}) 4%, transparent)`,
        inputMultilinePaddingBlock: `${palette.space["4"]}`,
        inputMultilineFilledPaddingTop: `${palette.space["6"]}`,
        inputMultilineFilledPaddingBottom: `${palette.space["2"]}`,
        // Material keeps its standard text-field geometry across the library's
        // three size inputs. See the TextEdit sizing exception and browser checks.
        multiline: {
            small: { minHeight: palette.size[56], paddingInline: palette.space[4], paddingBlock: palette.space[4], filledPaddingTop: palette.space[6], filledPaddingBottom: palette.space[2] },
            medium: { minHeight: palette.size[56], paddingInline: palette.space[4], paddingBlock: palette.space[4], filledPaddingTop: palette.space[6], filledPaddingBottom: palette.space[2] },
            large: { minHeight: palette.size[56], paddingInline: palette.space[4], paddingBlock: palette.space[4], filledPaddingTop: palette.space[6], filledPaddingBottom: palette.space[2] },
        },
    },
    shadcn: {
        formLayoutColumns: `fit-content(35%) minmax(0, 1fr) auto`,
        formFieldColumns: `subgrid`,
        formFieldControlColumn: `2 / -1`,
        formFieldInline: `1`,
        layoutControlRow: `2`,
        layoutLabelRow: `1`,
        layoutSupportRow: `3`,
        layoutRowGap: `${palette.space["2"]}`,
        controlMinHeight: `0px`,
        controlPaddingInline: `${palette.space["3"]}`,
        controlIconPaddingInline: `${palette.space["3"]}`,
        iconSize: `${palette.space["4"]}`,
        iconGap: `${palette.space["2"]}`,
        inputFontSize: `${palette.font.size.sm}`,
        inputLineHeight: `${palette.space["5"]}`,
        inputFilledPaddingTop: `0px`,
        labelAlign: `center`,
        labelMarginInline: `0px`,
        labelPrefixMarginInline: `0px`,
        labelFontSize: `${palette.font.size.sm}`,
        labelLineHeight: `${palette.space["5"]}`,
        labelEmptyPlaceholderColor: `var(--token-semantic-color-text-secondary, ${palette.neutral["500"]})`,
        labelEmptyPlaceholderColorDisabled: `var(--token-semantic-field-disabled-color)`,
        labelMultilineOffset: `0px`,
        labelFloatingAlign: `center`,
        labelFloatingMarginInline: `0px`,
        labelFloatingFontSize: `${palette.font.size.sm}`,
        labelFloatingLineHeight: `${palette.space["5"]}`,
        labelFloatingTransform: `none`,
        labelFilledOffset: `0px`,
        requiredColor: `var(--token-semantic-color-feedback-error-text, ${palette.material.error["40"]})`,
        requiredOrder: `-1`,
        requiredGap: `${palette.space["1"]}`,
        outlineDisplay: `none`,
        outlineLegendMargin: `0px`,
        outlineLegendPadding: `0px`,
        outlinedBorderColor: `var(--token-semantic-color-border-default, ${palette.neutral["200"]})`,
        outlinedBorderColorHover: `var(--token-semantic-color-border-hover, ${palette.neutral["400"]})`,
        outlinedBorderColorFocus: `var(--token-semantic-color-border-focus, ${palette.neutral["950"]})`,
        outlinedShadowFocus: `inset 0 0 0 2px var(--token-semantic-color-border-focus, ${palette.neutral["950"]})`,
        outlinedBorderColorError: `var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        outlinedBorderColorWarning: `var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        outlinedShadowError: `inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        outlinedShadowWarning: `inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        filledBorderRadius: `${palette.radius["4"]}`,
        filledBorderWidth: `1px`,
        filledBackgroundColor: `var(--token-semantic-color-background-surface, ${palette.white})`,
        filledBackgroundColorHover: `var(--token-semantic-color-background-surface, ${palette.white})`,
        filledBorderColor: `var(--token-semantic-color-border-default, ${palette.neutral["200"]})`,
        filledBorderColorHover: `var(--token-semantic-color-border-hover, ${palette.neutral["400"]})`,
        filledBorderColorFocus: `var(--token-semantic-color-border-focus, ${palette.neutral["950"]})`,
        filledShadowFocus: `inset 0 0 0 2px var(--token-semantic-color-border-focus, ${palette.neutral["950"]})`,
        filledShadowError: `inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        filledShadowWarning: `inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        supportPaddingInline: `0px`,
        disabledColor: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.neutral["950"]}) 50%, transparent)`,
        disabledBorderColor: `var(--token-semantic-color-border-default, ${palette.neutral["200"]})`,
        disabledFilledBorderColor: `var(--token-semantic-color-border-default, ${palette.neutral["200"]})`,
        disabledFilledBackground: `var(--token-semantic-color-background-surface, ${palette.white})`,
        inputMultilinePaddingBlock: `${palette.space["2"]}`,
        inputMultilineFilledPaddingTop: `${palette.space["2"]}`,
        inputMultilineFilledPaddingBottom: `${palette.space["2"]}`,
        // New York V4's 64px / px-3 / py-2 baseline is medium. The other
        // library size inputs are explicit Web extensions, not upstream variants.
        multiline: {
            small: { minHeight: palette.size[56], paddingInline: palette.space[2], paddingBlock: palette.space[1], filledPaddingTop: palette.space[1], filledPaddingBottom: palette.space[1] },
            medium: { minHeight: palette.size[64], paddingInline: palette.space[3], paddingBlock: palette.space[2], filledPaddingTop: palette.space[2], filledPaddingBottom: palette.space[2] },
            large: { minHeight: `calc(${palette.size[64]} + ${palette.space[2]})`, paddingInline: palette.space[4], paddingBlock: palette.space[3], filledPaddingTop: palette.space[3], filledPaddingBottom: palette.space[3] },
        },
    },
    apple: {
        formLayoutColumns: `fit-content(35%) minmax(0, 1fr) auto`,
        formFieldColumns: `subgrid`,
        formFieldControlColumn: `2 / -1`,
        formFieldInline: `1`,
        layoutControlRow: `2`,
        layoutLabelRow: `1`,
        layoutSupportRow: `3`,
        layoutRowGap: `${palette.space["2"]}`,
        controlMinHeight: `0px`,
        controlPaddingInline: `${palette.space["3"]}`,
        controlIconPaddingInline: `${palette.space["3"]}`,
        iconSize: `${palette.space["4"]}`,
        iconGap: `${palette.space["2"]}`,
        inputFontSize: `${palette.font.size.sm}`,
        inputLineHeight: `${palette.space["5"]}`,
        inputFilledPaddingTop: `0px`,
        labelAlign: `center`,
        labelMarginInline: `0px`,
        labelPrefixMarginInline: `0px`,
        labelFontSize: `${palette.font.size.sm}`,
        labelLineHeight: `${palette.space["5"]}`,
        labelEmptyPlaceholderColor: `var(--token-semantic-color-text-secondary, ${palette.zinc["500"]})`,
        labelEmptyPlaceholderColorDisabled: `var(--token-semantic-field-disabled-color)`,
        labelMultilineOffset: `0px`,
        labelFloatingAlign: `center`,
        labelFloatingMarginInline: `0px`,
        labelFloatingFontSize: `${palette.font.size.sm}`,
        labelFloatingLineHeight: `${palette.space["5"]}`,
        labelFloatingTransform: `none`,
        labelFilledOffset: `0px`,
        requiredColor: `var(--token-semantic-color-feedback-error-text, ${palette.material.error["40"]})`,
        requiredOrder: `-1`,
        requiredGap: `${palette.space["1"]}`,
        outlineDisplay: `none`,
        outlineLegendMargin: `0px`,
        outlineLegendPadding: `0px`,
        outlinedBorderColor: `var(--token-semantic-color-border-default, ${palette.zinc["200"]})`,
        outlinedBorderColorHover: `var(--token-semantic-color-border-hover, ${palette.zinc["400"]})`,
        outlinedBorderColorFocus: `var(--token-semantic-color-border-focus, ${palette.blue["600"]})`,
        outlinedShadowFocus: `var(--token-semantic-shadow-focus-ring)`,
        outlinedBorderColorError: `var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        outlinedBorderColorWarning: `var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        outlinedShadowError: `inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        outlinedShadowWarning: `inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        filledBorderRadius: `${palette.radius["3"]}`,
        filledBorderWidth: `1px`,
        filledBackgroundColor: `var(--token-semantic-color-background-surface, ${palette.white})`,
        filledBackgroundColorHover: `var(--token-semantic-color-background-surface, ${palette.white})`,
        filledBorderColor: `var(--token-semantic-color-border-default, ${palette.zinc["200"]})`,
        filledBorderColorHover: `var(--token-semantic-color-border-hover, ${palette.zinc["400"]})`,
        filledBorderColorFocus: `var(--token-semantic-color-border-focus, ${palette.blue["600"]})`,
        filledShadowFocus: `var(--token-semantic-shadow-focus-ring)`,
        filledShadowError: `inset 0 0 0 2px var(--token-semantic-color-feedback-error-border, ${palette.material.error["40"]})`,
        filledShadowWarning: `inset 0 0 0 2px var(--token-semantic-color-feedback-warning-border, ${palette.amber["600"]})`,
        supportPaddingInline: `0px`,
        disabledColor: `color-mix(in oklch, var(--token-semantic-color-text-primary, ${palette.zinc["900"]}) 50%, transparent)`,
        disabledBorderColor: `var(--token-semantic-color-border-default, ${palette.zinc["200"]})`,
        disabledFilledBorderColor: `var(--token-semantic-color-border-default, ${palette.zinc["200"]})`,
        disabledFilledBackground: `var(--token-semantic-color-background-surface, ${palette.white})`,
        inputMultilinePaddingBlock: `${palette.space["1"]}`,
        inputMultilineFilledPaddingTop: `${palette.space["1"]}`,
        inputMultilineFilledPaddingBottom: `${palette.space["1"]}`,
        // Apple-inspired browser geometry; these are Crab's Web size variants.
        multiline: {
            small: { minHeight: palette.size[32], paddingInline: palette.space[2], paddingBlock: palette.space['0-5'], filledPaddingTop: palette.space['0-5'], filledPaddingBottom: palette.space['0-5'] },
            medium: { minHeight: palette.size[36], paddingInline: palette.space[3], paddingBlock: palette.space[1], filledPaddingTop: palette.space[1], filledPaddingBottom: palette.space[1] },
            large: { minHeight: palette.size[40], paddingInline: palette.space[4], paddingBlock: palette.space[2], filledPaddingTop: palette.space[2], filledPaddingBottom: palette.space[2] },
        },
    },
});

export const designShapeContract: Record<DesignSystem, DesignShape> = defineTokens({
    md3: {
        radius: { md: palette.radius[2], xl: palette.radius[14] },
        shape: {
            control: palette.radius[2], card: palette.radius[6], overlay: palette.radius[14],
            button: palette.radius.full, buttonSelected: palette.radius[6], buttonPressed: palette.radius[4],
        },
        shadow: {
            control: palette.shadow["material-1"], float: palette.shadow["material-2"], overlay: palette.shadow["material-3"],
            card: palette.shadow["material-1"], cardHover: palette.shadow["material-2"],
        },
    },
    shadcn: {
        radius: { md: palette.radius[4], xl: palette.radius[6] },
        shape: {
            control: palette.radius[4], card: palette.radius[6], overlay: palette.radius[6],
            button: palette.radius[4], buttonSelected: palette.radius[4], buttonPressed: palette.radius[4],
        },
        shadow: {
            control: palette.shadow.xs, float: palette.shadow.sm, overlay: palette.shadow.lg,
            card: palette.shadow.sm, cardHover: palette.shadow.md,
        },
    },
    apple: {
        radius: { md: palette.radius[3], xl: palette.radius[8] },
        shape: {
            control: palette.radius[3], card: palette.radius[6], overlay: palette.radius[8],
            button: palette.radius[3], buttonSelected: palette.radius[3], buttonPressed: palette.radius[3],
        },
        shadow: {
            control: palette.shadow.xs, float: palette.shadow.md, overlay: palette.shadow.xl,
            card: palette.shadow.sm, cardHover: palette.shadow.md,
        },
    },
});

export interface DesignMetrics {
    "tab": {
        "small": string;
        "medium": string;
        "large": string;
        "icon": string;
        "gap": string;
    };
    "dialog": {
        "padding": string;
        "fontSize": string;
        "lineHeight": string;
        "fontWeight": string;
    };
    "toggle": {
        "small": {
            "width": string;
            "height": string;
            "handle": string;
            "inset": string;
        };
        "medium": {
            "width": string;
            "height": string;
            "handle": string;
            "inset": string;
        };
        "large": {
            "width": string;
            "height": string;
            "handle": string;
            "inset": string;
        };
        "stateLayer": string;
        "border": string;
    };
}

export interface DesignField {
    "formLayoutColumns": string;
    "formFieldColumns": string;
    "formFieldControlColumn": string;
    "formFieldInline": string;
    "layoutControlRow": string;
    "layoutLabelRow": string;
    "layoutSupportRow": string;
    "layoutRowGap": string;
    "controlMinHeight": string;
    "controlPaddingInline": string;
    "controlIconPaddingInline": string;
    "iconSize": string;
    "iconGap": string;
    "inputFontSize": string;
    "inputLineHeight": string;
    "inputFilledPaddingTop": string;
    "labelAlign": string;
    "labelMarginInline": string;
    "labelPrefixMarginInline": string;
    "labelFontSize": string;
    "labelLineHeight": string;
    "labelEmptyPlaceholderColor": string;
    "labelEmptyPlaceholderColorDisabled": string;
    "labelMultilineOffset": string;
    "labelFloatingAlign": string;
    "labelFloatingMarginInline": string;
    "labelFloatingFontSize": string;
    "labelFloatingLineHeight": string;
    "labelFloatingTransform": string;
    "labelFilledOffset": string;
    "requiredColor": string;
    "requiredOrder": string;
    "requiredGap": string;
    "outlineDisplay": string;
    "outlineLegendMargin": string;
    "outlineLegendPadding": string;
    "outlinedBorderColor": string;
    "outlinedBorderColorHover": string;
    "outlinedBorderColorFocus": string;
    "outlinedShadowFocus": string;
    "outlinedBorderColorError": string;
    "outlinedBorderColorWarning": string;
    "outlinedShadowError": string;
    "outlinedShadowWarning": string;
    "filledBorderRadius": string;
    "filledBorderWidth": string;
    "filledBackgroundColor": string;
    "filledBackgroundColorHover": string;
    "filledBorderColor": string;
    "filledBorderColorHover": string;
    "filledBorderColorFocus": string;
    "filledShadowFocus": string;
    "filledShadowError": string;
    "filledShadowWarning": string;
    "supportPaddingInline": string;
    "disabledColor": string;
    "disabledBorderColor": string;
    "disabledFilledBorderColor": string;
    "disabledFilledBackground": string;
    "inputMultilinePaddingBlock": string;
    "inputMultilineFilledPaddingTop": string;
    "inputMultilineFilledPaddingBottom": string;
    "multiline": {
        "small": {
            "minHeight": string;
            "paddingInline": string;
            "paddingBlock": string;
            "filledPaddingTop": string;
            "filledPaddingBottom": string;
        };
        "medium": {
            "minHeight": string;
            "paddingInline": string;
            "paddingBlock": string;
            "filledPaddingTop": string;
            "filledPaddingBottom": string;
        };
        "large": {
            "minHeight": string;
            "paddingInline": string;
            "paddingBlock": string;
            "filledPaddingTop": string;
            "filledPaddingBottom": string;
        };
    };
}

export interface DesignShape {
    "radius": {
        "md": string;
        "xl": string;
    };
    "shape": {
        "control": string;
        "card": string;
        "overlay": string;
        "button": string;
        "buttonSelected": string;
        "buttonPressed": string;
    };
    "shadow": {
        "control": string;
        "float": string;
        "overlay": string;
        "card": string;
        "cardHover": string;
    };
}
