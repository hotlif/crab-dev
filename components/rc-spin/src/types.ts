import type { HTMLAttributes, ReactNode, Ref } from 'react';

/**
 * 尺寸档位, 与 rc-button / rc-segmented 对齐。
 */
export type SpinSize = 'large' | 'middle' | 'small';

export interface SpinProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /**
     * 是否处于加载中, 默认 true
     */
    spinning?: boolean;

    /**
     * 尺寸, 默认 middle
     */
    size?: SpinSize;

    /**
     * 指示器下方的提示文案。给出后即作为无障碍名, 读屏播报该文案而非默认的 label
     */
    tip?: ReactNode;

    /**
     * 延迟显示的毫秒数, 默认 0（立即显示）。
     *
     * 设为 300–500 可避免"请求秒回却闪一下 spinner"的噪声反馈：在该时长内完成的操作
     * 全程无指示器；超出则说明操作确实耗时, 此时才给出进行中反馈。
     */
    delay?: number;

    /**
     * 自定义指示器, 替换默认的旋转环
     */
    indicator?: ReactNode;

    /**
     * 无障碍名, 默认 "加载中"。仅在未提供 tip 时生效
     */
    label?: string;

    /**
     * 被加载状态笼罩的内容。传入后进入包裹模式：内容变淡并被 inert 阻断交互,
     * 指示器浮于其上；不传则作为独立指示器渲染
     */
    children?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}
