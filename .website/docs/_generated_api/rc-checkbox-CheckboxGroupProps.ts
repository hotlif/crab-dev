// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Array<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type CheckboxGroupChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface CheckboxGroupProps {
    /**
     * 自定义类名
     */
    "className"?: string;

    /**
     * 子元素
     */
    "children": ReactNode;

    /**
     * 是否禁用所有复选框
     */
    "disabled"?: boolean;

    /**
     * 复选框组的大小, 默认为 medium
     */
    "size"?: 'large' | 'medium' | 'small';

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: Array<string | number>;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: Array<string | number>;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: (string | number)[], details: CheckboxGroupChangeDetails) => void);
}
