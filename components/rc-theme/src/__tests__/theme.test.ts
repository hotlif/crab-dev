import { describe, expect, it } from "@crab-dev/wake/test";
import { readFile } from "node:fs/promises";
import { themeColorContract, themeSelectors } from "../theme-values.js";

interface OklchColor {
    lightness: number;
    chroma: number;
    hue: number;
    alpha: number;
}

const oklchPattern = /oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)/gi;

function parseColors(value: string): OklchColor[] {
    return [...value.matchAll(oklchPattern)].map((match) => ({
        lightness: match[2] ? Number(match[1]) / 100 : Number(match[1]),
        chroma: Number(match[3]),
        hue: Number(match[4]),
        alpha: 1,
    }));
}

function mixHue(first: number, second: number, amount: number): number {
    const difference = ((second - first + 540) % 360) - 180;
    return (first + difference * amount + 360) % 360;
}

function resolveColor(value: string): OklchColor {
    const colors = parseColors(value);
    if (colors.length === 0) throw new Error(`No OKLCh fallback in ${value}`);
    if (!value.includes("color-mix(")) return colors.at(-1)!;

    const percentage = value.match(/\)\)\s+(\d+)%/)?.[1];
    if (percentage === undefined) {
        throw new Error(`Unsupported color mix in ${value}`);
    }
    const firstAmount = Number(percentage) / 100;
    if (colors.length === 1 && value.includes('transparent')) {
        return { ...colors[0], alpha: firstAmount };
    }
    if (colors.length !== 2) {
        throw new Error(`Unsupported color mix in ${value}`);
    }
    const [first, second] = colors;
    return {
        lightness: first.lightness * firstAmount + second.lightness * (1 - firstAmount),
        chroma: first.chroma * firstAmount + second.chroma * (1 - firstAmount),
        hue: mixHue(second.hue, first.hue, firstAmount),
        alpha: 1,
    };
}

function linearRgb(value: string): readonly [number, number, number, number] {
    const { lightness, chroma, hue, alpha } = resolveColor(value);
    const angle = (hue * Math.PI) / 180;
    const a = chroma * Math.cos(angle);
    const b = chroma * Math.sin(angle);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (channel: number) => Math.max(0, Math.min(1, channel));
    const red = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
    const green = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
    const blue = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
    return [red, green, blue, alpha];
}

