import { useComponentSize } from '@crab-dev/rc-config-provider';
import { cx } from '@crab-dev/css';
import { Children, Fragment, isValidElement, type KeyboardEvent, type ReactElement } from 'react';
import Skeleton from '@crab-dev/rc-skeleton';
import { CardContext } from './context.js';
import CardCover from './components/card-cover.js';
import CardHeader from './components/card-header.js';
import CardBody from './components/card-body.js';
import CardFooter from './components/card-footer.js';
import CardMeta from './components/card-meta.js';
import type { CardProps, CardSize, CardVariant } from './types.js';
import { cardBaseStyle, variantElevatedStyle, variantDefaultStyle, variantOutlinedStyle, variantFilledStyle, sizeLargeStyle, sizeMiddleStyle, sizeSmallStyle, liftStyle, outlinedInteractiveStyle, clickableStyle, disabledStyle, loadingStyle, loadingBodyStyle } from "./card.styles.js";
// 结构化区块子组件集合：children 命中其一即判为"复合模式"，直接渲染不再自动
// 包裹 Body。Card.Meta 属于内容（落在 Body 内），不计入结构化。
const STRUCTURAL_TYPES = new Set<unknown>([CardCover, CardHeader, CardBody, CardFooter]);

const variantStyleOf = (variant: CardVariant | undefined) => {
    if (variant === undefined) return variantDefaultStyle;
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
    variant,
    size: sizeProp,
    title,
    extra,
    cover,
    actions,
    hoverable = false,
    clickable = false,
    loading = false,
    loadingContent,
    disabled = false,
    onClick,
    children,
    className,
    ref,
    ...restProps
}: CardProps) => {
    const size = useComponentSize(sizeProp);
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
        content = loadingContent !== undefined ? loadingContent : (
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
                variant === 'outlined' && interactive && outlinedInteractiveStyle,
                disabled && disabledStyle,
                loading && loadingStyle,
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

// Keep an explicit CardProps entry for docgen and ambient compound members for
// published declarations. Wake's emitter cannot infer function expando members
// or emit initialized namespace variables, so declare types and assign values
// separately. Neither path requires a cast or changes the public component.
export interface CardComponent {
    (props: CardProps): ReactElement;
    Cover: typeof CardCover;
    Header: typeof CardHeader;
    Body: typeof CardBody;
    Footer: typeof CardFooter;
    Meta: typeof CardMeta;
}

function Card(props: CardProps): ReactElement {
    return <CardBase {...props} />;
}

// Compatibility exception for Wake 0.1.45: its declaration emitter drops
// function expandos, while docgen rejects the equivalent callable export alias.
// This ambient merge describes only the five real assignments below; it emits
// no runtime namespace and keeps the existing compound API. Public type cases,
// packed ESM/CJS consumers and docgen verify it. Remove this exception when the
// pinned tooling supports compound declarations and props discovery together.
// wake-lint-disable-next-line ts/no-namespace -- Card compound declaration/docgen compatibility, verified by public and packed fixtures.
declare namespace Card {
    let Cover: typeof CardCover;
    let Header: typeof CardHeader;
    let Body: typeof CardBody;
    let Footer: typeof CardFooter;
    let Meta: typeof CardMeta;
}

Card.Cover = CardCover;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Meta = CardMeta;

export default Card;
