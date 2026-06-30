import { css, cx } from '@linaria/core';
import { useRef, use, type FC, type MouseEvent } from 'react';
import token from './token.js';
import type { ButtonProps } from './types.js';
import ButtonGroupContext from './buttonGroupContext.js';

const opacityLoading = token.opacity.loading;

const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${token.transition};
    border: unset;
    user-select: none;
    background-color: unset;
    font-family: inherit;
    line-height: 1;
    vertical-align: middle;
    text-decoration: none;
    &[data-is-loading] {
        opacity: ${opacityLoading};
        cursor: default;
        pointer-events: none;
    }
`;

const iconWrapStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
        width: 1rem;
        height: 1rem;
    }
`;

const spinStyle = css`
    animation: rotate 1s linear infinite;
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
`;

const primaryStyle = css`
    &:not(:disabled) {
        box-shadow: ${token.primary['box-shadow']};
        background-color: ${token.primary.background.color};
        color: ${token.primary.color};
        &:hover { background-color: ${token.primary.background['color-hover']}; }
        &:active {
            background-color: ${token.primary.background['color-active']};
            transform: scale(0.97);
        }
    }
    &:disabled {
        cursor: default;
        pointer-events: none;
        background-color: ${token.primary.background['color-disabled']};
    }
`;

const dangerStyle = css`
    &:not(:disabled) {
        box-shadow: ${token.danger['box-shadow']};
        background-color: ${token.danger.background.color};
        color: ${token.danger.color};
        &:hover { background-color: ${token.danger.background['color-hover']}; }
        &:active {
            background-color: ${token.danger.background['color-active']};
            transform: scale(0.97);
        }
    }
    &:disabled {
        cursor: default;
        pointer-events: none;
        background-color: ${token.danger.background['color-disabled']};
    }
`;

const linkStyle = css`
    &:not(:disabled) {
        background-color: ${token.link.background.color};
        color: ${token.link.color};
        > span {
            position: relative;
            &::after {
                content: '';
                position: absolute;
                bottom: ${token.link.text['underline-offset']};
                left: 0;
                width: 100%;
                height: ${token.link.text.decoration.width};
                background-color: ${token.link.text.decoration.color};
                transform: scaleX(0);
                transform-origin: right;
                transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
            &:hover::after {
                transform: scaleX(1);
                transform-origin: left;
            }
        }
        &:hover { color: ${token.link['color-hover']}; }
        &:active {
            transform: scale(0.97);
            color: ${token.link['color-active']};
        }
    }
    &:disabled {
        cursor: default;
        background-color: ${token.link.background['color-disabled']};
        pointer-events: none;
    }
`;

const dashedStyle = css`
    border-width: ${token.dashed['border-width']};
    border-style: ${token.dashed['border-style']};
    box-shadow: ${token.dashed['box-shadow']};
    &:not(:disabled) {
        color: ${token.dashed.color};
        background-color: ${token.dashed.background.color};
        border-color: ${token.dashed['border-color']};
        &:hover {
            color: ${token.dashed['color-hover']};
            border-color: ${token.dashed['border-color-hover']};
        }
        &:active {
            transform: scale(0.97);
            color: ${token.dashed['color-active']};
            border-color: ${token.dashed['border-color-active']};
        }
    }
    &:disabled {
        cursor: default;
        pointer-events: none;
        background-color: ${token.dashed.background['color-disabled']};
        border-style: unset;
        border-width: unset;
    }
`;

const textStyle = css`
    &:not(:disabled) {
        &:hover { background-color: ${token.text.background['color-hover']}; }
        &:active {
            transform: scale(0.97);
            background-color: ${token.text.background['color-active']};
        }
    }
    &:disabled {
        cursor: default;
        background-color: transparent;
        pointer-events: none;
    }
`;

const subtleStyle = css`
    &:not(:disabled) {
        color: ${token.subtle.color};
        border-style: ${token.subtle['border-style']};
        border-width: ${token.subtle['border-width']};
        background-color: ${token.subtle.background['color']};
        border-color: ${token.subtle['border-color']};
        box-shadow: ${token.subtle['box-shadow']};
        &:hover {
            border-color: ${token.subtle['border-color-hover']};
            color: ${token.subtle['color-hover']};
        }
        &:active {
            transform: scale(0.97);
            color: ${token.subtle['color-active']};
            border-color: ${token.subtle['border-color-active']};
        }
    }
    &:disabled {
        cursor: default;
        pointer-events: none;
        background-color: ${token.subtle.background['color-disabled']};
    }
`;

