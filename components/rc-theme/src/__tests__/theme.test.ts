import { describe, expect, it } from "@crab-dev/wake/test";
import { readFile } from "node:fs/promises";
import {
    designColorContract,
    designFieldContract,
    designShapeContract,
    designThemeSelectors,
    shadcnColorContract,
    themeColorContract,
    themeSelectors,
} from "../theme-values.js";

const allThemes = Object.values(designColorContract).flatMap(design => [design.light, design.dark]);

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
    // Resolve the terminal numeric fallback of a shared state-opacity variable.
    value = value.replace(/calc\((.*?) \* 100%\)/g, (_, expression: string) => {
        const fallback = expression.match(/,\s*([\d.]+)\)+$/)?.[1];
        if (fallback === undefined) throw new Error(`Unsupported opacity: ${expression}`);
        return `${Number(fallback) * 100}%`;
    });
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
    if (value.includes("in oklab,")) {
        const a = first.chroma * Math.cos(first.hue * Math.PI / 180) * firstAmount
            + second.chroma * Math.cos(second.hue * Math.PI / 180) * (1 - firstAmount);
        const b = first.chroma * Math.sin(first.hue * Math.PI / 180) * firstAmount
            + second.chroma * Math.sin(second.hue * Math.PI / 180) * (1 - firstAmount);
        return {
            lightness: first.lightness * firstAmount + second.lightness * (1 - firstAmount),
            chroma: Math.hypot(a, b),
            hue: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360,
            alpha: 1,
        };
    }
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
    it('keeps surfaces and paired tonal content readable in both designs', () => {
        for (const theme of allThemes) {
            for (const surface of [...Object.values(theme.surface), ...Object.values(theme.workspace)]) {
                expectContrast(theme.text.primary, surface, 4.5);
                expectContrast(theme.text.secondary, surface, 4.5);
                expectContrast(theme.focusRing, surface, 3);
            }
            expectContrast(theme.brandContainer.foreground, theme.brandContainer.background, 4.5);
            for (const accent of [theme.secondary, theme.tertiary]) {
                expectContrast(accent.onPrimary, accent.primary, 4.5);
                expectContrast(accent.onContainer, accent.container, 4.5);
            }
        }
        const dark = themeColorContract.dark.surface;
        const lightness = [dark.lowest, dark.canvas, dark.low, dark.container, dark.high, dark.highest]
            .map(value => resolveColor(value).lightness);
        expect(lightness).toEqual([...lightness].sort((a, b) => a - b));
        expect(new Set(lightness).size).toBe(6);
    });

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
        expect(designThemeSelectors).toEqual({
            material: {
                light: '[data-crab-design="material"][data-theme="light"]',
                dark: '[data-crab-design="material"][data-theme="dark"]',
            },
            shadcn: {
                light: '[data-crab-design="shadcn"][data-theme="light"]',
                dark: '[data-crab-design="shadcn"][data-theme="dark"]',
            },
        });
    });

    it("keeps default Light and Dark text and focus indicators accessible", () => {
        for (const theme of allThemes) {
            expectContrast(theme.text.primary, theme.background.surface, 4.5);
            expectContrast(theme.text.secondary, theme.background.surface, 4.5);
            expectContrast(theme.text.tertiary, theme.background.surface, 4.5);
            expectContrast(theme.text.inverse, theme.background.inverse, 4.5);
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
        for (const theme of [themeColorContract.light, themeColorContract.dark]) {
            expectContrast(theme.border.default, theme.background.surface, 3);
            expectContrast(theme.border.hover, theme.background.surface, 3);
        }
    });

    it("derives focus shadows from the canonical focus ring variable", () => {
        for (const theme of allThemes) {
            expect(theme.focusShadow).toContain(
                "var(--token-semantic-color-focus-ring,",
            );
            expect(theme.focusShadow).toContain(
                "var(--token-semantic-color-border-focus,",
            );
        }
    });

    it('keeps switch thumbs distinct from their tracks', () => {
        for (const theme of allThemes) {
            expectContrast(theme.control.thumb, theme.control.track, 3);
            expectContrast(theme.control.thumb, theme.control.trackHover, 3);
        }
    });

    it('preserves the Material purple brand independently of shadcn', () => {
        expect(themeColorContract.light.brand.primary).toContain('--token-global-purple-40');
        expect(themeColorContract.dark.brand.primary).toContain('--token-global-purple-80');
        for (const theme of [themeColorContract.light, themeColorContract.dark]) {
            for (const value of [theme.brand.primary, theme.brand.hover, theme.brand.active]) {
                expect(resolveColor(value).chroma).toBeGreaterThan(0.01);
            }
        }
    });

    it('keeps shadcn structural roles neutral and brand states paired across themes', () => {
        for (const mode of ['light', 'dark'] as const) {
            const theme = shadcnColorContract[mode];
            const structuralColors = [
                ...Object.values(theme.workspace),
                ...Object.values(theme.surface),
                ...Object.values(theme.secondary),
                ...Object.values(theme.tertiary),
                ...Object.values(theme.brand),
                ...Object.values(theme.background),
                ...Object.values(theme.text),
                theme.border.subtle,
                theme.border.default,
                theme.border.hover,
                theme.border.strong,
                theme.border.focus,
                theme.focusRing,
                ...Object.values(theme.selection),
                ...Object.values(theme.fill),
            ];
            for (const value of structuralColors) {
                expect(resolveColor(value).chroma).toBeLessThanOrEqual(0.000001);
            }
            const states = [theme.brand.primary, theme.brand.hover, theme.brand.active];
            const lightness = states.map(value => resolveColor(value).lightness);
            expect(new Set(lightness).size).toBe(3);
            expect(lightness).toEqual([...lightness].sort((a, b) => mode === 'light' ? a - b : b - a));
            for (const state of states) expectContrast(theme.text.onBrand, state, 4.5);
        }
        expect(resolveColor(shadcnColorContract.light.brand.primary).lightness)
            .toBeLessThan(resolveColor(shadcnColorContract.dark.brand.primary).lightness);
    });

    it("keeps every feedback role readable in Light and Dark", () => {
        for (const theme of allThemes) {
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
        for (const feedback of [themeColorContract.dark.feedback.success, themeColorContract.dark.feedback.warning, themeColorContract.dark.feedback.info]) {
            expect(feedback.background).toContain("18%");
            expect(feedback.backgroundHover).toContain("26%");
        }
    });

    it("declares default Light before Dark so nested and runtime overrides win", async () => {
        const themeSource = await readFile(new URL("../theme.ts", import.meta.url), "utf8");
        const lightRule = themeSource.search(/:root,\s*\[data-theme="light"\],/);
        const darkRule = themeSource.search(/\[data-theme="dark"\]\s*\{/);
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


    it('selects exactly one design and mode for nested and updated boundaries', () => {
        const outer = document.createElement('section');
        outer.dataset.crabDesign = 'shadcn';
        outer.dataset.theme = 'dark';
        const inner = document.createElement('section');
        outer.append(inner);
        for (const design of ['material', 'shadcn'] as const) {
            for (const mode of ['light', 'dark'] as const) {
                inner.dataset.crabDesign = design;
                inner.dataset.theme = mode;
                for (const candidateDesign of ['material', 'shadcn'] as const) {
                    for (const candidateMode of ['light', 'dark'] as const) {
                        expect(inner.matches(designThemeSelectors[candidateDesign][candidateMode]))
                            .toBe(candidateDesign === design && candidateMode === mode);
                    }
                }
                expect(outer.matches(designThemeSelectors.shadcn.dark)).toBe(true);
            }
        }
        inner.removeAttribute('data-theme');
        expect(inner.matches(designThemeSelectors.shadcn.light)).toBe(false);
    });

    it('resets every themed property when returning from shadcn to Material', async () => {
        const source = await readFile(new URL('../theme.ts', import.meta.url), 'utf8');
        const ruleFor = (selector: string): string => {
            const start = source.indexOf(selector + ' {');
            expect(start).toBeGreaterThanOrEqual(0);
            return source.slice(start, source.indexOf('\n    }', start));
        };
        const declarations = (selector: string) => [...ruleFor(selector).matchAll(/(--token-semantic-[\w-]+):/g)]
            .map(match => match[1]).sort();
        const material = declarations(designThemeSelectors.material.light);
        expect(material).toContain('--token-semantic-color-brand-primary');
        expect(material).toContain('--token-semantic-color-selection-background');
        expect(material).toContain('--token-semantic-shape-button');
        expect(material).toContain('--token-semantic-color-border-card');
        expect(material).toContain('--token-semantic-shadow-card');
        expect(material).toContain('--token-semantic-shadow-overlay');
        expect(material).toContain('--token-semantic-form-layout-columns');
        expect(material).toContain('--token-semantic-form-field-columns');
        expect(material).toContain('--token-semantic-form-field-control-column');
        expect(material).toContain('--token-semantic-form-field-inline');
        expect(material).toContain('--token-semantic-field-required-color');
        expect(material).toContain('--token-semantic-field-required-order');
        expect(material).toContain('--token-semantic-field-required-gap');
        for (const design of ['material', 'shadcn'] as const) {
            for (const mode of ['light', 'dark'] as const) {
                const selector = designThemeSelectors[design][mode];
                expect(declarations(selector)).toEqual(material);
                const rule = ruleFor(selector);
                const colorReference = design === 'material' ? 'color' : 'shadcn';
                expect(rule).toContain('--token-semantic-color-brand-primary: ${' + colorReference + '.' + mode + '.brand.primary};');
                expect(rule).toContain('--token-semantic-shape-control: ${shape.' + design + '.shape.control};');
                expect(rule).toContain('--token-semantic-shadow-overlay: ${shape.' + design + '.shadow.overlay};');
                expect(rule).toContain('--token-semantic-form-layout-columns: ${field.' + design + '.formLayoutColumns};');
                expect(rule).toContain('--token-semantic-form-field-columns: ${field.' + design + '.formFieldColumns};');
                expect(rule).toContain('--token-semantic-form-field-control-column: ${field.' + design + '.formFieldControlColumn};');
                expect(rule).toContain('--token-semantic-form-field-inline: ${field.' + design + '.formFieldInline};');
                expect(rule).toContain('--token-semantic-field-required-color: ${field.' + design + '.requiredColor};');
                expect(rule).toContain('--token-semantic-field-required-order: ${field.' + design + '.requiredOrder};');
                expect(rule).toContain('--token-semantic-field-required-gap: ${field.' + design + '.requiredGap};');
            }
        }
    });

    it('changes shape and elevation independently of color mode and control size', () => {
        const material = designShapeContract.material;
        const shadcn = designShapeContract.shadcn;
        expect(material.shape.control).toContain('4px');
        expect(material.shape.card).toContain('12px');
        expect(material.shape.overlay).toContain('28px');
        expect(material.shape.button).toContain('9999px');
        expect(material.shape.buttonSelected).toContain('12px');
        expect(material.shape.buttonPressed).toContain('8px');
        expect(shadcn.shape.control).toContain('8px');
        expect(shadcn.shape.card).toContain('12px');
        expect(shadcn.shape.overlay).toContain('12px');
        expect(shadcn.shape.button).toBe(shadcn.shape.control);
        expect(shadcn.shape.buttonSelected).toBe(shadcn.shape.control);
        expect(shadcn.shape.buttonPressed).toBe(shadcn.shape.control);
        expect(material.shadow.control).toContain('--token-global-shadow-material-1');
        expect(shadcn.shadow.control).toContain('--token-global-shadow-xs');
        expect(shadcn.shadow.card).toBe('none');
    });

    it('switches the complete text-field layout between Material and shadcn', () => {
        const material = designFieldContract.material;
        const shadcn = designFieldContract.shadcn;
        expect(Object.keys(material).sort()).toEqual(Object.keys(shadcn).sort());
        expect(material.controlMinHeight).toContain('56px');
        expect(material.requiredColor).toBe('inherit');
        expect(material.requiredOrder).toBe('1');
        expect(shadcn.requiredColor).toContain('--token-semantic-color-feedback-error-text');
        expect(shadcn.requiredColor).toContain('--token-global-material-error-40');
        expect(shadcn.requiredOrder).toBe('-1');
        expect(material.requiredGap).toBe(shadcn.requiredGap);
        expect(material.inputFontSize).toContain('16px');
        expect(material.controlIconPaddingInline).toContain('12px');
        expect(material.iconSize).toContain('24px');
        expect(material.iconGap).toContain('16px');
        const terminalLength = (value: string) => Number(value.match(/([\d.]+)px\)+$/)?.[1]);
        expect(terminalLength(material.controlIconPaddingInline) + terminalLength(material.iconSize) + terminalLength(material.iconGap)).toBe(52);
        expect(material.labelPrefixMarginInline).toContain('--token-global-space-6');
        expect(material.labelFloatingFontSize).toContain('12px');
        expect(material.layoutControlRow).toBe(material.layoutLabelRow);
        expect(material.outlineDisplay).toBe('block');
        expect(material.labelFloatingTransform).toBe('translateY(-50%)');
        expect(material.filledBorderWidth).toBe('0 0 1px');
        expect(material.disabledColor).toContain('38%');
        expect(material.disabledBorderColor).toContain('12%');
        expect(material.disabledFilledBackground).toContain('4%');
        expect(shadcn.controlMinHeight).toBe('0px');
        expect(shadcn.iconSize).toContain('16px');
        expect(shadcn.iconGap).toContain('8px');
        expect(shadcn.layoutLabelRow).toBe('1');
        expect(shadcn.layoutControlRow).toBe('2');
        expect(shadcn.outlineDisplay).toBe('none');
        expect(shadcn.labelFloatingTransform).toBe('none');
        expect(shadcn.labelFontSize).toBe(shadcn.labelFloatingFontSize);
        expect(shadcn.labelAlign).toBe('center');
        expect(shadcn.labelFloatingAlign).toBe('center');
        expect(shadcn.filledBorderWidth).toBe('1px');
        expect(shadcn.inputFilledPaddingTop).toBe('0px');
    });

    it('keeps form label alignment in the design contract while standalone fields retain their rows', () => {
        const material = designFieldContract.material;
        const shadcn = designFieldContract.shadcn;
        expect(material.formLayoutColumns).toBe('auto minmax(0, 1fr) auto');
        expect(material.formFieldColumns).toBe('minmax(0, 1fr)');
        expect(material.formFieldControlColumn).toBe('1 / -1');
        expect(material.formFieldInline).toBe('0');
        expect(shadcn.formLayoutColumns).toBe('fit-content(35%) minmax(0, 1fr) auto');
        expect(shadcn.formFieldColumns).toBe('subgrid');
        expect(shadcn.formFieldControlColumn).toBe('2 / -1');
        expect(shadcn.formFieldInline).toBe('1');
        expect(shadcn.layoutLabelRow).toBe('1');
        expect(shadcn.layoutControlRow).toBe('2');
    });

    it('keeps shadcn Filled surfaces paired with readable text in both color modes', async () => {
        const source = await readFile(new URL('../theme.ts', import.meta.url), 'utf8');
        for (const background of [designFieldContract.shadcn.filledBackgroundColor, designFieldContract.shadcn.filledBackgroundColorHover, designFieldContract.shadcn.disabledFilledBackground]) {
            expect(background).toContain('var(--token-semantic-color-background-surface,');
            expect(background).not.toContain('--token-semantic-color-surface-content');
        }
        for (const mode of ['light', 'dark'] as const) {
            expect(source).toContain('--token-semantic-color-background-surface: ${shadcn.' + mode + '.background.surface};');
            expectContrast(shadcnColorContract[mode].text.primary, shadcnColorContract[mode].background.surface, 4.5);
            expectContrast(shadcnColorContract[mode].text.secondary, shadcnColorContract[mode].background.surface, 4.5);
        }
    });

    it("uses only the supported forced-color keywords and removes decorative shadows", async () => {
        const themeSource = await readFile(new URL("../theme.ts", import.meta.url), "utf8");
        const forcedColors = themeSource.slice(themeSource.indexOf("@media (forced-colors: active)"));
        const systemColors = new Set(forcedColors.match(/\b(?:CanvasText|Canvas|GrayText|HighlightText|Highlight)\b/g));
        expect(systemColors).toEqual(new Set(["Canvas", "CanvasText", "GrayText", "Highlight", "HighlightText"]));
        expect(forcedColors).not.toMatch(/\b(?:LinkText|Mark|MarkText)\b/);
        expect(forcedColors).toContain('[data-crab-design][data-theme]');
        expect(forcedColors).toContain("--token-semantic-shadow-card: none");
        expect(forcedColors).toContain("--token-semantic-shadow-control: none");
        expect(forcedColors).toContain("--token-semantic-shadow-float: none");
        expect(forcedColors).toContain("--token-semantic-shadow-overlay: none");
        expect(forcedColors).toContain("--token-semantic-shadow-focus-ring: 0 0 0 3px Highlight");
    });
});
