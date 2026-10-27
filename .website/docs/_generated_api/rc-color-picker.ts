// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ColorFormat = DocsTypePlaceholder;
type ColorPreset = DocsTypePlaceholder;
type ColorValueChangeDetails = DocsTypePlaceholder;
type DropdownOpenChangeDetails = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type Locale = DocsTypePlaceholder;
type OKLCHValue = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface ColorPickerProps {
    /**
     * 暂无说明。
     */
    "locale"?: Locale;

    /**
     * 非受控初始值。
     */
    "disabled"?: boolean;

    /**
     * 暂无说明。
     */
    "size"?: 'small' | 'medium' | 'large';

    /**
     * 文本输入框初始展示格式,默认 "hex"。仅影响显示,输出恒为 OKLCHValue。
     * @default "hex"
     */
    "format"?: ColorFormat;

    /**
     * 预设色板:扁平色或带标题的分组色。
     */
    "presets"?: ColorPreset[];

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
     * 是否显示「重置」按钮,默认 false。
     * @default false
     */
    "allowClear"?: boolean;

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: OKLCHValue;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: OKLCHValue;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: OKLCHValue, details: ColorValueChangeDetails) => void);

    /**
     * 暂无说明。 与 defaultOpen 互斥，不能同时提供。
     */
    "open"?: boolean;

    /**
     * 暂无说明。 与 open 互斥，不能同时提供。
     */
    "defaultOpen"?: boolean;

    /**
     * 暂无说明。
     */
    "onOpenChange"?: ((open: boolean, details: DropdownOpenChangeDetails) => void);
}
