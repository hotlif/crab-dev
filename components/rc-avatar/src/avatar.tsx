import { useComponentSize } from '@crab-dev/rc-config-provider';
import { cx } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useEffect, useState } from 'react';
import type { CSSProperties, FC, ReactNode, SyntheticEvent } from 'react';
import type { AvatarFit, AvatarProps, AvatarShape, AvatarSize, AvatarVariant } from './types.js';
import { baseStyle, disabledStyle, interactiveStyle, actionStyle, borderedStyle, noBorderStyle, circleStyle, squareStyle, sizeSmallStyle, sizeMiddleStyle, sizeLargeStyle, variantDefaultStyle, variantPrimaryStyle, variantSuccessStyle, variantWarningStyle, variantErrorStyle, forcedFallbackStyle, forcedPrimaryStyle, imageStyle, fitCoverStyle, fitContainStyle, fitFillStyle, fitNoneStyle, fitScaleDownStyle, contentStyle, iconWrapStyle, iconSmallStyle, iconMiddleStyle, iconLargeStyle } from "./avatar.styles.js";
const shapeStyleMap: Record<AvatarShape, string> = {
    circle: circleStyle,
    square: squareStyle,
};

const sizeStyleMap: Record<AvatarSize, string> = {
    small: sizeSmallStyle,
    medium: sizeMiddleStyle,
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
    medium: iconMiddleStyle,
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
    size: sizeProp,
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
    const size = useComponentSize(sizeProp);
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

    const isAction = onClick !== undefined || role === 'button';
    const isInteractive = isAction || tabIndex !== undefined;
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

    const avatar = (
        <span
            {...(isAction ? {} : restProps)}
            role={isAction ? undefined : resolvedRole}
            tabIndex={isAction ? undefined : tabIndex}
            aria-label={isAction ? undefined : resolvedAriaLabel}
            aria-disabled={!isAction && disabled ? 'true' : undefined}
            data-disabled={!isAction && disabled ? '' : undefined}
            className={cx(
                baseStyle,
                disabledStyle,
                shapeStyleMap[shape],
                isNumberSize ? undefined : sizeStyleMap[size as AvatarSize],
                variantStyleMap[variant],
                bordered ? borderedStyle : noBorderStyle,
                isInteractive && !isAction && interactiveStyle,
                !showImage && (variant === 'primary' ? forcedPrimaryStyle : forcedFallbackStyle),
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

    if (!isAction) return avatar;

    return (
        <Button
            {...restProps}
            type="button"
            appearance="text"
            shape={shape === 'circle' ? 'circle' : 'square'}
            role={role}
            tabIndex={disabled ? -1 : tabIndex}
            aria-label={resolvedAriaLabel ?? alt}
            disabled={disabled}
            onClick={onClick}
            className={actionStyle}
        >
            {avatar}
        </Button>
    );
};

export default Avatar;
