import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css, cx } from "@linaria/core";
import { type CSSProperties, type HTMLAttributes, type Ref, type RefObject, useEffect, useRef } from "react";
import token from "../token.js";
import type { OKLCHValue } from "../types.js";

export interface ColorPickerInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: OKLCHValue;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    ref?: Ref<HTMLDivElement>;
    /** 弹层根节点(由 ColorPicker 持有),用于判定 pointerdown 是否落在弹层内。 */
    overlayRef?: RefObject<HTMLDivElement | null>;
}

/** 合并「dropdown 的 setReference」与用户传入的 ref(ref 作为普通 prop,不使用 forwardRef)。 */
const assignRef = <T,>(ref: Ref<T> | undefined | null, node: T | null): void => {
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: T | null }).current = node;
};

const SWATCH_SIZE = {
    small: token.trigger.swatch.size.small,
    medium: token.trigger.swatch.size.medium,
    large: token.trigger.swatch.size.large,
};

const triggerStyle = css`
    display: inline-flex;
    cursor: pointer;
    border: 1px solid ${token.trigger.border.color};
    padding: ${token.trigger.padding};
    border-radius: ${token.trigger.border.radius};
    gap: ${token.trigger.gap};
    justify-content: center;
    align-items: center;
    &:focus-visible {
        outline: 2px solid ${token.trigger.focus.color};
        outline-offset: 1px;
    }
`;

const disabledStyle = css`
    cursor: not-allowed;
    border-color: ${token.trigger.disabled.border.color};
    background: ${token.trigger.disabled.background};
    opacity: 0.6;
`;

const swatchStyle = css`
    border-radius: inherit;
    height: var(--cp-swatch-size);
    min-width: var(--cp-swatch-size);
`;

const ColorPickerInput = ({
    value,
    size = "medium",
    disabled = false,
    ref,
    overlayRef,
    "aria-label": ariaLabel,
    className,
    onClick,
    onKeyDown,
    ...restProps
}: ColorPickerInputProps) => {
    const { refs, dispatch, state } = useDropdownContext<HTMLDivElement>();
    // 可变实例状态 ref(例外白名单第 1 类):持有触发器 DOM 供 outside-click 判定,不驱动渲染
    const triggerRef = useRef<HTMLDivElement | null>(null);

    // 点击触发器/弹层之外时关闭(dropdown-container 未内置 outside-click)。
    // 注意:不能用触发器 onBlur 关闭 —— 点击弹层内滑块会使触发器失焦而误关。
    useEffect(() => {
        if (!state.open) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (triggerRef.current?.contains(target) || overlayRef?.current?.contains(target)) return;
            dispatch({ type: "setOpen", payload: false });
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [state.open, overlayRef, dispatch]);

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
            aria-label={ariaLabel ?? "选择颜色"}
            tabIndex={disabled ? -1 : 0}
            {...restProps}
            className={cx(triggerStyle, disabled && disabledStyle, className)}
            ref={(node) => {
                triggerRef.current = node;
                assignRef(refs.setReference, node);
                assignRef(ref, node);
            }}
            onClick={(e) => {
                onClick?.(e);
                toggle();
            }}
            onKeyDown={(e) => {
                onKeyDown?.(e);
                if (disabled) return;
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
