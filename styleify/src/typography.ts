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

export type SizeLevel =
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
    font-size: var(--${prefix}-font-size-xs, 0.688rem);
    line-height: var(--${prefix}-line-height-xs, 1.3); 
`

const sm = `
    font-size: var(--${prefix}-font-size-xs, 0.75rem);
    line-height: var(--${prefix}-line-height-sm, 1.3); 
`

const base = `
    font-size: var(--${prefix}-font-size-base, 1rem);
    line-height: var(--${prefix}-line-height-base, 1.5);
`

const lg = `
    font-size: var(--${prefix}-font-size-lg, 1.125rem);
    line-height: var(--${prefix}-line-height-lg, 1.4);
`

const xl = `
    font-size: var(--${prefix}-font-size-xl, 1.5rem);
    line-height: var(--${prefix}-line-height-xl, 1.4);
`

const x2l = `
    font-size: var(--${prefix}-font-size-2xl, 1.875rem);
    line-height: var(--${prefix}-line-height-2xl, 1.3);
`

const x3l = `
    font-size: var(--${prefix}-font-size-3xl, 2.25rem);
    line-height: var(--${prefix}-line-height-3xl, 1.3);
`

const x4l = `
    font-size: var(--${prefix}-font-size-4xl, 3rem);
    line-height: var(--${prefix}-line-height-4xl, 1.25);
`

const x5l = `
    font-size: var(--${prefix}-font-size-5xl, 3.75rem);
    line-height: var(--${prefix}-line-height-5xl, 1.2);
`

const x6l = `
    font-size: var(--${prefix}-font-size-6xl, 4.5rem);
    line-height: var(--${prefix}-line-height-6xl, 1.2);
`

const x7l = `
    font-size: var(--${prefix}-font-size-7xl, 6rem);
    line-height: var(--${prefix}-line-height-7xl, 1.1);
`

const x8l = `
    font-size: var(--${prefix}-font-size-8xl, 8rem);
    line-height: var(--${prefix}-line-height-8xl, 1.1);
`

const x9l = `
    font-size: var(--${prefix}-font-size-9xl, 10rem);
    line-height: var(--${prefix}-line-height-9xl, 1.0);`


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
export const fontSize = (type: SizeLevel): string => {
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


const wrap = "text-wrap: wrap;"
const nowrap = "text-wrap: nowrap;"
const balance = "text-wrap: balance;";
const pretty = "text-wrap: pretty;";

export const textWrap = (type: "wrap" | "nowrap" | "balance" | "pretty") => {
    switch (type) {
        case "wrap":
            return wrap;
        case "nowrap":
            return nowrap;
        case "balance":
            return balance;
        case "pretty":
            return pretty;
        default:
            return wrap
    }
}


const left = "text-align: left;";
const center = "text-align: center;";
const right = "text-align: right;";
const justify = "text-align: justify;";
const start = "text-align: start;";
const end = "text-align: end;";

export const textAlign = (value: "left" | "center" | "right" | "justify" | "start" | "end") => {
    switch (value) {
        case "left":
            return left;
        case "center":
            return center;
        case "right":
            return right;
        case "justify":
            return justify;
        case "start":
            return start;
        case "end":
            return end;
        default:
            return left
    }
}

const truncate = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
const textEllipsis = "text-overflow: ellipsis;";
const textClip = "text-overflow: clip;";

export const textOverflow = (value: "truncate" | "ellipsis" | "clip") => {
        switch (value) {
        case "truncate":
            return truncate;
        case "ellipsis":
            return textEllipsis;
        case "clip":
            return textClip;
        default:
            return textEllipsis
    }
}


const txs = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 1)
`

const tsm = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 2)
`

const tbase = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 3)
`

const tlg = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 4)
`

const txl = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 5)
`

const tx2l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 6)
`

const tx3l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 7)
`

const tx4l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 8)
`

const tx5l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 9)
`

const tx6l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 10)
`

const tx7l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 11)
`

const tx8l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 12)
`

const tx9l = `
    text-indent: calc(var(--${prefix}-text-indent-spacing) * 13)
`

export const textIndent = (type: SizeLevel) => {
    switch (type) {
        case "xs":
            return txs;
        case "sm":
            return tsm;
        case "base":
            return tbase;
        case "lg":
            return tlg;
        case "xl":
            return txl;
        case "2xl":
            return tx2l;
        case "3xl":
            return tx3l;
        case "4xl":
            return tx4l;
        case "5xl":
            return tx5l;
        case "6xl":
            return tx6l;
        case "7xl":
            return tx7l;
        case "8xl":
            return tx8l;
        case "9xl":
            return tx9l;
        default:
            return tbase;
    }
}

type VerticalAlign = "baseline" | "top" | "middle" | "bottom" | "textTop" | "textBottom" | "sub" | "super";


const vbaseline = "vertical-align: baseline;";
const vtop = "vertical-align: top;";
const vmiddle = "vertical-align: middle;";
const vbottom = "vertical-align: bottom;";
const vtextTop = "vertical-align: text-top;";
const vtextBottom = "vertical-align: text-bottom;";
const vsub = "vertical-align: sub;";
const vsuper = "vertical-align: super;";

export const textVerticalAlign = (type: VerticalAlign) => {
    switch (type) {
        case "baseline":
            return vbaseline;
        case "top":
            return vtop;
        case "middle":
            return vmiddle;
        case "bottom":
            return vbottom;
        case "textTop":
            return vtextTop;
        case "textBottom":
            return vtextBottom;
        case "sub":
            return vsub;
        case "super":
            return vsuper;
        default:
            return vmiddle;
    }
}


const breakNormal = "word-break: normal;";
const breakAll = "word-break: break-all;";
const breakKeep = "word-break: keep-all;";

export const textWordBreak = (value: "normal" | "all" | "keep") => {
    switch (value) {
        case "normal":
            return breakNormal;
        case "all":
            return breakAll;
        case "keep":
            return breakKeep;
        default:
            return breakNormal;
    }
}
