/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ScientificMode = DocsTypePlaceholder;

export interface NumberEditPropsSearchIndex {
    /**
     * 是否显示步进按钮，默认 `true`
     */
    "controls"?: boolean;

    /**
     * 小数点符号，默认 `.`
     */
    "decimalSeparator"?: string;

    /**
     * 非受控默认值
     */
    "defaultValue"?: number | null;

    /**
     * 自定义显示格式化（失焦态）；返回展示字符串，优先级高于内置千分位
     */
    "formatter"?: (value: number | null) => string;

    /**
     * 大步长（Shift+↑↓ 或 PageUp/PageDown），默认 `step * 10`
     */
    "largeStep"?: number;

    /**
     * 最大值，默认 `Infinity`
     */
    "max"?: number;

    /**
     * 最小值，默认 `-Infinity`
     */
    "min"?: number;

    /**
     * 值变化回调（编辑失焦钳制、步进、清除后触发）；空值回传 `null`
     */
    "onChange"?: (value: number | null) => void;

    /**
     * 自定义解析（编辑文本 → 数值），与 NumberEditProps.formatter 配对
     */
    "parser"?: (text: string) => number | null;

    /**
     * 小数精度（四舍五入保留位数）；不传则不强制精度
     */
    "precision"?: number;

    /**
     * 科学计数法策略，默认 `auto`
     */
    "scientific"?: ScientificMode;

    /**
     * `auto` 模式触发阈值：十进制有效数字位数超过它即转科学计数法，默认 `15` （贴近 JS number 的精度极限）。
     */
    "scientificThreshold"?: number;

    /**
     * 步进步长，默认 `1`
     */
    "step"?: number;

    /**
     * 【预留 API — 第一版仅类型签名，尚未实现运算】高精度字符串模式。 未来开启后 value / onChange 将以 string 承载任意精度（BigInt / decimal）。 当前版本传入 `true` 不生效，仍按 number 处理。
     */
    "stringMode"?: boolean;

    /**
     * 千分位分隔：`true` 用 `,`，或传自定义分隔符字符串；默认关闭
     */
    "thousandSeparator"?: boolean | string;

    /**
     * 受控值；空值以 `null` 表示
     */
    "value"?: number | null;
}
