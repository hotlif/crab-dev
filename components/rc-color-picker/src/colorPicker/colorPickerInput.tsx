import { useComponentSize, useLocale } from '@crab-dev/rc-config-provider';
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css, cx } from "@crab-dev/css";
import { type CSSProperties, type HTMLAttributes, type Ref, type RefObject } from "react";
import token from "../token.js";
import type { OKLCHValue } from "../types.js";

export interface ColorPickerInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: OKLCHValue;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    ref?: Ref<HTMLDivElement>;
    triggerRef: RefObject<HTMLDivElement | null>;
}

/** 合并「dropdown 的 setReference」与用户传入的 ref(ref 作为普通 prop,不使用 forwardRef)。 */
const assignRef = <T,>(ref: Ref<T> | undefined | null, node: T | null): void => {
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: T | null }).current = node;
};

const SWATCH_SIZE = {
    small: token.trigger.swatch.small.width,
    medium: token.trigger.swatch.medium.width,
    large: token.trigger.swatch.large.width,
};

const triggerStyle = css`
    display: inline-flex;
    box-sizing: border-box;
    min-width: ${token.trigger.touch['min-width']};
    min-height: ${token.trigger.touch['min-height']};
    cursor: pointer;
    border: 1px solid ${token.trigger['border-color']};
    padding: ${token.trigger.padding};
    border-radius: ${token.trigger['border-radius']};
    gap: ${token.trigger.gap};
    justify-content: center;
    align-items: center;
    &:not([aria-disabled="true"]):hover {
        border-color: ${token.trigger['border-color-hover']};
        background-color: ${token.trigger['background-color-hover']};
    }
    &:not([aria-disabled="true"]):active {
        border-color: ${token.trigger['border-color-hover']};
        background-color: ${token.trigger['background-color-active']};
    }
    &:focus-visible {
        outline: 2px solid ${token.trigger.ring['color-focus']};
        outline-offset: 1px;
    }
`;

const disabledStyle = css`
    cursor: not-allowed;
    border-color: ${token.trigger['border-color-disabled']};
    background: ${token.trigger['background-color-disabled']};
    opacity: ${token.trigger['opacity-disabled']};
    @media (forced-colors: active) {
        /* Disabled UI uses a system boundary without fading the color data. */
        opacity: 1;
        border-color: GrayText;
    }
`;

const swatchStyle = css`
    border-radius: inherit;
    height: var(--cp-swatch-size);
    min-width: var(--cp-swatch-size);
    @media (forced-colors: active) {
        /* Preserve only the current color data, including its actual alpha. */
        forced-color-adjust: none;
    }
`;

const ColorPickerInput = ({
    value,
    size: sizeProp,
    disabled = false,
    ref,
    triggerRef,
    "aria-label": ariaLabel,
    className,
    onClick,
    onKeyDown,
    ...restProps
}: ColorPickerInputProps) => {
    const configuredSize = useComponentSize(sizeProp);
    const size = configuredSize;
    const { messages } = useLocale();
    const { refs, dispatch, state } = useDropdownContext<HTMLDivElement>();

    // 点击外部关闭已由 RcDropdownContainer 统一收口(基于 FloatingTree 的 useDismiss),
    // 能正确识别面板内嵌套下拉(如 RcSelect)自身的浮层,不会误判为外部点击。

    const toggle = () => {
        if (disabled) return;
        dispatch({ type: "setOpen", payload: !state.open });
    };

    const swatchStyleVars = {
        "--cp-swatch-size": SWATCH_SIZE[size],
        backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,
    } as CSSProperties;

    return (
        <div
            role="button"
            aria-haspopup="dialog"
            aria-expanded={state.open}
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel ?? messages.colorPicker.chooseColor}
            tabIndex={disabled ? -1 : 0}
            {...restProps}
            className={cx.call(undefined, triggerStyle, disabled && disabledStyle, className)}
            ref={(node) => {
                triggerRef.current = node;
                assignRef(refs.setReference, node);
                assignRef(ref, node);
            }}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) toggle();
            }}
            onKeyDown={(e) => {
                onKeyDown?.(e);
                if (disabled || e.defaultPrevented) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dispatch({ type: "setOpen", payload: !state.open });
                }
            }}
        >
            <div className={swatchStyle} style={swatchStyleVars} />
        </div>
    );
};

export default ColorPickerInput;
