/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ChangeEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLInputElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface RadioPropsSearchIndex {
    /**
     * 是否选中（受控）
     */
    "checked"?: boolean;

    /**
     * 默认是否选中（非受控）
     * @default false
     */
    "defaultChecked"?: boolean;

    /**
     * 单选框的大小, 默认为 middle
     */
    "size"?: 'large' | 'middle' | 'small';

    /**
     * 值变化时的回调
     */
    "onChange"?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Radio 的值, 在 RadioGroup 中使用
     */
    "value"?: string | number;

    /**
     * 子元素
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
