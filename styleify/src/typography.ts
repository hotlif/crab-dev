import { prefix } from "./util";

/**
 * 根据指定的类型返回 CSS 的 font-family 声明字符串。
 *
 * @param type - 要使用的字体类型，可选值为 "sans"、"serif" 或 "mono"。
 *   - "sans"：使用无衬线字体变量。
 *   - "serif"：使用衬线字体变量。
 *   - "mono"：使用等宽字体变量。
 * @returns 返回设置对应字体变量的 CSS 字符串。
 */
export const fontFamily = (type: "sans" | "serif" | "mono") => {
    switch (type) {
        case "serif":
            return `font-family: var(--${prefix}-font-family-serif);`;
        case "mono":
            return `font-family: var(--${prefix}-font-family-mono);`;
        default:
            return `font-family: var(--${prefix}-font-family-sans);`;
    }
}

export type FontSizeLevel =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";


const xs = `
    font-size: var(--${prefix}-font-size-xs);
    line-height: var(--${prefix}-line-height-xs); 
`

const sm = `
    font-size: var(--${prefix}-font-size-xs);
    line-height: var(--${prefix}-line-height-xs); 
`

const base = `
    font-size: var(--${prefix}-font-size-base);
    line-height: var(--${prefix}-line-height-base);
`

const lg = `
    font-size: var(--${prefix}-font-size-lg);
    line-height: var(--${prefix}-line-height-lg);
`

const xl = `
    font-size: var(--${prefix}-font-size-xl);
    line-height: var(--${prefix}-line-height-xl);
`

const x2l = `
    font-size: var(--${prefix}-font-size-2xl);
    line-height: var(--${prefix}-line-height-2xl);
`

const x3l = `
    font-size: var(--${prefix}-font-size-3xl);
    line-height: var(--${prefix}-line-height-3xl);
`

const x4l = `
    font-size: var(--${prefix}-font-size-4xl);
    line-height: var(--${prefix}-line-height-4xl);
`

const x5l = `
    font-size: var(--${prefix}-font-size-5xl);
    line-height: var(--${prefix}-line-height-5xl);
`

const x6l = `
    font-size: var(--${prefix}-font-size-6xl);
    line-height: var(--${prefix}-line-height-6xl);
`

const x7l = `
    font-size: var(--${prefix}-font-size-7xl);
    line-height: var(--${prefix}-line-height-7xl);
`

const x8l = `
    font-size: var(--${prefix}-font-size-8xl);
    line-height: var(--${prefix}-line-height-8xl);
`

const x9l = `
    font-size: var(--${prefix}-font-size-9xl);
    line-height: var(--${prefix}-line-height-9xl);`


/**
 * 根据不同的字号级别返回对应的 CSS font-size 声明字符串。
 *
 * 支持的字号级别如下表所示：
 *
 * | 级别      | 描述         
 * |-----------|--------------
 * | xs        | 极小字号     
 * | sm        | 小字号       
 * | base      | 基础字号     
 * | lg        | 稍大字号     
 * | xl        | 大字号       
 * | 2xl       | 更大字号     
 * | 3xl       | 超大字号     
 * | 4xl       | 巨大字号     
 * | 5xl       | 特大字号     
 * | 6xl       | 超特大字号   
 * | 7xl       | 极大字号     
 * | 8xl       | 超极大字号   
 * | 9xl       | 最大字号     
 *
 * @param level - 字号级别，可选值为 "xs"、"sm"、"base"、"lg"、"xl"、"2xl"、"3xl"、"4xl"、"5xl"、"6xl"、"7xl"、"8xl"、"9xl"。
 * @returns 返回设置对应字号的 CSS 字符串，例如：`font-size: 1rem;`。
 */
export const fontSize = (type: FontSizeLevel): string => {
    switch (type) {
        case "xs":
            return xs;
        case "sm":
            return sm;
        case "base":
            return base;
        case "lg":
            return lg;
        case "xl":
            return xl;
        case "2xl":
            return x2l;
        case "3xl":
            return x3l;
        case "4xl":
            return x4l;
        case "5xl":
            return x5l;
        case "6xl":
            return x6l;
        case "7xl":
            return x7l;
        case "8xl":
            return x8l;
        case "9xl":
            return x9l;
        default:
            return base;
    }
}

export const fontStyle = (type: "italic" | "not-italic") => {
    if (type === "italic") {
        return "font-style: italic;";
    } else {
        return "font-style: normal;"
    }
}

export const textDecoration = (type: "underline" | "lineThrough" | "overline" | "none") => {
    switch (type) {
        case "underline":
            return "text-decoration: underline;";
        case "lineThrough":
            return "text-decoration: line-through;";
        case "overline":
            return "text-decoration: overline;";
        case "none":
        default:
            return "text-decoration: none;";
    }
}

export const textTransform = (type: "uppercase" | "lowercase" | "capitalize") => {
    switch (type) {
        case "uppercase":
            return "text-transform: uppercase;";
        case "lowercase":
            return "text-transform: lowercase;";
        case "capitalize":
            return "text-transform: capitalize;";
        default:
            return "";
    }
}

const extraCompact = `letter-spacing: var(--${prefix}-text-letter-spacing-extra-compact);`;
const compact = `letter-spacing: var(--${prefix}-text-letter-spacing-extra-compact);`;
const comfortable = `letter-spacing: var(--${prefix}-text-letter-spacing-comfortable);`;
const relaxed = `letter-spacing: var(--${prefix}-text-letter-spacing-relaxed);`;
const spacious = `letter-spacing: var(--${prefix}-text-letter-spacing-spacious);`;
const airy = `letter-spacing: var(--${prefix}-text-letter-spacing-airy);`;

export const textLetterSpacing = (type: "extraCompact" | "compact" | "comfortable" | "relaxed" | "spacious" | "airy") => {
    switch (type) {
        case "extraCompact":
            return extraCompact;
        case "compact":
            return compact;
        case "comfortable":
            return comfortable;
        case "relaxed":
            return relaxed;
        case "spacious":
            return spacious;
        case "airy":
            return airy;
        default:
            return comfortable
    }
}

