import { css, cx } from '@crab-dev/css';
import { type FC, type KeyboardEvent, type MouseEvent as ReactMouseEvent, useState } from 'react';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons.js';
import token from './token.js';
import type { AlertProps, AlertType } from './types.js';

// ─── 基础样式 ────────────────────────────────────────────────────────────────

const baseStyle = css`
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    padding: ${token.root.padding};
    border-radius: ${token.root["border-radius"]};
    border: 1px solid transparent;
    font-size: ${token.root["font-size"]};
    line-height: ${token.root["line-height"]};
    transition: ${token.root.transition};
    word-break: break-word;
`;

// ─── 类型颜色样式 ────────────────────────────────────────────────────────────

const successStyle = css`
    color: ${token.success.color};
    background-color: ${token.success["background-color"]};
    border-color: ${token.success['border-color']};
`;

const warningStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning["background-color"]};
    border-color: ${token.warning['border-color']};
`;

const errorStyle = css`
    color: ${token.root['color-error']};
    background-color: ${token.root['background-color-error']};
    border-color: ${token.root['border-color-error']};
`;

const infoStyle = css`
    color: ${token.info.color};
    background-color: ${token.info["background-color"]};
    border-color: ${token.info['border-color']};
`;

const typeStyleMap: Record<AlertType, string> = {
    success: successStyle,
    warning: warningStyle,
    error: errorStyle,
    info: infoStyle,
};

const successIconStyle = css`color: ${token.success.icon.color};`;
const warningIconStyle = css`color: ${token.warning.icon.color};`;
const errorIconStyle = css`color: ${token.icon['color-error']};`;
const infoIconStyle = css`color: ${token.info.icon.color};`;

const typeIconStyleMap: Record<AlertType, string> = {
    success: successIconStyle,
    warning: warningIconStyle,
    error: errorIconStyle,
    info: infoIconStyle,
};

// ─── 图标样式 ────────────────────────────────────────────────────────────────

const iconStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: ${token.icon["margin-right"]};
    height: calc(${token.root["font-size"]} * ${token.root["line-height"]});
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
    }
`;

const iconWithTitleStyle = css`
    height: calc(${token.title["font-size"]} * ${token.root["line-height"]});
    > svg {
        width: ${token.icon['with-title'].width};
        height: ${token.icon['with-title'].width};
    }
`;

// ─── 内容样式 ────────────────────────────────────────────────────────────────

const contentStyle = css`
    flex: 1;
    min-width: 0;
`;

const titleStyle = css`
    font-size: ${token.title["font-size"]};
    font-weight: ${token.title["font-weight"]};
    margin-bottom: ${token.title["margin-bottom"]};
`;

// ─── 关闭按钮样式 ────────────────────────────────────────────────────────────

const closeButtonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: ${token.icon["margin-right"]};
    height: calc(${token.root["font-size"]} * ${token.root["line-height"]});
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${token.close.color};
    &:hover {
        color: ${token.close['color-hover']};
    }
`;

const closeButtonWithTitleStyle = css`
    height: calc(${token.title["font-size"]} * ${token.root["line-height"]});
`;

// ─── Alert 组件 ──────────────────────────────────────────────────────────────

const getDefaultIcon = (type: AlertProps["type"]) => {
    if (type === 'success') return <SuccessIcon />;
    if (type === 'warning') return <WarningIcon />;
    if (type === 'error') return <ErrorIcon />;
    return <InfoIcon />;
};

const Alert: FC<AlertProps> = ({
    type = 'info',
    title,
    showIcon = true,
    icon,
    closable = false,
    closeIcon,
    onClose,
    action,
    className,
    children,
    ...restProps
}) => {
    const [closed, setClosed] = useState(false);

    if (closed) return null;

    const handleClose = (e: ReactMouseEvent<HTMLButtonElement>) => {
        setClosed(true);
        onClose?.(e);
    };



    const renderIcon = () => {
        if (!showIcon) return null;
        const iconNode = icon ?? getDefaultIcon(type);
        return (
            <span className={cx.call(undefined, iconStyle, typeIconStyleMap[type], title ? iconWithTitleStyle : undefined)}>
                {iconNode}
            </span>
        );
    };

    const renderCloseButton = () => {
        if (!closable || closeIcon === false) return null;

        const iconNode = closeIcon ?? <CloseIcon size={token.close.width} />;

        return (
            <button
                type="button"
                aria-label="close"
                className={cx.call(undefined, closeButtonStyle, title ? closeButtonWithTitleStyle : undefined)}
                onClick={handleClose}
                onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClose(e as unknown as ReactMouseEvent<HTMLButtonElement>);
                    }
                }}
            >
                {iconNode}
            </button>
        );
    };

    return (
        <div
            role="alert"
            className={cx.call(undefined, baseStyle, typeStyleMap[type], className)}
            {...restProps}
        >
            {renderIcon()}
            <div className={contentStyle}>
                {title && <div className={titleStyle}>{title}</div>}
                {children && <div>{children}</div>}
            </div>
            {action && (
                <div
                    className={css`
                        display: inline-flex;
                        align-items: center;
                        flex-shrink: 0;
                        margin-left: ${token.icon["margin-right"]};
                        height: calc(${token.root["font-size"]} * ${token.root["line-height"]});
                    `}
                >
                    {action}
                </div>
            )}
            {renderCloseButton()}
        </div>
    );
};

export default Alert;
