/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ConfigSize = DocsTypePlaceholder;
type HTMLAttributes<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface DropdownContainerProps {
    /**
     * 浮层尺寸档；省略时继承最近的 ConfigProvider。
     */
    "size"?: ConfigSize;

    /**
     * 下拉组件内容
     */
    "overlay": ReactNode;

    /**
     * 浮层弹出面板的自定义类名
     */
    "overlayClassName"?: string;

    /**
     * 浮动面板的属性信息
     * @default {}
     */
    "floatingContainerProps"?: HTMLAttributes<HTMLDivElement>;
}
