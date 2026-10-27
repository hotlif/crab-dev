// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Placement = DocsTypePlaceholder;
type ReactElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type TooltipOpenChangeDetails = DocsTypePlaceholder;

export interface TooltipProps {
    /**
     * 提示文字内容
     */
    "title": ReactNode;

    /**
     * 触发元素，必须是单个可接受 ref 的 React 元素
     */
    "children": ReactElement;

    /**
     * 气泡相对于触发元素的位置
     * @default ’top’
     */
    "placement"?: Placement;

    /**
     * 鼠标移入后延迟显示的毫秒数
     * @default 100
     */
    "mouseEnterDelay"?: number;

    /**
     * 鼠标离开触发元素和提示区域后延迟隐藏的毫秒数
     * @default 1500
     */
    "mouseLeaveDelay"?: number;

    /**
     * 是否显示箭头；M3 plain tooltip 默认不显示，保留为扩展选项
     * @default false
     */
    "arrow"?: boolean;

    /**
     * 浮层的自定义类名
     */
    "className"?: string;

    /**
     * 暂无说明。 与 defaultOpen 互斥，不能同时提供。
     */
    "open"?: boolean;

    /**
     * 暂无说明。 与 open 互斥，不能同时提供。
     */
    "defaultOpen"?: boolean;

    /**
     * 暂无说明。
     */
    "onOpenChange"?: ((open: boolean, details: TooltipOpenChangeDetails) => void);
}
