/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ColorFormat = DocsTypePlaceholder;
type ColorPreset = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type Locale = DocsTypePlaceholder;
type OKLCHValue = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface ColorPickerPropsSearchIndex {
    /**
     * 是否显示「重置」按钮,默认 false。
     * @default false
     */
    "allowClear"?: boolean;

    /**
     * 非受控初始值。
     */
    "defaultValue"?: OKLCHValue;

    /**
     * 暂无说明。
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 文本输入框初始展示格式,默认 "hex"。仅影响显示,输出恒为 OKLCHValue。
     * @default "hex"
     */
    "format"?: ColorFormat;

    /**
     * 暂无说明。
     */
    "locale"?: Locale;

    /**
     * 暂无说明。
     */
    "onValueChange"?: (value: OKLCHValue) => void;

    /**
     * 预设色板:扁平色或带标题的分组色。
     */
    "presets"?: ColorPreset[];

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 是否显示透明度滑块,默认 true。
     * @default true
     */
    "showAlpha"?: boolean;

    /**
     * 是否显示吸管取色按钮(仍需浏览器支持 EyeDropper),默认 true。
     * @default true
     */
    "showEyeDropper"?: boolean;

    /**
     * 暂无说明。
     * @default "medium"
     */
    "size"?: "small" | "medium" | "large";

    /**
     * 受控值。与 defaultValue 二选一。
     */
    "value"?: OKLCHValue;
}
