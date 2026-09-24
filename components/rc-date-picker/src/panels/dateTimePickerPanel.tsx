import { type FC } from "react";
import { css } from "@crab-dev/css";
import semantic from '@crab-dev/rc-token-semantic';
import token from '../token.js';

import DatePickerPanel, { type DatePickerPanelProps } from "./datePickerPanel.js";
import TimePickerPanel, { type TimePickerPanelProps } from "./timePickerPanel.js";


export interface DateTimePickerPanelProps extends DatePickerPanelProps {
    selectTimeValue?: TimePickerPanelProps["value"]
    onSelectTimeValueChange?: (value: TimePickerPanelProps["value"]) => void
    /** 日期时间组合保留秒精度，可显式关闭；面板布局复用 M3 时间输入。 */
    timePanelProps?: Pick<TimePickerPanelProps, 'hourCycle' | 'showSeconds'>;
    onTimeValidityChange?: (valid: boolean) => void;
}

const DateTimePickerPanel: FC<DateTimePickerPanelProps> = ({
    value,
    selectValues,
    selectTimeValue,
    onSelectTimeValueChange,
    timePanelProps,
    onTimeValidityChange,
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
                defaultMode="input"
                showSeconds
                {...timePanelProps}
                value={selectTimeValue}
                onValueChange={onSelectTimeValueChange}
                onValidityChange={onTimeValidityChange}
            />
        </div>
    )
}

export default DateTimePickerPanel;
