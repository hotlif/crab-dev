import { globalStyle } from "@crab-dev/css";
import { themeColorContract as color } from "./theme-values.js";

// globalStyle is intentionally a compile-time side-effect expression.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
    :root,
    [data-theme="light"] {
        color-scheme: light;
        --token-semantic-color-control-thumb: ${color.light.control.thumb};
        --token-semantic-color-control-track: ${color.light.control.track};
        --token-semantic-color-control-track-hover: ${color.light.control.trackHover};
        --token-semantic-color-brand-primary: ${color.light.brand.primary};
        --token-semantic-color-brand-primary-hover: ${color.light.brand.hover};
        --token-semantic-color-brand-primary-active: ${color.light.brand.active};
        --token-semantic-color-brand-primary-subtle: ${color.light.brand.subtle};

        --token-semantic-color-background-surface: ${color.light.background.surface};
        --token-semantic-color-background-elevated: ${color.light.background.elevated};
        --token-semantic-color-background-sunken: ${color.light.background.sunken};
        --token-semantic-color-background-inverse: ${color.light.background.inverse};
        --token-semantic-color-background-overlay: ${color.light.background.overlay};
        --token-semantic-color-background-disabled: ${color.light.background.disabled};
        --token-semantic-color-background-hover-subtle: ${color.light.background.hoverSubtle};
        --token-semantic-color-background-active-subtle: ${color.light.background.activeSubtle};
        --token-semantic-color-background-selected: ${color.light.background.selected};

        --token-semantic-color-text-primary: ${color.light.text.primary};
        --token-semantic-color-text-secondary: ${color.light.text.secondary};
        --token-semantic-color-text-tertiary: ${color.light.text.tertiary};
        --token-semantic-color-text-on-brand: ${color.light.text.onBrand};
        --token-semantic-color-text-inverse: ${color.light.text.inverse};
        --token-semantic-color-text-disabled: ${color.light.text.disabled};
        --token-semantic-color-text-link: ${color.light.text.link};
        --token-semantic-color-text-link-hover: ${color.light.text.linkHover};

        --token-semantic-color-border-subtle: ${color.light.border.subtle};
        --token-semantic-color-border-default: ${color.light.border.default};
        --token-semantic-color-border-hover: ${color.light.border.hover};
        --token-semantic-color-border-strong: ${color.light.border.strong};
        --token-semantic-color-border-focus: ${color.light.border.focus};
        --token-semantic-color-border-error: ${color.light.border.error};
        --token-semantic-color-focus-ring: ${color.light.focusRing};

        --token-semantic-color-selection-background: ${color.light.selection.background};
        --token-semantic-color-selection-border: ${color.light.selection.border};
        --token-semantic-color-selection-foreground: ${color.light.selection.foreground};
        --token-semantic-color-highlight-background: ${color.light.highlight.background};
        --token-semantic-color-highlight-background-active: ${color.light.highlight.backgroundActive};
        --token-semantic-color-highlight-foreground: ${color.light.highlight.foreground};

        --token-semantic-color-feedback-error-text: ${color.light.feedback.error.text};
        --token-semantic-color-feedback-error-icon: ${color.light.feedback.error.icon};
        --token-semantic-color-feedback-error-border: ${color.light.feedback.error.border};
        --token-semantic-color-feedback-error-background: ${color.light.feedback.error.background};
        --token-semantic-color-feedback-error-background-hover: ${color.light.feedback.error.backgroundHover};
        --token-semantic-color-feedback-error-solid: ${color.light.feedback.error.solid};
        --token-semantic-color-feedback-error-solid-hover: ${color.light.feedback.error.solidHover};
        --token-semantic-color-feedback-error-solid-active: ${color.light.feedback.error.solidActive};
        --token-semantic-color-feedback-error-on-solid: ${color.light.feedback.error.onSolid};

        --token-semantic-color-feedback-success-text: ${color.light.feedback.success.text};
        --token-semantic-color-feedback-success-icon: ${color.light.feedback.success.icon};
        --token-semantic-color-feedback-success-border: ${color.light.feedback.success.border};
        --token-semantic-color-feedback-success-background: ${color.light.feedback.success.background};
        --token-semantic-color-feedback-success-background-hover: ${color.light.feedback.success.backgroundHover};
        --token-semantic-color-feedback-success-solid: ${color.light.feedback.success.solid};
        --token-semantic-color-feedback-success-solid-hover: ${color.light.feedback.success.solidHover};
        --token-semantic-color-feedback-success-solid-active: ${color.light.feedback.success.solidActive};
        --token-semantic-color-feedback-success-on-solid: ${color.light.feedback.success.onSolid};

        --token-semantic-color-feedback-warning-text: ${color.light.feedback.warning.text};
        --token-semantic-color-feedback-warning-icon: ${color.light.feedback.warning.icon};
        --token-semantic-color-feedback-warning-border: ${color.light.feedback.warning.border};
        --token-semantic-color-feedback-warning-background: ${color.light.feedback.warning.background};
        --token-semantic-color-feedback-warning-background-hover: ${color.light.feedback.warning.backgroundHover};
        --token-semantic-color-feedback-warning-solid: ${color.light.feedback.warning.solid};
        --token-semantic-color-feedback-warning-solid-hover: ${color.light.feedback.warning.solidHover};
        --token-semantic-color-feedback-warning-solid-active: ${color.light.feedback.warning.solidActive};
        --token-semantic-color-feedback-warning-on-solid: ${color.light.feedback.warning.onSolid};

        --token-semantic-color-feedback-info-text: ${color.light.feedback.info.text};
        --token-semantic-color-feedback-info-icon: ${color.light.feedback.info.icon};
        --token-semantic-color-feedback-info-border: ${color.light.feedback.info.border};
        --token-semantic-color-feedback-info-background: ${color.light.feedback.info.background};
        --token-semantic-color-feedback-info-background-hover: ${color.light.feedback.info.backgroundHover};
        --token-semantic-color-feedback-info-solid: ${color.light.feedback.info.solid};
        --token-semantic-color-feedback-info-solid-hover: ${color.light.feedback.info.solidHover};
        --token-semantic-color-feedback-info-solid-active: ${color.light.feedback.info.solidActive};
        --token-semantic-color-feedback-info-on-solid: ${color.light.feedback.info.onSolid};

        --token-semantic-color-fill-subtle: ${color.light.fill.subtle};
        --token-semantic-color-fill-default: ${color.light.fill.default};
        --token-semantic-color-fill-strong: ${color.light.fill.strong};
        --token-semantic-color-fill-translucent: ${color.light.fill.translucent};
        --token-semantic-color-fill-inactive: ${color.light.fill.inactive};
        --token-semantic-color-fill-active: ${color.light.fill.active};
        --token-semantic-shadow-focus-ring: ${color.light.focusShadow};
    }

    [data-theme="dark"] {
        color-scheme: dark;
        --token-semantic-color-control-thumb: ${color.dark.control.thumb};
        --token-semantic-color-control-track: ${color.dark.control.track};
        --token-semantic-color-control-track-hover: ${color.dark.control.trackHover};
        --token-semantic-color-brand-primary: ${color.dark.brand.primary};
        --token-semantic-color-brand-primary-hover: ${color.dark.brand.hover};
        --token-semantic-color-brand-primary-active: ${color.dark.brand.active};
        --token-semantic-color-brand-primary-subtle: ${color.dark.brand.subtle};

        --token-semantic-color-background-surface: ${color.dark.background.surface};
        --token-semantic-color-background-elevated: ${color.dark.background.elevated};
        --token-semantic-color-background-sunken: ${color.dark.background.sunken};
        --token-semantic-color-background-inverse: ${color.dark.background.inverse};
        --token-semantic-color-background-overlay: ${color.dark.background.overlay};
        --token-semantic-color-background-disabled: ${color.dark.background.disabled};
        --token-semantic-color-background-hover-subtle: ${color.dark.background.hoverSubtle};
        --token-semantic-color-background-active-subtle: ${color.dark.background.activeSubtle};
        --token-semantic-color-background-selected: ${color.dark.background.selected};

        --token-semantic-color-text-primary: ${color.dark.text.primary};
        --token-semantic-color-text-secondary: ${color.dark.text.secondary};
        --token-semantic-color-text-tertiary: ${color.dark.text.tertiary};
        --token-semantic-color-text-on-brand: ${color.dark.text.onBrand};
        --token-semantic-color-text-inverse: ${color.dark.text.inverse};
        --token-semantic-color-text-disabled: ${color.dark.text.disabled};
        --token-semantic-color-text-link: ${color.dark.text.link};
        --token-semantic-color-text-link-hover: ${color.dark.text.linkHover};

        --token-semantic-color-border-subtle: ${color.dark.border.subtle};
        --token-semantic-color-border-default: ${color.dark.border.default};
        --token-semantic-color-border-hover: ${color.dark.border.hover};
        --token-semantic-color-border-strong: ${color.dark.border.strong};
        --token-semantic-color-border-focus: ${color.dark.border.focus};
        --token-semantic-color-border-error: ${color.dark.border.error};
        --token-semantic-color-focus-ring: ${color.dark.focusRing};

        --token-semantic-color-selection-background: ${color.dark.selection.background};
        --token-semantic-color-selection-border: ${color.dark.selection.border};
        --token-semantic-color-selection-foreground: ${color.dark.selection.foreground};
        --token-semantic-color-highlight-background: ${color.dark.highlight.background};
        --token-semantic-color-highlight-background-active: ${color.dark.highlight.backgroundActive};
        --token-semantic-color-highlight-foreground: ${color.dark.highlight.foreground};

        --token-semantic-color-feedback-error-text: ${color.dark.feedback.error.text};
        --token-semantic-color-feedback-error-icon: ${color.dark.feedback.error.icon};
        --token-semantic-color-feedback-error-border: ${color.dark.feedback.error.border};
        --token-semantic-color-feedback-error-background: ${color.dark.feedback.error.background};
        --token-semantic-color-feedback-error-background-hover: ${color.dark.feedback.error.backgroundHover};
        --token-semantic-color-feedback-error-solid: ${color.dark.feedback.error.solid};
        --token-semantic-color-feedback-error-solid-hover: ${color.dark.feedback.error.solidHover};
        --token-semantic-color-feedback-error-solid-active: ${color.dark.feedback.error.solidActive};
        --token-semantic-color-feedback-error-on-solid: ${color.dark.feedback.error.onSolid};

        --token-semantic-color-feedback-success-text: ${color.dark.feedback.success.text};
        --token-semantic-color-feedback-success-icon: ${color.dark.feedback.success.icon};
        --token-semantic-color-feedback-success-border: ${color.dark.feedback.success.border};
        --token-semantic-color-feedback-success-background: ${color.dark.feedback.success.background};
        --token-semantic-color-feedback-success-background-hover: ${color.dark.feedback.success.backgroundHover};
        --token-semantic-color-feedback-success-solid: ${color.dark.feedback.success.solid};
        --token-semantic-color-feedback-success-solid-hover: ${color.dark.feedback.success.solidHover};
        --token-semantic-color-feedback-success-solid-active: ${color.dark.feedback.success.solidActive};
        --token-semantic-color-feedback-success-on-solid: ${color.dark.feedback.success.onSolid};

        --token-semantic-color-feedback-warning-text: ${color.dark.feedback.warning.text};
        --token-semantic-color-feedback-warning-icon: ${color.dark.feedback.warning.icon};
        --token-semantic-color-feedback-warning-border: ${color.dark.feedback.warning.border};
        --token-semantic-color-feedback-warning-background: ${color.dark.feedback.warning.background};
        --token-semantic-color-feedback-warning-background-hover: ${color.dark.feedback.warning.backgroundHover};
        --token-semantic-color-feedback-warning-solid: ${color.dark.feedback.warning.solid};
        --token-semantic-color-feedback-warning-solid-hover: ${color.dark.feedback.warning.solidHover};
        --token-semantic-color-feedback-warning-solid-active: ${color.dark.feedback.warning.solidActive};
        --token-semantic-color-feedback-warning-on-solid: ${color.dark.feedback.warning.onSolid};

        --token-semantic-color-feedback-info-text: ${color.dark.feedback.info.text};
        --token-semantic-color-feedback-info-icon: ${color.dark.feedback.info.icon};
        --token-semantic-color-feedback-info-border: ${color.dark.feedback.info.border};
        --token-semantic-color-feedback-info-background: ${color.dark.feedback.info.background};
        --token-semantic-color-feedback-info-background-hover: ${color.dark.feedback.info.backgroundHover};
        --token-semantic-color-feedback-info-solid: ${color.dark.feedback.info.solid};
        --token-semantic-color-feedback-info-solid-hover: ${color.dark.feedback.info.solidHover};
        --token-semantic-color-feedback-info-solid-active: ${color.dark.feedback.info.solidActive};
        --token-semantic-color-feedback-info-on-solid: ${color.dark.feedback.info.onSolid};

        --token-semantic-color-fill-subtle: ${color.dark.fill.subtle};
        --token-semantic-color-fill-default: ${color.dark.fill.default};
        --token-semantic-color-fill-strong: ${color.dark.fill.strong};
        --token-semantic-color-fill-translucent: ${color.dark.fill.translucent};
        --token-semantic-color-fill-inactive: ${color.dark.fill.inactive};
        --token-semantic-color-fill-active: ${color.dark.fill.active};
        --token-semantic-shadow-focus-ring: ${color.dark.focusShadow};
    }

    @media (forced-colors: active) {
        :root,
        [data-theme="light"],
        [data-theme="dark"] {
            --token-semantic-color-control-thumb: CanvasText;
            --token-semantic-color-control-track: Canvas;
            --token-semantic-color-control-track-hover: Canvas;
            --token-semantic-color-brand-primary: Highlight;
            --token-semantic-color-brand-primary-hover: Highlight;
            --token-semantic-color-brand-primary-active: Highlight;
            --token-semantic-color-brand-primary-subtle: Highlight;

            --token-semantic-color-background-surface: Canvas;
            --token-semantic-color-background-elevated: Canvas;
            --token-semantic-color-background-sunken: Canvas;
            --token-semantic-color-background-inverse: CanvasText;
            --token-semantic-color-background-overlay: Canvas;
            --token-semantic-color-background-disabled: Canvas;
            --token-semantic-color-background-hover-subtle: Canvas;
            --token-semantic-color-background-active-subtle: Highlight;
            --token-semantic-color-background-selected: Highlight;

            --token-semantic-color-text-primary: CanvasText;
            --token-semantic-color-text-secondary: CanvasText;
            --token-semantic-color-text-tertiary: CanvasText;
            --token-semantic-color-text-on-brand: HighlightText;
            --token-semantic-color-text-inverse: Canvas;
            --token-semantic-color-text-disabled: GrayText;
            --token-semantic-color-text-link: Highlight;
            --token-semantic-color-text-link-hover: Highlight;

            --token-semantic-color-border-subtle: GrayText;
            --token-semantic-color-border-default: CanvasText;
            --token-semantic-color-border-hover: CanvasText;
            --token-semantic-color-border-strong: CanvasText;
            --token-semantic-color-border-focus: Highlight;
            --token-semantic-color-border-error: Highlight;
            --token-semantic-color-focus-ring: Highlight;

            --token-semantic-color-selection-background: Highlight;
            --token-semantic-color-selection-border: Highlight;
            --token-semantic-color-selection-foreground: HighlightText;
            --token-semantic-color-highlight-background: Highlight;
            --token-semantic-color-highlight-background-active: Highlight;
            --token-semantic-color-highlight-foreground: HighlightText;

            --token-semantic-color-feedback-error-text: CanvasText;
            --token-semantic-color-feedback-error-icon: CanvasText;
            --token-semantic-color-feedback-error-border: CanvasText;
            --token-semantic-color-feedback-error-background: Canvas;
            --token-semantic-color-feedback-error-background-hover: Canvas;
            --token-semantic-color-feedback-error-solid: Highlight;
            --token-semantic-color-feedback-error-solid-hover: Highlight;
            --token-semantic-color-feedback-error-solid-active: Highlight;
            --token-semantic-color-feedback-error-on-solid: HighlightText;

            --token-semantic-color-feedback-success-text: CanvasText;
            --token-semantic-color-feedback-success-icon: CanvasText;
            --token-semantic-color-feedback-success-border: CanvasText;
            --token-semantic-color-feedback-success-background: Canvas;
            --token-semantic-color-feedback-success-background-hover: Canvas;
            --token-semantic-color-feedback-success-solid: Highlight;
            --token-semantic-color-feedback-success-solid-hover: Highlight;
            --token-semantic-color-feedback-success-solid-active: Highlight;
            --token-semantic-color-feedback-success-on-solid: HighlightText;

            --token-semantic-color-feedback-warning-text: CanvasText;
            --token-semantic-color-feedback-warning-icon: CanvasText;
            --token-semantic-color-feedback-warning-border: CanvasText;
            --token-semantic-color-feedback-warning-background: Canvas;
            --token-semantic-color-feedback-warning-background-hover: Canvas;
            --token-semantic-color-feedback-warning-solid: Highlight;
            --token-semantic-color-feedback-warning-solid-hover: Highlight;
            --token-semantic-color-feedback-warning-solid-active: Highlight;
            --token-semantic-color-feedback-warning-on-solid: HighlightText;

            --token-semantic-color-feedback-info-text: CanvasText;
            --token-semantic-color-feedback-info-icon: CanvasText;
            --token-semantic-color-feedback-info-border: CanvasText;
            --token-semantic-color-feedback-info-background: Canvas;
            --token-semantic-color-feedback-info-background-hover: Canvas;
            --token-semantic-color-feedback-info-solid: Highlight;
            --token-semantic-color-feedback-info-solid-hover: Highlight;
            --token-semantic-color-feedback-info-solid-active: Highlight;
            --token-semantic-color-feedback-info-on-solid: HighlightText;

            --token-semantic-color-fill-subtle: Canvas;
            --token-semantic-color-fill-default: CanvasText;
            --token-semantic-color-fill-strong: CanvasText;
            --token-semantic-color-fill-translucent: CanvasText;
            --token-semantic-color-fill-inactive: GrayText;
            --token-semantic-color-fill-active: Highlight;
            --token-semantic-shadow-float: none;
            --token-semantic-shadow-overlay: none;
            --token-semantic-shadow-focus-ring: 0 0 0 3px Highlight;
        }
    }
`;
