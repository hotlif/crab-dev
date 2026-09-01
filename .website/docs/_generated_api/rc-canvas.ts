/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type HTMLCanvasElement = DocsTypePlaceholder;
type KeyboardEvent = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CanvasPropsSearchIndex {
    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "className"?: string;

    /**
     * 设备像素比，默认 window.devicePixelRatio（≥1）
     */
    "dpr"?: number;

    /**
     * 自动填充父容器尺寸（ResizeObserver 驱动）。 开启时 width/height 被忽略；父容器必须有明确的 CSS 尺寸。
     * @default false
     */
    "fillParent"?: boolean;

    /**
     * 暂无说明。
     */
    "height"?: number;

    /**
     * 点击空白区域（无命中形状）时触发，常用于取消选中
     */
    "onEmptyClick"?: () => void;

    /**
     * 键盘按下时触发（容器 div 默认 tabIndex=0）
     */
    "onKeyDown"?: (e: KeyboardEvent) => void;

    /**
     * 键盘释放时触发
     */
    "onKeyUp"?: (e: KeyboardEvent) => void;

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLCanvasElement>;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties;

    /**
     * 容器 div 的 tabIndex。消费方在 Canvas 外自建键盘通道 （如 aria-hidden 包裹绘制层）时传 -1 将其移出 Tab 流。
     * @default 0
     */
    "tabIndex"?: number;

    /**
     * 暂无说明。
     */
    "width"?: number;
}
