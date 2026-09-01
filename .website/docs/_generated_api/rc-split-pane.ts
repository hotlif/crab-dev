/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface SplitPanePropsSearchIndex {
    /**
     * 分隔条的无障碍名称
     * @default '调整面板大小'
     */
    "aria-label"?: string;

    /**
     * 恰好两个面板：`[第一个, 第二个]`（horizontal 为左右，vertical 为上下）
     */
    "children": [ReactNode, ReactNode];

    /**
     * 暂无说明。
     */
    "className"?: string;

    /**
     * 非受控初始尺寸（px），同时是双击 / Enter 复位的目标
     */
    "defaultSize": number;

    /**
     * 分栏方向：`horizontal` 左右分栏（拖动调宽）；`vertical` 上下分栏（拖动调高）
     * @default 'horizontal'
     */
    "direction"?: 'horizontal' | 'vertical';

    /**
     * 禁用拖拽与键盘调整（分隔条仍渲染，仅作视觉分隔）
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 主面板尺寸上限（px）
     */
    "max"?: number;

    /**
     * 主面板尺寸下限（px）
     * @default 0
     */
    "min"?: number;

    /**
     * 尺寸变化回调（拖拽过程中逐帧触发）
     */
    "onSizeChange"?: (size: number) => void;

    /**
     * localStorage 键：提供后记住用户调整的尺寸， 下次挂载时优先于 defaultSize 恢复（读写失败一律静默）
     */
    "persistKey"?: string;

    /**
     * 尺寸受控的主面板；另一侧 flex 填充剩余空间
     * @default 'first'
     */
    "primary"?: 'first' | 'second';

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 受控尺寸（px）：非 `undefined` 即受控，配合 onSizeChange 使用
     */
    "size"?: number;

    /**
     * 键盘方向键的调整步进（px）
     * @default 16
     */
    "step"?: number;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties;
}
