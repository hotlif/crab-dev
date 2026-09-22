import { useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit";


import TimePickerOverlay from "./timePickerOverlay.js";
import { type TimePickerPanelProps } from '../panels/timePickerPanel.js';
import TimePickerInput from './timePickerInput.js';
import { popupContentStyle, popupFrameStyle } from '../panels/popup.style.js';


export interface TimePickerProps extends TimePickerPanelProps {
    /** Material 文本字段外观。 */
    appearance?: LineEditProps["appearance"];
    /** 可见的浮动字段标签。 */
    label?: LineEditProps["label"];
    /** 字段下方的辅助说明。 */
    supportingText?: LineEditProps["supportingText"];
    /** 字段错误说明。 */
    errorText?: LineEditProps["errorText"];
    /** 验证状态。 */
    status?: LineEditProps["status"];
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
            floatingContainerProps={{ className: popupFrameStyle }}
            overlayClassName={popupContentStyle}
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
