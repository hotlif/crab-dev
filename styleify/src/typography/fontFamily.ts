import { PrefixName } from "../util";


const FontFamilyValue = {
    sans: `font-family: var(--${PrefixName}-font-sans, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');`,
    serif: `font-family: var(--${PrefixName}-font-serif, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif);`,
    mono: `font-family: var(--${PrefixName}-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace );`,
};

export const fontFamily = (key: keyof typeof FontFamilyValue) => {
    return FontFamilyValue[key];
}
