import { useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit";


import TimePickerOverlay from "./timePickerOverlay.js";
import { type TimePickerPanelProps } from '../panels/timePickerPanel.js';
import TimePickerInput from './timePickerInput.js';
import { css } from '@linaria/core';


export interface TimePickerProps extends TimePickerPanelProps {
    /**
     * 大小
     */
    size?: LineEditProps["size"]

    /**
     * 自定义显示的时间字符串
     */
    renderDisplayString?: (value: TimePickerPanelProps["value"]) => string;

}


const TimePicker: FC<TimePickerProps> = ({
    value,
    onValueChange,
    renderDisplayString = (value) => value ? `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}:${value.second.toString().padStart(2, '0')}` : "",
    ...restProps
}) => {
    const [selectValues, setSelectValues] = useState<TimePickerPanelProps["value"]>(value);
    return (
        <RcDropdownContainer
            overlayClassName={css`
                padding: 0.2rem 1rem 1rem 1rem;
            `}
            overlay={(
                <TimePickerOverlay
                    value={selectValues}
                    onSelectValuesChange={setSelectValues}
                    onValueChange={onValueChange}
                />
            )}
        >
            <TimePickerInput
                value={renderDisplayString(value)}
                onValueChange={onValueChange}
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default TimePicker;
