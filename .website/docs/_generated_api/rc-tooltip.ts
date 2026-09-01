/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Placement = DocsTypePlaceholder;
type ReactElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface TooltipPropsSearchIndex {
    /**
     * 是否显示箭头
     * @default true
     */
    "arrow"?: boolean;

    /**
     * 触发元素，必须是单个可接受 ref 的 React 元素
     */
    "children": ReactElement;

    /**
     * 浮层的自定义类名
     */
    "className"?: string;

    /**
     * 非受控模式的默认显隐状态
     * @default false
     */
    "defaultOpen"?: boolean;

    /**
     * 鼠标移入后延迟显示的毫秒数
     * @default 100
     */
    "mouseEnterDelay"?: number;

    /**
     * 鼠标移出后延迟隐藏的毫秒数
     * @default 100
     */
    "mouseLeaveDelay"?: number;

    /**
     * 显隐状态变化时的回调
     */
    "onOpenChange"?: (open: boolean) => void;

    /**
     * 受控模式下的显隐状态
     */
    "open"?: boolean;

    /**
     * 气泡相对于触发元素的位置
     * @default 'top'
     */
    "placement"?: Placement;

    /**
     * 提示文字内容
     */
    "title": ReactNode;
}
