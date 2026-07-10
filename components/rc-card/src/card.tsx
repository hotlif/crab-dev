import { css, cx } from '@linaria/core';
import { Children, Fragment, isValidElement, type KeyboardEvent } from 'react';
import Skeleton from '@crab-dev/rc-skeleton';
import token from './token.js';
import { CardContext } from './context.js';
import CardCover from './components/card-cover.js';
import CardHeader from './components/card-header.js';
import CardBody from './components/card-body.js';
import CardFooter from './components/card-footer.js';
import CardMeta from './components/card-meta.js';
import type { CardProps, CardSize, CardVariant } from './types.js';

// ─── 容器基座 ────────────────────────────────────────────────────────────────
// overflow:hidden 让封面出血并随圆角裁切；border 常驻 1px transparent 以便描边
// 平滑过渡且切换变体不引起布局跳动；--rc-card-cover-scale 默认 1，悬浮时由
// liftStyle 提升，驱动封面同步缩放。
const cardBaseStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: var(--rc-card-radius, ${token.size.middle.radius});
    background-color: ${token.surface.background};
    --rc-card-cover-scale: 1;
    transition: ${token.motion.lift};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

// ─── 变体 ────────────────────────────────────────────────────────────────────
const variantElevatedStyle = css`
    box-shadow: ${token.elevation.rest};
`;
const variantOutlinedStyle = css`
    border-color: ${token.border.color};
`;
const variantFilledStyle = css`
    background-color: ${token.filled.background};
`;

// ─── 尺寸（注入 CSS 变量，向所有区块子组件传导）─────────────────────────────
const sizeLargeStyle = css`
    --rc-card-pad: ${token.size.large.padding};
    --rc-card-gap: ${token.size.large.gap};
    --rc-card-radius: ${token.size.large.radius};
    --rc-card-title-size: ${token.size.large['title-size']};
`;
const sizeMiddleStyle = css`
    --rc-card-pad: ${token.size.middle.padding};
    --rc-card-gap: ${token.size.middle.gap};
    --rc-card-radius: ${token.size.middle.radius};
    --rc-card-title-size: ${token.size.middle['title-size']};
`;
const sizeSmallStyle = css`
    --rc-card-pad: ${token.size.small.padding};
    --rc-card-gap: ${token.size.small.gap};
    --rc-card-radius: ${token.size.small.radius};
    --rc-card-title-size: ${token.size.small['title-size']};
`;

// ─── 悬浮轻浮起（hoverable / clickable 共用）─────────────────────────────────
// 位移用 transform 模拟、不改盒模型（反馈原则：不引起布局跳动）；封面同步微缩放。
const liftStyle = css`
    will-change: transform;

    &:hover {
        transform: translateY(${token.lift.hover});
        box-shadow: ${token.elevation.hover};
        --rc-card-cover-scale: 1.03;
    }

    @media (prefers-reduced-motion: reduce) {
        &:hover {
            transform: none;
        }
    }
`;

// filled / outlined 在可交互时的悬浮底色与描边微调，补足各自的悬浮意符
const filledInteractiveStyle = css`
    &:hover {
        background-color: ${token.filled['background-hover']};
    }
`;
const outlinedInteractiveStyle = css`
    &:hover {
        border-color: ${token.border['color-hover']};
    }
`;

// ─── 整卡可点击 ──────────────────────────────────────────────────────────────
const clickableStyle = css`
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    /* 键盘焦点意符（forced-colors 下 outline 保留） */
    &:focus-visible {
        outline: 2px solid ${token.focus.ring.color};
        outline-offset: 2px;
    }

    /* 按压回落，短促过渡更跟手 */
    &:active {
        transform: translateY(${token.lift.active});
        box-shadow: ${token.elevation.active};
        transition-duration: 80ms;
    }

    @media (prefers-reduced-motion: reduce) {
        &:active {
            transform: none;
        }
    }
`;

