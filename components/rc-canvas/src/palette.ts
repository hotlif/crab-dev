import token from './token.js';
import { parseColor } from './math/color.js';

export interface CanvasPalette {
    /** Line / Text / Marker 等图元未显式给色时的前景色。 */
    foreground: string;
    /** InfiniteGrid 未显式给色时的网格色。 */
    grid: string;
    /** Viewport 框选描边色。 */
    selectionStroke: string;
    /** Viewport 框选填充色。 */
    selectionFill: string;
    /** Text 内联编辑器背景色。 */
    editorBackground: string;
    /** Text 内联编辑器边框色。 */
    editorBorder: string;
    /** Transformer 控制点填充色。 */
    transformerHandleFill: string;
    /** Transformer 控制点描边色。 */
    transformerHandleStroke: string;
    /** Transformer 选区描边色。 */
    transformerSelectionStroke: string;
    /** Minimap 背景色。 */
    minimapBackground: string;
    /** Minimap 视口描边色。 */
    minimapViewportStroke: string;
    /** Minimap 视口填充色。 */
    minimapViewportFill: string;
    /** Minimap 边框色。 */
    minimapBorder: string;
    /** Minimap 投影。 */
    minimapShadow: string;
    /** Minimap 中无法读取原色的位图占位色。 */
    minimapImageFallback: string;
}

/** 与既有硬编码默认值逐项一致，省略 palette 时不改变视觉。 */
export const DEFAULT_CANVAS_PALETTE: CanvasPalette = {
    foreground: '#000000',
    grid: '#b0b0b0',
    selectionStroke: '#4a9eff',
    selectionFill: 'rgba(74,158,255,0.08)',
    editorBackground: 'white',
    editorBorder: '#4a9eff',
    transformerHandleFill: '#ffffff',
    transformerHandleStroke: '#4a90e2',
    transformerSelectionStroke: '#4a90e2',
    minimapBackground: 'rgba(240,242,245,0.92)',
    minimapViewportStroke: 'rgba(59,130,246,0.8)',
    minimapViewportFill: 'rgba(59,130,246,0.08)',
    minimapBorder: 'rgba(0,0,0,0.08)',
    minimapShadow: '0 2px 10px rgba(0,0,0,0.14)',
    minimapImageFallback: 'rgba(160,160,160,0.7)',
};

/**
 * 对接三层设计令牌的 Canvas palette。
 *
 * WebGL 不能直接解析 CSS var / color-mix / 系统色；Canvas 会在自身 DOM
 * 边界通过 computed style 求值，再把普通 rgb/rgba 字符串交给绘制层。
 */
export const SEMANTIC_CANVAS_PALETTE: CanvasPalette = {
    foreground: token.palette.foreground.color,
    grid: token.palette.grid.color,
    selectionStroke: token.palette.selection['border-color'],
    selectionFill: token.palette.selection['background-color'],
    editorBackground: token.palette.editor['background-color'],
    editorBorder: token.palette.editor['border-color'],
    transformerHandleFill: token.palette.transformer.handle['background-color'],
    transformerHandleStroke: token.palette.transformer.handle['border-color'],
    transformerSelectionStroke: token.palette.transformer.selection['border-color'],
    minimapBackground: token.palette.minimap['background-color'],
    minimapViewportStroke: token.palette.minimap.viewport['border-color'],
    minimapViewportFill: token.palette.minimap.viewport['background-color'],
    minimapBorder: token.palette.minimap['border-color'],
    minimapShadow: token.palette.minimap['box-shadow'],
    minimapImageFallback: token.palette.minimap['image-fallback']['background-color'],
};

export function mergeCanvasPalette(palette?: Partial<CanvasPalette>): CanvasPalette {
    return palette ? { ...DEFAULT_CANVAS_PALETTE, ...palette } : DEFAULT_CANVAS_PALETTE;
}

const COLOR_FIELDS = [
    'foreground',
    'grid',
    'selectionStroke',
    'selectionFill',
    'editorBackground',
    'editorBorder',
    'transformerHandleFill',
    'transformerHandleStroke',
    'transformerSelectionStroke',
    'minimapBackground',
    'minimapViewportStroke',
    'minimapViewportFill',
    'minimapBorder',
    'minimapImageFallback',
] as const satisfies readonly (keyof CanvasPalette)[];

const warnedInvalidValues = new Set<string>();
let resolvedValueCaches = new WeakMap<HTMLElement, Map<string, string>>();

export function clearCanvasColorResolutionCache(probe?: HTMLElement | null): void {
    if (probe) {
        resolvedValueCaches.delete(probe);
        return;
    }
    resolvedValueCaches = new WeakMap();
}

