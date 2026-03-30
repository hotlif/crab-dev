import { useRef, useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit";

import { formatTemporal } from "../util.js"
import DateTimePickerInput from "./dateTimePickerInput.js";
import DateTimePickerOverlay from "./dateTimePickerOverlay.js";
import type { DateTimePickerPanelProps } from "../panels/dateTimePickerPanel.js"
import type { DatePickerPanelInstance } from '../panels/datePickerPanel.js';

export interface DateTimePickerProps extends Omit<DateTimePickerPanelProps, 'selectTimeValue' | 'onSelectTimeValueChange' | 'value'> {

    /**
     * 大小
     */
    size?: LineEditProps["size"]

    /**
     * 限制范围信息
     */
    range?: DateTimePickerPanelProps["range"]

    /**
     * 时区
     */
    timeZone?: string;

    /**
     * 一周的起始天
     */
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7;

    /**
     * 国际化
     */
    locale?: string;

    /**
     * 日期值
     */
    value?: Temporal.ZonedDateTime | null;

    /**
     * 改变日期的时候触发的事件
     */
    onValueChange?: (value: Temporal.ZonedDateTime | null) => void;

    /**
     * 自定义显示的日期字符串
     */
    renderDisplayString?: (value?: Temporal.ZonedDateTime | null) => string;
}


const DateTimePicker: FC<DateTimePickerProps> = ({
    value,
    onValueChange = () => {},
    timeZone,
    weekStartDay,
    locale,
    range,
    renderDisplayString = (value) => value ? formatTemporal(value, "yyyy-MM-dd HH:mm:ss") : "",
    ...restProps
}) => {

    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>(value == null ?  [Temporal.Now.zonedDateTimeISO()] : [value]);
    
    const dateTimePickerPanelInstance = useRef<DatePickerPanelInstance>(null);

    return (
        <RcDropdownContainer
            overlay={(
                <DateTimePickerOverlay
                    value={value ?? selectValues?.[0]}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    range={range}
                    onValueChange={onValueChange}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                    instance={dateTimePickerPanelInstance}
                />
            )}
        >
            <DateTimePickerInput
                value={renderDisplayString(value)}
                onValueChange={onValueChange}
                instance={dateTimePickerPanelInstance}
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default DateTimePicker;
