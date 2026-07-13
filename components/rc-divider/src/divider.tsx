import { css, cx } from '@linaria/core';
import { type CSSProperties, useId } from 'react';

import token from './token.js';
import type { DividerOwnProps, DividerSpacing, DividerVariant } from './types.js';

/* ────────────────────────────────── 静态样式 ──────────────────────────────────
 *
 * 线型与留白经两个 CSS 自定义属性传递, 而非拆成"方向 × 线型 × 档位"的组合类：
 *
 *   --rc-divider-line-style —— 无文字时作用于自身 border, 带文字时作用于 ::before /
 *                              ::after 两段线, 一处切换、三处生效
 *   --rc-divider-spacing    —— 横线走 margin-block, 竖线走 margin-inline, 同一档位
 *                              在两个方向上语义一致
 *
 * 变量的默认值写在 var() 的 fallback 里, 因此不依赖 Linaria 的类名输出顺序。
 */

const baseStyle = css`
    box-sizing: border-box;
    border: 0;
`;

/* ---- 线型 ---- */

const variantDashedStyle = css`
    --rc-divider-line-style: dashed;
`;

const variantDottedStyle = css`
    --rc-divider-line-style: dotted;
`;

/* ---- 留白档位 ---- */

const spacingNoneStyle = css`
    --rc-divider-spacing: ${token.spacing.none};
`;

const spacingSmallStyle = css`
    --rc-divider-spacing: ${token.spacing.small};
`;

const spacingLargeStyle = css`
    --rc-divider-spacing: ${token.spacing.large};
`;

/* ---- 横线（无文字） ---- */

const horizontalStyle = css`
    display: block;
    inline-size: 100%;
    min-inline-size: 100%;
    block-size: 0;
    margin-block: var(--rc-divider-spacing, ${token.spacing.middle});
    border-block-start: ${token.line.width} var(--rc-divider-line-style, solid)
        ${token.line.color};
`;

/* ---- 竖线 ---- */

const verticalStyle = css`
    display: inline-block;
    inline-size: 0;
    block-size: ${token.vertical.size};
    margin-inline: var(--rc-divider-spacing, ${token.spacing.middle});
    vertical-align: middle;
    border-inline-start: ${token.line.width} var(--rc-divider-line-style, solid)
        ${token.line.color};
`;

/* ---- 横线（带文字） ---- */

const withTextStyle = css`
    display: flex;
    align-items: center;
    inline-size: 100%;
    min-inline-size: 100%;
    margin-block: var(--rc-divider-spacing, ${token.spacing.middle});
    color: ${token.text.color};
    font-size: ${token.text['font-size']};
    font-weight: ${token.text['font-weight']};
    white-space: nowrap;

    &::before,
    &::after {
        content: '';
        flex: 1 1 auto;
        border-block-start: ${token.line.width} var(--rc-divider-line-style, solid)
            ${token.line.color};
    }

    &::before {
        margin-inline-end: ${token.text.gap};
    }

    &::after {
        margin-inline-start: ${token.text.gap};
    }
`;

const textAlignStartStyle = css`
    &::before {
        flex: 0 0 var(--rc-divider-text-offset, ${token.text.offset});
    }
`;

const textAlignEndStyle = css`
    &::after {
        flex: 0 0 var(--rc-divider-text-offset, ${token.text.offset});
    }
`;

const textPlainStyle = css`
    color: ${token.text['color-plain']};
    font-weight: ${token.text['font-weight-plain']};
`;

const textStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
`;

/* ────────────────────────────────── 辅助 ────────────────────────────────── */

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
    spacing = 'middle',
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
                <span id={textId} className={textStyle}>
                    {children}
                </span>
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
        />
    );
};

export default Divider;
