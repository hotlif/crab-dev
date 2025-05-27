import { PrefixName } from "../util";

const prefixNameFontSize = `--${PrefixName}-text`;
const prefixNameLineHeight = `--${PrefixName}-text-line-height`
const TextSizeValue = {
    xs: `font-size: var(${prefixNameFontSize}-xs, 0.75rem); line-height: var(${prefixNameLineHeight}-xs, 1rem);`,
    sm: `font-size: var(${prefixNameFontSize}-sm, 0.875rem); line-height: var(${prefixNameLineHeight}-sm, 1.25rem);`,
    base: `font-size: var(${prefixNameFontSize}-base, 1rem); line-height: var(${prefixNameLineHeight}-base, 1.5rem);`,
    lg: `font-size: var(${prefixNameFontSize}-lg, 1.125rem); line-height: var(${prefixNameLineHeight}-lg, 1.75rem);`,
    xl: `font-size: var(${prefixNameFontSize}-xl, 1.25rem); line-height: var(${prefixNameLineHeight}-xl, 1.75rem);`,
    "2xl": `font-size: var(${prefixNameFontSize}-2xl, 1.5rem); line-height: var(${prefixNameLineHeight}-2xl, 2rem);`,
    "3xl": `font-size: var(${prefixNameFontSize}-3xl, 1.875rem); line-height: var(${prefixNameLineHeight}-3xl, 2.25rem);`,
    "4xl": `font-size: var(${prefixNameFontSize}-4xl, 2.25rem); line-height: var(${prefixNameLineHeight}-4xl, 2.5rem);`,
    "5xl": `font-size: var(${prefixNameFontSize}-5xl, 3rem); line-height: var(${prefixNameLineHeight}-5xl, 1);`,
    "6xl": `font-size: var(${prefixNameFontSize}-6xl, 3.75rem); line-height: var(${prefixNameLineHeight}-6xl, 1);`,
    "7xl": `font-size: var(${prefixNameFontSize}-7xl, 4.5rem); line-height: var(${prefixNameLineHeight}-7xl, 1);`,
    "8xl": `font-size: var(${prefixNameFontSize}-8xl, 6rem); line-height: var(${prefixNameLineHeight}-8xl, 1);`,
    "9xl": `font-size: var(${prefixNameFontSize}-9xl, 8rem); line-height: var(${prefixNameLineHeight}-9xl, 1);`,
};

export const fontSize = (key: keyof typeof TextSizeValue) => {
    return TextSizeValue[key];
}
