// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type RadioGroupChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface RadioGroupProps {
    /**
     * 自定义类名
     */
    "className"?: string;

    /**
     * 子元素
     */
    "children": ReactNode;

    /**
     * 是否禁用所有单选框
     */
    "disabled"?: boolean;

    /**
     * 单选框组的大小, 默认为 medium
     */
    "size"?: 'large' | 'medium' | 'small';

    /**
     * Radio name 属性，用于原生分组与表单字段；未指定或为空时自动生成组内唯一名称。 通过 FormData 提交时应显式指定稳定的业务字段名。
     */
    "name"?: string;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: string | number;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: string | number;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: string | number, details: RadioGroupChangeDetails) => void);
}
