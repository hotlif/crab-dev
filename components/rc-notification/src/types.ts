import type { HTMLAttributes, ReactNode } from "react";

export type Direction = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {

    /**
     * 消息的标题信息
     */
    title?: ReactNode

    /**
     * 消息通知显示的位置
     */
    direction?: Direction

    /**
     * 是否开启
     */
    open: boolean;

    /**
     * 状态发生改变的时候触发的事件
     */
    onOpenChange: (open: boolean) => void;
}