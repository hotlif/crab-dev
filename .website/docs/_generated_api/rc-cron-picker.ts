/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLInputElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CronPickerPropsSearchIndex {
    /**
     * 无障碍名称,默认 "Cron 表达式"
     */
    "aria-label"?: string;

    /**
     * 自定义类名,作用于触发器容器
     */
    "className"?: string;

    /**
     * 非受控默认值,默认 `* * * * *`
     */
    "defaultValue"?: string;

    /**
     * 是否禁用
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 表达式变化回调,仅在产生合法表达式时触发
     */
    "onChange"?: (value: string) => void;

    /**
     * 弹层开合变化回调
     */
    "onOpenChange"?: (open: boolean) => void;

    /**
     * 占位提示,默认 `* * * * *`
     */
    "placeholder"?: string;

    /**
     * 弹层内"接下来执行时间"预览条数,传 0 关闭预览,默认 5
     * @default 5
     */
    "previewCount"?: number;

    /**
     * 输入框元素的 ref
     */
    "ref"?: Ref<HTMLInputElement>;

    /**
     * 控件尺寸,默认 middle
     * @default 'middle'
     */
    "size"?: 'large' | 'middle' | 'small';

    /**
     * 外部校验状态,影响边框颜色;输入了非法表达式时组件会自行显示 error 态
     */
    "status"?: 'error' | 'warning';

    /**
     * 受控值:五段式(分 时 日 月 周)cron 表达式
     */
    "value"?: string;
}
