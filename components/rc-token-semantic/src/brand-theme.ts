import { vars as TokenVars } from './token.js';

/** L2 overrides only: neutral surfaces and feedback colors keep their own meaning. */
export type BrandThemeVariables = Readonly<Record<`--token-semantic-${string}`, string>>;

export interface BrandTheme {
    readonly seed: string;
    readonly light: BrandThemeVariables;
    readonly dark: BrandThemeVariables;
}

interface Color {
    lightness: number;
    chroma: number;
    hue: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Accept opaque sRGB hex only; never interpolate arbitrary CSS into a theme rule. */
export function normalizeBrandColor(value: string): string {
    const hex = value.trim();
    if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) {
        throw new RangeError('brandColor must be an opaque #RGB or #RRGGBB color.');
    }
    return (hex.length === 4 ? `#${[...hex.slice(1)].map((digit) => digit + digit).join('')}` : hex).toLowerCase();
}

function fromHex(hex: string): Color {
    const channel = (start: number) => {
        const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const r = channel(1), g = channel(3), b = channel(5);
    // The same OKLab / linear-sRGB matrices used by rc-color-picker.
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const chroma = Math.hypot(a, bb);
    return {
        lightness: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        chroma: chroma < 0.0001 ? 0 : chroma,
        hue: chroma < 0.0001 ? 0 : (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360,
    };
}

function linearRgb({ lightness: L, chroma: C, hue: H }: Color): readonly [number, number, number] {
    const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
}

function luminance(color: Color): number {
    const [r, g, b] = linearRgb(color);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Keep hue and lightness fixed; lower chroma instead of clipping RGB channels.
function inGamut(color: Color): Color {
    let low = 0, high = color.chroma;
    const fits = (chroma: number) => linearRgb({ ...color, chroma }).every((v) => v >= 0 && v <= 1);
    if (fits(high)) return color;
    for (let step = 0; step < 24; step += 1) {
        const middle = (low + high) / 2;
        if (fits(middle)) low = middle;
        else high = middle;
    }
    return { ...color, chroma: low };
}

function cssColor(color: Color): string {
    const value = inGamut(color);
    return `oklch(${value.lightness.toFixed(6)} ${value.chroma.toFixed(6)} ${value.hue.toFixed(4)})`;
}

function variables(seed: Color, dark: boolean): BrandThemeVariables {
    const chroma = Math.min(seed.chroma, dark ? 0.12 : 0.18);
    let lightness = dark ? clamp(seed.lightness + 0.2, 0.72, 0.82) : clamp(seed.lightness, 0.46, 0.6);
    // Reserve contrast for tinted containers and the white 12% pressed state layer.
    if (!dark) {
        while (1.05 / (luminance(inGamut({ ...seed, lightness, chroma })) + 0.05) < 6.2) lightness -= 0.005;
    }
    const shade = (lightness: number, chroma: number) => cssColor({ lightness, chroma, hue: seed.hue });
    const primary = shade(lightness, chroma);
    const hover = shade(lightness + (dark ? 0.04 : -0.04), chroma);
    const active = shade(lightness + (dark ? 0.08 : -0.08), chroma);
    const onBrand = dark ? shade(0.2, Math.min(chroma * 0.15, 0.02)) : 'oklch(1 0 0)';
    const selected = shade(dark ? 0.26 : 0.95, Math.min(chroma * 0.2, 0.025));
    const accent = (offset: number, role: 'secondary' | 'tertiary'): BrandThemeVariables => {
        const accentShade = (lightness: number, chroma: number) => cssColor({ lightness, chroma, hue: (seed.hue + offset) % 360 });
        return {
            [TokenVars[`color.${role}.primary`]]: accentShade(dark ? 0.82 : 0.48, 0.06),
            [TokenVars[`color.${role}.on-primary`]]: dark ? accentShade(0.25, 0.04) : onBrand,
            [TokenVars[`color.${role}.container`]]: accentShade(dark ? 0.32 : 0.92, 0.035),
            [TokenVars[`color.${role}.on-container`]]: accentShade(dark ? 0.92 : 0.2, 0.035),
        };
    };
    return {
        ...accent(0, 'secondary'),
        ...accent(60, 'tertiary'),
        [TokenVars['color.brand.primary']]: primary,
        [TokenVars['color.brand.primary-hover']]: hover,
        [TokenVars['color.brand.primary-active']]: active,
        [TokenVars['color.brand.primary-subtle']]: primary,
        [TokenVars['color.text.on-brand']]: onBrand,
        [TokenVars['color.text.link']]: primary,
        [TokenVars['color.text.link-hover']]: hover,
        [TokenVars['color.background.selected']]: selected,
        [TokenVars['color.border.focus']]: primary,
        [TokenVars['color.focus.ring']]: primary,
        [TokenVars['color.selection.background']]: selected,
        [TokenVars['color.selection.border']]: primary,
        [TokenVars['color.selection.foreground']]: dark ? primary : active,
        [TokenVars['color.fill.active']]: primary,
        [TokenVars['shadow.focus-ring']]: `0 0 0 3px color-mix(in oklch, ${primary} 20%, transparent)`,
    };
}

/** Derive paired, gamut-mapped OKLCh brand roles from one opaque sRGB seed. */
export function createBrandTheme(brandColor: string): BrandTheme {
    const seed = normalizeBrandColor(brandColor);
    const color = fromHex(seed);
    return { seed, light: variables(color, false), dark: variables(color, true) };
}
