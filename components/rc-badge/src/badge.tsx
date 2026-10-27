import { useConfig, useLocale } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import type { CSSProperties, FC, ReactNode } from 'react';
import token, { vars } from './token.js';
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
    font-size: ${token.status.text['font-size']};
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
    inset-inline-end: 0;
    ${vars['indicator.anchor.left']}: 50%;
    ${vars['indicator.offset.left']}: 0px;
    ${vars['indicator.offset.top']}: 0px;
    transform: ${token.indicator.transform};
    transform-origin: 100% 0%;
    z-index: 1;
    pointer-events: none;

    &:dir(rtl) {
        ${vars['indicator.anchor.left']}: -50%;
        transform-origin: 0% 0%;
    }
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
    background-color: ${token.count['background-color']};
    font-weight: ${token.count['font-weight']};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    line-height: 1;
    transition: ${token.root.transition};
`;

const countBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

const countSizeDefaultStyle = css`
    height: ${token.size.default.height};
    min-width: ${token.size.default['min-width']};
    padding: ${token.size.default.padding};
    border-radius: calc(${token.size.default.height} / 2);
    font-size: ${token.size.default['font-size']};
`;

const countSizeSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small['min-width']};
    padding: ${token.size.small.padding};
    border-radius: calc(${token.size.small.height} / 2);
    font-size: ${token.size.small['font-size']};
`;

// ═══════════════════════════════════════════════════════════════════════════
// 圆点样式
// ═══════════════════════════════════════════════════════════════════════════

const dotBaseStyle = css`
    display: inline-block;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: ${token.count['background-color']};
    transition: ${token.root.transition};
    flex-shrink: 0;
`;

const dotSizeDefaultStyle = css`
    width: ${token.dot.default.width};
    height: ${token.dot.default.width};
`;

const dotSizeSmallStyle = css`
    width: ${token.dot.small.width};
    height: ${token.dot.small.width};
`;

const dotBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

// Own only the small indicator's system-color pair. Browser text backplates
// otherwise paint Canvas behind HighlightText and hide the count. System
// colors follow the user's palette; surrounding status text remains automatic.
const forcedColorStyle = css`
    @media (forced-colors: active) {
        forced-color-adjust: none;
        color: HighlightText !important;
        background-color: Highlight !important;
        box-shadow: none !important;
        outline: 1px solid Canvas;
        outline-offset: 0;
    }
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
    background-color: ${token.status['color-error']};
`;

const PRESET_COLOR_MAP: Record<BadgePresetColor, string> = {
    default: colorDefaultStyle,
    processing: colorProcessingStyle,
    success: colorSuccessStyle,
    warning: colorWarningStyle,
    error: colorErrorStyle,
};

const countColorDefaultStyle = css`
    color: ${token.count.default.color};
    background-color: ${token.count.default['background-color']};
`;
const countColorProcessingStyle = css`
    color: ${token.count.processing.color};
    background-color: ${token.count.processing['background-color']};
`;
const countColorSuccessStyle = css`
    color: ${token.count.success.color};
    background-color: ${token.count.success['background-color']};
`;
const countColorWarningStyle = css`
    color: ${token.count.warning.color};
    background-color: ${token.count.warning['background-color']};
`;
const countColorErrorStyle = css`
    color: ${token.count['color-error']};
    background-color: ${token.count['background-color-error']};
`;

const PRESET_COUNT_COLOR_MAP: Record<BadgePresetColor, string> = {
    default: countColorDefaultStyle,
    processing: countColorProcessingStyle,
    success: countColorSuccessStyle,
    warning: countColorWarningStyle,
    error: countColorErrorStyle,
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

// Isolate the numeric expression without changing the indicator's logical
// corner. Caller-provided content keeps its own writing direction.
const numericCountStyle = css`
    direction: ltr;
    unicode-bidi: isolate;
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
    size: sizeProp,
    offset,
    title,
    className,
    style,
    children,
    indicatorClassName,
    indicatorStyle,
    ...restProps
}) => {
    const config = useConfig();
    const { messages } = useLocale();
    const size = sizeProp ?? (config.size === 'small' ? 'small' : 'default');
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
                        forcedColorStyle,
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
        color !== undefined && isPresetColor(color)
            ? (dot ? PRESET_COLOR_MAP[color] : PRESET_COUNT_COLOR_MAP[color])
            : undefined;
    const customColorStyle: CSSProperties | undefined =
        color !== undefined && !isPresetColor(color)
            ? { backgroundColor: color }
            : undefined;

    // The anchor follows the actual DOM direction, including a native dir
    // override. Offsets remain physical: positive x moves right, y moves down.
    // Variables keep CSS lengths/calc intact without replacing the L3 transform.
    const positionedStyle: CSSProperties | undefined = offset
        ? {
            [vars['indicator.offset.left']]: typeof offset[0] === 'number' ? `${offset[0]}px` : offset[0],
            [vars['indicator.offset.top']]: typeof offset[1] === 'number' ? `${offset[1]}px` : offset[1],
        } as CSSProperties
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
                forcedColorStyle,
                indicatorClassName,
            )}
            style={Object.keys(indicatorInlineStyle).length > 0 ? indicatorInlineStyle : undefined}
            role="status"
            aria-label={title ?? (typeof text === 'string' ? text : messages.badge.dotLabel)}
        />
    ) : (
        <span
            className={cx(
                countBaseStyle,
                size === 'small' ? countSizeSmallStyle : countSizeDefaultStyle,
                presetColorClass,
                hasChildren && countBorderStyle,
                hasChildren && indicatorPositionedStyle,
                forcedColorStyle,
                indicatorClassName,
            )}
            style={Object.keys(indicatorInlineStyle).length > 0 ? indicatorInlineStyle : undefined}
            title={title ?? (typeof count === 'number' ? String(count) : undefined)}
            role="status"
            aria-label={
                title ?? (typeof count === 'number' ? `${count}` : undefined)
            }
        >
            {typeof count === 'number'
                ? <bdi dir="ltr" className={numericCountStyle}>{formatCount(count, overflowCount)}</bdi>
                : formatCount(count, overflowCount)}
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
