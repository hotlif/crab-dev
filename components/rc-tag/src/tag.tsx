import Button, { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import type { CSSProperties, FC } from 'react';
import token from './token.js';
import { getOpaqueHexForeground } from './custom-color.js';
import type { PresetTagColor, TagProps } from './types.js';

const baseStyle = css`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) {
        /* Keep system ink and its surface together, including the label and
           icon descendants. Automatic text backplates can otherwise hide a
           primary label. Override custom inline colors only in this mode. */
        forced-color-adjust: none;
        color: CanvasText !important;
        background-color: Canvas !important;
        border-color: CanvasText !important;
    }
    border: 1px solid transparent;
    font-family: inherit;
`;

// The native Button retains its separate coarse-pointer hit target. Only its
// painted close role is compact; focus stays inside that role, not the hit area.
const closeButtonStyle = css`
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-active']};
    ${buttonVars['root.outline-color-focus']}: ${token.close['outline-color-focus']};
    ${buttonVars['root.outline-width-focus']}: ${token.close['outline-width-focus']};
    ${buttonVars['root.outline-offset-focus']}: ${token.close['outline-offset-focus']};
    ${buttonVars['shape.default.border-radius']}: ${token.close['border-radius']};
    ${buttonVars['shape.default.border-radius-active']}: ${token.close['border-radius']};
    ${buttonVars['root.touch.min-width']}: ${token.interaction.touch['min-width']};
    ${buttonVars['root.touch.min-height']}: ${token.interaction.touch['min-height']};
    && {
        flex-shrink: 0;
        width: min(${token.close.control.width}, var(--tag-close-available-size));
        height: min(${token.close.control.width}, var(--tag-close-available-size));
        min-width: 0;
        min-height: 0;
        padding: 0;
        color: ${token.close.color};
    }
    &:hover { color: ${token.close['color-hover']}; }
`;

const noBorderStyle = css`
    border-color: transparent;
`;

const primaryColorStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary['background-color']};
`;

const primaryBorderStyle = css`
    border-color: ${token.primary['border-color']};
`;

const successColorStyle = css`
    color: ${token.success.color};
    background-color: ${token.success['background-color']};
`;

const successBorderStyle = css`
    border-color: ${token.success['border-color']};
`;

const warningColorStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning['background-color']};
`;

const warningBorderStyle = css`
    border-color: ${token.warning['border-color']};
`;

const errorColorStyle = css`
    color: ${token.root['color-error']};
    background-color: ${token.root['background-color-error']};
`;

const errorBorderStyle = css`
    border-color: ${token.root['border-color-error']};
`;

const defaultColorStyle = css`
    color: ${token.default.color};
    background-color: ${token.default['background-color']};
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
