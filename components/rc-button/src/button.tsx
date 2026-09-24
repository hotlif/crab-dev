import { css, cx } from '@crab-dev/css';
import { useRef, use, type FC, type MouseEvent } from 'react';
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';
import { useConfig } from '@crab-dev/rc-config-provider';
import token, { vars as buttonVars } from './token.js';
import type { ButtonProps } from './types.js';
import ButtonGroupContext from './buttonGroupContext.js';

const opacityLoading = token.root['opacity-loading'];

const baseStyle = css`
    display: inline-flex;
    box-sizing: border-box;
    max-width: 100%;
    justify-content: center;
    position: relative;
    align-items: center;
    cursor: pointer;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    border: unset;
    border-radius: calc(${token.root.height} / 2);
    user-select: none;
    background-color: unset;
    font-family: ${token.root['font-family']};
    font-weight: ${token.root['font-weight']};
    line-height: ${token.root['line-height']};
    vertical-align: middle;
    text-decoration: none;
    white-space: nowrap;
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-disabled='true']:not([data-is-loading]) {
        cursor: not-allowed;
        color: ${token.root['color-disabled']};
        /* M3 applies 38% to content, independently of the 10% container. */
        > span { opacity: ${token.root['opacity-disabled']}; }
    }
    @media (prefers-reduced-motion: reduce) {
        /* Keep every appearance still, including selectors with state specificity. */
        &:active:not([aria-disabled="true"]) { transform: none !important; }
    }
    @media (forced-colors: active) {
        /* Own the system-color pair, including descendants, so text backplates
           cannot turn HighlightText into white-on-white inside a filled button. */
        forced-color-adjust: none;
        color: ButtonText !important;
        background-color: ButtonFace !important;
        border-color: ButtonText !important;
        box-shadow: none !important;
        outline: ${token.root['border-width']} solid ButtonText;
        outline-offset: -1px;
        &:focus-visible {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-pressed='true'] {
            color: HighlightText !important;
            background-color: Highlight !important;
        }
        &[aria-disabled='true']:not([data-is-loading]) {
            color: GrayText !important;
            outline-color: GrayText;
            > span { opacity: 1; }
        }
    }
    &[data-is-loading] {
        opacity: ${opacityLoading};
        cursor: not-allowed;
        pointer-events: none;
    }
`;

const iconWrapStyle = css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
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
        &:focus-visible { background-color: ${token.primary['background-color-focus']}; }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.primary['background-color-active']};
            transform: none;
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
        &:focus-visible { background-color: ${token.danger['background-color-focus']}; }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.danger['background-color-active']};
            transform: none;
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
        > span:not([aria-hidden]) {
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
            transform: none;
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
            transform: none;
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
    color: ${token.text.color};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) { background-color: ${token.text['background-color-hover']}; }
        &:focus-visible { background-color: ${token.text['background-color-focus']}; }
        &:active:not([aria-disabled="true"]) {
            transform: none;
            background-color: ${token.text['background-color-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        background-color: transparent;
        pointer-events: none;
    }
`;


const layeredStyle = css`
    isolation: isolate;
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not([aria-disabled='true']) {
        &:hover::before { opacity: ${token['state-layer']['opacity-hover']}; }
        &:focus-visible::before { opacity: ${token['state-layer']['opacity-focus']}; }
        &:active::before { opacity: ${token['state-layer']['opacity-active']}; }
    }
    &[aria-disabled='true']:not([data-is-loading]) {
        color: ${token.subtle['color-disabled']};
        background: ${token.root['background-color-disabled']};
        border-color: transparent;
    }
    @media (prefers-reduced-motion: reduce) { &::before { transition: none; } }
    @media (forced-colors: active) { &::before { display: none; } }
`;

const touchTargetStyle = css`
    position: absolute;
    inset: 0;
    @media (pointer: coarse) {
        inset: auto;
        top: 50%;
        left: 50%;
        width: max(100%, ${token.root.touch['min-width']});
        height: max(100%, ${token.root.touch['min-height']});
        transform: translate(-50%, -50%);
    }
`;

const elevatedStyle = css`
    color: ${token.elevated.color};
    background-color: ${token.elevated['background-color']};
    box-shadow: ${token.elevated['box-shadow']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) {
            background-color: ${token.elevated['background-color-hover']};
            box-shadow: ${token.elevated['box-shadow-hover']};
        }
        &:focus-visible {
            background-color: ${token.elevated['background-color-focus']};
            box-shadow: ${token.elevated['box-shadow']};
        }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.elevated['background-color-active']};
            box-shadow: ${token.elevated['box-shadow']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.elevated['color-disabled']};
        background-color: ${token.elevated['background-color-disabled']};
        box-shadow: none;
    }
