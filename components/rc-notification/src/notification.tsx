import { css, cx } from "@linaria/core";
import { 
    ReactNode,
    type FC,
} from "react";

import { motion } from "motion/react"
import type { HTMLMotionProps } from "motion/react";

import Close from "./icons/close";
import { type Direction } from "./types";

export interface NotificationProps extends Omit<HTMLMotionProps<"div">, "title" | "children"> {

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

    /**
     * 消息通知的内容
     */
    children?: ReactNode;
}

const Notification: FC<NotificationProps> = ({
    title,
    children,
    open,
    onOpenChange,
    className,
    style,
    ...restProps
}) => {
    return (
        <motion.div
            className={cx(css`
                padding: 20px 24px;
                border-radius: 8px;
                isolation: isolate;
                background-color: white;
                grid-area: 1 / 1;
            `)}
            {...restProps}
        >
            {title ? (
                <div
                    className={css`
                        display: flex;
                        color: rgba(0,0,0,0.88);
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 10px;
                    `}
                >
                    <div
                        className={css`
                            flex: 1;
                        `}
                    >
                        {title}
                    </div>
                    <div
                        className={css`
                            display: flex;
                            align-items: center;
                            opacity: 0.7;
                            user-select: none;
                            cursor: pointer;
                        `}
                        onClick={() => {
                            onOpenChange?.(false)
                        }}
                    >
                        <Close />
                    </div>
                </div>
            ): null}
            <div
                className={css`
                    color: rgba(0,0,0,0.88);
                    font-size: 14px;
                `}
            >
                {children}
            </div>
        </motion.div>
    )
}

export default Notification;