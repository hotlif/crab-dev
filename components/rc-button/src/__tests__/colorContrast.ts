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

export function resolveColor(value: string, variables: Variables): Color {
    const relative = /^oklch\(from (.+) l c none\)$/.exec(value);
    if (relative) {
        const [lightness, chroma] = resolveColor(relative[1], variables);
        return [lightness, chroma, null];
    }
    if (value.startsWith('var(')) {
        const [name, fallback] = argumentsOf(value);
        return resolveColor(variables[name] ?? fallback, variables);
    }
    if (value.startsWith('color-mix(')) {
        const [space, first, second] = argumentsOf(value);
        const weighted = /^(.*)\s+([\d.]+)%$/.exec(first);
        if (space !== 'in oklch' || !weighted) throw new Error(`Unsupported mix: ${value}`);
        const weight = Number(weighted[2]) / 100;
        const [l1, c1, h1] = resolveColor(weighted[1], variables);
        const [l2, c2, h2] = resolveColor(second, variables);
        // Missing hue borrows the other operand's hue; explicit hues use the shorter arc.
        const hue = h1 === null ? h2 ?? 0 : h2 === null ? h1
            : (h2 + ((h1 - h2 + 540) % 360 - 180) * weight + 360) % 360;
        return [l1 * weight + l2 * (1 - weight), c1 * weight + c2 * (1 - weight), hue];
    }
    const match = /^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/.exec(value);
    if (!match) throw new Error(`Unsupported color: ${value}`);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function luminance([lightness, chroma, hue]: Color): number {
    const a = chroma * Math.cos((hue ?? 0) * Math.PI / 180);
    const b = chroma * Math.sin((hue ?? 0) * Math.PI / 180);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const [red, green, blue] = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(channel => Math.max(0, Math.min(1, channel)));
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrast(first: string, second: string, variables: Variables): number {
    const a = luminance(resolveColor(first, variables));
    const b = luminance(resolveColor(second, variables));
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
