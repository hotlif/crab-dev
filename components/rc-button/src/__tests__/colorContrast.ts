// Test-only resolver for opaque OKLCh tokens and their CSS variable fallbacks.
// DOM tests have no color/layout engine; actual browser styles are checked separately.
function argumentsOf(value: string): string[] {
    const body = value.slice(value.indexOf('(') + 1, -1);
    const parts: string[] = [];
    let depth = 0;
    let start = 0;
    for (let index = 0; index < body.length; index++) {
        if (body[index] === '(') depth++;
        else if (body[index] === ')') depth--;
        else if (body[index] === ',' && depth === 0) {
            parts.push(body.slice(start, index).trim());
            start = index + 1;
        }
    }
    parts.push(body.slice(start).trim());
    return parts;
}

type Color = readonly [lightness: number, chroma: number, hue: number | null];
export type Variables = Readonly<Record<string, string>>;

function scalar(value: string, variables: Variables): number {
    if (value.startsWith('var(')) {
        const [name, fallback] = argumentsOf(value);
        return scalar(variables[name] ?? fallback, variables);
    }
    return Number(value);
}

function fromLinearRgb([r, g, b]: number[]): Color {
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, Math.hypot(a, bb), (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360];
}

export function resolveColor(value: string, variables: Variables, backdrop?: string): Color {
    if (value === 'transparent' && backdrop) return resolveColor(backdrop, variables);
    const relative = /^oklch\(from (.+) l c none\)$/.exec(value);
    if (relative) {
        const [lightness, chroma] = resolveColor(relative[1], variables, backdrop);
        return [lightness, chroma, null];
    }
    if (value.startsWith('var(')) {
        const [name, fallback] = argumentsOf(value);
        return resolveColor(variables[name] ?? fallback, variables, backdrop);
    }
    if (value.startsWith('color-mix(')) {
        const [space, first, second] = argumentsOf(value);
        const weighted = /^(.*)\s+([\d.]+)%$/.exec(first);
        const calculated = /^(.*)\s+calc\((.*) \* 100%\)$/.exec(first);
        if (!weighted && !calculated) throw new Error(`Unsupported mix: ${value}`);
        const weight = weighted ? Number(weighted[2]) / 100 : scalar(calculated![2], variables);
        const firstColor = resolveColor(weighted?.[1] ?? calculated![1], variables, backdrop);
        const secondColor = resolveColor(second, variables, backdrop);
        if (space === 'in srgb') {
            const encode = (v: number) => v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
            const decode = (v: number) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            const a = linearRgb(firstColor), b = linearRgb(secondColor);
            return fromLinearRgb(a.map((v, i) => decode(encode(v) * weight + encode(b[i]) * (1 - weight))));
        }
        if (space !== 'in oklch') throw new Error(`Unsupported mix: ${value}`);
        const [l1, c1, h1] = firstColor;
        const [l2, c2, h2] = resolveColor(second, variables, backdrop);
        // Missing hue borrows the other operand's hue; explicit hues use the shorter arc.
        const hue = h1 === null ? h2 ?? 0 : h2 === null ? h1
            : (h2 + ((h1 - h2 + 540) % 360 - 180) * weight + 360) % 360;
        return [l1 * weight + l2 * (1 - weight), c1 * weight + c2 * (1 - weight), hue];
    }
    const match = /^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/.exec(value);
    if (!match) throw new Error(`Unsupported color: ${value}`);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function linearRgb([lightness, chroma, hue]: Color): number[] {
    const a = chroma * Math.cos((hue ?? 0) * Math.PI / 180);
    const b = chroma * Math.sin((hue ?? 0) * Math.PI / 180);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(channel => Math.max(0, Math.min(1, channel)));
}

export function contrast(first: string, second: string, variables: Variables, backdrop?: string): number {
    const luminance = (color: Color) => {
        const [red, green, blue] = linearRgb(color);
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const a = luminance(resolveColor(first, variables, backdrop));
    const b = luminance(resolveColor(second, variables, backdrop));
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
