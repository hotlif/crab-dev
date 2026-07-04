import type { ColorFormat, OKLCHValue } from "../types.js";

/** sRGB 整数分量 0–255,alpha 0–1。 */
export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

const clamp = (x: number, min: number, max: number): number =>
    x < min ? min : x > max ? max : x;

const round = (x: number, digits = 0): number => {
    const p = 10 ** digits;
    return Math.round(x * p) / p;
};

// ---- sRGB 传输函数:线性 <-> 非线性 ----

const linearToSrgb = (x: number): number =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;

const srgbToLinear = (x: number): number =>
    x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;

// ---- OKLCH <-> sRGB(Björn Ottosson OKLab 标准矩阵)----

export const oklchToRgb = ({ lightness: L, chroma: C, hue: H, alpha = 1 }: OKLCHValue): RGBA => {
    const h = (H * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    return {
        r: clamp(Math.round(linearToSrgb(rLin) * 255), 0, 255),
        g: clamp(Math.round(linearToSrgb(gLin) * 255), 0, 255),
        b: clamp(Math.round(linearToSrgb(bLin) * 255), 0, 255),
        a: clamp(alpha, 0, 1),
    };
};

/** a 传 undefined 表示「输入未指定 alpha」,原样保留(OKLCHValue 缺省 alpha 视为 1)。 */
export const rgbToOklch = ({ r, g, b, a }: { r: number; g: number; b: number; a?: number }): OKLCHValue => {
    const rl = srgbToLinear(r / 255);
    const gl = srgbToLinear(g / 255);
    const bl = srgbToLinear(b / 255);

    const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
    const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
    const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const aa = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    const C = Math.sqrt(aa * aa + bb * bb);
    let H = (Math.atan2(bb, aa) * 180) / Math.PI;
    if (H < 0) H += 360;

    return { lightness: L, chroma: C, hue: H, alpha: a === undefined ? undefined : clamp(a, 0, 1) };
};

// ---- hex ----

const toHex2 = (n: number): string => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");

export const oklchToHex = (v: OKLCHValue): string => {
    const { r, g, b, a } = oklchToRgb(v);
    const base = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
    return a < 1 ? `${base}${toHex2(a * 255)}` : base;
};

export const hexToOklch = (hex: string): OKLCHValue | null => {
    const m = /^#?([0-9a-f]{3,8})$/i.exec(hex.trim());
    if (!m) return null;
    let s = m[1];
    if (s.length === 3 || s.length === 4) {
        s = s
            .split("")
            .map((c) => c + c)
            .join("");
    }
    if (s.length !== 6 && s.length !== 8) return null;
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    // 6 位 hex 不含 alpha:返回 undefined 让调用方决定保留还是取默认 1
    const a = s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : undefined;
    return rgbToOklch({ r, g, b, a });
};

// ---- hsl(经 sRGB 中转)----

const rgbToHsl = ({ r, g, b }: RGBA): { h: number; s: number; l: number } => {
    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;
    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);
    const l = (max + min) / 2;
    const d = max - min;
    let h = 0;
    let s = 0;
    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r1:
                h = ((((g1 - b1) / d) % 6) + 6) % 6;
                break;
            case g1:
                h = (b1 - r1) / d + 2;
                break;
            default:
                h = (r1 - g1) / d + 4;
        }
        h *= 60;
    }
    return { h, s, l };
};

const hslToRgb = (h: number, s: number, l: number): RGBA => {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const [r, g, b] =
        h < 60
            ? [c, x, 0]
            : h < 120
                ? [x, c, 0]
                : h < 180
                    ? [0, c, x]
                    : h < 240
                        ? [0, x, c]
                        : h < 300
                            ? [x, 0, c]
                            : [c, 0, x];
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
        a: 1,
    };
};

// ---- 格式化 / 解析 ----

const parseAlpha = (s: string): number =>
    s.endsWith("%") ? clamp(parseFloat(s) / 100, 0, 1) : clamp(parseFloat(s), 0, 1);

export const formatColor = (v: OKLCHValue, format: ColorFormat): string => {
    const alpha = clamp(v.alpha ?? 1, 0, 1);
    switch (format) {
        case "hex":
            return oklchToHex(v).toUpperCase();
        case "rgb": {
            const { r, g, b } = oklchToRgb(v);
            return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${round(alpha, 2)})` : `rgb(${r}, ${g}, ${b})`;
        }
        case "hsl": {
            const { h, s, l } = rgbToHsl(oklchToRgb(v));
            const hh = round(h);
            const ss = round(s * 100);
            const ll = round(l * 100);
            return alpha < 1 ? `hsla(${hh}, ${ss}%, ${ll}%, ${round(alpha, 2)})` : `hsl(${hh}, ${ss}%, ${ll}%)`;
        }
        case "oklch": {
            const core = `${round(v.lightness, 3)} ${round(v.chroma, 3)} ${round(v.hue, 1)}`;
            return alpha < 1 ? `oklch(${core} / ${round(alpha, 2)})` : `oklch(${core})`;
        }
    }
};

/** 解析失败返回 null;输入未写 alpha 时返回 alpha: undefined,由调用方决定保留旧值或取默认 1。 */
export const parseColor = (input: string, format: ColorFormat): OKLCHValue | null => {
    const str = input.trim();
    switch (format) {
        case "hex":
            return hexToOklch(str);
        case "rgb": {
            const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?\s*\)/i.exec(str);
            if (!m) return null;
            const a = m[4] ? parseAlpha(m[4]) : undefined;
            return rgbToOklch({ r: +m[1], g: +m[2], b: +m[3], a });
        }
        case "hsl": {
            const m = /hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.%]+))?\s*\)/i.exec(str);
            if (!m) return null;
            const a = m[4] ? parseAlpha(m[4]) : undefined;
            return rgbToOklch({ ...hslToRgb(+m[1], +m[2] / 100, +m[3] / 100), a });
        }
        case "oklch": {
            const m = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i.exec(str);
            if (!m) return null;
            const L = m[1].endsWith("%") ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
            const a = m[4] ? parseAlpha(m[4]) : undefined;
            return { lightness: L, chroma: +m[2], hue: +m[3], alpha: a };
        }
    }
};
