// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CheckboxChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface CheckboxProps {
    /**
     * Defines a string value that labels the current element.
     */
    "aria-label"?: (string | undefined) & (string);

    /**
     * 暂无说明。
     */
    "children"?: (ReactNode | undefined) & (ReactNode);

    /**
     * 是否半选状态
     * @default false
     */
    "indeterminate"?: boolean;

    /**
     * 复选框的大小, 默认为 medium
     */
    "size"?: 'large' | 'medium' | 'small';

    /**
     * Checkbox 的值, 在 CheckboxGroup 中使用
     */
    "value"?: string | number;

    /**
     * 暂无说明。 与 defaultChecked 互斥，不能同时提供。
     */
    "checked"?: boolean;

    /**
     * 暂无说明。 与 checked 互斥，不能同时提供。
     */
    "defaultChecked"?: boolean;

    /**
     * 暂无说明。
     */
    "onCheckedChange"?: ((checked: boolean, details: CheckboxChangeDetails) => void);
}