`;

const dangerTextStyle = css`
    &[data-tone="danger"]:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.danger.content.color};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger.content['background-color-hover']}; }
        &:focus-visible, &:active:not([aria-disabled="true"]) { background-color: ${token.danger.content['background-color-active']}; }
    }
`;

const dangerSubtleStyle = css`
    &[data-tone="danger"]:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.danger.content.color};
        background-color: ${token.danger.subtle['background-color']};
        &:hover:not([aria-disabled="true"]) { background-color: ${token.danger.subtle['background-color-hover']}; }
        &:focus-visible, &:active:not([aria-disabled="true"]) { background-color: ${token.danger.subtle['background-color-active']}; }
    }
`;

const dangerSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading]))[data-tone="danger"] {
            color: ${token.danger.color} !important;
            background-color: ${token.danger['background-color']} !important;
            border-color: ${token.danger['background-color']} !important;
        }
    }
`;

const tonalStyle = css`
    border-color: transparent;
    color: ${token.tonal.color};
    background-color: ${token.tonal['background-color']};
`;

const dangerTonalStyle = css`
    &[data-tone='danger']:not([aria-disabled='true']:not([data-is-loading])) {
        color: ${token.danger.tonal.color};
        background-color: ${token.danger.tonal['background-color']};
    }
`;

const dangerElevatedStyle = css`
    &[data-tone='danger']:not([aria-disabled='true']:not([data-is-loading])) {
        color: ${token.danger.content.color};
        background-color: ${token.elevated['background-color']};
    }
`;

const outlinedStyle = css`
    border: ${token.root['border-width']} solid ${token.outlined['border-color']};
    box-shadow: ${token.subtle['box-shadow']};
    color: ${token.outlined.color};
    background-color: ${token.outlined['background-color']};
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        &:hover:not([aria-disabled="true"]) { background-color: ${token.outlined['background-color-hover']}; }
        &:focus-visible { background-color: ${token.outlined['background-color-focus']}; }
        &:active:not([aria-disabled="true"]) {
            background-color: ${token.outlined['background-color-active']};
            border-radius: ${token.root['border-radius-active']};
        }
    }
    &:is(:disabled, [aria-disabled="true"]:not([data-is-loading])) {
        cursor: not-allowed;
        pointer-events: none;
        color: ${token.subtle['color-disabled']};
        background-color: ${token.subtle['background-color-disabled']};
        border-color: ${token.subtle['border-color-disabled']};
        box-shadow: ${token.subtle['box-shadow-disabled']};
    }
`;

const outlinedSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            color: ${token.outlined['color-selected']} !important;
            background-color: ${token.outlined['background-color-selected']} !important;
            border-color: ${token.outlined['background-color-selected']} !important;
        }
    }
