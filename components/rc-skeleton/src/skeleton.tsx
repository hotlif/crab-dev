import type { CSSProperties, FC } from "react";
import { css, cx } from "@linaria/core";

import token from "./token.js";
import type { SkeletonAnimation, SkeletonProps, SkeletonSize, SkeletonVariant } from "./types.js";

/* ────────────────────────────────── 静态样式 ────────────────────────────────── */

const baseStyle = css`
    display: block;
    background-color: ${token.color.background};
    background-image: linear-gradient(
        90deg,
        ${token.color.background} 0%,
        ${token.color.highlight} 50%,
        ${token.color.background} 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0%;
    border-radius: ${token.radius.default};
    width: var(--rc-skeleton-w, 100%);
    height: var(--rc-skeleton-h, auto);
    flex-shrink: 0;
`;

const groupStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.text.rows.gap};
    width: 100%;
`;

/* ---- variant：形状 ---- */

const variantTextStyle = css`
    border-radius: ${token.radius.text};
`;

const variantRectStyle = css`
    width: var(--rc-skeleton-w, ${token.rect.default.width});
    height: var(--rc-skeleton-h, ${token.rect.default.height});
    border-radius: ${token.radius.default};
`;

const variantCircleStyle = css`
    width: var(--rc-skeleton-w, ${token.circle.default.size});
    height: var(--rc-skeleton-h, ${token.circle.default.size});
    aspect-ratio: 1 / 1;
    border-radius: ${token.radius.pill};
`;

const variantButtonStyle = css`
    width: var(--rc-skeleton-w, ${token.button.default.width});
    height: var(--rc-skeleton-h, ${token.button.default.height});
    border-radius: ${token.radius.default};
`;

const variantAvatarStyle = css`
    width: var(--rc-skeleton-w, ${token.avatar.default.size});
    height: var(--rc-skeleton-h, ${token.avatar.default.size});
    aspect-ratio: 1 / 1;
    border-radius: ${token.radius.pill};
`;

const variantImageStyle = css`
    width: var(--rc-skeleton-w, 100%);
    height: var(--rc-skeleton-h, 200px);
    border-radius: ${token.radius.default};
`;

/* ---- size：仅 text 变体的行高 ---- */

const sizeSmallTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.small.height});
`;

const sizeMediumTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.medium.height});
`;

const sizeLargeTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.large.height});
`;

/* ---- 末行收窄 ---- */

const lastTextRowStyle = css`
    width: var(--rc-skeleton-w, ${token.text["last-row"].width});
`;

/* ---- round：强制 pill 圆角 ---- */

const roundStyle = css`
    border-radius: ${token.radius.pill};
`;

/* ---- 动画：pulse ---- */

const pulseStyle = css`
    background-image: none;
    animation: rc-skeleton-pulse ${token.animation.pulse.duration} ${token.animation.pulse.easing} infinite;

    @keyframes rc-skeleton-pulse {
        0%,
        100% {
            opacity: ${token.animation.pulse["opacity-max"]};
        }
        50% {
            opacity: ${token.animation.pulse["opacity-min"]};
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

/* ---- 动画：wave ---- */

const waveStyle = css`
    animation: rc-skeleton-wave ${token.animation.wave.duration} ${token.animation.wave.easing} infinite;

    @keyframes rc-skeleton-wave {
        0% {
            background-position: 200% 0%;
        }
        100% {
            background-position: -200% 0%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        background-image: none;
    }
`;

/* ---- 静态（active=false）：移除渐变带，保留纯底色 ---- */

const staticStyle = css`
    background-image: none;
`;

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
    size = "medium",
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
    if (!loading) {
        return <>{children}</>;
    }

    const widthValue = toCssLength(width);
    const heightValue = toCssLength(height);

    const dimensionVars = (extraWidth?: string): CSSProperties => ({
        ...(extraWidth !== undefined ? { ["--rc-skeleton-w" as string]: extraWidth } : widthValue !== undefined ? { ["--rc-skeleton-w" as string]: widthValue } : {}),
        ...(heightValue !== undefined ? { ["--rc-skeleton-h" as string]: heightValue } : {}),
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
            className={cx(baseStyle, variantStyle, roundClass, animationStyle, className)}
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
