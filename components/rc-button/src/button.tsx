import { cx } from '@crab-dev/css';
import { useEffect, useRef, useState, use, type FC, type MouseEvent } from 'react';
import { SpinIndicator } from '@crab-dev/rc-spin';
import { useConfig } from '@crab-dev/rc-config-provider';
import type { ButtonProps } from './types.js';
import ButtonGroupContext from './buttonGroupContext.js';
import { baseStyle, iconWrapStyle, labelStyle, loadingIndicatorStyle, primaryStyle, dangerStyle, linkStyle, dashedStyle, textStyle, layeredStyle, touchTargetStyle, elevatedStyle, dangerTextStyle, dangerSubtleStyle, dangerSelectedStyle, tonalStyle, dangerTonalStyle, dangerElevatedStyle, outlinedStyle, outlinedSelectedStyle, sizeLargeStyle, sizeMiddleStyle, sizeSmallStyle, sizeExtraLargeStyle, sizeExtraExtraLargeStyle, squareStyle, roundStyle, defaultShapeStyle, defaultSelectedShapeStyle, selectedFeedbackStyle, pressShapeStyle, tonalSelectedStyle, primaryUnselectedStyle, selectedDisabledStyle, fitContainerStyle, selectedStyle, circleStyle, iconOnlyStyle } from "./button.styles.js";
// Match Material Web's minimum press feedback for keyboard/assistive clicks.
const minimumPressMs = 225;

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
    const [pressFeedback, setPressFeedback] = useState(false);
    // Mutable instance state: repeated activations replace the pending release timer.
    const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const inactive = Boolean(disabled || loading);

    useEffect(() => {
        if (inactive) setPressFeedback(false);
        return () => { clearTimeout(feedbackTimeout.current); };
    }, [inactive]);

    const showPressFeedback = () => {
        clearTimeout(feedbackTimeout.current);
        setPressFeedback(true);
        feedbackTimeout.current = setTimeout(() => {
            setPressFeedback(false);
        }, minimumPressMs);
    };

    const groupCtx = use(ButtonGroupContext);
    const config = useConfig();
    const resolvedAppearance = appearance ?? groupCtx.appearance ?? 'outlined';
    const resolvedDanger = resolvedAppearance === 'danger' || (danger ?? groupCtx.danger ?? false);
    const dangerAppearanceStyle = resolvedAppearance === 'primary' || resolvedAppearance === 'danger'
        ? dangerStyle
        : resolvedAppearance === 'tonal' ? dangerTonalStyle
            : resolvedAppearance === 'elevated' ? dangerElevatedStyle
                : resolvedAppearance === 'text' || resolvedAppearance === 'link' ? dangerTextStyle : dangerSubtleStyle;
    const configuredSizes = { small: 'xs', medium: 's', large: 'm' } as const;
    const resolvedSize = size ?? groupCtx.size ?? configuredSizes[config.size];
    const unselectedPrimary = !resolvedDanger && resolvedAppearance === 'primary' && isSelected === false;
    const iconOnly = children == null && (icon != null || iconAfter != null || loading);

    const buttonClassName = cx(
        baseStyle,
        unselectedPrimary ? primaryUnselectedStyle : resolvedDanger && resolvedAppearance === 'primary' ? dangerStyle : appearanceStyleMap[resolvedAppearance],
        resolvedDanger ? dangerAppearanceStyle : null,
        resolvedAppearance === 'tonal' || unselectedPrimary ? layeredStyle : null,
        sizeStyleMap[resolvedSize],
        !resolvedDanger && resolvedAppearance === 'tonal' && isSelected ? tonalSelectedStyle : null,
        shape === undefined ? defaultShapeStyle : shape === 'square' || (shape === 'round' && isSelected) ? squareStyle : shape === 'round' ? roundStyle : null,
        shape === undefined && isSelected ? defaultSelectedShapeStyle : null,
        shape === 'round' ? pressShapeStyle : null,
        shape === 'circle' ? circleStyle : null,
        iconOnly ? iconOnlyStyle : null,
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
            <span aria-hidden="true" data-button-part="touch-target" className={touchTargetStyle} />
            {renderLeadingIcon()}
            {children != null && <span className={labelStyle}>{children}</span>}
            {renderTrailingIcon()}
        </>
    );

    const makeClickHandler = <Element extends HTMLElement,>(handler?: (event: MouseEvent<Element>) => void | Promise<void>, withFeedback = false) => (
        e: MouseEvent<Element>,
    ) => {
        if (disabled || loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // Native keyboard and assistive activations have no sustained :active state.
        if (withFeedback && e.detail === 0) showPressFeedback();
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
        'data-press-feedback': pressFeedback && !inactive ? '' : undefined,
        'data-tone': resolvedDanger ? 'danger' : undefined,
        className: buttonClassName,
    };

    if (restProps.href !== undefined) {
        return (
            <a
                {...restProps}
                {...commonProps}
                tabIndex={disabled ? -1 : restProps.tabIndex}
                onClick={makeClickHandler(restProps.onClick, true)}
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
            onClick={makeClickHandler(restProps.onClick, true)}
            onClickCapture={makeClickHandler(restProps.onClickCapture)}
        >
            {content}
        </button>
    );
};

export default Button;
