import { css, cx } from "@linaria/core";
import { 
    ReactNode,
    type FC,
} from "react";

import { motion } from "motion/react"
import type { HTMLMotionProps } from "motion/react";

import Close from "./icons/close.js";
import { type Direction } from "./types.js";
import token from "./token.js";

const colorBackground = token.background.color;
const colorText = token.text.color;
const colorProgressStart = token.progress.start.color;
const colorProgressEnd = token.progress.end.color;

const dimensionPadding = token.padding;
const dimensionBorderRadius = token.border.radius;
const dimensionTitleMarginBottom = token.title.margin.bottom;
const dimensionProgressHeight = token.progress.height;

const typographyTitleFontSize = token.title.font.size;
const typographyTitleLineHeight = token.title.line.height;
const typographyContentFontSize = token.content.font.size;

const opacityClose = token.close.opacity;

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

    /**
     * 剩余时间，单位为毫秒
     */
    remaining?: number

    /**
     * 是否暂停进度动画
     */
    paused?: boolean
}

const Notification: FC<NotificationProps> = ({
    title,
    children,
    open,
    onOpenChange,
    className,
    style,
    duration = 3000,
    remaining,
    paused = false,
    showProgress = true,
    ...restProps
}) => {
    const safeDuration = duration > 0 ? duration : 1;
    const safeRemaining = Math.max(0, remaining ?? safeDuration);
    const progressScale = Math.min(1, safeRemaining / safeDuration);

    return (
        <motion.div
            className={cx(css`
                position: relative;
                padding: ${dimensionPadding};
                border-radius: ${dimensionBorderRadius};
                isolation: isolate;
                background-color: ${colorBackground};
                grid-area: 1 / 1;
                overflow: hidden;
            `)}
            {...restProps}
        >
            {title ? (
                <div
                    className={css`
                        display: flex;
                        color: ${colorText};
                        font-size: ${typographyTitleFontSize};
                        line-height: ${typographyTitleLineHeight};
                        margin-bottom: ${dimensionTitleMarginBottom};
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
                            opacity: ${opacityClose};
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
                    color: ${colorText};
                    font-size: ${typographyContentFontSize};
                `}
            >
                {children}
            </div>
            {showProgress && (
                <motion.div
                    key={`${paused ? "paused" : "running"}-${safeRemaining}`}
                    className={css`
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: ${dimensionProgressHeight};
                        transform-origin: left;
                        background: linear-gradient(90deg, ${colorProgressStart} 0%, ${colorProgressEnd} 100%);
                        border-top-right-radius: 0;
                        border-bottom-left-radius: inherit;
                    `}
                    initial={{ scaleX: progressScale }}
                    animate={{ scaleX: paused ? progressScale : 0 }}
                    transition={{ duration: paused ? 0 : safeRemaining / 1000, ease: "linear" }}
                />
            )}
        </motion.div>
    )
}

export default Notification;