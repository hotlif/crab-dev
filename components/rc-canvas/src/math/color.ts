/** RGBA 颜色，每通道归一化到 [0, 1] */
export type ColorRGBA = [number, number, number, number];

/**
 * 将 CSS 颜色字符串解析为归一化 [r, g, b, a]。
 * 支持：transparent、#rgb、#rrggbb、#rrggbbaa、rgb()、rgba()、oklch()。
 */
export function parseColor(css: string): ColorRGBA {
    const s = css.trim();

    if (s === 'transparent') return [0, 0, 0, 0];
    if (s.startsWith('#')) return parseHex(s);
    if (s.startsWith('oklch(')) return parseOklch(s);
    if (s.startsWith('rgba(') || s.startsWith('rgb(')) return parseRgbCss(s);

    return [0, 0, 0, 1];
}

// ─── 内部实现 ────────────────────────────────────────────────────────────────

function parseHex(s: string): ColorRGBA {
    const h = s.slice(1);
    if (h.length === 3) {
        const r = parseInt(h[0] + h[0], 16) / 255;
        const g = parseInt(h[1] + h[1], 16) / 255;
        const b = parseInt(h[2] + h[2], 16) / 255;
        return [r, g, b, 1];
    }
    if (h.length === 6) {
        const r = parseInt(h.slice(0, 2), 16) / 255;
        const g = parseInt(h.slice(2, 4), 16) / 255;
        const b = parseInt(h.slice(4, 6), 16) / 255;
        return [r, g, b, 1];
    }
    if (h.length === 8) {
        const r = parseInt(h.slice(0, 2), 16) / 255;
        const g = parseInt(h.slice(2, 4), 16) / 255;
        const b = parseInt(h.slice(4, 6), 16) / 255;
        const a = parseInt(h.slice(6, 8), 16) / 255;
        return [r, g, b, a];
    }
    return [0, 0, 0, 1];
}

function parseRgbCss(s: string): ColorRGBA {
    const inner = s.replace(/^rgba?\(/, '').replace(/\)$/, '');
    const parts = inner.split(',').map((v) => v.trim());
    const r = parseFloat(parts[0]!) / 255;
    const g = parseFloat(parts[1]!) / 255;
    const b = parseFloat(parts[2]!) / 255;
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return [clamp(r), clamp(g), clamp(b), clamp(a)];
}

/**
 * 解析 oklch(L C H) 或 oklch(L C H / A)。
 * L ∈ [0,1]，C ≥ 0（色度），H ∈ [0,360]（色相，度数），A ∈ [0,1]（可选 alpha）。
 *
 * 转换路径：OKLCh → OKLab → linear sRGB → sRGB
 * 公式来源：Björn Ottosson https://bottosson.github.io/posts/oklab/
 */
function parseOklch(s: string): ColorRGBA {
    const inner = s.replace(/^oklch\(/, '').replace(/\)$/, '');
    const [mainPart, alphaPart] = inner.split('/');
    const parts = (mainPart ?? '').trim().split(/\s+/);

    const L = parseFloat(parts[0] ?? '0');
    const C = parseFloat(parts[1] ?? '0');
    const H = parseFloat(parts[2] ?? '0');
    const alpha = alphaPart !== undefined ? parseFloat(alphaPart.trim()) : 1;

    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    // OKLab → LMS（立方根空间）
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const ss = s_ * s_ * s_;

    // LMS → linear sRGB
    const rLin =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * ss;
    const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * ss;
    const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * ss;

    return [
        clamp(srgbGamma(rLin)),
        clamp(srgbGamma(gLin)),
        clamp(srgbGamma(bLin)),
        clamp(alpha),
    ];
}

/** linear → sRGB gamma 校正（IEC 61966-2-1） */
function srgbGamma(u: number): number {
    if (u <= 0.0031308) return 12.92 * u;
    return 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
}

function clamp(v: number): number {
    return Math.max(0, Math.min(1, v));
}
