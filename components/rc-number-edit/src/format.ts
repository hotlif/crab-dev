import type { ScientificMode } from "./types.js";

/**
 * 数字输入框的纯逻辑层：解析、钳制、精度、科学计数法判定与格式化。
 *
 * 全部为无副作用的纯函数——既便于单元测试，也天然被 React Compiler 记忆化。
 * 本文件不感知 React、不持有状态。
 */

// ─────────────────────────────────────────────────────────────────────────────
// 解析：编辑文本 → 数值
// ─────────────────────────────────────────────────────────────────────────────

export interface ParseOptions {
    /** 小数点符号，如 "." 或 "," */
    decimalSeparator: string;
    /** 千分位分隔符；false 表示不启用 */
    thousandSeparator: string | false;
    /** 自定义解析器，优先于内置逻辑 */
    parser?: (text: string) => number | null;
}

/**
 * 编辑文本 → 数值。
 *
 * 宽容处理：剥离千分位、归一化小数点、容忍前导 `+`、指数写法（`1e5`、`1.2e-3`）。
 * 空串或无法解析为有限数的中间态（如 `"-"`、`"1."`、`"1e"`）返回 `null`。
 */
export function parseNumber(text: string, options: ParseOptions): number | null {
    const { decimalSeparator, thousandSeparator, parser } = options;
    if (parser) {
        return parser(text);
    }
    let s = text.trim();
    if (s === "") {
        return null;
    }
    if (thousandSeparator) {
        s = s.split(thousandSeparator).join("");
    }
    if (decimalSeparator !== ".") {
        s = s.split(decimalSeparator).join(".");
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 数值处理：钳制与精度
// ─────────────────────────────────────────────────────────────────────────────

/** 将 value 钳制到 [min, max]。 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

/**
 * 数值的小数位数——用于步进后消除浮点噪声（如 `0.1 + 0.2` 的尾巴）。
 * 例：`0.1→1`、`1.25→2`、`5→0`、`1e-7→7`。
 */
export function countDecimalPlaces(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }
    const s = String(value);
    if (s.includes("e") || s.includes("E")) {
        const [mantissa, expPart] = Math.abs(value).toExponential().split("e");
        const exp = parseInt(expPart, 10);
        const decimals = mantissa.includes(".") ? mantissa.split(".")[1].length : 0;
        return Math.max(0, decimals - exp);
    }
    const dot = s.indexOf(".");
    return dot === -1 ? 0 : s.length - dot - 1;
}

/** 按精度四舍五入；precision 为 undefined 时原样返回。 */
export function applyPrecision(value: number, precision?: number): number {
    if (precision === undefined || !Number.isFinite(value)) {
        return value;
    }
    // toFixed 在 |value| >= 1e21 会返回指数记法，故大数走 factor 分支
    if (Math.abs(value) >= 1e21) {
        const factor = 10 ** precision;
        return Math.round(value * factor) / factor;
    }
    return Number(value.toFixed(precision));
}

// ─────────────────────────────────────────────────────────────────────────────
// 科学计数法判定："不好显示"的量化
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 十进制完整显示所需的数字位数（整数位 + 小数位，含小数前导零，
 * 不含符号 / 小数点 / 千分位）。这是"不好显示"的度量：越需要更多位十进制
 * 字符表达，越应转科学计数法。
 *
 * 例：`123→3`、`1000→4`、`1e20→21`、`0.00012→5`、`1e-16→16`。
 *
 * 注意：对占位零多的数（如 `1e20` 有效数字仅 1 位），此度量仍取其完整十进制
 * 长度（21），从而正确判定为"不好显示"——比纯有效数字位数更贴合直觉。
 */
export function decimalDigitCount(value: number): number {
    if (!Number.isFinite(value) || value === 0) {
        return 1;
    }
    const [mantissa, expPart] = Math.abs(value).toExponential().split("e");
    const exp = parseInt(expPart, 10);
    const sig = mantissa.replace(".", "").length;
    if (exp >= 0) {
        // 整数为主：整数位数 (exp+1) 与有效数字位数取大（后者含小数尾巴）
        return Math.max(exp + 1, sig);
    }
    // 纯小数：小数点后前导零 (−exp−1) + 有效数字
    return -exp - 1 + sig;
}

/** 判定失焦态是否应以科学计数法呈现该值。 */
export function shouldUseScientific(
    value: number,
    mode: ScientificMode,
    threshold: number,
): boolean {
    if (!Number.isFinite(value)) {
        return false;
    }
    if (mode === "never") {
        return false;
    }
    if (mode === "always") {
        return value !== 0; // 0 无科学计数法意义
    }
    return decimalDigitCount(value) > threshold;
}

// ─────────────────────────────────────────────────────────────────────────────
// 科学计数法：拆分与序列化
// ─────────────────────────────────────────────────────────────────────────────

export interface ScientificParts {
    /** 尾数（已去尾随零），如 `"1.23"` 或 `"-4.5"` */
    mantissa: string;
    /** 10 的幂指数 */
    exponent: number;
}

/** 数值 → 科学计数法各部分（供上标展示层渲染 mantissa × 10^exponent）。 */
export function toScientificParts(value: number, precision?: number): ScientificParts {
    const raw = precision === undefined
        ? value.toExponential()
        : value.toExponential(precision);
    const [mantissaRaw, expPart] = raw.split("e");
    const exponent = parseInt(expPart, 10);
    let mantissa = mantissaRaw;
    if (mantissa.includes(".")) {
        // 去掉尾随零："1.230"→"1.23"、"1.0"→"1"
        mantissa = mantissa.replace(/0+$/, "").replace(/\.$/, "");
    }
    return { mantissa, exponent };
}

/** 数值 → 科学计数法 e 记法字符串（编辑态回显 / 可直接键入），如 `"1.23e+21"`。 */
export function toScientificString(value: number, precision?: number): string {
    const { mantissa, exponent } = toScientificParts(value, precision);
    const sign = exponent >= 0 ? "+" : "-";
    return `${mantissa}e${sign}${Math.abs(exponent)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 十进制展开与格式化
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 把可能带指数记法的数值展开为完整十进制字符串（不含科学计数法）。
 * JS 对 `|x| >= 1e21` 或极小数会自动用指数记法，此函数手动还原。
 * 例：`1e21 → "1000000000000000000000"`、`1.2e-7 → "0.00000012"`。
 */
export function toPlainDecimalString(value: number): string {
    if (value === 0) {
        return "0";
    }
    const str = String(value);
    if (!/e/i.test(str)) {
        return str; // 已是普通十进制
    }
    const negative = value < 0;
    const [mantissa, expPart] = Math.abs(value).toExponential().split("e");
    const exp = parseInt(expPart, 10);
    const digits = mantissa.replace(".", "");
    const pointPos = mantissa.indexOf(".");
    const intLen = pointPos === -1 ? mantissa.length : pointPos;
    const newPoint = intLen + exp; // 展开后小数点相对 digits 起点的位置
    let result: string;
    if (newPoint <= 0) {
        result = "0." + "0".repeat(-newPoint) + digits;
    } else if (newPoint >= digits.length) {
        result = digits + "0".repeat(newPoint - digits.length);
    } else {
        result = digits.slice(0, newPoint) + "." + digits.slice(newPoint);
    }
    return negative ? "-" + result : result;
}

/** 给整数部分（不含符号）插入千分位分隔符。 */
export function addThousandSeparator(intPart: string, separator: string): string {
    return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export interface FormatPlainOptions {
    precision?: number;
    thousandSeparator: string | false;
    decimalSeparator: string;
}

/** 数值 → 失焦态普通十进制显示字符串（精度 + 千分位 + 小数点符号）。 */
export function formatPlain(value: number, options: FormatPlainOptions): string {
    const { precision, thousandSeparator, decimalSeparator } = options;
    let s = toPlainDecimalString(applyPrecision(value, precision));
    const negative = s.startsWith("-");
    if (negative) {
        s = s.slice(1);
    }
    let [intPart, fracPart = ""] = s.split(".");
    // 指定 precision 时固定小数位（补零 / 截断）
    if (precision !== undefined && precision > 0) {
        fracPart = fracPart.slice(0, precision).padEnd(precision, "0");
    }
    if (thousandSeparator) {
        intPart = addThousandSeparator(intPart, thousandSeparator);
    }
    let out = intPart;
    if (fracPart !== "") {
        out += decimalSeparator + fracPart;
    }
    return (negative ? "-" : "") + out;
}

export interface FormatEditingOptions {
    /** 该值失焦态是否走科学计数法（决定编辑态回显 e 记法还是十进制） */
    useScientific: boolean;
    precision?: number;
    decimalSeparator: string;
}

/**
 * 数值 → 聚焦编辑态文本（**始终不含千分位**，便于直接修改）。
 * 科学计数法态回显可编辑的 e 记法（`1.23e+21`），否则回显十进制。
 */
export function formatEditing(value: number, options: FormatEditingOptions): string {
    const { useScientific, precision, decimalSeparator } = options;
    if (useScientific) {
        return toScientificString(value, precision);
    }
    let s = toPlainDecimalString(applyPrecision(value, precision));
    if (decimalSeparator !== ".") {
        s = s.replace(".", decimalSeparator);
    }
    return s;
}
