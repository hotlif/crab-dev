import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';
import { nowZonedDateTime, temporal } from '../temporal.js';
import { useControllableValue, useControllableOpen } from '@crab-dev/rc-hooks';
import { usePickerLocale } from '../locale.js';
import { useId, useRef, useState, type FC } from 'react';
import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { type LineEditProps } from "@crab-dev/rc-line-edit"
import { formatTemporal, isWithinDateRange } from "../util.js"
import DatePickerInput from "./datePickerInput.js";
import DatePickerOverlay from "./datePickerOverlay.js";
import type { DatePickerPanelInstance, DatePickerPanelProps } from "../panels/datePickerPanel.js"
import { popupContentStyle, popupFrameStyle } from '../panels/popup.style.js';
import type { PickerFieldProps, PickerValueProps, PickerOpenProps, PickerValueChangeDetails } from '../types.js';

interface DatePickerBaseProps extends PickerFieldProps {
    /** 允许输入 ISO 日期（YYYY-MM-DD），同时保留日历按钮。默认仅从日历选择。 */
    editable?: boolean;

    /** 只传给日期面板；选择草稿和面板实例由选择器管理。 */
    panelProps?: Omit<DatePickerPanelProps, 'value' | 'selectValues' | 'onSelect' | 'instance' | 'range' | 'timeZone' | 'weekStartDay' | 'locale'>;

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

    /**
     * 改变日期的时候触发的事件
     */

    /**
     * 自定义显示的日期字符串；不改变值或清除状态。空值提示使用 placeholder。
     */
    renderDisplayString?: (value: Temporal.ZonedDateTime | null) => string;
}


export type DatePickerProps = DatePickerBaseProps & PickerValueProps<Temporal.ZonedDateTime> & PickerOpenProps;

const DatePicker: FC<DatePickerProps> = ({
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
    editable = false,
    renderDisplayString = (value) => formatTemporal(value, "yyyy-MM-dd"),
    ...restProps
}) => {

    const { locale, messages } = usePickerLocale(localeProp);
    const popupId = useId();
    const [value, setValue] = useControllableValue<Temporal.ZonedDateTime | null, [PickerValueChangeDetails]>({ value: valueProp, defaultValue: defaultValue ?? null, onValueChange });
    const [isOpen, setOpen] = useControllableOpen<DropdownOpenChangeDetails>({ open, defaultOpen, onOpenChange });
    const changeValue = (next: Temporal.ZonedDateTime | null, event?: PickerValueChangeDetails['event']) => setValue(next, { reason: next === null ? 'clear' : 'confirm', ...(event ? { event } : {}) });
    const [selectValues, setSelectValues] = useState<Temporal.ZonedDateTime[]>(() => value == null ? [nowZonedDateTime(timeZone)] : [value]);
    const datePickerPanelInstance = useRef<DatePickerPanelInstance>(null);
    const entryZone = timeZone ?? temporal.Now.timeZoneId();
    const displayedValue = editable && value ? value.withTimeZone(entryZone) : value;
    const chinese = locale.toLowerCase().startsWith('zh');
    const textEntry = editable ? {
        value: displayedValue?.toPlainDate().withCalendar('iso8601').toString() ?? '',
        confirm: (raw: string, event: PickerValueChangeDetails['event']): string | undefined => {
            const text = raw.trim();
            if (!text) {
                changeValue(null, event);
                return;
            }
            const invalid = chinese ? '请输入有效日期，格式为 YYYY-MM-DD。' : 'Enter a valid date in YYYY-MM-DD format.';
            if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) return invalid;
            let next: Temporal.ZonedDateTime;
            try {
                const date = temporal.PlainDate.from(text, { overflow: 'reject' });
                next = date.toZonedDateTime(entryZone);
                if (temporal.PlainDate.compare(next.toPlainDate(), date) !== 0) return invalid;
            } catch {
                return invalid;
            }
            if (!isWithinDateRange(next, range)) {
                return chinese ? '日期超出可选范围。' : 'The date is outside the selectable range.';
            }
            changeValue(next, event);
            setSelectValues([next]);
        },
    } : undefined;

    return (
        <RcDropdownContainer
            closeOnFocusOut
            open={isOpen}
            onOpenChange={setOpen}
            floatingContainerProps={{ id: popupId, role: 'dialog', 'aria-label': messages.chooseDate, 'aria-modal': false, className: popupFrameStyle }}
            overlayClassName={popupContentStyle}
            overlay={(
                <DatePickerOverlay
                    {...panelProps}
                    value={value ?? selectValues?.[0]}
                    timeZone={timeZone}
                    weekStartDay={weekStartDay}
                    locale={locale}
                    range={range}
                    onValueChange={changeValue}
                    selectValues={selectValues}
                    onSelectValuesChange={setSelectValues}
                    instance={datePickerPanelInstance}
                />
            )}
        >
            <DatePickerInput locale={locale} popupId={popupId}
                value={renderDisplayString(displayedValue)}
                textEntry={textEntry}
                onValueChange={changeValue}
                instance={datePickerPanelInstance}
                onConfirm={() => {
                    if (selectValues[0]) changeValue(selectValues[0]);
                }}
                onOpen={() => setSelectValues([value ?? nowZonedDateTime(timeZone)])}
                {...restProps}
                hasValue={value != null}
            />
        </RcDropdownContainer>
    );
};

export default DatePicker;
