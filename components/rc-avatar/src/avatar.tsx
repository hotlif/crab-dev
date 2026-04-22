import { css, cx } from '@linaria/core';
import { useEffect, useState } from 'react';
import type { CSSProperties, FC, ReactNode, SyntheticEvent } from 'react';
import token from './token.js';
import type { AvatarFit, AvatarProps, AvatarShape, AvatarSize, AvatarVariant } from './types.js';

const baseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid transparent;
    vertical-align: middle;
    line-height: 1;
    font-family: inherit;
    user-select: none;
    transition: ${token.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const disabledStyle = css`
    &[aria-disabled='true'] {
        opacity: ${token.disabled.opacity};
        cursor: not-allowed;
        pointer-events: none;
    }
`;

const interactiveStyle = css`
    cursor: pointer;

    &:hover:not([aria-disabled='true']) {
        box-shadow: 0 0 0 1px ${token.border.hover};
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px ${token.focus.ring.color};
    }

    &:active:not([aria-disabled='true']) {
        transform: scale(0.96);
    }

    @media (prefers-reduced-motion: reduce) {
        &:active:not([aria-disabled='true']) {
            transform: none;
        }
    }
`;

const borderedStyle = css`
    border-color: ${token.border.color};
`;

const noBorderStyle = css`
    border-color: transparent;
`;

const circleStyle = css`
    border-radius: 50%;
`;

const squareStyle = css`
    border-radius: ${token.shape.square.radius};
`;

const sizeSmallStyle = css`
    width: ${token.size.small.value};
    height: ${token.size.small.value};
    font-size: ${token.size.small.font.size};
`;

const sizeMiddleStyle = css`
    width: ${token.size.middle.value};
    height: ${token.size.middle.value};
    font-size: ${token.size.middle.font.size};
`;

const sizeLargeStyle = css`
    width: ${token.size.large.value};
    height: ${token.size.large.value};
    font-size: ${token.size.large.font.size};
`;

const variantDefaultStyle = css`
    color: ${token.default.color};
    background-color: ${token.default.background.color};
`;

const variantPrimaryStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary.background.color};
`;

const variantSuccessStyle = css`
    color: ${token.success.color};
    background-color: ${token.success.background.color};
`;

const variantWarningStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning.background.color};
`;

const variantErrorStyle = css`
    color: ${token.error.color};
    background-color: ${token.error.background.color};
`;

const imageStyle = css`
    display: block;
    width: 100%;
    height: 100%;
`;

const fitCoverStyle = css`
    object-fit: cover;
`;

const fitContainStyle = css`
    object-fit: contain;
`;

const fitFillStyle = css`
    object-fit: fill;
`;

const fitNoneStyle = css`
    object-fit: none;
`;

const fitScaleDownStyle = css`
    object-fit: scale-down;
`;

const contentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: ${token.content['max-width']};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: ${token.content.font.weight};
`;

const iconWrapStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;

    > svg {
        width: 1em;
        height: 1em;
    }
`;

const iconSmallStyle = css`
    font-size: ${token.icon.size.small};
`;

const iconMiddleStyle = css`
    font-size: ${token.icon.size.middle};
`;

const iconLargeStyle = css`
    font-size: ${token.icon.size.large};
`;

const shapeStyleMap: Record<AvatarShape, string> = {
    circle: circleStyle,
    square: squareStyle,
};

const sizeStyleMap: Record<AvatarSize, string> = {
    small: sizeSmallStyle,
    middle: sizeMiddleStyle,
    large: sizeLargeStyle,
};

const variantStyleMap: Record<AvatarVariant, string> = {
    default: variantDefaultStyle,
    primary: variantPrimaryStyle,
    success: variantSuccessStyle,
    warning: variantWarningStyle,
    error: variantErrorStyle,
};

const fitStyleMap: Record<AvatarFit, string> = {
    cover: fitCoverStyle,
    contain: fitContainStyle,
    fill: fitFillStyle,
    none: fitNoneStyle,
    'scale-down': fitScaleDownStyle,
};

