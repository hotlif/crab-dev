/** Resolve public token fallbacks and supported color mixes without a browser. */
function argumentsOf(value: string): string[] {
    const body = value.slice(value.indexOf("(") + 1, -1);
    let depth = 0;
    let start = 0;
    const parts: string[] = [];
    for (let index = 0; index < body.length; index++) {
        if (body[index] === "(") depth++;
        else if (body[index] === ")") depth--;
        else if (body[index] === "," && depth === 0) {
            parts.push(body.slice(start, index).trim());
            start = index + 1;
        }
    }
    parts.push(body.slice(start).trim());
    return parts;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const encode = (value: number) => value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
const decode = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

export function rgb(value: string): number[] {
    value = value.replace(/calc\((.*?) \* 100%\)/g, (_, expression: string) => {
        const fallback = expression.match(/,\s*([\d.]+)\)+$/)?.[1];
        if (fallback === undefined) throw new Error(`Unsupported opacity: ${expression}`);
        return `${Number(fallback) * 100}%`;
    });
    if (value.startsWith("var(")) return rgb(argumentsOf(value)[1]);
    if (value.startsWith("color-mix(")) {
        const [space, first, second] = argumentsOf(value);
        const weighted = /^(.*)\s+([\d.]+)%$/.exec(first);
        if (!weighted) throw new Error(`Missing state layer weight: ${first}`);
        const weight = Number(weighted[2]) / 100;
        if (space === "in oklch") {
            const polar = (value: string) => {
                const [l, a, b] = oklab(value);
                return [l, Math.hypot(a, b), (Math.atan2(b, a) * 180 / Math.PI + 360) % 360];
            };
            const [l1, c1, h1] = polar(weighted[1]);
            const [l2, c2, h2] = polar(second);
            // CSS defaults to the shorter hue arc for polar color interpolation.
            const hue = (h2 + ((h1 - h2 + 540) % 360 - 180) * weight) * Math.PI / 180;
            const chroma = c1 * weight + c2 * (1 - weight);
            return oklabToRgb(l1 * weight + l2 * (1 - weight), chroma * Math.cos(hue), chroma * Math.sin(hue));
        }
        if (space === "in oklab") {
            const foreground = oklab(weighted[1]);
            const background = oklab(second);
            const mixed = foreground.map((channel, index) => channel * weight + background[index] * (1 - weight));
            return oklabToRgb(mixed[0], mixed[1], mixed[2]);
        }
        if (space !== "in srgb") throw new Error(`Unsupported color space: ${space}`);
        const foreground = rgb(weighted[1]);
        const background = rgb(second);
        return foreground.map((channel, index) => channel * weight + background[index] * (1 - weight));
    }
    const [lightness, a, b] = oklab(value);
    return oklabToRgb(lightness, a, b);
}

function oklab(value: string): number[] {
    if (value.startsWith("var(")) return oklab(argumentsOf(value)[1]);
    const match = /^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/.exec(value);
    if (!match) throw new Error(`Unsupported static color: ${value}`);
    const lightness = Number(match[1]);
    const angle = Number(match[3]) * Math.PI / 180;
    const a = Number(match[2]) * Math.cos(angle);
    const b = Number(match[2]) * Math.sin(angle);
    return [lightness, a, b];
}

function oklabToRgb(lightness: number, a: number, b: number): number[] {
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(channel => encode(clamp(channel)));
}

export function contrast(foreground: string, background: string) {
    const luminance = (value: string) => {
        const [red, green, blue] = rgb(value).map(decode);
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const first = luminance(foreground);
    const second = luminance(background);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
