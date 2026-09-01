/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLButtonElement = DocsTypePlaceholder;
type KeyboardEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type MouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface SwitchPropsSearchIndex {
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
     * 按钮的大小, 默认为 middle
     */
    "size"?: 'large' | 'middle' | 'small';

    /**
     * 值变化时的回调
     */
    "onChange"?: (checked: boolean, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
