import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-global";

// Each design boundary resets every surface role, including nested providers.
// Colors resolve against the boundary's light/dark semantic palette.
globalStyle`
    :root,
    [data-crab-design="md3"] {
        --token-semantic-overlay-dialog-background: var(--token-semantic-color-surface-high);
        --token-semantic-overlay-dialog-border: transparent;
        --token-semantic-overlay-dialog-confirm-background: transparent;
        --token-semantic-overlay-dialog-confirm-foreground: var(--token-semantic-color-brand-primary);
        --token-semantic-overlay-dialog-confirm-border: transparent;
        --token-semantic-overlay-dialog-confirm-hover: color-mix(in oklch, var(--token-semantic-color-brand-primary) 8%, transparent);
        --token-semantic-overlay-dialog-confirm-focus: color-mix(in oklch, var(--token-semantic-color-brand-primary) 12%, transparent);
        --token-semantic-overlay-dialog-confirm-pressed: color-mix(in oklch, var(--token-semantic-color-brand-primary) 12%, transparent);
        --token-semantic-overlay-dialog-cancel-background: transparent;
        --token-semantic-overlay-dialog-cancel-foreground: var(--token-semantic-color-brand-primary);
        --token-semantic-overlay-dialog-cancel-border: transparent;
        --token-semantic-overlay-dialog-cancel-hover: color-mix(in oklch, var(--token-semantic-color-brand-primary) 8%, transparent);
        --token-semantic-overlay-dialog-cancel-focus: color-mix(in oklch, var(--token-semantic-color-brand-primary) 12%, transparent);
        --token-semantic-overlay-dialog-cancel-pressed: color-mix(in oklch, var(--token-semantic-color-brand-primary) 12%, transparent);
        --token-semantic-overlay-sheet-background: var(--token-semantic-color-surface-low);
        --token-semantic-overlay-sheet-shape: ${token.radius[14]};
        --token-semantic-overlay-sheet-border: transparent;
        --token-semantic-overlay-popover-background: var(--token-semantic-color-surface-container);
        --token-semantic-overlay-popover-shape: ${token.radius[2]};
        --token-semantic-overlay-popover-border: transparent;
        --token-semantic-overlay-tooltip-background: var(--token-semantic-color-background-inverse);
        --token-semantic-overlay-tooltip-foreground: var(--token-semantic-color-text-inverse);
        --token-semantic-overlay-tooltip-shape: ${token.radius[2]};
        --token-semantic-overlay-tooltip-shadow: ${token.shadow.none};
        --token-semantic-overlay-tooltip-border: transparent;
        --token-semantic-feedback-toast-background: var(--token-semantic-color-background-inverse);
        --token-semantic-feedback-toast-foreground: var(--token-semantic-color-text-inverse);
        --token-semantic-feedback-toast-shape: ${token.radius[2]};
        --token-semantic-feedback-toast-border: transparent;
        --token-semantic-feedback-notice-shape: ${token.radius[6]};
        --token-semantic-feedback-banner-shape: ${token.radius[6]};
        --token-semantic-feedback-banner-padding: ${token.space[4]};
        --token-semantic-feedback-banner-title-font-size: ${token.font.size.md};
        --token-semantic-feedback-banner-tint: 100%;
        --token-semantic-feedback-banner-border-tint: 100%;
        --token-semantic-surface-card-padding-small: ${token.space[3]};
        --token-semantic-surface-card-padding-medium: ${token.space[4]};
        --token-semantic-surface-card-padding-large: ${token.space[6]};
        --token-semantic-status-avatar-shape: ${token.radius[6]};
        --token-semantic-status-tag-shape: ${token.radius[4]};
        --token-semantic-status-chip-height: ${token.size[32]};
        --token-semantic-status-chip-font-size: ${token.font.size.sm};
        --token-semantic-status-badge-height: ${token.space[4]};
        --token-semantic-status-spinner-color: var(--token-semantic-color-brand-primary);
        --token-semantic-status-spinner-track: var(--token-semantic-color-fill-default);
        --token-semantic-status-spinner-circular-display: inline;
        --token-semantic-status-spinner-spokes-display: none;
        --token-semantic-status-spinner-easing: linear;
    }

    [data-crab-design="shadcn"] {
        --token-semantic-overlay-dialog-background: var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface));
        --token-semantic-overlay-dialog-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-dialog-confirm-background: var(--token-semantic-color-brand-primary);
        --token-semantic-overlay-dialog-confirm-foreground: var(--token-semantic-color-text-on-brand);
        --token-semantic-overlay-dialog-confirm-border: transparent;
        --token-semantic-overlay-dialog-confirm-hover: var(--token-semantic-color-brand-primary-hover);
        --token-semantic-overlay-dialog-confirm-focus: var(--token-semantic-color-brand-primary-hover);
        --token-semantic-overlay-dialog-confirm-pressed: var(--token-semantic-color-brand-primary-active);
        --token-semantic-overlay-dialog-cancel-background: var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface));
        --token-semantic-overlay-dialog-cancel-foreground: var(--token-semantic-color-text-primary);
        --token-semantic-overlay-dialog-cancel-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-dialog-cancel-hover: var(--token-semantic-color-background-hover-subtle);
        --token-semantic-overlay-dialog-cancel-focus: var(--token-semantic-color-background-hover-subtle);
        --token-semantic-overlay-dialog-cancel-pressed: var(--token-semantic-color-background-active-subtle);
        --token-semantic-overlay-sheet-background: var(--token-semantic-color-background-surface);
        --token-semantic-overlay-sheet-shape: ${token.radius[0]};
        --token-semantic-overlay-sheet-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-popover-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-overlay-popover-shape: ${token.radius[4]};
        --token-semantic-overlay-popover-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-tooltip-background: var(--token-semantic-color-background-inverse);
        --token-semantic-overlay-tooltip-foreground: var(--token-semantic-color-text-inverse);
        --token-semantic-overlay-tooltip-shape: ${token.radius[3]};
        --token-semantic-overlay-tooltip-shadow: ${token.shadow.none};
        --token-semantic-overlay-tooltip-border: transparent;
        --token-semantic-feedback-toast-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-feedback-toast-foreground: var(--token-semantic-color-text-primary);
        --token-semantic-feedback-toast-shape: ${token.radius[4]};
        --token-semantic-feedback-toast-border: var(--token-semantic-color-border-subtle);
        --token-semantic-feedback-notice-shape: ${token.radius[4]};
        --token-semantic-feedback-banner-shape: ${token.radius[4]};
        --token-semantic-feedback-banner-padding: ${token.space[3]} ${token.space[4]};
        --token-semantic-feedback-banner-title-font-size: ${token.font.size.sm};
        --token-semantic-feedback-banner-tint: 0%;
        --token-semantic-feedback-banner-border-tint: 0%;
        --token-semantic-surface-card-padding-small: ${token.space[4]};
        --token-semantic-surface-card-padding-medium: ${token.space[6]};
        --token-semantic-surface-card-padding-large: ${token.space[8]};
        --token-semantic-status-avatar-shape: ${token.radius[4]};
        --token-semantic-status-tag-shape: ${token.radius.full};
        --token-semantic-status-chip-height: ${token.space[6]};
        --token-semantic-status-chip-font-size: ${token.font.size.xs};
        --token-semantic-status-badge-height: ${token.space[5]};
        --token-semantic-status-spinner-color: var(--token-semantic-color-text-primary);
        --token-semantic-status-spinner-track: transparent;
        --token-semantic-status-spinner-circular-display: inline;
        --token-semantic-status-spinner-spokes-display: none;
        --token-semantic-status-spinner-easing: linear;
    }

    [data-crab-design="apple"] {
        --token-semantic-overlay-dialog-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-overlay-dialog-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-dialog-confirm-background: var(--token-semantic-color-brand-primary);
        --token-semantic-overlay-dialog-confirm-foreground: var(--token-semantic-color-text-on-brand);
        --token-semantic-overlay-dialog-confirm-border: transparent;
        --token-semantic-overlay-dialog-confirm-hover: var(--token-semantic-color-brand-primary-hover);
        --token-semantic-overlay-dialog-confirm-focus: var(--token-semantic-color-brand-primary-hover);
        --token-semantic-overlay-dialog-confirm-pressed: var(--token-semantic-color-brand-primary-active);
        --token-semantic-overlay-dialog-cancel-background: var(--token-semantic-color-background-surface);
        --token-semantic-overlay-dialog-cancel-foreground: var(--token-semantic-color-text-primary);
        --token-semantic-overlay-dialog-cancel-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-dialog-cancel-hover: var(--token-semantic-color-background-hover-subtle);
        --token-semantic-overlay-dialog-cancel-focus: var(--token-semantic-color-background-hover-subtle);
        --token-semantic-overlay-dialog-cancel-pressed: var(--token-semantic-color-background-active-subtle);
        --token-semantic-overlay-sheet-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-overlay-sheet-shape: ${token.radius[6]};
        --token-semantic-overlay-sheet-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-popover-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-overlay-popover-shape: ${token.radius[3]};
        --token-semantic-overlay-popover-border: var(--token-semantic-color-border-subtle);
        --token-semantic-overlay-tooltip-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-overlay-tooltip-foreground: var(--token-semantic-color-text-primary);
        --token-semantic-overlay-tooltip-shape: ${token.radius[2]};
        --token-semantic-overlay-tooltip-shadow: ${token.shadow.md};
        --token-semantic-overlay-tooltip-border: var(--token-semantic-color-border-subtle);
        --token-semantic-feedback-toast-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-feedback-toast-foreground: var(--token-semantic-color-text-primary);
        --token-semantic-feedback-toast-shape: ${token.radius[6]};
        --token-semantic-feedback-toast-border: var(--token-semantic-color-border-subtle);
        --token-semantic-feedback-notice-shape: ${token.radius[8]};
        --token-semantic-feedback-banner-shape: ${token.radius[5]};
        --token-semantic-feedback-banner-padding: ${token.space[3]} ${token.space[4]};
        --token-semantic-feedback-banner-title-font-size: ${token.font.size.sm};
        --token-semantic-feedback-banner-tint: 35%;
        --token-semantic-feedback-banner-border-tint: 35%;
        --token-semantic-surface-card-padding-small: ${token.space[3]};
        --token-semantic-surface-card-padding-medium: ${token.space[4]};
        --token-semantic-surface-card-padding-large: ${token.space[6]};
        --token-semantic-status-avatar-shape: ${token.radius[3]};
        --token-semantic-status-tag-shape: ${token.radius[2]};
        --token-semantic-status-chip-height: ${token.space[6]};
        --token-semantic-status-chip-font-size: ${token.font.size.xs};
        --token-semantic-status-badge-height: ${token.space[4]};
        --token-semantic-status-spinner-color: var(--token-semantic-color-text-secondary);
        --token-semantic-status-spinner-track: var(--token-semantic-color-fill-default);
        --token-semantic-status-spinner-circular-display: none;
        --token-semantic-status-spinner-spokes-display: inline;
        --token-semantic-status-spinner-easing: steps(12);
    }

    @media (forced-colors: active) {
        :root, [data-crab-design] {
            --token-semantic-overlay-dialog-background: Canvas;
            --token-semantic-overlay-dialog-border: CanvasText;
            --token-semantic-overlay-sheet-background: Canvas;
            --token-semantic-overlay-sheet-border: CanvasText;
            --token-semantic-overlay-popover-background: Canvas;
            --token-semantic-overlay-popover-border: CanvasText;
            --token-semantic-overlay-tooltip-background: Canvas;
            --token-semantic-overlay-tooltip-foreground: CanvasText;
            --token-semantic-overlay-tooltip-border: CanvasText;
            --token-semantic-overlay-tooltip-shadow: none;
            --token-semantic-feedback-toast-background: Canvas;
            --token-semantic-feedback-toast-foreground: CanvasText;
            --token-semantic-feedback-toast-border: CanvasText;
            --token-semantic-status-spinner-color: Highlight;
            --token-semantic-status-spinner-track: Canvas;
        }
    }
`;
