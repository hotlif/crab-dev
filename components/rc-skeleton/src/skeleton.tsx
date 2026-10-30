import { useComponentSize } from '@crab-dev/rc-config-provider';
import type { CSSProperties, FC } from "react";
import { cx } from "@crab-dev/css";
import type { SkeletonAnimation, SkeletonProps, SkeletonSize, SkeletonVariant } from "./types.js";
import { baseStyle, groupStyle, variantTextStyle, variantRectStyle, variantCircleStyle, variantButtonStyle, variantAvatarStyle, variantImageStyle, sizeSmallTextStyle, sizeMediumTextStyle, sizeLargeTextStyle, lastTextRowStyle, roundStyle, pulseStyle, waveStyle, staticStyle, forcedColorStyle } from "./skeleton.styles.js";
/* ────────────────────────────────── 辅助 ────────────────────────────────── */

const toCssLength = (value: number | string | undefined): string | undefined => {
    if (value === undefined) return undefined;
    return typeof value === "number" ? `${value}px` : value;
};

const getVariantStyle = (variant: SkeletonVariant): string => {
    if (variant === "rect") return variantRectStyle;
    if (variant === "circle") return variantCircleStyle;
    if (variant === "button") return variantButtonStyle;
    if (variant === "avatar") return variantAvatarStyle;
    if (variant === "image") return variantImageStyle;
    return variantTextStyle;
};

const getTextSizeStyle = (size: SkeletonSize): string => {
    if (size === "small") return sizeSmallTextStyle;
    if (size === "large") return sizeLargeTextStyle;
    return sizeMediumTextStyle;
};

const getAnimationStyle = (active: boolean, animation: SkeletonAnimation): string => {
    if (!active) return staticStyle;
    if (animation === "wave") return waveStyle;
    return pulseStyle;
};

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * 骨架屏：在异步内容加载时提供占位节奏，降低用户感知等待时间。
 *
 * - `variant` 决定形状（text / rect / circle / button / avatar / image）
 * - `animation` 决定动效（pulse 透明度脉动 / wave 渐变扫过）
 * - `loading=false` 时渲染真实 `children`
 */
const Skeleton: FC<SkeletonProps> = ({
    variant = "text",
    size: sizeProp,
    width,
    height,
    rows = 1,
    round = false,
    active = true,
    animation = "pulse",
    loading = true,
    className,
    style,
    children,
    ...restProps
}) => {
    const configuredSize = useComponentSize(sizeProp);
    const size = configuredSize === 'medium' ? 'medium' : configuredSize;
    if (!loading) {
        return <>{children}</>;
    }

    const widthValue = toCssLength(width);
    const heightValue = toCssLength(height);
    const circular = variant === 'circle' || variant === 'avatar';
    // A definite fallback on both axes defeats aspect-ratio. Keep the omitted
    // axis automatic when one explicit dimension controls a circular shape.
    const resolvedWidth = widthValue ?? (circular && heightValue !== undefined ? 'auto' : undefined);
    const resolvedHeight = heightValue ?? (circular && widthValue !== undefined ? 'auto' : undefined);

    const dimensionVars = (extraWidth?: string): CSSProperties => ({
        ...(extraWidth !== undefined ? { ["--rc-skeleton-w" as string]: extraWidth } : resolvedWidth !== undefined ? { ["--rc-skeleton-w" as string]: resolvedWidth } : {}),
        ...(resolvedHeight !== undefined ? { ["--rc-skeleton-h" as string]: resolvedHeight } : {}),
        ...style,
    });

    const variantStyle = getVariantStyle(variant);
    const animationStyle = getAnimationStyle(active, animation);
    const roundClass = round ? roundStyle : "";

    if (variant === "text") {
        const sizeStyle = getTextSizeStyle(size);
        const effectiveRows = Math.max(1, Math.floor(rows));
        return (
            <div
                className={cx(groupStyle, className)}
                role="status"
                aria-live="polite"
                aria-busy="true"
                {...restProps}
            >
                {Array.from({ length: effectiveRows }, (_, index) => {
                    const isLast = index === effectiveRows - 1 && effectiveRows > 1;
                    const perRowWidth = isLast ? undefined : widthValue;
                    return (
                        <span
                            key={index}
                            className={cx(
                                baseStyle,
                                variantTextStyle,
                                sizeStyle,
                                roundClass,
                                animationStyle,
                                isLast && lastTextRowStyle,
                                forcedColorStyle,
                            )}
                            style={dimensionVars(perRowWidth)}
                            aria-hidden="true"
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <span
            className={cx(baseStyle, variantStyle, roundClass, animationStyle, forcedColorStyle, className)}
            style={dimensionVars()}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-hidden="true"
            {...restProps}
        />
    );
};

export default Skeleton;

export type { SkeletonAnimation, SkeletonProps, SkeletonSize, SkeletonVariant };
