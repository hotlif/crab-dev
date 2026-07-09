import type { LineEditProps } from "@crab-dev/rc-line-edit";

/**
 * 科学计数法显示策略。
 * - `auto`（默认）：仅当十进制有效数字位数超过 {@link NumberEditProps.scientificThreshold} 时，
 *   失焦态才切换为上标科学计数法（`1.23×10²¹`）——即"不好显示时才用"。
 * - `never`：始终十进制。
 * - `always`：始终科学计数法。
 */
export type ScientificMode = "auto" | "never" | "always";

/**
 * 从 rc-line-edit 复用的外壳能力（透传 size / status / bordered / prefix / suffix /
 * allowClear / disabled / readOnly / placeholder / ref / containerRef / aria-* 等）。
 * 剔除由数字语义接管或不适用于数字框的属性：
 * - `value` / `defaultValue` / `onChange`：改为 number 语义（见下）；
 * - `type`：数字框固定内部实现，不由外部指定；
 * - `min` / `max` / `step`：原生为 `string | number`，此处收紧为 `number`；
 * - `showCount` / `maxLength`：属文本域语义。
 */
type InheritedShellProps = Omit<
    LineEditProps,
    | "value"
    | "defaultValue"
    | "onChange"
    | "type"
    | "min"
    | "max"
    | "step"
    | "showCount"
    | "maxLength"
>;

export interface NumberEditProps extends InheritedShellProps {
    /** 受控值；空值以 `null` 表示 */
    value?: number | null;

    /** 非受控默认值 */
    defaultValue?: number | null;

    /** 值变化回调（编辑失焦钳制、步进、清除后触发）；空值回传 `null` */
    onChange?: (value: number | null) => void;

    /** 最小值，默认 `-Infinity` */
    min?: number;

    /** 最大值，默认 `Infinity` */
    max?: number;

    /** 步进步长，默认 `1` */
    step?: number;

    /** 大步长（Shift+↑↓ 或 PageUp/PageDown），默认 `step * 10` */
    largeStep?: number;

    /** 小数精度（四舍五入保留位数）；不传则不强制精度 */
    precision?: number;

    /** 科学计数法策略，默认 `auto` */
    scientific?: ScientificMode;

    /**
     * `auto` 模式触发阈值：十进制有效数字位数超过它即转科学计数法，默认 `15`
     * （贴近 JS number 的精度极限）。
     */
    scientificThreshold?: number;

    /** 千分位分隔：`true` 用 `,`，或传自定义分隔符字符串；默认关闭 */
    thousandSeparator?: boolean | string;

    /** 小数点符号，默认 `.` */
    decimalSeparator?: string;

    /** 自定义显示格式化（失焦态）；返回展示字符串，优先级高于内置千分位 */
    formatter?: (value: number | null) => string;

    /** 自定义解析（编辑文本 → 数值），与 {@link NumberEditProps.formatter} 配对 */
    parser?: (text: string) => number | null;

    /** 是否显示步进按钮，默认 `true` */
    controls?: boolean;

    /**
     * 【预留 API — 第一版仅类型签名，尚未实现运算】高精度字符串模式。
     * 未来开启后 value / onChange 将以 string 承载任意精度（BigInt / decimal）。
     * 当前版本传入 `true` 不生效，仍按 number 处理。
     */
    stringMode?: boolean;
}
