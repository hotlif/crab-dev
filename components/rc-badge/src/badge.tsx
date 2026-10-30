import { useConfig, useLocale } from '@crab-dev/rc-config-provider';
import { cx } from '@crab-dev/css';
import type { CSSProperties, FC, ReactNode } from 'react';
import { vars } from './token.js';
import type { BadgePresetColor, BadgeProps } from './types.js';
import { statusWrapStyle, wrapperStyle, standaloneStyle, indicatorPositionedStyle, countBaseStyle, countBorderStyle, countSizeDefaultStyle, countSizeSmallStyle, dotBaseStyle, dotSizeDefaultStyle, dotSizeSmallStyle, dotBorderStyle, forcedColorStyle, colorDefaultStyle, colorProcessingStyle, colorSuccessStyle, colorWarningStyle, colorErrorStyle, countColorDefaultStyle, countColorProcessingStyle, countColorSuccessStyle, countColorWarningStyle, countColorErrorStyle, processingDotStyle, statusTextStyle, numericCountStyle } from "./badge.styles.js";
const PRESET_COLOR_MAP: Record<BadgePresetColor, string> = {
    default: colorDefaultStyle,
    processing: colorProcessingStyle,
    success: colorSuccessStyle,
    warning: colorWarningStyle,
    error: colorErrorStyle,
};

const PRESET_COUNT_COLOR_MAP: Record<BadgePresetColor, string> = {
    default: countColorDefaultStyle,
    processing: countColorProcessingStyle,
    success: countColorSuccessStyle,
    warning: countColorWarningStyle,
    error: countColorErrorStyle,
};

const isPresetColor = (value: string): value is BadgePresetColor => value in PRESET_COLOR_MAP;

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
