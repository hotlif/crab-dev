import { type FC } from "react";
import { css } from "@linaria/core";

import DatePickerPanel, { type DatePickerPanelProps } from "./datePickerPanel.js";
import TimePickerPanel, { type TimePickerPanelProps } from "./timePickerPanel.js";


export interface DateTimePickerPanelProps extends DatePickerPanelProps {
    selectTimeValue?: TimePickerPanelProps["value"]
    onSelectTimeValueChange?: (value: TimePickerPanelProps["value"]) => void
}

const DateTimePickerPanel: FC<DateTimePickerPanelProps> = ({
    value,
    selectValues,
    selectTimeValue,
    onSelectTimeValueChange,
    ...restProps
}) => {
    return (
        <div
            className={css`
                display: flex;
                gap: 1rem;
            `}
        >
            <DatePickerPanel
                value={value}
                selectValues={selectValues}
                {...restProps}
            />
            <TimePickerPanel
                value={selectTimeValue}
                onValueChange={onSelectTimeValueChange}
            />
        </div>
    )
}

export default DateTimePickerPanel;