import { type FC } from "react";
import { css } from "@crab-dev/css";
import semantic from '@crab-dev/rc-token-semantic';
import token from '../token.js';

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
                flex-wrap: wrap;
                gap: ${semantic.space['section-gap']};
                width: max-content;
                max-width: calc(100vw - ${token.panel.padding} * 4);
                > * { flex-shrink: 0; }
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
