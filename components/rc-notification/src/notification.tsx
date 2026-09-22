import { css, cx } from "@crab-dev/css";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { usePresence } from "@crab-dev/rc-hooks";
import Button from "@crab-dev/rc-button";

import Close from "./icons/close.js";
import { type Direction } from "./types.js";
import token from "./token.js";

const colorBackground = token.root["background-color"];
const colorText = token.text.color;
const colorProgressStart = token.progress.start.color;
const colorProgressEnd = token.progress.end.color;

const dimensionPadding = token.root.padding;
const dimensionBorderRadius = token.root["border-radius"];
const dimensionTitleMarginBottom = token.title["margin-bottom"];
const dimensionProgressHeight = token.progress.height;

const typographyTitleFontSize = token.title["font-size"];
const typographyTitleLineHeight = token.title["line-height"];
const typographyContentFontSize = token.content["font-size"];

const opacityClose = token.close.opacity;

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
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
    direction = "topRight",
    stack = 1,
    onExitComplete,
    onOpenChange,
    className,
    duration = 3000,
    remaining,
    paused = false,
    showProgress = true,
    ...restProps
}) => {
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
            className={cx(css`
                position: relative;
                display: flex;
                flex-direction: column;
                width: ${token.root.width};
                min-width: 0;
                padding: ${dimensionPadding};
                border-radius: ${dimensionBorderRadius};
                isolation: isolate;
                background-color: ${colorBackground};
                box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.root["box-shadow"]};
                z-index: ${token.stack.front["z-index"]};
                grid-area: 1 / 1;
                overflow: hidden;
                pointer-events: auto;
                box-sizing: border-box;
                max-width: calc(100vw - ${token.stack.translate} * 2);
                max-height: calc(100dvh - ${token.stack.translate} * 2 - ${token.stack.gap} * 2);
                opacity: 1;
                scale: 1;
                transform-origin: center bottom;
                translate: 0 ${token.stack.translate};
                &[data-stack="2"] {
                    translate: 0 calc(${token.stack.translate} + ${token.stack.gap});
                    scale: ${token.stack.second.scale};
                    z-index: ${token.stack.second["z-index"]};
                    background-color: ${token.stack.second["background-color"]};
                    box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.stack["box-shadow"]};
                }
                &[data-stack="3"] {
                    translate: 0 calc(${token.stack.translate} + ${token.stack.gap} * 2);
                    scale: ${token.stack.third.scale};
                    z-index: ${token.stack.third["z-index"]};
                    background-color: ${token.stack.third["background-color"]};
                    box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.stack["box-shadow"]};
                }
                &[data-stack="2"], &[data-stack="3"] {
                    pointer-events: none;
                    & > * { visibility: hidden; }
                }
                &[data-direction^="bottom"] {
                    transform-origin: center top;
                    translate: 0 calc(${token.stack.translate} * -1);
                    &[data-stack="2"] { translate: 0 calc((${token.stack.translate} + ${token.stack.gap}) * -1); }
                    &[data-stack="3"] { translate: 0 calc((${token.stack.translate} + ${token.stack.gap} * 2) * -1); }
                }
                transition:
                    opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition},
                    scale ${token.motion.spatial.transition}, background-color ${token.motion.interaction.transition},
                    box-shadow ${token.motion.interaction.transition};
                @starting-style {
                    &[data-state="open"] { opacity: 0; translate: 0 -100%; }
                    &[data-direction^="bottom"] { translate: 0 100%; }
                    &[data-direction$="Left"] { translate: -120% 0; }
                    &[data-direction$="Right"] { translate: 120% 0; }
                }
                &[data-state="closed"] { opacity: 0; translate: 0 -100%; pointer-events: none; }
                &[data-direction^="bottom"][data-state="closed"] { translate: 0 100%; }
                &[data-direction$="Left"][data-state="closed"] { translate: -120% 0; }
                &[data-direction$="Right"][data-state="closed"] { translate: 120% 0; }
                @media (prefers-reduced-motion: reduce) { transition: none; }
                @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
            `, className)}
            {...restProps}
        >
            {title ? (
                <div
                    className={css`
                        display: flex;
                        align-items: flex-start;
                        gap: ${token.title["margin-bottom"]};
                        flex-shrink: 0;
                        color: ${colorText};
                        font-size: ${typographyTitleFontSize};
                        line-height: ${typographyTitleLineHeight};
                        margin-bottom: ${dimensionTitleMarginBottom};
                    `}
                >
                    <div
                        className={css`
                            flex: 1;
                            min-width: 0;
                            overflow-wrap: anywhere;
                        `}
                    >
                        {title}
                    </div>
                    <Button
                        appearance="text"
                        size="small"
                        aria-label="关闭通知"
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
                    </Button>
                </div>
            ): null}
            <div
                className={css`
                    color: ${colorText};
                    font-size: ${typographyContentFontSize};
                    line-height: ${token.content["line-height"]};
                    min-height: 0;
                    overflow: auto;
                    overflow-wrap: anywhere;
                `}
            >
                {children}
            </div>
            {showProgress && duration > 0 && (
                <div
                    key={`${duration}-${safeRemaining}`}
                    aria-hidden="true"
                    data-paused={paused}
                    ref={(node) => {
                        // User-supplied time is runtime data; CSS performs every frame.
                        node?.style.setProperty('--notification-countdown-duration', `${safeDuration}ms`);
                        node?.style.setProperty('--notification-countdown-delay', `${Math.min(0, safeRemaining - safeDuration)}ms`);
                    }}
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
                        animation: notification-countdown ${token.progress['animation-duration']} linear ${token.progress['animation-delay']} forwards;
                        &[data-paused="true"] { animation-play-state: paused; }
                        @keyframes notification-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
                        @media (prefers-reduced-motion: reduce) { animation: none; }
                        @media (forced-colors: active) { background: Highlight; }
                    `}
                />
            )}
        </div>
    )
}

export default Notification;
