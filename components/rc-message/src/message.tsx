import { css, cx } from '@crab-dev/css';
import { type FC } from 'react';
import { usePresence } from '@crab-dev/rc-hooks';

import { ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from './icons.js';
import token, { vars } from './token.js';
import type { MessageType, MessageProps } from './types.js';

/** @deprecated 使用公开的 MessageProps。 */
export type MessageInternalProps = MessageProps;

// ─── 基础样式 ────────────────────────────────────────────────────────────────

const baseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: ${token.root.padding};
    border-radius: ${token.root["border-radius"]};
    background-color: ${token.root["background-color"]};
    box-shadow: ${token.root["box-shadow"]};
    font-size: ${token.root["font-size"]};
    line-height: ${token.root["line-height"]};
    color: ${token.text.color};
    pointer-events: all;
    grid-area: 1 / 1;
    overflow: hidden;
    max-width: calc(100vw - ${token.stack.translate} * 2);
    box-sizing: border-box;
    opacity: 1;
    translate: 0 0;
    &[data-stack="1"] { translate: 0 ${token.stack.translate}; }
    &[data-stack="2"] { translate: 0 calc(${token.stack.translate} * 2); }
    &[data-stack="3"] { translate: 0 calc(${token.stack.translate} * 3); }
    transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition};
    @starting-style {
        &[data-state="open"] { opacity: 0; translate: 0 -100%; }
    }
    &[data-state="closed"] { opacity: 0; translate: 0 -100%; pointer-events: none; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
`;

const progressStyle = css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${token.progress.height};
    transform-origin: left;
    background: linear-gradient(90deg, ${token.progress.start.color} 0%, ${token.progress.end.color} 100%);
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
    animation: message-countdown ${token.progress['animation-duration']} linear ${token.progress['animation-delay']} forwards;
    &[data-paused="true"] { animation-play-state: paused; }
    @keyframes message-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    @media (prefers-reduced-motion: reduce) { animation: none; }
    @media (forced-colors: active) { background: Highlight; }
`;

// ─── 图标样式 ────────────────────────────────────────────────────────────────

const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: ${token.icon["margin-right"]};
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
    }
`;

const successIconStyle = css`
    color: ${token.success.icon.color};
`;

const warningIconStyle = css`
    color: ${token.warning.icon.color};
`;

const errorIconStyle = css`
    color: ${token.icon['color-error']};
`;

const infoIconStyle = css`
    color: ${token.info.icon.color};
`;

const loadingIconStyle = css`
    color: ${token.info.icon.color};
`;

// ─── 图标颜色映射 ───────────────────────────────────────────────────────────

const iconStyleMap: Record<MessageType, string> = {
    success: successIconStyle,
    warning: warningIconStyle,
    error: errorIconStyle,
    info: infoIconStyle,
    loading: loadingIconStyle,
};

// ─── 默认图标 ───────────────────────────────────────────────────────────────

const getDefaultIcon = (type: MessageType) => {
    if (type === 'success') return <SuccessIcon />;
    if (type === 'warning') return <WarningIcon />;
    if (type === 'error') return <ErrorIcon />;
    if (type === 'loading') return <LoadingIcon />;
    return <InfoIcon />;
};

// ─── Message 组件 ────────────────────────────────────────────────────────────

const Message: FC<MessageInternalProps> = ({
    type = 'info',
    content,
    icon,
    className,
    duration = 3000,
    remaining,
    progressKey,
    paused = false,
    showProgress = true,
    open = true,
    onExitComplete,
    stack,
    ...restProps
}) => {
    const iconNode = icon ?? getDefaultIcon(type);
    const safeDuration = duration > 0 ? duration : 1;
    const safeRemaining = Math.max(0, remaining ?? safeDuration);
    const presence = usePresence<HTMLDivElement>(open, onExitComplete);
    if (!presence.present) return null;

    return (
        <div
            ref={presence.ref}
            data-state={presence.state}
            data-stack={stack}
            inert={!open}
            role="alert"
            className={cx(baseStyle, className)}
            {...restProps}
        >
            <span className={cx(iconBaseStyle, iconStyleMap[type])}>
                {iconNode}
            </span>
            <span>{content}</span>
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
    );
};

export default Message;
