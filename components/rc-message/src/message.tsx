import { css, cx } from '@crab-dev/css';
import { type FC, type ReactNode } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

import { ErrorIcon, InfoIcon, LoadingIcon, SuccessIcon, WarningIcon } from './icons.js';
import token from './token.js';
import type { MessageType } from './types.js';

export interface MessageInternalProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'content'> {
    /** 消息类型 */
    type?: MessageType;
    /** 消息内容 */
    content: ReactNode;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 是否显示进度条 */
    showProgress?: boolean;
    /** 消息通知的持续时间，单位为毫秒 */
    duration?: number;
    /** 剩余时间，单位为毫秒 */
    remaining?: number;
    /** 是否暂停进度动画 */
    paused?: boolean;
}

// ─── 基础样式 ────────────────────────────────────────────────────────────────

const baseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: ${token.padding};
    border-radius: ${token.border.radius};
    background-color: ${token.background.color};
    font-size: ${token.font.size};
    line-height: ${token.line.height};
    color: ${token.text.color};
    pointer-events: all;
    grid-area: 1 / 1;
    overflow: hidden;
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
`;

// ─── 图标样式 ────────────────────────────────────────────────────────────────

const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: ${token.icon.margin.right};
    > svg {
        width: ${token.icon.size};
        height: ${token.icon.size};
    }
`;

const successIconStyle = css`
    color: ${token.success.color};
`;

const warningIconStyle = css`
    color: ${token.warning.color};
`;

const errorIconStyle = css`
    color: ${token.error.color};
`;

const infoIconStyle = css`
    color: ${token.info.color};
`;

const loadingIconStyle = css`
    color: ${token.info.color};
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
    paused = false,
    showProgress = true,
    ...restProps
}) => {
    const iconNode = icon ?? getDefaultIcon(type);
    const safeDuration = duration > 0 ? duration : 1;
    const safeRemaining = Math.max(0, remaining ?? safeDuration);
    const progressScale = Math.min(1, safeRemaining / safeDuration);

    return (
        <motion.div
            role="alert"
            className={cx(baseStyle, className)}
            {...restProps}
        >
            <span className={cx(iconBaseStyle, iconStyleMap[type])}>
                {iconNode}
            </span>
            <span>{content}</span>
            {showProgress && (
                <motion.div
                    key={`${paused ? 'paused' : 'running'}-${safeRemaining}`}
                    className={progressStyle}
                    initial={{ scaleX: progressScale }}
                    animate={{ scaleX: paused ? progressScale : 0 }}
                    transition={{ duration: paused ? 0 : safeRemaining / 1000, ease: 'linear' }}
                />
            )}
        </motion.div>
    );
};

export default Message;
