import { useLocale } from '@crab-dev/rc-config-provider';
import { cx } from "@crab-dev/css";
import type { FC, HTMLAttributes, MouseEvent, ReactNode } from "react";

import { useControllableOpen, type ControlledOpenProps, usePresence } from "@crab-dev/rc-hooks";
import Button from "@crab-dev/rc-button";

import { notificationStyle, headerStyle, titleStyle, closeStyle, contentStyle, progressStyle } from './notification.styles.js';
import Close from "./icons/close.js";
import { type Direction } from "./types.js";
import { vars } from "./token.js";

export interface NotificationOpenChangeDetails {
    reason: 'close-button';
    event: MouseEvent<HTMLButtonElement>;
}

interface NotificationBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    onExitComplete?: () => void;
    /** 叠层序号：1 为最前层，2、3 为后方卡片。 */
    stack?: number;

    /**
     * 消息的标题信息
     */
    title?: ReactNode

    /**
     * 消息通知显示的位置
     */
    direction?: Direction

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
    /** 改变此值时重新启动倒计时进度动画。 */
    progressKey?: string | number

    /**
     * 是否暂停进度动画
     */
    paused?: boolean
}

export type NotificationProps = NotificationBaseProps & ControlledOpenProps<NotificationOpenChangeDetails>;

const Notification: FC<NotificationProps> = ({
    title,
    children,
    open: controlledOpen,
    defaultOpen,
    direction = "topRight",
    stack = 1,
    onExitComplete,
    onOpenChange,
    className,
    duration = 3000,
    remaining,
    progressKey,
    paused = false,
    showProgress = true,
    ...restProps
}) => {
    const { messages } = useLocale();
    const [open, setOpen] = useControllableOpen<NotificationOpenChangeDetails>({ open: controlledOpen, defaultOpen, onOpenChange });
    const safeDuration = duration > 0 ? duration : 1;
    const safeRemaining = Math.max(0, remaining ?? safeDuration);
    const presence = usePresence<HTMLDivElement>(open, onExitComplete);
    if (!presence.present) return null;

    return (
        <div
            ref={presence.ref}
            role="status"
            data-state={presence.state}
            data-direction={direction}
            data-stack={stack}
            inert={!open || stack > 1}
            aria-hidden={!open || stack > 1 ? true : undefined}
            className={cx(notificationStyle, className)}
            {...restProps}
        >
            {title ? (
                <div
                    className={headerStyle}
                >
                    <div
                        className={titleStyle}
                    >
                        {title}
                    </div>
                    <Button
                        appearance="text"
                        size="s"
                        aria-label={messages.notification.close}
                        className={closeStyle}
                        onClick={(event) => {
                            setOpen(false, { reason: 'close-button', event });
                        }}
                    >
                        <Close />
                    </Button>
                </div>
            ): null}
            <div
                className={contentStyle}
            >
                {children}
            </div>
            {showProgress && duration > 0 && (
                <div
                    key={`${progressKey ?? ''}-${duration}-${safeRemaining}`}
                    aria-hidden="true"
                    data-paused={paused}
                    ref={(node) => {
                        // User-supplied time is runtime data; CSS performs every frame.
                        node?.style.setProperty(vars['progress.animation-duration'], `${safeDuration}ms`);
                        node?.style.setProperty(vars['progress.animation-delay'], `${Math.min(0, safeRemaining - safeDuration)}ms`);
                    }}
                    className={progressStyle}
                />
            )}
        </div>
    )
}

export default Notification;
