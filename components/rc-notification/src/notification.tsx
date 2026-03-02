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

    /**
     * 是否显示进度条
     */
    showProgress?: boolean

    /**
     * 消息通知的持续时间，单位为毫秒
     */
    duration?: number
}

const Notification: FC<NotificationProps> = ({
    title,
    children,
    open,
    onOpenChange,
    className,
    style,
    duration = 3000,
    showProgress = true,
    ...restProps
}) => {
    return (
        <motion.div
            className={cx(css`
                position: relative;
                padding: 20px 24px;
                border-radius: 8px;
                isolation: isolate;
                background-color: white;
                grid-area: 1 / 1;
                overflow: hidden;
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
            {showProgress && (
                <motion.div
                    className={css`
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        transform-origin: left;
                        background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
                        border-radius: 0 0 8px 8px;
                    `}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                />
            )}
        </motion.div>
    )
}

export default Notification;