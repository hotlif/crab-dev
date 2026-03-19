import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { css } from "@linaria/core";
import { FC, useEffect, useRef, useState } from "react";

import { Clock, XCircleFill } from '../icons';
import token from '../token';

interface TimePickerInputProps {
    
    /**
     * 改变值值触发的事件
     */
    onChange?: (value: Temporal.ZonedDateTime | null) => void;

    /**
     * 输入的值信息
     */
    value: string

    /**
     * 大小
     */
    size?: LineEditProps["size"]

}

const iconStyle = css`
    opacity: ${token.opacity['icon']};
    cursor: pointer;
    transition: opacity .2s;
    &:hover {
        opacity: ${token.opacity['icon-hover']};
    }

`

const TimePickerInput: FC<TimePickerInputProps> = ({
    value,
    onChange,
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
                <Clock
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
                        onChange?.(null);
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
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    dispatch({
                        type: "setOpen",
                        payload: false
                    });
                    return;
                }
            }}
            value={value}
            readOnly
            suffix={renderSuffixIcon()}
            {...restProps}
        />
    )
}

export default TimePickerInput;