`;

const sizeLargeStyle = css`
    ${buttonVars['root.height']}: ${token.size.large.height};
    ${buttonVars['root.border-radius']}: ${token.size.large.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.large['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.large.icon.width};
    line-height: ${token.size.large['line-height']};
    font-size: ${token.size.large["font-size"]};
    padding: ${token.size.large.padding};
    height: max(${token.size.large.height}, calc(1lh + 2 * ${token.root['border-width']}));
    gap: ${token.size.large.gap};
    border-radius: ${token.size.large['border-radius']};
`;

const sizeMiddleStyle = css`
    ${buttonVars['root.height']}: ${token.size.middle.height};
    ${buttonVars['root.border-radius']}: ${token.size.middle.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.middle['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.middle.icon.width};
    line-height: ${token.size.middle['line-height']};
    font-size: ${token.size.middle["font-size"]};
    height: max(${token.size.middle.height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size.middle.padding};
    gap: ${token.size.middle.gap};
    border-radius: ${token.size.middle['border-radius']};
`;

const sizeSmallStyle = css`
    ${buttonVars['root.height']}: ${token.size.small.height};
    ${buttonVars['root.border-radius']}: ${token.size.small.square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size.small['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size.small.icon.width};
    line-height: ${token.size.small['line-height']};
    font-size: ${token.size.small["font-size"]};
    height: max(${token.size.small.height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size.small.padding};
    gap: ${token.size.small.gap};
    border-radius: ${token.size.small['border-radius']};
`;

const sizeExtraLargeStyle = css`
    ${buttonVars['root.border-width']}: ${token.size['extra-large']['border-width']};
    ${buttonVars['root.height']}: ${token.size['extra-large'].height};
    ${buttonVars['root.border-radius']}: ${token.size['extra-large'].square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size['extra-large']['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size['extra-large'].icon.width};
    font-size: ${token.size['extra-large']['font-size']};
    line-height: ${token.size['extra-large']['line-height']};
    height: max(${token.size['extra-large'].height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size['extra-large'].padding};
    gap: ${token.size['extra-large'].gap};
`;

const sizeExtraExtraLargeStyle = css`
    ${buttonVars['root.border-width']}: ${token.size['extra-extra-large']['border-width']};
    ${buttonVars['root.height']}: ${token.size['extra-extra-large'].height};
    ${buttonVars['root.border-radius']}: ${token.size['extra-extra-large'].square['border-radius']};
    ${buttonVars['root.border-radius-active']}: ${token.size['extra-extra-large']['border-radius-active']};
    ${buttonVars['icon.width']}: ${token.size['extra-extra-large'].icon.width};
    font-size: ${token.size['extra-extra-large']['font-size']};
    line-height: ${token.size['extra-extra-large']['line-height']};
    height: max(${token.size['extra-extra-large'].height}, calc(1lh + 2 * ${token.root['border-width']}));
    padding: ${token.size['extra-extra-large'].padding};
    gap: ${token.size['extra-extra-large'].gap};
`;

const squareStyle = css`border-radius: ${token.root['border-radius']};`;
const roundStyle = css`border-radius: calc(${token.root.height} / 2);`;
const selectedFeedbackStyle = css`
    isolation: isolate;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not([aria-disabled='true']) {
        &:hover::after { opacity: ${token['state-layer']['opacity-hover']}; }
        &:focus-visible::after { opacity: ${token['state-layer']['opacity-focus']}; }
        &:active::after { opacity: ${token['state-layer']['opacity-active']}; }
    }
    @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }
    @media (forced-colors: active) { &::after { display: none; } }
`;
const pressShapeStyle = css`
    &:active:not(:disabled):not([aria-disabled="true"]) { border-radius: ${token.root['border-radius-active']}; }
`;
const tonalSelectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            color: ${token.tonal['color-selected']} !important;
            background-color: ${token.tonal['background-color-selected']} !important;
        }
    }
`;
const primaryUnselectedStyle = css`
    &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
        color: ${token.primary.unselected.color};
        background-color: ${token.primary.unselected['background-color']};
        border-color: transparent;
    }
`;

const selectedDisabledStyle = css`
    &[aria-disabled='true']:not([data-is-loading]) {
        background-color: ${token.root['background-color-disabled']};
        border-color: transparent;
    }
`;

const fitContainerStyle = css`width: 100%;`;

const selectedStyle = css`
    @media (forced-colors: none) {
        &:not(:disabled):not([aria-disabled="true"]:not([data-is-loading])) {
            background-color: ${token.root["background-color-selected"]} !important;
            color: ${token.root["color-selected"]} !important;
            border-color: ${token.root['border-color-selected']} !important;
        }
    }
`;


const circleStyle = css`
    border-radius: ${token.shape.circle['border-radius']};
    padding: ${token.shape.circle.padding};
    aspect-ratio: 1;
`;

const appearanceStyleMap = {
    primary: primaryStyle,
    elevated: elevatedStyle,
    danger:  dangerStyle,
    link:    linkStyle,
    dashed:  dashedStyle,
    text:    textStyle,
    subtle:  outlinedStyle,
    tonal: tonalStyle,
    outlined: outlinedStyle,
} as const;

const sizeStyleMap = {
    large:  sizeLargeStyle,
    middle: sizeMiddleStyle,
    small:  sizeSmallStyle,
    xs: sizeSmallStyle,
    s: sizeMiddleStyle,
    m: sizeLargeStyle,
    l: sizeExtraLargeStyle,
    xl: sizeExtraExtraLargeStyle,
} as const;

const Button: FC<ButtonProps> = ({
    icon,
    iconAfter,
    loading = false,
    loadingIcon,
    appearance,
    danger,
    shouldFitContainer = false,
    className,
    children,
    size,
    shape,
    isSelected,
    disabled,
    ...restProps
}) => {
    // 可变实例状态 ref：跨事件持有点击锁，不触发渲染
    const clickState = useRef<boolean>(false);

    const groupCtx = use(ButtonGroupContext);
    const config = useConfig();
    const resolvedAppearance = appearance ?? groupCtx.appearance ?? 'outlined';
    const resolvedDanger = resolvedAppearance === 'danger' || (danger ?? groupCtx.danger ?? false);
    const dangerAppearanceStyle = resolvedAppearance === 'primary' || resolvedAppearance === 'danger'
        ? dangerStyle
        : resolvedAppearance === 'tonal' ? dangerTonalStyle
            : resolvedAppearance === 'elevated' ? dangerElevatedStyle
                : resolvedAppearance === 'text' || resolvedAppearance === 'link' ? dangerTextStyle : dangerSubtleStyle;
    const resolvedSize = size ?? groupCtx.size ?? config.size;
    const unselectedPrimary = !resolvedDanger && resolvedAppearance === 'primary' && isSelected === false;

    const buttonClassName = cx(
        baseStyle,
        unselectedPrimary ? primaryUnselectedStyle : resolvedDanger && resolvedAppearance === 'primary' ? dangerStyle : appearanceStyleMap[resolvedAppearance],
        resolvedDanger ? dangerAppearanceStyle : null,
        resolvedAppearance === 'tonal' || unselectedPrimary ? layeredStyle : null,
        sizeStyleMap[resolvedSize],
        !resolvedDanger && resolvedAppearance === 'tonal' && isSelected ? tonalSelectedStyle : null,
        shape === 'square' ? squareStyle : null,
        isSelected && shape !== 'circle' ? shape === 'square' ? roundStyle : squareStyle : null,
        shape !== 'circle' ? pressShapeStyle : null,
        shape === 'circle' ? circleStyle : null,
        shouldFitContainer ? fitContainerStyle : null,
        isSelected && resolvedAppearance !== 'tonal' ? (resolvedAppearance === 'outlined' || resolvedAppearance === 'subtle') && !resolvedDanger ? outlinedSelectedStyle : selectedStyle : null,
        isSelected && resolvedDanger ? dangerSelectedStyle : null,
        (isSelected && resolvedAppearance !== 'tonal') || (resolvedDanger && resolvedAppearance === 'elevated') ? selectedFeedbackStyle : null,
        isSelected && resolvedAppearance !== 'text' && resolvedAppearance !== 'link' ? selectedDisabledStyle : null,
        className,
    );

    const renderLoadingIcon = () => {
        if (loadingIcon) {
            return <span aria-hidden="true" className={iconWrapStyle}>{loadingIcon}</span>;
        }
        // 按钮自身已声明 aria-busy, 故用纯视觉的 SpinIndicator；
        // 若在此嵌入带 role="status" + aria-live 的 Spin, 读屏会把"加载中"播报两次。
        return (
            <span aria-hidden="true" className={loadingIndicatorStyle}>
                <SpinIndicator />
            </span>
        );
    };

    const renderLeadingIcon = () => {
        if (loading) return renderLoadingIcon();
        if (icon) return <span aria-hidden="true" className={iconWrapStyle}>{icon}</span>;
        return null;
    };

    const renderTrailingIcon = () => {
        if (iconAfter) return <span aria-hidden="true" className={iconWrapStyle}>{iconAfter}</span>;
        return null;
    };

    const content = (
        <>
            <span aria-hidden="true" className={touchTargetStyle} />
            {renderLeadingIcon()}
            {children != null && <span>{children}</span>}
            {renderTrailingIcon()}
        </>
    );

    const makeClickHandler = <Element extends HTMLElement,>(handler?: (event: MouseEvent<Element>) => void | Promise<void>) => (
        e: MouseEvent<Element>,
    ) => {
        if (disabled || loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (clickState.current === false) {
            clickState.current = true;
            try {
                const result = handler?.(e);
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
        'aria-busy': loading,
        'aria-disabled': disabled || loading,
        'data-is-loading': loading && !disabled ? `${loading}` : null,
        'data-tone': resolvedDanger ? 'danger' : undefined,
        className: buttonClassName,
    };

    if (restProps.href !== undefined) {
        return (
            <a
                {...restProps}
                {...commonProps}
                tabIndex={disabled ? -1 : restProps.tabIndex}
                onClick={makeClickHandler(restProps.onClick)}
                onClickCapture={makeClickHandler(restProps.onClickCapture)}
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
            onClick={makeClickHandler(restProps.onClick)}
            onClickCapture={makeClickHandler(restProps.onClickCapture)}
        >
            {content}
        </button>
    );
};

export default Button;