// ─── 禁用（撤销全部示能）─────────────────────────────────────────────────────
// 根节点保留 not-allowed 光标作意符；内部阻断指针事件，连同卡内按钮一并失活。
const disabledStyle = css`
    cursor: not-allowed;
    opacity: ${token.disabled.opacity};

    & > * {
        pointer-events: none;
    }
`;

// ─── 加载骨架容器 ────────────────────────────────────────────────────────────
const loadingBodyStyle = css`
    display: flex;
    flex-direction: column;
    gap: var(--rc-card-gap, ${token.size.middle.gap});
    padding: var(--rc-card-pad, ${token.size.middle.padding});
`;

// 结构化区块子组件集合：children 命中其一即判为"复合模式"，直接渲染不再自动
// 包裹 Body。Card.Meta 属于内容（落在 Body 内），不计入结构化。
const STRUCTURAL_TYPES = new Set<unknown>([CardCover, CardHeader, CardBody, CardFooter]);

const variantStyleOf = (variant: CardVariant) => {
    if (variant === 'outlined') return variantOutlinedStyle;
    if (variant === 'filled') return variantFilledStyle;
    return variantElevatedStyle;
};

const sizeStyleOf = (size: CardSize) => {
    if (size === 'large') return sizeLargeStyle;
    if (size === 'small') return sizeSmallStyle;
    return sizeMiddleStyle;
};

const CardBase = ({
    variant = 'elevated',
    size = 'middle',
    title,
    extra,
    cover,
    actions,
    hoverable = false,
    clickable = false,
    loading = false,
    disabled = false,
    onClick,
    children,
    className,
    ref,
    ...restProps
}: CardProps) => {
    // 防错优于报错：加载 / 禁用态一并撤销悬浮与点击示能
    const actionable = clickable && !disabled && !loading;
    const interactive = (hoverable || clickable) && !disabled && !loading;

    // 键盘激活：Enter / Space 合成一次原生点击，onClick 以统一的事件路径触发
    const handleKeyDown = actionable
        ? (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
            }
        }
        : undefined;

    let content;
    if (loading) {
        content = (
            <>
                {cover != null && <Skeleton variant="image" height="160px" />}
                <div className={loadingBodyStyle}>
                    <Skeleton variant="text" width="45%" height="1.5rem" />
                    <Skeleton variant="text" rows={3} />
                </div>
            </>
        );
    } else {
        const hasStructuralChild = Children.toArray(children).some(
            (child) => isValidElement(child) && STRUCTURAL_TYPES.has(child.type),
        );

        let body = null;
        if (children != null) {
            body = hasStructuralChild ? children : <CardBody>{children}</CardBody>;
        }

        content = (
            <>
                {cover != null && <CardCover>{cover}</CardCover>}
                {(title != null || extra != null) && <CardHeader title={title} extra={extra} />}
                {body}
                {actions != null && actions.length > 0 && (
                    <CardFooter>
                        {actions.map((node, index) => (
                            // 操作组是位置型列表，索引即身份，作 key 稳定
                             
                            <Fragment key={index}>{node}</Fragment>
                        ))}
                    </CardFooter>
                )}
            </>
        );
    }

    return (
        <div
            {...restProps}
            ref={ref}
            className={cx(
                cardBaseStyle,
                variantStyleOf(variant),
                sizeStyleOf(size),
                interactive && liftStyle,
                actionable && clickableStyle,
                variant === 'filled' && interactive && filledInteractiveStyle,
                variant === 'outlined' && interactive && outlinedInteractiveStyle,
                disabled && disabledStyle,
                className,
            )}
            role={clickable ? 'button' : undefined}
            tabIndex={actionable ? 0 : undefined}
            aria-disabled={(clickable && disabled) || undefined}
            aria-busy={loading || undefined}
            onClick={actionable ? onClick : undefined}
            onKeyDown={handleKeyDown}
        >
            <CardContext value={{ size, clickable: actionable }}>{content}</CardContext>
        </div>
    );
};

// 复合子组件以静态属性挂载，支持 <Card.Cover /> / <Card.Header /> 等自由拼装
const Card = Object.assign(CardBase, {
    Cover: CardCover,
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
    Meta: CardMeta,
});

export default Card;