const iconSizeStyleMap: Record<AvatarSize, string> = {
    small: iconSmallStyle,
    middle: iconMiddleStyle,
    large: iconLargeStyle,
};

const hasRenderableNode = (node: ReactNode): boolean => {
    return node !== undefined && node !== null && node !== false;
};

const DefaultAvatarIcon = () => {
    return (
        <svg viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M858.5 763.6a374 374 0 0 0-205.6-126.7 218.7 218.7 0 1 0-281.8 0A374 374 0 0 0 165.5 763.6a32 32 0 0 0 53.3 35.5A310 310 0 0 1 512 704a310 310 0 0 1 293.2 95.1 32 32 0 1 0 53.3-35.5ZM384 416a128 128 0 1 1 256 0 128 128 0 0 1-256 0Z" />
        </svg>
    );
};

const Avatar: FC<AvatarProps> = ({
    shape = 'circle',
    size = 'middle',
    variant = 'default',
    src,
    srcSet,
    alt,
    fit = 'cover',
    bordered = false,
    disabled = false,
    icon,
    onError,
    crossOrigin,
    loading,
    referrerPolicy,
    className,
    style,
    children,
    onClick,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    ...restProps
}) => {
    const [isImageError, setIsImageError] = useState(false);

    useEffect(() => {
        setIsImageError(false);
    }, [src]);

    const hasSrc = typeof src === 'string' && src.length > 0;
    const showImage = hasSrc && !isImageError;
    const hasChildren = hasRenderableNode(children);
    const hasCustomIcon = hasRenderableNode(icon);

    const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        const shouldFallback = onError?.(event);

        if (shouldFallback !== false) {
            setIsImageError(true);
        }
    };

    const isInteractive = onClick !== undefined || role === 'button' || tabIndex !== undefined;
    const isVisualOnlyFallback = !showImage && !hasChildren;
    const resolvedRole = isVisualOnlyFallback ? (role ?? 'img') : role;
    const resolvedAriaLabel =
        ariaLabel
        ?? (!showImage ? alt : undefined)
        ?? (isVisualOnlyFallback ? 'avatar' : undefined);

    const isNumberSize = typeof size === 'number';
    const mergedStyle: CSSProperties = {
        ...(isNumberSize ? { width: size, height: size, fontSize: Math.round(size * 0.375) } : {}),
        ...style,
    };

    const renderFallbackContent = () => {
        if (hasChildren) {
            return <span className={contentStyle}>{children}</span>;
        }

        const iconClass = cx(
            contentStyle,
            iconWrapStyle,
            isNumberSize ? undefined : iconSizeStyleMap[size as AvatarSize],
        );
        const iconStyle = isNumberSize
            ? { fontSize: Math.round((size as number) * 0.45) }
            : undefined;

        return (
            <span className={iconClass} style={iconStyle} aria-hidden="true">
                {hasCustomIcon ? icon : <DefaultAvatarIcon />}
            </span>
        );
    };

    return (
        <span
            {...restProps}
            onClick={onClick}
            role={resolvedRole}
            tabIndex={tabIndex}
            aria-label={resolvedAriaLabel}
            aria-disabled={disabled ? 'true' : undefined}
            className={cx(
                baseStyle,
                disabledStyle,
                shapeStyleMap[shape],
                isNumberSize ? undefined : sizeStyleMap[size as AvatarSize],
                variantStyleMap[variant],
                bordered ? borderedStyle : noBorderStyle,
                isInteractive && interactiveStyle,
                className,
            )}
            style={mergedStyle}
        >
            {showImage ? (
                <img
                    src={src}
                    srcSet={srcSet}
                    alt={alt ?? ''}
                    draggable={false}
                    crossOrigin={crossOrigin}
                    loading={loading}
                    referrerPolicy={referrerPolicy}
                    className={cx(imageStyle, fitStyleMap[fit])}
                    onError={handleImageError}
                />
            ) : (
                renderFallbackContent()
            )}
        </span>
    );
};

export default Avatar;