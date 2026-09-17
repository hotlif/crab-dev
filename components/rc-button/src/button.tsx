import { css, cx } from '@crab-dev/css';
import { useRef, use, type FC, type MouseEvent } from 'react';
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from './token.js';
import type { ButtonProps } from './types.js';
import ButtonGroupContext from './buttonGroupContext.js';

const opacityLoading = token.root['opacity-loading'];

const baseStyle = css`
    display: inline-flex;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    border: unset;
    user-select: none;
    background-color: unset;
    font-family: inherit;
    line-height: ${token.root['line-height']};
    vertical-align: middle;
    text-decoration: none;
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-disabled='true']:not([data-is-loading]) {
        cursor: not-allowed;
        opacity: ${token.root['opacity-disabled']};
    }
    @media (pointer: coarse) {
        min-width: ${token.root.touch['min-width']};
        min-height: ${token.root.touch['min-height']};
    }
    @media (prefers-reduced-motion: reduce) {
        /* Keep every appearance still, including selectors with state specificity. */
        &:active:not([aria-disabled="true"]) { transform: none !important; }
    }
    @media (forced-colors: active) {
        outline: ${token.root['border-width']} solid ButtonText;
        outline-offset: -1px;
        &:focus-visible {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled='true'] { outline-color: GrayText; }
    }
    &[data-is-loading] {
        opacity: ${opacityLoading};
        cursor: not-allowed;
        pointer-events: none;
    }
`;

const iconWrapStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
        width: 1rem;
        height: 1rem;
    }
`;

/**
 * 加载指示环：复用 @crab-dev/rc-spin 的纯视觉环, 不再自造 keyframes。
 *
 * - 尺寸跟随按钮字号（1em）, 三档尺寸自动缩放；
 * - 描边改用 currentColor —— rc-spin 默认的品牌色在 primary / danger 这类深底按钮上会看不见；
 * - 底环设为透明, 只留旋转弧, 与按钮原本的视觉分量保持一致。
 */
const loadingIndicatorStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    --rc-spin-size: 1em;
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

const primaryStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        box-shadow: ${token.primary['box-shadow']};
        background-color: ${token.primary["background-color"]};
        color: ${token.primary.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.primary['background-color-hover']}; }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.primary['background-color-active']};
            transform: scale(0.98);
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.primary['background-color-disabled']};
    }
`;

const dangerStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        box-shadow: ${token.danger['box-shadow']};
        background-color: ${token.danger["background-color"]};
        color: ${token.danger.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger['background-color-hover']}; }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.danger['background-color-active']};
            transform: scale(0.98);
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.danger['background-color-disabled']};
    }
`;

const linkStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        background-color: ${token.link["background-color"]};
        color: ${token.link.color};
        > span {
            position: relative;
            &::after {
                content: '';
                position: absolute;
                bottom: ${token.link['text-underline-offset']};
                left: 0;
                width: 100%;
                height: ${token.link['text-decoration-width']};
                background-color: ${token.link['text-decoration-color']};
                transform: scaleX(0);
                transform-origin: right;
                transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; } transition-property: transform;
            }
            &:hover::after {
                transform: scaleX(1);
                transform-origin: left;
            }
        }
        &:hover:not([aria-disabled="true"]) { color: ${token.link['color-hover']}; }
        &:active:not([aria-disabled="true"]) {
            transform: scale(0.98);
            color: ${token.link['color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        background-color: ${token.link['background-color-disabled']};
        pointer-events: none;
    }
`;

const dashedStyle = css`
    border-width: ${token.dashed['border-width']};
    border-style: ${token.dashed['border-style']};
    box-shadow: ${token.dashed['box-shadow']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.dashed.color};
        background-color: ${token.dashed["background-color"]};
        border-color: ${token.dashed['border-color']};
        &:hover:not([aria-disabled="true"]) {
            color: ${token.dashed['color-hover']};
            border-color: ${token.dashed['border-color-hover']};
        }
        &:active:not([aria-disabled="true"]) {
            transform: scale(0.98);
            color: ${token.dashed['color-active']};
            border-color: ${token.dashed['border-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.dashed['background-color-disabled']};
        border-color: transparent;
    }
`;

const textStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) { background-color: ${token.text['background-color-hover']}; }
        &:active:not([aria-disabled="true"]) {
            transform: scale(0.98);
            background-color: ${token.text['background-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        background-color: transparent;
        pointer-events: none;
    }
`;

const subtleStyle = css`
    border-style: ${token.subtle['border-style']};
    border-width: ${token.subtle['border-width']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.subtle.color};
        background-color: ${token.subtle["background-color"]};
        border-color: ${token.subtle['border-color']};
        box-shadow: ${token.subtle['box-shadow']};
        &:hover:not([aria-disabled="true"]) {
            border-color: ${token.subtle['border-color-hover']};
            color: ${token.subtle['color-hover']};
        }
        &:active:not([aria-disabled="true"]) {
            transform: scale(0.98);
            color: ${token.subtle['color-active']};
            border-color: ${token.subtle['border-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        background-color: ${token.subtle['background-color-disabled']};
    }
`;

const sizeLargeStyle = css`
    font-size: ${token.size.large["font-size"]};
    padding: ${token.size.large.padding};
    height: ${token.size.large.height};
    border-radius: ${token.size.large["border-radius"]};
    gap: ${token.size.large.gap};
`;

const sizeMiddleStyle = css`
    font-size: ${token.size.middle["font-size"]};
    height: ${token.size.middle.height};
    padding: ${token.size.middle.padding};
    border-radius: ${token.size.middle["border-radius"]};
    gap: ${token.size.middle.gap};
`;

const sizeSmallStyle = css`
    font-size: ${token.size.small["font-size"]};
    height: ${token.size.small.height};
    padding: ${token.size.small.padding};
    border-radius: ${token.size.small["border-radius"]};
    gap: ${token.size.small.gap};
`;

const fitContainerStyle = css`width: 100%;`;

const selectedStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        background-color: ${token.root["background-color-selected"]} !important;
        color: ${token.root["color-selected"]} !important;
        border-color: ${token.root['border-color-selected']} !important;
    }
`;

const circleStyle = css`
    border-radius: ${token.shape.circle['border-radius']};
    padding: ${token.shape.circle.padding};
    aspect-ratio: 1;
`;

const appearanceStyleMap = {
    primary: primaryStyle,
    danger:  dangerStyle,
    link:    linkStyle,
    dashed:  dashedStyle,
    text:    textStyle,
    subtle:  subtleStyle,
} as const;

const sizeStyleMap = {
    large:  sizeLargeStyle,
    middle: sizeMiddleStyle,
    small:  sizeSmallStyle,
} as const;

const Button: FC<ButtonProps> = ({
    icon,
    iconAfter,
    loading = false,
    loadingIcon,
    appearance,
    shouldFitContainer = false,
    className,
    children,
    size,
    shape,
    isSelected,
    disabled,
    href,
    target,
    rel,
    id,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    'aria-current': ariaCurrent,
    onClick,
    onClickCapture,
    ...restProps
}) => {
    // 可变实例状态 ref：跨事件持有点击锁，不触发渲染
    const clickState = useRef<boolean>(false);

    const groupCtx = use(ButtonGroupContext);
    const config = useConfig();
    const resolvedAppearance = appearance ?? groupCtx.appearance ?? 'subtle';
    const resolvedSize = size ?? groupCtx.size ?? config.size;

    const buttonClassName = cx(
        baseStyle,
        appearanceStyleMap[resolvedAppearance],
        sizeStyleMap[resolvedSize],
        shape === 'circle' ? circleStyle : null,
        shouldFitContainer ? fitContainerStyle : null,
        isSelected ? selectedStyle : null,
        className,
    );

    const renderLoadingIcon = () => {
        if (loadingIcon) {
            return <div className={iconWrapStyle}>{loadingIcon}</div>;
        }
        // 按钮自身已声明 aria-busy, 故用纯视觉的 SpinIndicator；
        // 若在此嵌入带 role="status" + aria-live 的 Spin, 读屏会把"加载中"播报两次。
        return (
            <span className={loadingIndicatorStyle}>
                <SpinIndicator />
            </span>
        );
    };

    const renderLeadingIcon = () => {
        if (loading) return renderLoadingIcon();
        if (icon) return <div className={iconWrapStyle}>{icon}</div>;
        return null;
    };

    const renderTrailingIcon = () => {
        if (iconAfter) return <div className={iconWrapStyle}>{iconAfter}</div>;
        return null;
    };

    const content = (
        <>
            {renderLeadingIcon()}
            {children != null && <span>{children}</span>}
            {renderTrailingIcon()}
        </>
    );

    const makeClickHandler = (handler: ButtonProps['onClick']) => (
        e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
        if (disabled || loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (clickState.current === false) {
            clickState.current = true;
            try {
                const result = handler?.(
                    e as Parameters<NonNullable<ButtonProps['onClick']>>[0],
                );
                if (result?.then) {
                    result
                        .then(() => { clickState.current = false; })
                        .catch(() => { clickState.current = false; })
                        .finally(() => { clickState.current = false; });
                } else {
                    clickState.current = false;
                }
            } catch (error) {
                clickState.current = false;
                throw error;
            }
        }
    };

    const commonProps = {
        id,
        tabIndex,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-current': ariaCurrent,
        'aria-busy': loading,
        'aria-disabled': disabled || loading,
        'data-is-loading': loading ? `${loading}` : null,
        className: buttonClassName,
    };

    if (href) {
        return (
            <a
                {...commonProps}
                href={href}
                target={target}
                rel={rel}
                onClick={(e) => {
                    if (disabled || loading) { e.preventDefault(); return; }
                    makeClickHandler(onClick)(e);
                }}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            {...restProps}
            {...commonProps}
            aria-pressed={restProps['aria-pressed'] ?? (
                !restProps.role || restProps.role === 'button' ? isSelected : undefined
            )}
            disabled={disabled}
            onClick={makeClickHandler(onClick)}
            onClickCapture={makeClickHandler(onClickCapture)}
        >
            {content}
        </button>
    );
};

export default Button;
