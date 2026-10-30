// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type HTMLInputElement = DocsTypePlaceholder;
type NumberEditChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ScientificMode = DocsTypePlaceholder;

export interface NumberEditProps {
    /**
     * 前缀图标
     */
    "prefix"?: ReactNode;

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    "status"?: "error" | "warning";

    /**
     * 与输入框关联的可见标签；Material 浮动，Apple 与 shadcn 上置。
     */
    "label"?: string;

    /**
     * input 元素的 ref
     */
    "ref"?: Ref<HTMLInputElement>;

    /**
     * 字段外观，默认 outlined；bordered=false 时由宿主提供外观。
     */
    "appearance"?: "outlined" | "filled";

    /**
     * 设置单行文本输入框的大小，默认为 medium
     */
    "size"?: "large" | "medium" | "small";

    /**
     * 输入框下方的辅助说明，自动加入 aria-describedby。
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明。
     */
    "errorText"?: string;

    /**
     * 后缀图标
     */
    "suffix"?: ReactNode;

    /**
     * 是否允许一键清除内容；触发 onValueChange，受控模式由父组件接受新值
     */
    "allowClear"?: boolean;

    /**
     * 点击清除按钮时的回调
     */
    "onClear"?: () => void;

    /**
     * 容器 div 的 ref
     */
    "containerRef"?: Ref<HTMLDivElement>;

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。 设为 false 时容器变为无样式（透明、无边框、高度随内容自适应）， 用于嵌入到已有边框的宿主容器中（例如作为另一个组件内部的搜索框）
     */
    "bordered"?: boolean;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: number | null;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: number | null;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: number | null, details: NumberEditChangeDetails) => void);

    /**
     * 最小值，默认 `-Infinity`
     */
    "min"?: number;

    /**
     * 最大值，默认 `Infinity`
     */
    "max"?: number;

    /**
     * 步进步长，默认 `1`
     */
    "step"?: number;

    /**
     * 大步长（Shift+↑↓ 或 PageUp/PageDown），默认 `step * 10`
     */
    "largeStep"?: number;

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
     * 千分位分隔：`true` 用 `,`，或传自定义分隔符字符串；默认关闭
     */
    "thousandSeparator"?: boolean | string;

    /**
     * 小数点符号，默认 `.`
     */
    "decimalSeparator"?: string;

    /**
     * 自定义显示格式化（失焦态）；返回展示字符串，优先级高于内置千分位
     */
    "formatter"?: (value: number | null) => string;

    /**
     * 自定义解析（编辑文本 → 数值），与 NumberEditProps.formatter 配对
     */
    "parser"?: (text: string) => number | null;

    /**
     * 是否显示步进按钮，默认 `true`
     */
    "controls"?: boolean;

    /**
     * 当前仅支持 number 模式；高精度字符串运算尚未提供，禁止开启。
     */
    "stringMode"?: false;
}
