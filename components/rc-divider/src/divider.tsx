import { cx } from '@crab-dev/css';
import { type CSSProperties, useId } from 'react';
import type { DividerOwnProps, DividerSpacing, DividerVariant } from './types.js';
import { baseStyle, variantDashedStyle, variantDottedStyle, lineStyle, spacingNoneStyle, spacingSmallStyle, spacingLargeStyle, horizontalStyle, verticalStyle, withTextStyle, textAlignStartStyle, textAlignEndStyle, textPlainStyle, textStyle } from "./divider.styles.js";
/* ────────────────────────────────── 辅助 ────────────────────────────────── */

function DividerLine({ vertical = false }: { vertical?: boolean }) {
    return (
        <svg className={lineStyle} aria-hidden="true" focusable="false">
            <line
                x1={vertical ? '50%' : '0'}
                y1={vertical ? '0' : '50%'}
                x2={vertical ? '50%' : '100%'}
                y2={vertical ? '100%' : '50%'}
            />
        </svg>
    );
}

const variantStyleOf = (variant: DividerVariant): string | false => {
    if (variant === 'dashed') return variantDashedStyle;
    if (variant === 'dotted') return variantDottedStyle;
    return false;
};

const spacingStyleOf = (spacing: DividerSpacing): string | false => {
    if (spacing === 'none') return spacingNoneStyle;
    if (spacing === 'small') return spacingSmallStyle;
    if (spacing === 'large') return spacingLargeStyle;
    return false;
};

const toCssLength = (value: number | string | undefined): string | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

/* ────────────────────────────────── 组件 ────────────────────────────────── */

/**
 * 分割线：在内容之间划分区隔, 用一条线把"一堆"切成"几组"。
 *
 * - `direction` 决定横 / 竖；竖线用于按钮组、面包屑等行内场景
 * - `children` 传入文字即成为带标题的分节线（仅横向）
 * - `decorative` 决定它是语义分隔（读屏播报）还是纯视觉修饰（不进无障碍树）
 *
 * 实现签名取扁平的 {@link DividerOwnProps}；对外经 index.ts 收窄为可辨识联合 `DividerProps`,
 * 使「竖线嵌文字」「装饰线带文字」等非法组合在消费侧编译期即不可拼出。
 */
const Divider = ({
    direction = 'horizontal',
    variant = 'solid',
    spacing = 'medium',
    decorative = false,
    textAlign = 'center',
    textOffset,
    plain = false,
    children,
    className,
    style,
    ref,
    ...restProps
}: DividerOwnProps) => {
    const textId = useId();
    const sharedClassNames = cx(baseStyle, variantStyleOf(variant), spacingStyleOf(spacing));

    // 竖线不承载文字：即便消费方绕过类型硬塞 children, 也不会误渲染成横向文字线
    const hasText =
        direction === 'horizontal' &&
        children !== undefined &&
        children !== null &&
        children !== false;

    if (hasText) {
        const offset = toCssLength(textOffset);
        // 内联 style 仅用于注入 CSS 自定义属性, 样式值本身仍来自令牌（同 rc-skeleton / rc-segmented）
        const offsetVars =
            offset === undefined
                ? style
                : ({ ...style, ['--rc-divider-text-offset' as never]: offset } as CSSProperties);

        return (
            <div
                {...restProps}
                ref={ref}
                role="separator"
                // 静态 separator 的子节点在 ARIA 中按 presentational 处理, 文字不会被读出；
                // 用 aria-labelledby 指回文字, 让读屏播报"XX 分隔线"而不是一句空洞的"分隔线"。
                aria-labelledby={textId}
                className={cx(
                    sharedClassNames,
                    withTextStyle,
                    textAlign === 'start' && textAlignStartStyle,
                    textAlign === 'end' && textAlignEndStyle,
                    plain && textPlainStyle,
                    className,
                )}
                style={offsetVars}
            >
                <DividerLine />
                <span id={textId} className={textStyle}>
                    {children}
                </span>
                <DividerLine />
            </div>
        );
    }

    const isVertical = direction === 'vertical';

    return (
        <div
            {...restProps}
            ref={ref}
            // 装饰线不得进入无障碍树：一条只为好看的线若播报为"分隔线", 就是噪声反馈。
            role={decorative ? 'none' : 'separator'}
            aria-hidden={decorative || undefined}
            // separator 的隐含方向是 horizontal, 故仅竖线需要显式声明。
            aria-orientation={!decorative && isVertical ? 'vertical' : undefined}
            className={cx(sharedClassNames, isVertical ? verticalStyle : horizontalStyle, className)}
            style={style}
        >
            <DividerLine vertical={isVertical} />
        </div>
    );
};

export default Divider;
