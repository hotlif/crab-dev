/**
 * Design tokens for crab-dev website.
 * Light + dark theme via CSS variables on :root / [data-theme="dark"].
 * Colors use OKLCh for stable perceptual lightness across hue shifts.
 */
import { css } from "@linaria/core";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
css`
    :global() {
        :root {
            /* shadcn-like semantic palette */
            --background: oklch(100% 0 0);
            --foreground: oklch(14.5% 0 0);
            --card: oklch(100% 0 0);
            --card-foreground: oklch(14.5% 0 0);
            --popover: oklch(100% 0 0);
            --popover-foreground: oklch(14.5% 0 0);
            --primary: oklch(20.5% 0 0);
            --primary-foreground: oklch(98.5% 0 0);
            --secondary: oklch(97% 0 0);
            --secondary-foreground: oklch(20.5% 0 0);
            --muted: oklch(97% 0 0);
            --muted-foreground: oklch(55.6% 0 0);
            --accent: oklch(97% 0 0);
            --accent-foreground: oklch(20.5% 0 0);
            --destructive: oklch(57.7% 0.245 27.325);
            --destructive-foreground: oklch(98.5% 0 0);
            --border: oklch(92.2% 0 0);
            --input: oklch(92.2% 0 0);
            --ring: oklch(70.8% 0 0);

            /* compatibility aliases */
            --surface-base: var(--background);
            --surface-raised: var(--card);
            --surface-sunken: var(--muted);
            --surface-overlay: oklch(100% 0 0 / 0.85);
            --text-primary: var(--foreground);
            --text-secondary: oklch(40% 0 0);
            --text-tertiary: var(--muted-foreground);
            --text-on-accent: var(--primary-foreground);
            --border-subtle: var(--border);
            --border-default: oklch(88% 0 0);
            --border-strong: oklch(76% 0 0);
            --accent-50: oklch(97% 0 0);
            --accent-100: oklch(93% 0 0);
            --accent-400: oklch(70% 0 0);
            --accent-500: var(--ring);
            --accent-600: oklch(33% 0 0);
            --accent-700: var(--primary);

            /* thematic accent tones */
            --tone-cyan: oklch(68% 0.1 220);
            --tone-cyan-soft: oklch(95% 0.04 220);
            --tone-amber: oklch(78% 0.12 88);
            --tone-amber-soft: oklch(97% 0.05 88);
            --tone-rose: oklch(72% 0.1 24);
            --tone-rose-soft: oklch(95% 0.04 24);

            /* showcase effects */
            --focus-ring-soft: oklch(70.8% 0 0 / 0.28);
            --showcase-top-tint: oklch(99% 0 0 / 0.42);
            --showcase-scan-glow: oklch(100% 0 0 / 0.16);
            --showcase-skeleton-highlight: oklch(100% 0 0 / 0.52);

            /* background decoration helpers */
            --aurora-1: oklch(94% 0.02 250);
            --aurora-2: oklch(96% 0.03 210);
            --aurora-3: oklch(96% 0.035 70);

            /* shadow */
            --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.04);
            --shadow-md: 0 8px 20px oklch(0% 0 0 / 0.06), 0 2px 6px oklch(0% 0 0 / 0.04);
            --shadow-lg: 0 20px 48px oklch(0% 0 0 / 0.10), 0 8px 14px oklch(0% 0 0 / 0.08);

            /* typography */
            --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            --font-mono: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace;

            /* sizing */
            --radius-sm: 6px;
            --radius-md: 8px;
            --radius-lg: 10px;
            --radius-xl: 14px;
            --radius-pill: 999px;

            --transition-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 360ms cubic-bezier(0.4, 0, 0.2, 1);

            color-scheme: light;
        }

        [data-theme="dark"] {
            --background: oklch(14.5% 0 0);
            --foreground: oklch(98.5% 0 0);
            --card: oklch(20.5% 0 0);
            --card-foreground: oklch(98.5% 0 0);
            --popover: oklch(20.5% 0 0);
            --popover-foreground: oklch(98.5% 0 0);
            --primary: oklch(92.2% 0 0);
            --primary-foreground: oklch(20.5% 0 0);
            --secondary: oklch(26.9% 0 0);
            --secondary-foreground: oklch(98.5% 0 0);
            --muted: oklch(26.9% 0 0);
            --muted-foreground: oklch(70.8% 0 0);
            --accent: oklch(26.9% 0 0);
            --accent-foreground: oklch(98.5% 0 0);
            --destructive: oklch(70.4% 0.191 22.216);
            --destructive-foreground: oklch(98.5% 0 0);
            --border: oklch(100% 0 0 / 0.1);
            --input: oklch(100% 0 0 / 0.15);
            --ring: oklch(55.6% 0 0);

            --surface-base: var(--background);
            --surface-raised: var(--card);
            --surface-sunken: var(--muted);
            --surface-overlay: oklch(14.5% 0 0 / 0.8);
            --text-primary: var(--foreground);
            --text-secondary: oklch(84% 0 0);
            --text-tertiary: var(--muted-foreground);
            --text-on-accent: var(--primary-foreground);
            --border-subtle: var(--border);
            --border-default: oklch(100% 0 0 / 0.18);
            --border-strong: oklch(100% 0 0 / 0.28);
            --accent-50: var(--accent);
            --accent-100: oklch(32% 0 0);
            --accent-400: oklch(80% 0 0);
            --accent-500: var(--ring);
            --accent-600: oklch(92% 0 0);
            --accent-700: var(--primary);

            --tone-cyan: oklch(74% 0.09 220);
            --tone-cyan-soft: oklch(32% 0.035 220);
            --tone-amber: oklch(80% 0.1 88);
            --tone-amber-soft: oklch(34% 0.035 88);
            --tone-rose: oklch(78% 0.09 24);
            --tone-rose-soft: oklch(32% 0.03 24);

            --focus-ring-soft: oklch(55.6% 0 0 / 0.45);
            --showcase-top-tint: oklch(24% 0 0 / 0.72);
            --showcase-scan-glow: oklch(92% 0 0 / 0.12);
            --showcase-skeleton-highlight: oklch(100% 0 0 / 0.16);

            --aurora-1: oklch(28% 0.03 250);
            --aurora-2: oklch(24% 0.045 210);
            --aurora-3: oklch(25% 0.04 80);

            --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.34);
            --shadow-md: 0 10px 30px oklch(0% 0 0 / 0.35), 0 2px 6px oklch(0% 0 0 / 0.22);
            --shadow-lg: 0 20px 56px oklch(0% 0 0 / 0.45), 0 8px 20px oklch(0% 0 0 / 0.28);

            color-scheme: dark;
        }

        html, body, #root {
            margin: 0;
            padding: 0;
            min-height: 100%;
        }

        html {
            font-family: var(--font-sans);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        body {
            background: var(--surface-base);
            color: var(--text-primary);
            font-size: 15px;
            line-height: 1.6;
            transition: background-color var(--transition-base), color var(--transition-base);
        }

        *, *::before, *::after {
            box-sizing: border-box;
        }

        a {
            color: inherit;
            text-decoration: none;
            transition: color var(--transition-fast);
        }

        a:hover {
            color: var(--accent-700);
        }

        button {
            font-family: inherit;
        }

        ::selection {
            background: var(--accent-100);
            color: var(--text-primary);
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--border-default);
            border-radius: var(--radius-pill);
            border: 2px solid var(--surface-base);
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--border-strong);
        }
    }
`;

const tokens = {
    space: (n: number) => `${n * 4}px`,
};

export default tokens;
