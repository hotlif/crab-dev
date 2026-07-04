/** OKLCH 颜色值。lightness 0–1、chroma 0–~0.4、hue 0–360、alpha 0–1(缺省视为 1)。 */
export interface OKLCHValue {
    lightness: number;
    chroma: number;
    hue: number;
    alpha?: number;
}

/** 输入框/展示所用的颜色格式。仅影响呈现,onValueChange 输出恒为 OKLCHValue。 */
export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

/** 预设色:单色,或带标题的一组色。 */
export type ColorPreset = OKLCHValue | { label: string; colors: OKLCHValue[] };

export interface ColorPickerPanelLocale {
    labelLightness: string;
    labelChroma: string;
    labelHue: string;
    labelAlpha?: string;
}

export interface ColorPickerOverlayLocale {
    confirmText: string;
    cancelText: string;
    clearText?: string;
}

export interface Locale {
    overlay?: ColorPickerOverlayLocale;
    panel?: ColorPickerPanelLocale;
}

/**
 * 原生 EyeDropper API 的类型声明。截至当前 TS lib.dom 未必内置,故在此补齐
 * (符合仓库「类型缺失补 types.ts」约束)。仅 Chromium 95+ 支持,需特性检测。
 */
export interface EyeDropperResult {
    sRGBHex: string;
}

export interface EyeDropperOpenOptions {
    signal?: AbortSignal;
}

export interface EyeDropperInstance {
    open(options?: EyeDropperOpenOptions): Promise<EyeDropperResult>;
}

export interface EyeDropperConstructor {
    new (): EyeDropperInstance;
}

declare global {
    interface Window {
        EyeDropper?: EyeDropperConstructor;
    }
}
