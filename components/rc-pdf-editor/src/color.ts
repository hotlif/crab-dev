import { parseColor } from '@crab-dev/rc-canvas';
import type { OKLCHValue } from '@crab-dev/rc-color-picker';
import type { Rgba } from './protocol.js';

export function colorCss(color: Rgba): string { return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`; }
export function fromOklch(value: OKLCHValue): Rgba {
    return parseColor(`oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`).map(channel => Math.round(channel * 255)) as Rgba;
}
export function toOklch(color: Rgba): OKLCHValue {
    const [r, g, b] = color.slice(0, 3).map(v => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return { lightness: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, chroma: Math.hypot(a, bb), hue: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360, alpha: color[3] / 255 };
}