function resolutionCache(probe: HTMLElement): Map<string, string> {
    const existing = resolvedValueCaches.get(probe);
    if (existing) return existing;
    const created = new Map<string, string>();
    resolvedValueCaches.set(probe, created);
    return created;
}

function warnInvalidValue(field: string, value: string, fallback: string): void {
    const runtimeProcess = (globalThis as {
        process?: { env?: { NODE_ENV?: string } };
    }).process;
    if (runtimeProcess?.env?.NODE_ENV === 'production') return;
    const key = `${field}\u0000${value}`;
    if (warnedInvalidValues.has(key)) return;
    warnedInvalidValues.add(key);
    console.warn(`[rc-canvas] palette.${field} 无法解析颜色 “${value}”，已回退为 “${fallback}”。`);
}

function isLegacyRgbColor(value: string): boolean {
    return /^rgba?\([^)]*,[^)]*\)$/i.test(value);
}

function findClosingParenthesis(value: string, openingIndex: number): number {
    let depth = 0;
    for (let index = openingIndex; index < value.length; index += 1) {
        if (value[index] === '(') depth += 1;
        if (value[index] !== ')') continue;
        depth -= 1;
        if (depth === 0) return index;
    }
    return -1;
}

function findTopLevelComma(value: string): number {
    let depth = 0;
    for (let index = 0; index < value.length; index += 1) {
        if (value[index] === '(') depth += 1;
        else if (value[index] === ')') depth -= 1;
        else if (value[index] === ',' && depth === 0) return index;
    }
    return -1;
}

/**
 * CSS accepts `var(--missing)` at parse time, then makes the whole declaration
 * invalid at computed-value time. Resolve custom properties first so an inherited
 * `color` value cannot be mistaken for the requested palette color.
 */
function substituteCssVariables(
    value: string,
    probe: HTMLElement,
    stack: ReadonlySet<string> = new Set(),
): string | null {
    const variableIndex = value.indexOf('var(');
    if (variableIndex < 0) return value;

    const openingIndex = variableIndex + 3;
    const closingIndex = findClosingParenthesis(value, openingIndex);
    if (closingIndex < 0) return null;

    const body = value.slice(openingIndex + 1, closingIndex);
    const commaIndex = findTopLevelComma(body);
    const name = (commaIndex < 0 ? body : body.slice(0, commaIndex)).trim();
    const fallback = commaIndex < 0 ? null : body.slice(commaIndex + 1).trim();
    if (!/^--[a-z0-9_-]+$/i.test(name)) return null;

    const computedStyle = getComputedStyle(probe);
    const customValue = computedStyle.getPropertyValue(name).trim();
    let replacement: string | null = null;
    if (customValue && !stack.has(name)) {
        const nextStack = new Set(stack);
        nextStack.add(name);
        replacement = substituteCssVariables(customValue, probe, nextStack);
    }
    if (replacement === null && fallback !== null) {
        replacement = substituteCssVariables(fallback, probe, stack);
    }
    if (replacement === null) return null;

    return substituteCssVariables(
        `${value.slice(0, variableIndex)}${replacement}${value.slice(closingIndex + 1)}`,
        probe,
        stack,
    );
}

