import { css, cx } from '@crab-dev/css';
import type { CSSProperties, FC, ReactNode } from 'react';
import token from './token.js';
import type { BadgePresetColor, BadgeProps } from './types.js';

// ═══════════════════════════════════════════════════════════════════════════
// 基础布局
// ═══════════════════════════════════════════════════════════════════════════

// 状态模式：dot + text 水平排列
const statusWrapStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.status.text.gap};
    color: ${token.status.text.color};
    font-size: ${token.status.text.font.size};
    line-height: 1.5;
    vertical-align: middle;
`;

// 包裹模式：相对定位父容器
const wrapperStyle = css`
    position: relative;
    display: inline-flex;
    line-height: 1;
    vertical-align: middle;
`;

// 独立模式：纯徽标占位
const standaloneStyle = css`
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 1;
`;

// 角标定位（当有 children 时）
const indicatorPositionedStyle = css`
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(${token.offset.x}, ${token.offset.y});
    transform-origin: 100% 0%;
    z-index: 1;
    pointer-events: none;
`;

// ═══════════════════════════════════════════════════════════════════════════
// 计数徽标样式（数字 / 自定义节点）
// ═══════════════════════════════════════════════════════════════════════════

const countBaseStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: ${token.count.color};
    background-color: ${token.count.background.color};
    font-weight: ${token.count.font.weight};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    line-height: 1;
    transition: ${token.transition};
`;

const countBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

const countSizeDefaultStyle = css`
    height: ${token.size.default.height};
    min-width: ${token.size.default['min-width']};
    padding: ${token.size.default.padding};
    border-radius: calc(${token.size.default.height} / 2);
    font-size: ${token.size.default.font.size};
`;

const countSizeSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small['min-width']};
    padding: ${token.size.small.padding};
    border-radius: calc(${token.size.small.height} / 2);
    font-size: ${token.size.small.font.size};
`;

// ═══════════════════════════════════════════════════════════════════════════
// 圆点样式
// ═══════════════════════════════════════════════════════════════════════════

const dotBaseStyle = css`
    display: inline-block;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: ${token.count.background.color};
    transition: ${token.transition};
    flex-shrink: 0;
`;

const dotSizeDefaultStyle = css`
    width: ${token.dot.size.default};
    height: ${token.dot.size.default};
`;

const dotSizeSmallStyle = css`
    width: ${token.dot.size.small};
    height: ${token.dot.size.small};
`;

const dotBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

// ═══════════════════════════════════════════════════════════════════════════
// 预设颜色（静态样式 — 不得运行时插值）
// ═══════════════════════════════════════════════════════════════════════════

const colorDefaultStyle = css`
    background-color: ${token.status.default.color};
`;

const colorProcessingStyle = css`
    background-color: ${token.status.processing.color};
`;

const colorSuccessStyle = css`
    background-color: ${token.status.success.color};
`;

const colorWarningStyle = css`
    background-color: ${token.status.warning.color};
`;

const colorErrorStyle = css`
    background-color: ${token.status.error.color};
