import type { ControlledOpenProps } from '@crab-dev/rc-hooks';
import type { Placement } from '@floating-ui/react';
import type { ReactElement, ReactNode } from 'react';

export interface TooltipOpenChangeDetails {
    reason: 'hover' | 'focus' | 'escape' | 'outside-press' | 'trigger';
    event?: Event;
}

interface TooltipBaseProps {
    /**
     * 提示文字内容
     */
    title: ReactNode;

    /**
     * 触发元素，必须是单个可接受 ref 的 React 元素
     */
    children: ReactElement;

    /**
     * 气泡相对于触发元素的位置
     * @default 'top'
     */
    placement?: Placement;

    /**
     * 鼠标移入后延迟显示的毫秒数
     * @default 100
     */
    mouseEnterDelay?: number;

    /**
     * 鼠标离开触发元素和提示区域后延迟隐藏的毫秒数
     * @default 1500
     */
    mouseLeaveDelay?: number;

    /**
     * 是否显示箭头；M3 plain tooltip 默认不显示，保留为扩展选项
     * @default false
     */
    arrow?: boolean;

    /**
     * 浮层的自定义类名
     */
    className?: string;
}

export type TooltipProps = TooltipBaseProps & ControlledOpenProps<TooltipOpenChangeDetails>;
