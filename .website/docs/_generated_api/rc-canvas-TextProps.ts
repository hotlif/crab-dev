// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DragEndEvent = DocsTypePlaceholder;
type DragMoveEvent = DocsTypePlaceholder;
type DragStartEvent = DocsTypePlaceholder;
type PointerHitEvent = DocsTypePlaceholder;

export interface TextProps {
    /**
     * 暂无说明。
     */
    "opacity"?: number;

    /**
     * 暂无说明。
     */
    "zIndex"?: number;

    /**
     * 暂无说明。
     */
    "draggable"?: boolean;

    /**
     * 暂无说明。
     */
    "cursor"?: string;

    /**
     * 暂无说明。
     */
    "onClick"?: (e: PointerHitEvent) => void;

    /**
     * 暂无说明。
     */
    "onMouseEnter"?: (e: PointerHitEvent) => void;

    /**
     * 暂无说明。
     */
    "onMouseLeave"?: (e: PointerHitEvent) => void;

    /**
     * 暂无说明。
     */
    "onDragStart"?: (e: DragStartEvent) => void;

    /**
     * 暂无说明。
     */
    "onDrag"?: (e: DragMoveEvent) => void;

    /**
     * 暂无说明。
     */
    "onDragEnd"?: (e: DragEndEvent) => void;

    /**
     * 暂无说明。
     */
    "x": number;

    /**
     * 暂无说明。
     */
    "y": number;

    /**
     * 暂无说明。
     */
    "children": string;

    /**
     * 暂无说明。
     */
    "fontSize"?: number;

    /**
     * 暂无说明。
     */
    "fontFamily"?: string;

    /**
     * 暂无说明。
     */
    "fill"?: string;

    /**
     * 水平对齐：x 为文字块左 / 中 / 右边的位置，默认 ’left’
     */
    "textAlign"?: 'left' | 'center' | 'right';

    /**
     * 垂直基线：y 为文字块顶 / 中 / 底边的位置，默认 ’top’
     */
    "textBaseline"?: 'top' | 'middle' | 'bottom';

    /**
     * 行高（world px），默认 fontSize × 1.4
     */
    "lineHeight"?: number;

    /**
     * 超出此宽度（world px）时自动词换行；不设则不限宽
     */
    "maxWidth"?: number;

    /**
     * 文本渲染模式，默认 ’sdf’： - ’sdf’：距离场纹理，任意缩放级别下边缘平滑，适合可缩放画布（Viewport）； 代价是小字号（≲14px）细节圆化、发虚。 - ’bitmap’：按设备像素比直接光栅化（ECharts/zrender 清晰文本同机制）， 配合渲染器物理像素吸附，小字号下与 DOM 文本同等清晰； 适合视图不缩放的场景（图表轴文本等），放大后会呈现位图插值模糊。
     */
    "mode"?: 'sdf' | 'bitmap';

    /**
     * 双击进入内联编辑模式（createPortal 挂载到 Canvas 容器 div）
     */
    "editable"?: boolean;

    /**
     * 内联文本编辑器的无障碍名称；未提供或仅为空白时使用当前语言的默认名称。
     */
    "editorLabel"?: string;

    /**
     * 编辑完成（失焦或非输入法组合态的 Enter，Shift+Enter 换行）时触发，每次编辑只通知一次。
     */
    "onEdit"?: (text: string) => void;
}
