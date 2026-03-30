import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { css } from "@linaria/core";
import { FC, RefObject, useEffect, useRef, useState } from "react";

import { Calendar, XCircleFill } from '../icons.js';
import token from '../token.js';
import type { DatePickerPanelInstance } from "../panels/datePickerPanel.js";
import type { DateTimePickerProps } from "./dateTimePicker.js";

interface DatePickerInputProps {
    
    /**
     * 改变值值触发的事件
     */
    onValueChange?: DateTimePickerProps["onValueChange"];

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


const iconStyle = css`
    opacity: ${token.opacity.icon};
    cursor: pointer;
    transition: opacity .2s;
    &:hover {
        opacity: ${token.opacity['icon-hover']};
    }

`

const DatePickerInput: FC<DatePickerInputProps> = ({
    value = "",
    onValueChange,
    instance,
    ...restProps
}) => {
    const {
        refs,
        state,
        dispatch
    } = useDropdownContext<HTMLInputElement>();

    const inputRef = useRef<HTMLInputElement>(null)

    const [hover, setHover] = useState(false);


    useEffect(() => {
        if (state.open) {
            inputRef.current?.focus();
        }
    }, [state.open]);

    const renderSuffixIcon = () => {
        if (value == null || value === '' || !hover) {
            return (
                <Calendar
                    className={iconStyle}
                    onClick={() => {
                        dispatch({
                            type: "setOpen",
                            payload: true
                        })
                    }}
                />
            )
        } else {
            return (
                <XCircleFill
                    className={iconStyle}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onValueChange?.(null);
                    }}
                />
            )
        }
    }
    return (
        <RcLineEdit
            containerRef={refs.setReference}
            inputRef={inputRef}
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
            onPointerEnter={() => {
                setHover(true);
            }}
            onPointerLeave={() => {
                setHover(false)
            }}
            value={value}
            readOnly
            suffix={renderSuffixIcon()}
            onKeyDown={(e) => {
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
            {...restProps}
        />
    )
}

export default DatePickerInput;