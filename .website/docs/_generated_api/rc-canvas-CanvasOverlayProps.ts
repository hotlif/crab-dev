// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CanvasOverlayState = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface CanvasOverlayProps {
    /**
     * Anchor in the nearest Group’s coordinates. Contents remain in CSS pixels.
     */
    "x": number;

    /**
     * 暂无说明。
     */
    "y": number;

    /**
     * 暂无说明。
     */
    "children": ReactNode | ((state: CanvasOverlayState) => ReactNode);

    /**
     * 暂无说明。
     */
    "zIndex"?: number;
}
