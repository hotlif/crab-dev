import { useRef, useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit"
import { formatTemporal } from "../util.js"
import DatePickerInput from "./datePickerInput.js";
import type { DatePickerInputProps } from "./datePickerInput.js";
import DatePickerOverlay from "./datePickerOverlay.js";
import type { DatePickerPanelInstance, DatePickerPanelProps } from "../panels/datePickerPanel.js"
import { css } from '@crab-dev/css';
import token from '../token.js';

export interface DatePickerProps extends Omit<DatePickerPanelProps, "value"> {

    /**
     * 大小
     */
    size?: LineEditProps["size"]

    /**
     * 限制范围信息
     */
    range?: DatePickerPanelProps["range"]

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
    onValueChange?: DatePickerInputProps["onValueChange"];

    /**
     * 自定义显示的日期字符串
     */
    renderDisplayString?: (value: Temporal.ZonedDateTime | null) => string;
}


const DatePicker: FC<DatePickerProps> = ({
    value,
    onValueChange,
    timeZone,
    weekStartDay,
    locale,
    range,
    renderDisplayString = (value) => formatTemporal(value, "yyyy-MM-dd"),
    ...restProps
}) => {

    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>(value == null ?  [Temporal.Now.zonedDateTimeISO()] : [value]);
    const datePickerPanelInstance = useRef<DatePickerPanelInstance>(null);

    return (
        <RcDropdownContainer
            overlayClassName={css`
                padding: ${token.panel.padding};
            `}
            overlay={(
                <DatePickerOverlay
                    value={value ?? selectValues?.[0]}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    range={range}
                    onValueChange={onValueChange}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                    instance={datePickerPanelInstance}
                />
            )}
        >
            <DatePickerInput
                value={renderDisplayString(value!)}
                onValueChange={onValueChange}
                instance={datePickerPanelInstance}
                onConfirm={() => {
                    if (selectValues[0]) onValueChange?.(selectValues[0]);
                }}
                onOpen={() => setSelectValues([value ?? Temporal.Now.zonedDateTimeISO(timeZone)])}
                {...restProps}
            />
        </RcDropdownContainer>
    );
};

export default DatePicker;
