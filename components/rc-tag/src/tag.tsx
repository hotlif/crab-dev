import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import type { CSSProperties, FC } from 'react';
import token from './token.js';
import { getOpaqueHexForeground } from './custom-color.js';
import type { PresetTagColor, TagProps } from './types.js';
import { baseStyle, closeButtonStyle, noBorderStyle, primaryColorStyle, primaryBorderStyle, successColorStyle, successBorderStyle, warningColorStyle, warningBorderStyle, errorColorStyle, errorBorderStyle, defaultColorStyle, defaultBorderStyle } from "./tag.styles.js";
const colorStyleMap = {
    primary: { base: primaryColorStyle, border: primaryBorderStyle },
    success: { base: successColorStyle, border: successBorderStyle },
    warning: { base: warningColorStyle, border: warningBorderStyle },
    error: { base: errorColorStyle, border: errorBorderStyle },
    default: { base: defaultColorStyle, border: defaultBorderStyle },
};

const isPresetTagColor = (value: string): value is PresetTagColor => {
    return value in colorStyleMap;
};

const Tag: FC<TagProps> = ({
    color = 'default',
    size: sizeProp,
    bordered = true,
    closable = false,
    closeIcon,
    closeAriaLabel,
    icon,
    className,
    children,
    onClose,
    style,
    ...restProps
}) => {
    const size = useComponentSize(sizeProp);
    const { messages } = useLocale();
    const getColorStyle = () => {
        const styles = isPresetTagColor(color) ? colorStyleMap[color] : colorStyleMap.default;
        return cx(styles.base, bordered ? styles.border : noBorderStyle);
    };

    const getCustomColorStyle = (): CSSProperties | undefined => {
        if (isPresetTagColor(color)) {
            return undefined;
        }

        return {
            color: getOpaqueHexForeground(color) ?? token.primary.color,
            backgroundColor: color,
            borderColor: bordered ? color : 'transparent',
        };
    };

    const getSizeStyle = () => {
        if (size === 'large') {
            return css`
                --tag-close-available-size: calc(${token.size.large.height} - 2px);
                font-size: ${token.size.large['font-size']};
                padding: ${token.size.large.padding};
                height: ${token.size.large.height};
                border-radius: ${token.size.large['border-radius']};
                gap: ${token.size.large.gap};
            `;
        } else if (size === 'small') {
            return css`
                --tag-close-available-size: calc(${token.size.small.height} - 2px);
                font-size: ${token.size.small['font-size']};
                padding: ${token.size.small.padding};
                height: ${token.size.small.height};
                border-radius: ${token.size.small['border-radius']};
                gap: ${token.size.small.gap};
            `;
        } else {
            return css`
                --tag-close-available-size: calc(${token.size.medium.height} - 2px);
                font-size: ${token.size.medium['font-size']};
                padding: ${token.size.medium.padding};
                height: ${token.size.medium.height};
                border-radius: ${token.size.medium['border-radius']};
                gap: ${token.size.medium.gap};
            `;
        }
    };

    const renderIcon = () => {
        if (!icon) return null;
        return (
            <span
                className={css`
                    display: inline-flex;
                    align-items: center;
                    > svg { width: 1em; height: 1em; }
                `}
            >
                {icon}
            </span>
        );
    };

    const renderCloseIcon = () => {
        if (!closable || closeIcon === false) return null;

        const iconNode = closeIcon ?? (
            <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                width={token.close.width}
                height={token.close.width}
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L512 442.2 295.9 191.7c-3-3.6-7.5-5.7-12.3-5.7H203.8c-6.8 0-10.5 7.9-6.1 13.1L460.2 512 197.7 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7L512 581.8l216.1 250.5c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
            </svg>
        );

        return (
            <Button
                type="button"
                appearance="text"
                size="xs"
                aria-label={closeAriaLabel ?? messages.common.close}
                className={closeButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.(e);
                }}
            >
                {iconNode}
            </Button>
        );
    };

    const customColorStyle = getCustomColorStyle();

    return (
        <span
            {...restProps}
            style={customColorStyle ? { ...customColorStyle, ...style } : style}
            className={cx(
                baseStyle,
                getColorStyle(),
                getSizeStyle(),
                className,
            )}
        >
            {renderIcon()}
            <span>{children}</span>
            {renderCloseIcon()}
        </span>
    );
};

export default Tag;
