/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SpinSize = DocsTypePlaceholder;

export interface SpinPropsSearchIndex {
    /**
     * 被加载状态笼罩的内容。传入后进入包裹模式：内容变淡并被 inert 阻断交互, 指示器浮于其上；不传则作为独立指示器渲染
     */
    "children"?: ReactNode;

    /**
     * 延迟显示的毫秒数, 默认 0（立即显示）。 设为 300–500 可避免"请求秒回却闪一下 spinner"的噪声反馈：在该时长内完成的操作 全程无指示器；超出则说明操作确实耗时, 此时才给出进行中反馈。
     * @default 0
     */
    "delay"?: number;

    /**
     * 自定义指示器, 替换默认的旋转环
     */
    "indicator"?: ReactNode;

    /**
     * 无障碍名, 默认 "加载中"。仅在未提供 tip 时生效
     * @default '加载中'
     */
    "label"?: string;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 尺寸, 默认 middle
     * @default 'middle'
     */
    "size"?: SpinSize;

    /**
     * 是否处于加载中, 默认 true
     * @default true
     */
    "spinning"?: boolean;

    /**
     * 指示器下方的提示文案。给出后即作为无障碍名, 读屏播报该文案而非默认的 label
     */
    "tip"?: ReactNode;
}
