// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CronPickerChangeDetails = DocsTypePlaceholder;
type DropdownOpenChangeDetails = DocsTypePlaceholder;
type HTMLInputElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CronPickerProps {
    /**
     * 与输入框关联的可见标签；Material 浮动，Apple 与 shadcn 上置。
     */
    "label"?: string;

    /**
     * 字段外观，默认 outlined；bordered=false 时由宿主提供外观。
     */
    "appearance"?: "outlined" | "filled";

    /**
     * 输入框下方的辅助说明，自动加入 aria-describedby。
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明。
     */
    "errorText"?: string;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: string;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: string;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: string, details: CronPickerChangeDetails) => void);

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

    /**
     * 控件尺寸,默认 medium
     */
    "size"?: 'large' | 'medium' | 'small';

    /**
     * 是否禁用
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 外部校验状态,影响边框颜色;输入了非法表达式时组件会自行显示 error 态
     */
    "status"?: 'error' | 'warning';

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
     * 自定义类名,作用于触发器容器
     */
    "className"?: string;

    /**
     * 无障碍名称,默认 "Cron 表达式"
     */
    "aria-label"?: string;
}
