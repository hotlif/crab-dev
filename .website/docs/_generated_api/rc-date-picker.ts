// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DatePickerPanelProps = DocsTypePlaceholder;
type DropdownOpenChangeDetails = DocsTypePlaceholder;
type HTMLInputElement = DocsTypePlaceholder;
type LineEditProps = DocsTypePlaceholder;
type Omit<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type PickerValueChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
// eslint-disable-next-line @typescript-eslint/no-namespace -- Generated type-only namespace preserves the public qualified API name.
declare namespace Temporal {
    type ZonedDateTime = DocsTypePlaceholder;
}

export interface DatePickerProps {
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
     * 大小
     */
    "size"?: LineEditProps["size"];

    /**
     * 输入框下方的辅助说明，自动加入 aria-describedby。
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明。
     */
    "errorText"?: string;

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。 设为 false 时容器变为无样式（透明、无边框、高度随内容自适应）， 用于嵌入到已有边框的宿主容器中（例如作为另一个组件内部的搜索框）
     */
    "bordered"?: boolean;

    /**
     * 是否显示字符计数，配合 maxLength 使用
     */
    "showCount"?: boolean;

    /**
     * 只传给日期面板；选择草稿和面板实例由选择器管理。
     */
    "panelProps"?: Omit<DatePickerPanelProps, 'value' | 'selectValues' | 'onSelect' | 'instance' | 'range' | 'timeZone' | 'weekStartDay' | 'locale'>;

    /**
     * 限制范围信息
     */
    "range"?: DatePickerPanelProps["range"];

    /**
     * 时区
     */
    "timeZone"?: string;

    /**
     * 一周的起始天
     */
    "weekStartDay"?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

    /**
     * 国际化
     */
    "locale"?: string;

    /**
     * 自定义显示的日期字符串；不改变值或清除状态。空值提示使用 placeholder。
     */
    "renderDisplayString"?: (value: Temporal.ZonedDateTime | null) => string;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: Temporal.ZonedDateTime | null;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: Temporal.ZonedDateTime | null;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: Temporal.ZonedDateTime | null, details: PickerValueChangeDetails) => void);

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
