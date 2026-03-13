import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import RcLineEdit, { type LineEditProps } from '@crab-dev/rc-line-edit';
import { css } from "@linaria/core";
import { FC } from "react";

import { Calendar } from './icons';
import { size } from "@floating-ui/react";

interface DatePickerInputProps {
    
    value: string

    /**
     * 大小
     */
    size?: LineEditProps["size"]
}

const DatePickerInput: FC<DatePickerInputProps> = ({ value, ...restProps }) => {
    const {
        refs,
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    return (
        <RcLineEdit
            containerRef={refs.setReference}
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
            value={value}
            suffix={
                <Calendar
                    className={css`
                        opacity: 0.5;
                    `}
                />
            }
            {...restProps}
        />
    )
}

export default DatePickerInput;