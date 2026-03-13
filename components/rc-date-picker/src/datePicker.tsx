import { useState, type FC, type HTMLAttributes } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit"
import { formatTemporal } from "./util"
import DatePickerInput from "./input";
import DatePickerOverlay from "./overlay";

interface DatePickerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {

    /**
     * 大小
     */
    size?: LineEditProps["size"]

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
    value: Temporal.ZonedDateTime;

    /**
     * 改变日期的时候触发的事件
     * @param value 值
     */
    onValueChange?: (value: Temporal.ZonedDateTime) => void;

    /**
     * 自定义显示的日期字符串
     * @param value 值
     * @returns 显示的字符串
     */
    renderDisplayString?: (value: Temporal.ZonedDateTime) => string;
}


const DatePicker: FC<DatePickerProps> = ({
    value,
    onValueChange,
    timeZone,
    weekStartDay,
    locale,
    renderDisplayString = (value) => formatTemporal(value, "yyyy-MM-dd hh:mm:ss"),
    className,
    ...props
}) => {
    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>([]);
    return (
        <RcDropdownContainer
            overlay={(
                <DatePickerOverlay
                    value={value}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    onValueChange={onValueChange}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                />
            )}
        >
            <DatePickerInput value={renderDisplayString(value)} {...props} />
        </RcDropdownContainer>
    );
};

export default DatePicker;
