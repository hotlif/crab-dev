import { css, cx } from '@linaria/core';
import type { CSSProperties, FC, KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import token from './token.js';
import type { PresetTagColor, TagProps } from './types.js';

const baseStyle = css`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    transition: ${token.transition};
    border: 1px solid transparent;
    font-family: inherit;
`;

const noBorderStyle = css`
    border-color: transparent;
`;

const primaryColorStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary.background.color};
`;

const primaryBorderStyle = css`
    border-color: ${token.primary['border-color']};
`;

const successColorStyle = css`
    color: ${token.success.color};
    background-color: ${token.success.background.color};
`;

const successBorderStyle = css`
    border-color: ${token.success['border-color']};
`;

const warningColorStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning.background.color};
`;

const warningBorderStyle = css`
    border-color: ${token.warning['border-color']};
`;

const errorColorStyle = css`
    color: ${token.error.color};
    background-color: ${token.error.background.color};
`;

const errorBorderStyle = css`
    border-color: ${token.error['border-color']};
`;

const defaultColorStyle = css`
    color: ${token.default.color};
    background-color: ${token.default.background.color};
`;

const defaultBorderStyle = css`
    border-color: ${token.default['border-color']};
`;

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
    size = 'middle',
    bordered = true,
    closable = false,
    closeIcon,
    closeAriaLabel = 'close',
    icon,
    className,
    children,
    onClose,
    style,
    ...restProps
}) => {
    const getColorStyle = () => {
        const styles = isPresetTagColor(color) ? colorStyleMap[color] : colorStyleMap.default;
        return cx(styles.base, bordered ? styles.border : noBorderStyle);
    };

    const getCustomColorStyle = (): CSSProperties | undefined => {
        if (isPresetTagColor(color)) {
            return undefined;
        }

        return {
            color: token.primary.color,
            backgroundColor: color,
            borderColor: bordered ? color : 'transparent',
        };
    };

    const getSizeStyle = () => {
        if (size === 'large') {
            return css`
                font-size: ${token.size.large.font.size};
                padding: ${token.size.large.padding};
                height: ${token.size.large.height};
                border-radius: ${token.size.large.border.radius};
                gap: ${token.size.large.gap};
            `;
        } else if (size === 'small') {
            return css`
                font-size: ${token.size.small.font.size};
                padding: ${token.size.small.padding};
                height: ${token.size.small.height};
                border-radius: ${token.size.small.border.radius};
                gap: ${token.size.small.gap};
            `;
        } else {
            return css`
                font-size: ${token.size.middle.font.size};
                padding: ${token.size.middle.padding};
                height: ${token.size.middle.height};
                border-radius: ${token.size.middle.border.radius};
                gap: ${token.size.middle.gap};
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
                width={token.close.size}
                height={token.close.size}
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L512 442.2 295.9 191.7c-3-3.6-7.5-5.7-12.3-5.7H203.8c-6.8 0-10.5 7.9-6.1 13.1L460.2 512 197.7 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7L512 581.8l216.1 250.5c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
            </svg>
        );

        return (
            <span
                role="button"
                tabIndex={0}
                aria-label={closeAriaLabel}
                className={css`
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                    color: ${token.close.color};
                    &:hover {
                        color: ${token.close['color-hover']};
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose?.(e);
                }}
                onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose?.(e as unknown as ReactMouseEvent<HTMLSpanElement>);
                    }
                }}
            >
                {iconNode}
            </span>
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
