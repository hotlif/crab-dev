
export interface ColorPickerPanelLocale {
    labelLightness: string;
    labelChroma: string;
    labelHue: string;
}

export interface ColorPickerOverlayLocale {
    confirmText: string;
    cancelText: string;
}

export interface Locale {
    overlay?: ColorPickerOverlayLocale;
    panel?: ColorPickerPanelLocale;
}