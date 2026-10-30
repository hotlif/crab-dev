import { defineTokens } from '@crab-dev/css';
import palette from '@crab-dev/rc-token-global';
import type { DesignSystem } from './design-system.js';

interface TypographyStyle {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
}

interface TypescaleStyle extends TypographyStyle {
    emphasizedWeight: string;
}

export interface DesignTypography {
    fontFamily: string;
    font: {
        lineHeight: string;
        bodySize: string;
        headingSize: string;
        subheadSize: string;
        captionSize: string;
        bodyWeight: string;
        labelWeight: string;
        headingWeight: string;
        strongWeight: string;
    };
    legacy: Record<'display' | 'headline' | 'title' | 'body' | 'label' | 'caption', TypographyStyle>;
    typescale: Record<'displayLarge' | 'displayMedium' | 'displaySmall' | 'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 'titleLarge' | 'titleMedium' | 'titleSmall' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'labelLarge' | 'labelMedium' | 'labelSmall', TypescaleStyle>;
}

// Reviewed 2026-10-23: M3 baseline and emphasized type scale. Material Web v0.192
// implements the baseline only. Apple and shadcn/ui have autonomous Web mappings.
// https://m3.material.io/styles/typography/type-scale-tokens
// https://material-web.dev/theming/typography/
// https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss
// https://developer.apple.com/design/human-interface-guidelines/typography
// https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4/ui/dialog.tsx
// https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4/ui/label.tsx
// Apple follows system-font hierarchy and heavier headings. Its Web scale is
// rounded to existing L1 sizes; it does not replicate AppKit/UIKit text metrics.
// shadcn/ui uses compact UI labels, semibold headings and relaxed reading text.
export const designTypographyContract: Record<DesignSystem, DesignTypography> = defineTokens({
    md3: {
        fontFamily: palette.font.family.material,
        font: {
            lineHeight: palette.line.height.normal,
            bodySize: palette.font.size.sm,
            headingSize: palette.font.size["22"],
            subheadSize: palette.font.size["md"],
            captionSize: palette.font.size.xs,
            bodyWeight: palette.font.weight.regular,
            labelWeight: palette.font.weight.medium,
            headingWeight: palette.font.weight.regular,
            strongWeight: palette.font.weight.bold,
        },
        legacy: {
            display: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["36-44"] },
            headline: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["28-36"] },
            title: { fontSize: palette.font.size["22"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["22-28"] },
            body: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"] },
            label: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"] },
            caption: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"] },
        },
        typescale: {
            displayLarge: { fontSize: palette.font.size["57"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["57-64"], emphasizedWeight: palette.font.weight.medium },
            displayMedium: { fontSize: palette.font.size["45"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["45-52"], emphasizedWeight: palette.font.weight.medium },
            displaySmall: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["36-44"], emphasizedWeight: palette.font.weight.medium },
            headlineLarge: { fontSize: palette.font.size["4xl"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["32-40"], emphasizedWeight: palette.font.weight.medium },
            headlineMedium: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["28-36"], emphasizedWeight: palette.font.weight.medium },
            headlineSmall: { fontSize: palette.font.size["2xl"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["24-32"], emphasizedWeight: palette.font.weight.medium },
            titleLarge: { fontSize: palette.font.size["22"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["22-28"], emphasizedWeight: palette.font.weight.medium },
            titleMedium: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["16-24"], emphasizedWeight: palette.font.weight.bold },
            titleSmall: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.bold },
            bodyLarge: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["16-24"], emphasizedWeight: palette.font.weight.medium },
            bodyMedium: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.medium },
            bodySmall: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.medium },
            labelLarge: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.bold },
            labelMedium: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.bold },
            labelSmall: { fontSize: palette.font.size["11"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["11-16"], emphasizedWeight: palette.font.weight.bold },
        },
    },
    apple: {
        fontFamily: palette.font.family.system,
        font: {
            lineHeight: palette.line.height.normal,
            bodySize: palette.font.size.sm,
            headingSize: palette.font.size["xl"],
            subheadSize: palette.font.size["md"],
            captionSize: palette.font.size.xs,
            bodyWeight: palette.font.weight.regular,
            labelWeight: palette.font.weight.medium,
            headingWeight: palette.font.weight.semibold,
            strongWeight: palette.font.weight.bold,
        },
        legacy: {
            display: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["36-44"] },
            headline: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["28-36"] },
            title: { fontSize: palette.font.size["xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["20-28"] },
            body: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"] },
            label: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"] },
            caption: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"] },
        },
        typescale: {
            displayLarge: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["36-44"], emphasizedWeight: palette.font.weight.bold },
            displayMedium: { fontSize: palette.font.size["4xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["32-40"], emphasizedWeight: palette.font.weight.bold },
            displaySmall: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["28-36"], emphasizedWeight: palette.font.weight.bold },
            headlineLarge: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["28-36"], emphasizedWeight: palette.font.weight.bold },
            headlineMedium: { fontSize: palette.font.size["2xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["24-32"], emphasizedWeight: palette.font.weight.bold },
            headlineSmall: { fontSize: palette.font.size["xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["20-28"], emphasizedWeight: palette.font.weight.bold },
            titleLarge: { fontSize: palette.font.size["xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["20-28"], emphasizedWeight: palette.font.weight.bold },
            titleMedium: { fontSize: palette.font.size["lg"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["snug"], emphasizedWeight: palette.font.weight.bold },
            titleSmall: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["16-24"], emphasizedWeight: palette.font.weight.bold },
            bodyLarge: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["16-24"], emphasizedWeight: palette.font.weight.semibold },
            bodyMedium: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.semibold },
            bodySmall: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.semibold },
            labelLarge: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.semibold },
            labelMedium: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.semibold },
            labelSmall: { fontSize: palette.font.size["11"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["11-16"], emphasizedWeight: palette.font.weight.semibold },
        },
    },
    shadcn: {
        fontFamily: palette.font.family.sans,
        font: {
            lineHeight: palette.line.height.normal,
            bodySize: palette.font.size.sm,
            headingSize: palette.font.size["2xl"],
            subheadSize: palette.font.size["lg"],
            captionSize: palette.font.size.xs,
            bodyWeight: palette.font.weight.regular,
            labelWeight: palette.font.weight.medium,
            headingWeight: palette.font.weight.semibold,
            strongWeight: palette.font.weight.bold,
        },
        legacy: {
            display: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.bold, lineHeight: palette.line.height["tight"] },
            headline: { fontSize: palette.font.size["4xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["tight"] },
            title: { fontSize: palette.font.size["2xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["24-32"] },
            body: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"] },
            label: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"] },
            caption: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"] },
        },
        typescale: {
            displayLarge: { fontSize: palette.font.size["45"], fontWeight: palette.font.weight.bold, lineHeight: palette.line.height["tight"], emphasizedWeight: palette.font.weight.bold },
            displayMedium: { fontSize: palette.font.size["36"], fontWeight: palette.font.weight.bold, lineHeight: palette.line.height["tight"], emphasizedWeight: palette.font.weight.bold },
            displaySmall: { fontSize: palette.font.size["4xl"], fontWeight: palette.font.weight.bold, lineHeight: palette.line.height["tight"], emphasizedWeight: palette.font.weight.bold },
            headlineLarge: { fontSize: palette.font.size["4xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["tight"], emphasizedWeight: palette.font.weight.bold },
            headlineMedium: { fontSize: palette.font.size["3xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["tight"], emphasizedWeight: palette.font.weight.bold },
            headlineSmall: { fontSize: palette.font.size["2xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["24-32"], emphasizedWeight: palette.font.weight.bold },
            titleLarge: { fontSize: palette.font.size["xl"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["20-28"], emphasizedWeight: palette.font.weight.bold },
            titleMedium: { fontSize: palette.font.size["lg"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["snug"], emphasizedWeight: palette.font.weight.bold },
            titleSmall: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.semibold, lineHeight: palette.line.height["16-24"], emphasizedWeight: palette.font.weight.bold },
            bodyLarge: { fontSize: palette.font.size["md"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["relaxed"], emphasizedWeight: palette.font.weight.medium },
            bodyMedium: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.medium },
            bodySmall: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.regular, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.medium },
            labelLarge: { fontSize: palette.font.size["sm"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["14-20"], emphasizedWeight: palette.font.weight.semibold },
            labelMedium: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.semibold },
            labelSmall: { fontSize: palette.font.size["xs"], fontWeight: palette.font.weight.medium, lineHeight: palette.line.height["12-16"], emphasizedWeight: palette.font.weight.semibold },
        },
    },
} satisfies Record<DesignSystem, DesignTypography>);

export interface DesignMotion {
    interaction: string;
    fade: string;
    expand: string;
    slideEnter: string;
    slideExit: string;
    sheetEnterDuration: string;
    sheetExitDuration: string;
    sheetEasing: string;
    layout: string;
    easingSpatialDefault: string;
    spatialFast: string;
    spatialDefault: string;
    spatialSlow: string;
    effectsFast: string;
    effectsDefault: string;
    effectsSlow: string;
}

// M3 uses the official Web spring approximations, rather than a live spring engine.
// Bounded sheet transitions retain their existing legacy easing fallback.
// Apple uses brief, non-overshooting Web transitions informed by HIG feedback
// guidance. These are project choices, not native spring parameters.
// shadcn/ui follows New York dialog 200ms / sheet 500ms-enter, 300ms-exit,
// using the existing L1 ease-in-out curve for bounded Web transitions.
// https://m3.material.io/styles/motion/overview/specs
// https://developer.apple.com/design/human-interface-guidelines/motion
// https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4/ui/dialog.tsx
// https://github.com/shadcn-ui/ui/blob/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4/ui/sheet.tsx
export const designMotionContract: Record<DesignSystem, DesignMotion> = defineTokens({
    md3: {
        interaction: `${palette.duration["150"]} ${palette.easing["expressive-effects-fast"]}`,
        fade: `${palette.duration["normal"]} ${palette.easing["expressive-effects-default"]}`,
        expand: `${palette.duration["500"]} ${palette.easing["expressive-spatial-default"]}`,
        slideEnter: `${palette.duration["500"]} ${palette.easing["expressive-spatial-default"]}`,
        slideExit: `${palette.duration["350"]} ${palette.easing["expressive-spatial-fast"]}`,
        sheetEnterDuration: palette.duration.slow,
        sheetExitDuration: palette.duration.normal,
        sheetEasing: palette.easing.material,
        layout: `${palette.duration["normal"]} ${palette.easing["out"]}`,
        easingSpatialDefault: palette.easing["expressive-spatial-default"],
        spatialFast: `${palette.duration["350"]} ${palette.easing["expressive-spatial-fast"]}`,
        spatialDefault: `${palette.duration["500"]} ${palette.easing["expressive-spatial-default"]}`,
        spatialSlow: `${palette.duration["650"]} ${palette.easing["expressive-spatial-slow"]}`,
        effectsFast: `${palette.duration["150"]} ${palette.easing["expressive-effects-fast"]}`,
        effectsDefault: `${palette.duration["normal"]} ${palette.easing["expressive-effects-default"]}`,
        effectsSlow: `${palette.duration["slow"]} ${palette.easing["expressive-effects-slow"]}`,
    },
    apple: {
        interaction: `${palette.duration["fast"]} ${palette.easing["out"]}`,
        fade: `${palette.duration["150"]} ${palette.easing["out"]}`,
        expand: `${palette.duration["normal"]} ${palette.easing["out"]}`,
        slideEnter: `${palette.duration["slow"]} ${palette.easing["out"]}`,
        slideExit: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        sheetEnterDuration: palette.duration.slow,
        sheetExitDuration: palette.duration.normal,
        sheetEasing: palette.easing.out,
        layout: `${palette.duration["normal"]} ${palette.easing["out"]}`,
        easingSpatialDefault: palette.easing.out,
        spatialFast: `${palette.duration["150"]} ${palette.easing["out"]}`,
        spatialDefault: `${palette.duration["normal"]} ${palette.easing["out"]}`,
        spatialSlow: `${palette.duration["slow"]} ${palette.easing["out"]}`,
        effectsFast: `${palette.duration["fast"]} ${palette.easing["out"]}`,
        effectsDefault: `${palette.duration["150"]} ${palette.easing["out"]}`,
        effectsSlow: `${palette.duration["normal"]} ${palette.easing["out"]}`,
    },
    shadcn: {
        interaction: `${palette.duration["150"]} ${palette.easing["default"]}`,
        fade: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        expand: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        slideEnter: `${palette.duration["500"]} ${palette.easing["default"]}`,
        slideExit: `${palette.duration["slow"]} ${palette.easing["default"]}`,
        sheetEnterDuration: palette.duration[500],
        sheetExitDuration: palette.duration.slow,
        sheetEasing: palette.easing.default,
        layout: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        easingSpatialDefault: palette.easing.default,
        spatialFast: `${palette.duration["150"]} ${palette.easing["default"]}`,
        spatialDefault: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        spatialSlow: `${palette.duration["slow"]} ${palette.easing["default"]}`,
        effectsFast: `${palette.duration["150"]} ${palette.easing["default"]}`,
        effectsDefault: `${palette.duration["normal"]} ${palette.easing["default"]}`,
        effectsSlow: `${palette.duration["slow"]} ${palette.easing["default"]}`,
    },
} satisfies Record<DesignSystem, DesignMotion>);
