// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type FitBoundsOptions = DocsTypePlaceholder;
type Pt = DocsTypePlaceholder;
type Rect = DocsTypePlaceholder;
type ViewportState = DocsTypePlaceholder;

export interface CanvasControls {
    /**
     * 读取当前实际视口。
     */
    "getViewport": () => ViewportState;

    /**
     * 设置视口；缩放遵循 Viewport 的 minZoom / maxZoom。
     */
    "setViewport": (viewport: ViewportState) => void;

    /**
     * 缩放到指定倍率，默认以画布中心为支点。
     */
    "zoomTo": (zoom: number, pivot?: Pt) => void;

    /**
     * 显示指定世界坐标边界，padding 使用屏幕 CSS 像素。
     */
    "fitBounds": (bounds: Rect, options?: FitBoundsOptions) => void;

    /**
     * 将指定世界坐标移到视口中心，保留缩放。
     */
    "centerOn": (point: Pt) => void;

    /**
     * 将视口调整为恰好显示所有图元的最佳状态，padding 为边缘留白（world px，默认 40）
     */
    "fitView": (padding?: number) => void;

    /**
     * 将当前帧导出为 PNG DataURL（base64）
     */
    "exportPNG": () => string;

    /**
     * 以 canvas 中心为缩放点，放大约 10%
     */
    "zoomIn": () => void;

    /**
     * 以 canvas 中心为缩放点，缩小约 10%
     */
    "zoomOut": () => void;
}
