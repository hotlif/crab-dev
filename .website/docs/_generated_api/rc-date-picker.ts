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
type Temporal_ZonedDateTime = DocsTypePlaceholder;

export interface DatePickerPropsSearchIndex {
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
    "value": Temporal_ZonedDateTime | null;

    /**
     * 改变日期的时候触发的事件
     */
    "onValueChange"?: DatePickerInputProps["onValueChange"];

    /**
     * 自定义显示的日期字符串
     */
    "renderDisplayString"?: (value: Temporal_ZonedDateTime | null) => string;
}
