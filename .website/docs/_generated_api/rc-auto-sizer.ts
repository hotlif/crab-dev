/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactNode = DocsTypePlaceholder;
type Size = DocsTypePlaceholder;

export interface AutoSizerPropsSearchIndex {
    /**
     * 渲染函数，接收当前容器的 { width, height }，返回需要渲染的内容。 用法与 react-virtualized-auto-sizer 保持一致。
     */
    "children": (size: Size) => ReactNode;

    /**
     * SSR 或首帧渲染时的默认高度，ResizeObserver 触发后自动替换。
     * @default 0
     */
    "defaultHeight"?: number;

    /**
     * SSR 或首帧渲染时的默认宽度，ResizeObserver 触发后自动替换。
     * @default 0
     */
    "defaultWidth"?: number;

    /**
     * 禁用高度自动测量，始终返回 defaultHeight 给子渲染函数。 适合只需感知宽度的场景（如水平虚拟列表）。
     * @default false
     */
    "disableHeight"?: boolean;

    /**
     * 禁用宽度自动测量，始终返回 defaultWidth 给子渲染函数。 适合只需感知高度的场景。
     * @default false
     */
    "disableWidth"?: boolean;

    /**
     * 容器尺寸变化时的回调，与子渲染函数收到的 size 一致。
     */
    "onResize"?: (size: Size) => void;
}
