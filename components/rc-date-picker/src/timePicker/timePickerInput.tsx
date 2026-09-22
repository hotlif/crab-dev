import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { css } from "@crab-dev/css";
import { useEffect, useRef } from "react";
import type { FC } from "react";

import token from '../token.js';
import { Clock } from '../icons.js';
import type { TimePickerPanelProps } from "../panels/timePickerPanel.js";

interface TimePickerInputProps extends Omit<
    LineEditProps,
    "value" | "onChange" | "readOnly" | "suffix" | "allowClear" | "onClear"
> {
    
    /**
     * 改变值值触发的事件
     */
    onValueChange?: TimePickerPanelProps["onValueChange"];

    /**
     * 输入的值信息
     */
    value: string

}

const iconStyle = css`
    opacity: ${token.icon.opacity};
    pointer-events: none;
`

const TimePickerInput: FC<TimePickerInputProps> = ({
    value = "",
    onValueChange,
    onKeyDown,
    ...restProps
}) => {
    const {
        refs,
        state,
        dispatch
    } = useDropdownContext<HTMLInputElement>();

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (state.open) {
            inputRef.current?.focus();
        }
    }, [state.open]);

    return (
        <RcLineEdit
            containerRef={refs.setReference}
            ref={inputRef}
            onClick={() => {
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            onFocus={() => {
                dispatch({
                    type: "setOpen",
                    payload: true
                })
            }}
            onBlur={() => {
                dispatch({
                    type: "setOpen",
                    payload: false
                })
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    dispatch({
                        type: "setOpen",
                        payload: false
                    });
                }
                onKeyDown?.(e);
            }}
            value={value}
            readOnly
            allowClear={value !== ""}
            onClear={() => onValueChange?.(null)}
            suffix={<Clock aria-hidden="true" className={iconStyle} />}
            {...restProps}
        />
    )
}

export default TimePickerInput;
