import { globalStyle } from '@crab-dev/css';
import palette from '@crab-dev/rc-token-global';

// Tahoe 26 regular Liquid Glass, adapted to browser backdrop compositing.
// The opaque base is intentional: unsupported filters and accessibility modes
// must not leave text over an uncontrolled transparent background.
globalStyle`
    :root, [data-crab-design] {
        --token-semantic-material-control-shadow: var(--token-semantic-shadow-control);
        --token-semantic-material-knob-background: var(--token-semantic-color-control-thumb);
        --token-semantic-material-filter: none;
        --token-semantic-material-sheen: none;
        --token-semantic-material-background: var(--token-semantic-color-surface-overlay);
        --token-semantic-material-border: var(--token-semantic-color-border-subtle);
        --token-semantic-material-shadow: var(--token-semantic-shadow-float);
        --token-semantic-material-navigation-background: initial;
        --token-semantic-feedback-notice-background: var(--token-semantic-color-surface-overlay);
    }

    [data-crab-design="macos"] {
        --token-semantic-material-control-shadow: inset 0 1px 0 color-mix(in oklch, ${palette.white} 18%, transparent), 0 1px 1px color-mix(in oklch, ${palette.black} 8%, transparent);
        --token-semantic-overlay-dialog-background: var(--token-semantic-material-background);
        --token-semantic-feedback-notice-background: var(--token-semantic-material-background);
        --token-semantic-overlay-sheet-background: var(--token-semantic-material-background);
        --token-semantic-material-navigation-background: var(--token-semantic-material-background);
        --token-semantic-shadow-float: var(--token-semantic-material-shadow);
        --token-semantic-shadow-overlay: var(--token-semantic-material-shadow);
        --token-semantic-material-shadow: 0 8px 28px -10px color-mix(in oklch, ${palette.black} 20%, transparent), 0 1px 4px color-mix(in oklch, ${palette.black} 6%, transparent);
    }

    @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        [data-crab-design="macos"][data-theme="light"] {
            --token-semantic-material-knob-background: color-mix(in oklch, ${palette.white} 85%, transparent);
            --token-semantic-material-filter: blur(20px) saturate(1.2);
            --token-semantic-material-background: color-mix(in oklch, ${palette.zinc[100]} 74%, transparent);
            --token-semantic-material-border: color-mix(in oklch, ${palette.zinc[500]} 22%, transparent);
            --token-semantic-material-sheen: linear-gradient(180deg, color-mix(in oklch, ${palette.white} 30%, transparent), transparent 70%);
        }
        [data-crab-design="macos"][data-theme="dark"] {
            --token-semantic-material-knob-background: color-mix(in oklch, ${palette.white} 85%, transparent);
            --token-semantic-material-filter: blur(20px) saturate(1.2);
            --token-semantic-material-background: color-mix(in oklch, ${palette.zinc[800]} 76%, transparent);
            --token-semantic-material-border: color-mix(in oklch, ${palette.white} 12%, transparent);
            --token-semantic-material-sheen: linear-gradient(180deg, color-mix(in oklch, ${palette.white} 5%, transparent), transparent 70%);
        }
    }

    @media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
        [data-crab-design="macos"][data-theme] {
            --token-semantic-material-knob-background: var(--token-semantic-color-control-thumb);
            --token-semantic-material-filter: none;
            --token-semantic-material-sheen: none;
            --token-semantic-material-background: var(--token-semantic-color-surface-overlay);
            --token-semantic-material-border: var(--token-semantic-color-border-default);
        }
    }

    @media (forced-colors: active) {
        :root, [data-crab-design][data-theme] {
            --token-semantic-material-control-shadow: none;
            --token-semantic-material-knob-background: var(--token-semantic-color-control-thumb);
            --token-semantic-material-filter: none;
            --token-semantic-material-sheen: none;
            --token-semantic-material-background: Canvas;
            --token-semantic-material-border: CanvasText;
            --token-semantic-material-shadow: none;
        }
    }
`;
