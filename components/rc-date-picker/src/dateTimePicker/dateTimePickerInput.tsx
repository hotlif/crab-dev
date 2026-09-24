import type { PickerFieldProps } from '../types.js';
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { useEffect, useRef } from "react";
import type { FC, RefObject } from "react";

import PickerInputActions, { usePickerFieldHover } from '../pickerInputActions.js';
import type { DatePickerPanelInstance } from "../panels/datePickerPanel.js";

interface DatePickerInputProps extends PickerFieldProps {
    
    /**
     * 改变值值触发的事件
     */
    onValueChange?: (value: Temporal.ZonedDateTime | null) => void;

    /**
     * 输入的值信息
     */
    value: string

    /**
     * 大小
     */
    size?: LineEditProps["size"]

    /**
     * 面板实例
     */
    instance?: RefObject<DatePickerPanelInstance | null> ;
}


const DatePickerInput: FC<DatePickerInputProps> = ({
    value = "",
    onValueChange,
    instance,
    ref, disabled, onClick, onFocus, onKeyDown,
    ...restProps
}) => {
    const {
        refs,
        state,
        dispatch
    } = useDropdownContext<HTMLDivElement>();

    const inputRef = useRef<HTMLInputElement>(null)
    const { hovered, containerRef } = usePickerFieldHover(refs.setReference);

    // 跨事件的焦点恢复标记：清除后聚焦输入框，不重新打开日历。
    const restoringFocus = useRef(false);


    useEffect(() => {
        if (state.open) {
            inputRef.current?.focus();
        }
    }, [state.open]);

    return (
        <RcLineEdit
            {...restProps}
            disabled={disabled}
            containerRef={containerRef}
            ref={(node) => {
                inputRef.current = node;
                const cleanup = typeof ref === 'function' ? ref(node) : undefined;
                if (ref && typeof ref !== 'function') ref.current = node;
                return () => {
                    inputRef.current = null;
                    if (cleanup) cleanup();
                    else if (typeof ref === 'function') ref(null);
                    else if (ref) ref.current = null;
                };
            }}
            onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented || disabled) return;
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            onFocus={(e) => {
                onFocus?.(e);
                if (e.defaultPrevented || disabled || restoringFocus.current) return;
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            value={value}
            readOnly
            suffix={<PickerInputActions
                hasValue={Boolean(value)}
                hovered={hovered}
                disabled={disabled}
                open={state.open}
                onOpen={() => {
                    if (!disabled) dispatch({ type: 'setOpen', payload: true });
                }}
                onClear={() => {
                    restoringFocus.current = true;
                    inputRef.current?.focus();
                    restoringFocus.current = false;
                    dispatch({ type: 'setOpen', payload: false });
                    onValueChange?.(null);
                }}
            />}
            onKeyDown={(e) => {
                onKeyDown?.(e);
                if (e.defaultPrevented || disabled) return;
                if (e.key === "Escape") {
                    dispatch({
                        type: "setOpen",
                        payload: false
                    });
                    return;
                }
                if (instance && typeof instance.current?.keyboardNavigate === 'function') {
                    switch (e.key) {
                        case "ArrowUp":
                            instance.current?.keyboardNavigate("up");
                            break;
                        case "ArrowDown":
                            instance.current?.keyboardNavigate("down");
                            break;
                        case "ArrowLeft":
                            instance.current?.keyboardNavigate("left");
                            break;
                        case "ArrowRight":
                            instance.current?.keyboardNavigate("right");
                            break;
                        case "Enter":
                            break;
                    }
                }

                if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
                    e.preventDefault();
                }
            }}
        />
    )
}

export default DatePickerInput;