`;

const PRESET_COLOR_MAP: Record<BadgePresetColor, string> = {
    default: colorDefaultStyle,
    processing: colorProcessingStyle,
    success: colorSuccessStyle,
    warning: colorWarningStyle,
    error: colorErrorStyle,
};

const isPresetColor = (value: string): value is BadgePresetColor => value in PRESET_COLOR_MAP;

// ═══════════════════════════════════════════════════════════════════════════
// Processing 状态脉冲动画
// ═══════════════════════════════════════════════════════════════════════════

const processingDotStyle = css`
    position: relative;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: 0 0 0 0 currentColor;
        opacity: 0.6;
        background-color: inherit;
        animation: badge-pulse 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes badge-pulse {
        0% {
            transform: scale(1);
            opacity: 0.6;
        }
        100% {
            transform: scale(2.4);
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        &::after {
            animation: none;
        }
    }
`;

// ═══════════════════════════════════════════════════════════════════════════
// 状态文字
// ═══════════════════════════════════════════════════════════════════════════

const statusTextStyle = css`
    display: inline-block;
`;

// ═══════════════════════════════════════════════════════════════════════════
// 组件实现
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_OVERFLOW_COUNT = 99;

const formatCount = (count: number | ReactNode, overflowCount: number): ReactNode => {
    if (typeof count !== 'number') return count;
    if (count > overflowCount) return `${overflowCount}+`;
    return count;
};

const Badge: FC<BadgeProps> = ({
    count,
    overflowCount = DEFAULT_OVERFLOW_COUNT,
    showZero = false,
    dot = false,
    status,
    text,
    color,
    size = 'default',
    offset,
    title,
    className,
    style,
    children,
    indicatorClassName,
    indicatorStyle,
    ...restProps
}) => {
    const hasChildren = children !== undefined && children !== null && children !== false;

    // ── 状态模式：无 children + status，渲染 "dot + text" ────────────────────
    if (!hasChildren && status !== undefined) {
        const statusColorStyle = PRESET_COLOR_MAP[status];
        const isProcessing = status === 'processing';
        const customDotStyle: CSSProperties | undefined =
            color !== undefined && !isPresetColor(color)
                ? { backgroundColor: color }
                : undefined;

        return (
            <span {...restProps} className={cx(statusWrapStyle, className)} style={style}>
                <span
                    className={cx(
                        dotBaseStyle,
                        size === 'small' ? dotSizeSmallStyle : dotSizeDefaultStyle,
                        !customDotStyle && (color && isPresetColor(color)
                            ? PRESET_COLOR_MAP[color]
                            : statusColorStyle),
                        isProcessing && processingDotStyle,
                    )}
                    style={customDotStyle}
                    aria-hidden="true"
                />
                {text !== undefined && text !== null && text !== false && (
                    <span className={statusTextStyle}>{text}</span>
                )}
            </span>
        );
    }

    // ── 判断是否隐藏徽标 ─────────────────────────────────────────────────────
    const numericCount = typeof count === 'number' ? count : undefined;
    const isZero = numericCount === 0;
    const hasCountContent = count !== undefined && count !== null && count !== false;
    const hideForZero = isZero && !showZero && !dot;
    const hideForEmpty = !dot && !hasCountContent;
    const shouldShowIndicator = !hideForZero && !(hideForEmpty && !dot);

    // 包裹模式但无可见徽标 → 只渲染 children
    if (hasChildren && !shouldShowIndicator) {
        return (
            <span {...restProps} className={cx(wrapperStyle, className)} style={style}>
                {children}
            </span>
        );
    }

    // 独立模式且不应渲染徽标 → 空输出
    if (!hasChildren && !shouldShowIndicator) {
        return null;
    }

    // ── 渲染徽标节点 ─────────────────────────────────────────────────────────
    const presetColorClass =
        color !== undefined && isPresetColor(color) ? PRESET_COLOR_MAP[color] : undefined;
    const customColorStyle: CSSProperties | undefined =
        color !== undefined && !isPresetColor(color)
            ? { backgroundColor: color }
            : undefined;

    const positionedStyle: CSSProperties | undefined = offset
        ? {
            transform: `translate(calc(50% + ${typeof offset[0] === 'number' ? `${offset[0]}px` : offset[0]}), calc(-50% + ${typeof offset[1] === 'number' ? `${offset[1]}px` : offset[1]}))`,
        }
        : undefined;

    const indicatorInlineStyle: CSSProperties | undefined = {
        ...customColorStyle,
        ...(hasChildren ? positionedStyle : undefined),
        ...indicatorStyle,
    };

    const indicator = dot ? (
        <span
            className={cx(
                dotBaseStyle,
                size === 'small' ? dotSizeSmallStyle : dotSizeDefaultStyle,
                presetColorClass,
                hasChildren && dotBorderStyle,
                hasChildren && indicatorPositionedStyle,
                indicatorClassName,
            )}
            style={Object.keys(indicatorInlineStyle).length > 0 ? indicatorInlineStyle : undefined}
            role="status"
            aria-label={title ?? (typeof text === 'string' ? text : 'badge')}
        />
    ) : (
        <span
            className={cx(
                countBaseStyle,
                size === 'small' ? countSizeSmallStyle : countSizeDefaultStyle,
                presetColorClass,
                hasChildren && countBorderStyle,
                hasChildren && indicatorPositionedStyle,
                indicatorClassName,
            )}
            style={Object.keys(indicatorInlineStyle).length > 0 ? indicatorInlineStyle : undefined}
            title={title ?? (typeof count === 'number' ? String(count) : undefined)}
            role="status"
            aria-label={
                title ?? (typeof count === 'number' ? `${count}` : undefined)
            }
        >
            {formatCount(count, overflowCount)}
        </span>
    );

    // ── 包裹模式 ─────────────────────────────────────────────────────────────
    if (hasChildren) {
        return (
            <span {...restProps} className={cx(wrapperStyle, className)} style={style}>
                {children}
                {indicator}
            </span>
        );
    }

    // ── 独立模式 ─────────────────────────────────────────────────────────────
    return (
        <span {...restProps} className={cx(standaloneStyle, className)} style={style}>
            {indicator}
        </span>
    );
};

export default Badge;
