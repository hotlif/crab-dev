import { useRef, useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit"
import { formatTemporal } from "../util"
import DateTimePickerInput from "./dateTimePickerInput";
import DateTimePickerOverlay from "./dateTimePickerOverlay";
import type { DateTimePickerPanelProps } from "../panels/dateTimePickerPanel"
import type { DatePickerPanelInstance } from '../panels/datePickerPanel';
import { TimePickerPanelProps } from '../panels/timePickerPanel';

export interface DateTimePickerProps extends Omit<DateTimePickerPanelProps, 'selectTimeValue' | 'onSelectTimeValueChange'> {

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
    value: Temporal.ZonedDateTime | null;

    /**
     * 改变日期的时候触发的事件
     */
    onValueChange?: (value: Temporal.ZonedDateTime) => void;

    /**
     * 自定义显示的日期字符串
     */
    renderDisplayString?: (value: Temporal.ZonedDateTime) => string;
}


const DateTimePicker: FC<DateTimePickerProps> = ({
    value,
    onValueChange,
    timeZone,
    weekStartDay,
    locale,
    range,
    renderDisplayString = (value) => formatTemporal(value, "yyyy-MM-dd HH:mm:ss"),
    className,
    ...restProps
}) => {

    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>(value == null ?  [] : [value]);
    
    const dateTimePickerPanelInstance = useRef<DatePickerPanelInstance>(null);

    return (
        <RcDropdownContainer
            overlay={(
                <DateTimePickerOverlay
                    value={value ?? Temporal.Now.zonedDateTimeISO()}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    range={range}
                    onValueChange={onValueChange}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                    instance={dateTimePickerPanelInstance}                />
            )}
        >
            <DateTimePickerInput
                value={renderDisplayString(value)}
                onChange={onValueChange}
                instance={dateTimePickerPanelInstance}
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default DateTimePicker;
