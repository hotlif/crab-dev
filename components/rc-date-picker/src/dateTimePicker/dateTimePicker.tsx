import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';
import { nowZonedDateTime } from '../temporal.js';
import { useControllableValue, useControllableOpen } from '@crab-dev/rc-hooks';
import { usePickerLocale } from '../locale.js';
import { useId, useRef, useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit";

import { formatTemporal } from "../util.js"
import DateTimePickerInput from "./dateTimePickerInput.js";
import DateTimePickerOverlay from "./dateTimePickerOverlay.js";
import type { DateTimePickerPanelProps } from "../panels/dateTimePickerPanel.js"
import type { DatePickerPanelInstance } from '../panels/datePickerPanel.js';
import { popupContentStyle, popupFrameStyle } from '../panels/popup.style.js';
import type { PickerFieldProps, PickerValueProps, PickerOpenProps, PickerValueChangeDetails } from '../types.js';

interface DateTimePickerBaseProps extends PickerFieldProps {
    /** 只传给面板，内部选择草稿和实例不对外暴露。 */
    panelProps?: Omit<DateTimePickerPanelProps, 'value' | 'selectValues' | 'onSelect' | 'instance' | 'selectTimeValue' | 'onSelectTimeValueChange' | 'range' | 'timeZone' | 'weekStartDay' | 'locale'>;

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

    /**
     * 改变日期的时候触发的事件
     */

    /**
     * 自定义显示的日期字符串；不改变值或清除状态。空值提示使用 placeholder。
     */
    renderDisplayString?: (value?: Temporal.ZonedDateTime | null) => string;
}


export type DateTimePickerProps = DateTimePickerBaseProps & PickerValueProps<Temporal.ZonedDateTime> & PickerOpenProps;

const DateTimePicker: FC<DateTimePickerProps> = ({
    value: valueProp,
    defaultValue,
    open,
    defaultOpen,
    onOpenChange,
    onValueChange,
    timeZone,
    weekStartDay,
    locale: localeProp,
    range,
    panelProps,
    renderDisplayString = (value) => value ? formatTemporal(value, "yyyy-MM-dd HH:mm:ss") : "",
    ...restProps
}) => {

    const { locale, messages } = usePickerLocale(localeProp);
    const popupId = useId();
    const [value, setValue] = useControllableValue<Temporal.ZonedDateTime | null, [PickerValueChangeDetails]>({ value: valueProp, defaultValue: defaultValue ?? null, onValueChange });
    const [isOpen, setOpen] = useControllableOpen<DropdownOpenChangeDetails>({ open, defaultOpen, onOpenChange });
    const changeValue = (next: Temporal.ZonedDateTime | null, event?: PickerValueChangeDetails['event']) => setValue(next, { reason: next === null ? 'clear' : 'confirm', ...(event ? { event } : {}) });
    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>(() => value == null ? [nowZonedDateTime(timeZone)] : [value]);
    
    const dateTimePickerPanelInstance = useRef<DatePickerPanelInstance>(null);

    return (
        <RcDropdownContainer
            closeOnFocusOut
            open={isOpen}
            onOpenChange={setOpen}
            floatingContainerProps={{ id: popupId, role: 'dialog', 'aria-label': messages.chooseDateTime, 'aria-modal': false, className: popupFrameStyle }}
            overlayClassName={popupContentStyle}
            overlay={(
                <DateTimePickerOverlay
                    {...panelProps}
                    value={value ?? selectValues?.[0]}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    range={range}
                    onValueChange={changeValue}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                    instance={dateTimePickerPanelInstance}
                />
            )}
        >
            <DateTimePickerInput locale={locale} popupId={popupId}
                value={renderDisplayString(value)}
                onValueChange={changeValue}
                instance={dateTimePickerPanelInstance}
                onOpen={() => setSelectValues([value ?? nowZonedDateTime(timeZone)])}
                {...restProps}
                hasValue={value != null}
            />
        </RcDropdownContainer>
    );
};

export default DateTimePicker;
