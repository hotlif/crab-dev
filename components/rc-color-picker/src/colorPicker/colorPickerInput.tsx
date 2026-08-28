import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css, cx } from "@crab-dev/css";
import { type CSSProperties, type HTMLAttributes, type Ref } from "react";
import token from "../token.js";
import type { OKLCHValue } from "../types.js";

export interface ColorPickerInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: OKLCHValue;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    ref?: Ref<HTMLDivElement>;
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
    "aria-label": ariaLabel,
    className,
    onClick,
    onKeyDown,
    ...restProps
}: ColorPickerInputProps) => {
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
            aria-label={ariaLabel ?? "选择颜色"}
            tabIndex={disabled ? -1 : 0}
            {...restProps}
            className={cx(triggerStyle, disabled && disabledStyle, className)}
            ref={(node) => {
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
