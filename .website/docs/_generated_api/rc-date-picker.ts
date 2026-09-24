/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DatePickerInputProps = DocsTypePlaceholder;
type DatePickerPanelProps = DocsTypePlaceholder;
type LineEditProps = DocsTypePlaceholder;
type Omit<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
// eslint-disable-next-line @typescript-eslint/no-namespace -- Generated type-only namespace preserves the public qualified API name.
declare namespace Temporal {
    type ZonedDateTime = DocsTypePlaceholder;
}

export interface DatePickerProps {
    /**
     * 只传给日期面板；选择草稿和面板实例由选择器管理。
     */
    "panelProps"?: Omit<DatePickerPanelProps, 'value' | 'selectValues' | 'onSelect' | 'instance' | 'range' | 'timeZone' | 'weekStartDay' | 'locale'>;

    /**
     * 大小
     */
    "size"?: LineEditProps["size"];

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
     * 日期值
     */
    "value": Temporal.ZonedDateTime | null;

    /**
     * 改变日期的时候触发的事件
     */
    "onValueChange"?: DatePickerInputProps["onValueChange"];

    /**
     * 自定义显示的日期字符串
     */
    "renderDisplayString"?: (value: Temporal.ZonedDateTime | null) => string;
}