const sizeLargeStyle = css`
    font-size: ${token.size.large.font.size};
    padding: ${token.size.large.padding};
    height: ${token.size.large.height};
    border-radius: ${token.size.large.border.radius};
    gap: ${token.size.large.gap};
`;

const sizeMiddleStyle = css`
    font-size: ${token.size.middle.font.size};
    height: ${token.size.middle.height};
    padding: ${token.size.middle.padding};
    border-radius: ${token.size.middle.border.radius};
    gap: ${token.size.middle.gap};
`;

const sizeSmallStyle = css`
    font-size: ${token.size.small.font.size};
    height: ${token.size.small.height};
    padding: ${token.size.small.padding};
    border-radius: ${token.size.small.border.radius};
    gap: ${token.size.small.gap};
`;

const fitContainerStyle = css`width: 100%;`;

const selectedStyle = css`
    &:not(:disabled) {
        background-color: ${token.selected.background.color} !important;
        color: ${token.selected.color} !important;
        border-color: ${token.selected['border-color']} !important;
        border-style: solid;
        border-width: 1px;
    }
`;

const circleStyle = css`
    border-radius: ${token.shape.circle['border-radius']};
    padding: ${token.shape.circle.padding};
    aspect-ratio: 1;
`;

const appearanceStyleMap = {
    primary: primaryStyle,
    danger:  dangerStyle,
    link:    linkStyle,
    dashed:  dashedStyle,
    text:    textStyle,
    subtle:  subtleStyle,
} as const;

const sizeStyleMap = {
    large:  sizeLargeStyle,
    middle: sizeMiddleStyle,
    small:  sizeSmallStyle,
} as const;

const Button: FC<ButtonProps> = ({
    icon,
    iconAfter,
    loading = false,
    loadingIcon,
    appearance,
    shouldFitContainer = false,
    className,
    children,
    size,
    shape,
    isSelected = false,
    disabled,
    href,
    target,
    rel,
    id,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    onClick,
    onClickCapture,
    ...restProps
}) => {
    // 可变实例状态 ref：跨事件持有点击锁，不触发渲染
    const clickState = useRef<boolean>(false);

    const groupCtx = use(ButtonGroupContext);
    const resolvedAppearance = appearance ?? groupCtx.appearance ?? 'subtle';
    const resolvedSize = size ?? groupCtx.size ?? 'middle';

    const buttonClassName = cx(
        baseStyle,
        appearanceStyleMap[resolvedAppearance],
        sizeStyleMap[resolvedSize],
        shape === 'circle' ? circleStyle : null,
        shouldFitContainer ? fitContainerStyle : null,
        isSelected ? selectedStyle : null,
        className,
    );

    const renderLoadingIcon = () => {
        if (loadingIcon) {
            return <div className={iconWrapStyle}>{loadingIcon}</div>;
        }
        return (
            <span className={spinStyle}>
                <svg
                    viewBox="0 0 1024 1024"
                    focusable="false"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
                </svg>
            </span>
        );
    };

    const renderLeadingIcon = () => {
        if (loading) return renderLoadingIcon();
        if (icon) return <div className={iconWrapStyle}>{icon}</div>;
        return null;
    };

    const renderTrailingIcon = () => {
        if (iconAfter) return <div className={iconWrapStyle}>{iconAfter}</div>;
        return null;
    };

    const content = (
        <>
            {renderLeadingIcon()}
            {children != null && <span>{children}</span>}
            {renderTrailingIcon()}
        </>
    );

    const makeClickHandler = (handler: ButtonProps['onClick']) => (
        e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
        if (clickState.current === false) {
            clickState.current = true;
            try {
                const result = handler?.(
                    e as Parameters<NonNullable<ButtonProps['onClick']>>[0],
                );
                if (result?.then) {
                    result
                        .then(() => { clickState.current = false; })
                        .catch(() => { clickState.current = false; })
                        .finally(() => { clickState.current = false; });
                } else {
                    clickState.current = false;
                }
            } catch (error) {
                clickState.current = false;
                throw error;
            }
        }
    };

    const commonProps = {
        id,
        tabIndex,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-busy': loading,
        'aria-disabled': disabled || loading,
        'data-is-loading': loading ? `${loading}` : null,
        className: buttonClassName,
    };

    if (href) {
        return (
            <a
                {...commonProps}
                href={href}
                target={target}
                rel={rel}
                onClick={(e) => {
                    if (disabled || loading) { e.preventDefault(); return; }
                    makeClickHandler(onClick)(e);
                }}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            {...restProps}
            {...commonProps}
            disabled={disabled}
            onClick={makeClickHandler(onClick)}
            onClickCapture={makeClickHandler(onClickCapture)}
        >
            {content}
        </button>
    );
};

export default Button;
