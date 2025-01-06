const FontFamilyValue = {
    sans: "font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';",
    serif: "font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;",
    mono: "font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;",
};

export const fontFamily = (key: keyof typeof FontFamilyValue) => {
    return FontFamilyValue[key];
}