function relativeLuminance(value: string): number {
    const [red, green, blue] = linearRgb(value);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function compositedRelativeLuminance(value: string, backdrop: string): number {
    const [red, green, blue, alpha] = linearRgb(value);
    const [backdropRed, backdropGreen, backdropBlue] = linearRgb(backdrop);
    return (
        0.2126 * (red * alpha + backdropRed * (1 - alpha)) +
        0.7152 * (green * alpha + backdropGreen * (1 - alpha)) +
        0.0722 * (blue * alpha + backdropBlue * (1 - alpha))
    );
}

function contrastRatio(first: string, second: string): number {
    const firstLuminance = relativeLuminance(first);
    const secondLuminance = relativeLuminance(second);
    return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

function expectContrast(first: string, second: string, minimum: number): void {
    expect(contrastRatio(first, second)).toBeGreaterThanOrEqual(minimum);
}

function expectCompositedContrast(
    foreground: string,
    translucentBackground: string,
    backdrop: string,
    minimum: number,
): void {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = compositedRelativeLuminance(
        translucentBackground,
        backdrop,
    );
    const ratio =
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(minimum);
}

describe("theme color contract", () => {
    it('exposes CSS as the only theme consumption entry', async () => {
        const packageJson = JSON.parse(
            await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
        ) as { exports: Record<string, unknown> };
        expect(Object.keys(packageJson.exports)).toEqual([
            './css/index.css',
            './package.json',
        ]);
    });

    it("uses the public Light, Dark and forced-colors selectors", () => {
        expect(themeSelectors).toEqual({
            light: ':root, [data-theme="light"]',
            dark: '[data-theme="dark"]',
            forcedColors: "@media (forced-colors: active)",
        });
    });

    it("keeps default Light and Dark text and focus indicators accessible", () => {
        for (const theme of Object.values(themeColorContract)) {
            expectContrast(theme.text.primary, theme.background.surface, 4.5);
            expectContrast(theme.text.secondary, theme.background.surface, 4.5);
            expectContrast(theme.text.tertiary, theme.background.surface, 4.5);
            expectContrast(theme.text.inverse, theme.background.inverse, 4.5);
            expectContrast(theme.border.default, theme.background.surface, 3);
            expectContrast(theme.border.hover, theme.background.surface, 3);
            expectContrast(theme.border.strong, theme.background.surface, 3);
            for (const background of [
                theme.background.surface,
                theme.background.elevated,
                theme.background.sunken,
            ]) {
                expectContrast(theme.focusRing, background, 3);
            }
            for (const background of [
                theme.brand.primary,
                theme.brand.hover,
                theme.brand.active,
            ]) {
                expectContrast(theme.text.onBrand, background, 4.5);
            }
            expectContrast(theme.selection.foreground, theme.selection.background, 4.5);
            expectContrast(theme.selection.border, theme.selection.background, 3);
            expectContrast(theme.highlight.foreground, theme.highlight.background, 4.5);
            expectContrast(theme.highlight.foreground, theme.highlight.backgroundActive, 4.5);
            expectCompositedContrast(
                theme.text.primary,
                theme.fill.translucent,
                theme.background.surface,
                4.5,
            );
        }
    });

    it("derives focus shadows from the canonical focus ring variable", () => {
        for (const theme of Object.values(themeColorContract)) {
            expect(theme.focusShadow).toContain(
                "var(--token-semantic-color-focus-ring,",
            );
            expect(theme.focusShadow).toContain(
                "var(--token-semantic-color-border-focus,",
            );
        }
    });

    it("keeps every feedback role readable in Light and Dark", () => {
        for (const theme of Object.values(themeColorContract)) {
            for (const feedback of Object.values(theme.feedback)) {
                expectContrast(feedback.text, feedback.background, 4.5);
                expectContrast(feedback.text, feedback.backgroundHover, 4.5);
                expectContrast(feedback.icon, feedback.background, 3);
                expectContrast(feedback.icon, feedback.backgroundHover, 3);
                expectContrast(feedback.border, feedback.background, 3);
                expectContrast(feedback.border, feedback.backgroundHover, 3);
                for (const solid of [
                    feedback.solid,
                    feedback.solidHover,
                    feedback.solidActive,
                ]) {
                    expectContrast(feedback.onSolid, solid, 4.5);
                }
            }
        }
        for (const feedback of Object.values(themeColorContract.dark.feedback)) {
            expect(feedback.background).toContain("18%");
            expect(feedback.backgroundHover).toContain("26%");
        }
    });

    it("declares default Light before Dark so nested and runtime overrides win", async () => {
        const themeSource = await readFile(new URL("../theme.ts", import.meta.url), "utf8");
        const lightRule = themeSource.indexOf(':root,\n    [data-theme="light"]');
        const darkRule = themeSource.indexOf('[data-theme="dark"]');
        expect(lightRule).toBeGreaterThanOrEqual(0);
        expect(darkRule).toBeGreaterThan(lightRule);

        const root = document.documentElement;
        root.removeAttribute("data-theme");
        expect(root.matches(":root")).toBe(true);

        const nested = document.createElement("section");
        nested.dataset.theme = "dark";
        root.append(nested);
        expect(nested.matches(themeSelectors.dark)).toBe(true);

        root.dataset.theme = "dark";
        expect(root.matches(themeSelectors.dark)).toBe(true);
        root.dataset.theme = "light";
        expect(root.matches('[data-theme="light"]')).toBe(true);
        nested.remove();
        root.removeAttribute("data-theme");
    });

    it("uses only the supported forced-color keywords and removes decorative shadows", async () => {
        const themeSource = await readFile(new URL("../theme.ts", import.meta.url), "utf8");
        const forcedColors = themeSource.slice(themeSource.indexOf("@media (forced-colors: active)"));
        const systemColors = new Set(forcedColors.match(/\b(?:CanvasText|Canvas|GrayText|HighlightText|Highlight)\b/g));
        expect(systemColors).toEqual(new Set(["Canvas", "CanvasText", "GrayText", "Highlight", "HighlightText"]));
        expect(forcedColors).not.toMatch(/\b(?:LinkText|Mark|MarkText)\b/);
        expect(forcedColors).toContain("--token-semantic-shadow-float: none");
        expect(forcedColors).toContain("--token-semantic-shadow-overlay: none");
        expect(forcedColors).toContain("--token-semantic-shadow-focus-ring: 0 0 0 3px Highlight");
    });
});
