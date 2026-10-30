import { cx } from '@crab-dev/css';
import { type FC } from 'react';
import { usePresence } from '@crab-dev/rc-hooks';
import { ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from './icons.js';
import { vars } from './token.js';
import type { MessageType, MessageProps } from './types.js';
import { baseStyle, progressStyle, iconBaseStyle, contentStyle, successIconStyle, warningIconStyle, errorIconStyle, infoIconStyle, loadingIconStyle } from "./message.styles.js";
/** @deprecated 使用公开的 MessageProps。 */
export type MessageInternalProps = MessageProps;

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
            role="status"
            aria-live="polite"
            className={cx(baseStyle, className)}
            {...restProps}
        >
            <span className={cx(iconBaseStyle, iconStyleMap[type])}>
                {iconNode}
            </span>
            <span className={contentStyle}>{content}</span>
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