function serializeKnownColor(value: string): string | null {
    const normalized = value.trim();
    const named = normalized.toLowerCase();
    if (named === 'transparent') return 'transparent';
    if (named === 'white') return 'rgba(255, 255, 255, 1)';
    if (named === 'black') return 'rgba(0, 0, 0, 1)';
    const isHex = /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(normalized);
    const isOklch = /^oklch\(\s*\d*\.?\d+\s+\d*\.?\d+\s+-?\d*\.?\d+(?:deg)?(?:\s*\/\s*\d*\.?\d+)?\s*\)$/i.test(normalized);
    if (!isHex && !isOklch) return null;
    const [red, green, blue, alpha] = parseColor(normalized);
    if (![red, green, blue, alpha].every(Number.isFinite)) return null;
    return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${alpha})`;
}

/**
 * computed style 对现代色彩空间通常保留原空间；除 legacy rgb/rgba 外，
 * 一律借 1×1 Canvas2D 取得确定的 sRGB 像素值，避免 WebGL 层再猜语法。
 */
function normalizeComputedColor(value: string, probe: HTMLElement): string | null {
    if (isLegacyRgbColor(value)) return value;
    if (value.toLowerCase() === 'transparent') return 'rgba(0, 0, 0, 0)';
    const knownColor = serializeKnownColor(value);
    if (knownColor) return knownColor;

    const canvas = probe.ownerDocument.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    // Canvas2D 对不支持的颜色会静默保留原 fillStyle。用两个不同的既有
    // renderer 默认色作哨兵，区分“候选色恰好等于哨兵”和“setter 拒绝候选色”。
    context.fillStyle = DEFAULT_CANVAS_PALETTE.foreground;
    const firstSentinel = context.fillStyle;
    context.fillStyle = value;
    if (context.fillStyle === firstSentinel) {
        context.fillStyle = DEFAULT_CANVAS_PALETTE.grid;
        const secondSentinel = context.fillStyle;
        context.fillStyle = value;
        if (context.fillStyle === secondSentinel) return null;
    }

    context.clearRect(0, 0, 1, 1);
    context.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
}

function resolveFallbackColor(fallback: string, probe: HTMLElement): string {
    const knownFallback = serializeKnownColor(fallback);
    if (knownFallback) return knownFallback;
    probe.style.color = fallback;
    const computed = getComputedStyle(probe).color.trim();
    return normalizeComputedColor(computed, probe) ?? DEFAULT_CANVAS_PALETTE.foreground;
}

/** 在 Canvas 所在 DOM 继承上下文中把 CSS 颜色表达式求值为普通颜色。 */
export function resolveCanvasColor(
    value: string,
    probe: HTMLElement | null,
    fallback: string = DEFAULT_CANVAS_PALETTE.foreground,
    field = 'foreground',
): string {
    if (!probe || typeof getComputedStyle !== 'function') return value;

    const cache = resolutionCache(probe);
    const cached = cache.get(`color\u0000${value}`);
    if (cached !== undefined) return cached;

    const substituted = value.includes('var(')
        ? substituteCssVariables(value, probe)
        : value;
    if (substituted === null) {
        warnInvalidValue(field, value, fallback);
        return resolveFallbackColor(fallback, probe);
    }

    // 已由绘制层可靠支持的字面量无需进入 CSSOM。除减少真实页面的
    // computed-style 开销外，也避开 JSDOM 对 OKLCh style setter 的极慢路径。
    const knownColor = serializeKnownColor(substituted);
    if (knownColor) {
        cache.set(`color\u0000${value}`, knownColor);
        return knownColor;
    }

    probe.style.color = '';
    probe.style.color = substituted;
    if (!probe.style.color) {
        warnInvalidValue(field, value, fallback);
        return resolveFallbackColor(fallback, probe);
    }
    const resolved = getComputedStyle(probe).color.trim();
    if (!resolved) {
        warnInvalidValue(field, value, fallback);
        return resolveFallbackColor(fallback, probe);
    }
    const normalized = normalizeComputedColor(resolved, probe);
    if (normalized) {
        cache.set(`color\u0000${value}`, normalized);
        return normalized;
    }

    warnInvalidValue(field, value, fallback);
    return resolveFallbackColor(fallback, probe);
}

function resolveCanvasShadow(value: string, probe: HTMLElement | null, fallback: string): string {
    if (!probe || typeof getComputedStyle !== 'function') return value;

    const cache = resolutionCache(probe);
    const cacheKey = `shadow\u0000${value}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;

    const substituted = value.includes('var(')
        ? substituteCssVariables(value, probe)
        : value;
    if (substituted === null) {
        warnInvalidValue('minimapShadow', value, fallback);
        probe.style.boxShadow = fallback;
        return getComputedStyle(probe).boxShadow.trim() || fallback;
    }

    probe.style.boxShadow = '';
    probe.style.boxShadow = substituted;
    if (!probe.style.boxShadow) {
        warnInvalidValue('minimapShadow', value, fallback);
        probe.style.boxShadow = fallback;
        return getComputedStyle(probe).boxShadow.trim() || fallback;
    }
    const resolved = getComputedStyle(probe).boxShadow.trim();
    if (!resolved || (resolved === 'none' && substituted.trim().toLowerCase() !== 'none')) {
        warnInvalidValue('minimapShadow', value, fallback);
        probe.style.boxShadow = fallback;
        return getComputedStyle(probe).boxShadow.trim() || fallback;
    }
    cache.set(cacheKey, resolved);
    return resolved;
}

export function resolveCanvasPalette(palette: CanvasPalette, probe: HTMLElement | null): CanvasPalette {
    const resolved = { ...palette };
    for (const field of COLOR_FIELDS) {
        resolved[field] = resolveCanvasColor(palette[field], probe, DEFAULT_CANVAS_PALETTE[field], field);
    }
    resolved.minimapShadow = resolveCanvasShadow(
        palette.minimapShadow,
        probe,
        DEFAULT_CANVAS_PALETTE.minimapShadow,
    );
    return resolved;
}

export function canvasPalettesEqual(a: CanvasPalette, b: CanvasPalette): boolean {
    return (Object.keys(a) as (keyof CanvasPalette)[]).every(key => a[key] === b[key]);
}
