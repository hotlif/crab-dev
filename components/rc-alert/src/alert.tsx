import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { usePresence } from '@crab-dev/rc-hooks';
import { type FC, type MouseEvent as ReactMouseEvent, useState } from 'react';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons.js';
import token from './token.js';
import type { AlertProps, AlertType } from './types.js';
import { baseStyle, successStyle, warningStyle, errorStyle, infoStyle, successIconStyle, warningIconStyle, errorIconStyle, infoIconStyle, iconStyle, iconWithTitleStyle, contentStyle, titleStyle, closeButtonStyle, closeButtonWithTitleStyle, closeIconStyle } from "./alert.styles.js";
const typeStyleMap: Record<AlertType, string> = {
    success: successStyle,
    warning: warningStyle,
    error: errorStyle,
    info: infoStyle,
};

const typeIconStyleMap: Record<AlertType, string> = {
    success: successIconStyle,
    warning: warningIconStyle,
    error: errorIconStyle,
    info: infoIconStyle,
};

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
    const { messages } = useLocale();
    const [closed, setClosed] = useState(false);
    const presence = usePresence<HTMLDivElement>(!closed);

    if (!presence.present) return null;

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
            <Button
                type="button"
                appearance="text"
                size="xs"
                aria-label={messages.common.close}
                className={cx.call(undefined, closeButtonStyle, title ? closeButtonWithTitleStyle : undefined)}
                onClick={handleClose}
            >
                <span className={closeIconStyle}>{iconNode}</span>
            </Button>
        );
    };

    return (
        <div
            role="alert"
            className={cx.call(undefined, baseStyle, typeStyleMap[type], className)}
            {...restProps}
            ref={presence.ref}
            data-state={presence.state}
            inert={closed}
            aria-hidden={closed || undefined}
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
                        margin-inline-start: ${token.icon["margin-right"]};
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
