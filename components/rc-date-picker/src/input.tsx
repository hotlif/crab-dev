import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { css } from "@linaria/core";
import { FC, useState } from "react";

import { Calendar, XCircleFill } from './icons';
import token from './token';

interface DatePickerInputProps {
    
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

const DatePickerInput: FC<DatePickerInputProps> = ({
    value,
    onChange,
    ...restProps
}) => {
    const {
        refs,
        dispatch
    } = useDropdownContext<HTMLInputElement>();

    const [hover, setHover] = useState(false);

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
                        onChange?.(null);
                    }}
                />
            )
        }
    }
    return (
        <RcLineEdit
            containerRef={refs.setReference}
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
            {...restProps}
        />
    )
}

export default DatePickerInput;