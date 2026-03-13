import RcButton from "@crab-dev/rc-button"
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css } from '@linaria/core';
import { FC } from "react";
import DatePickerPanel from './panels/datePickerPanel';


interface DatePickerOverlayProps {
    value: Temporal.ZonedDateTime;
    timeZone?: string;
    weekStartDay?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    locale?: string;
    onValueChange?: (value: Temporal.ZonedDateTime) => void;
    selectValues?: Temporal.ZonedDateTime[];
    onSelectValuesChange?: (values: Temporal.ZonedDateTime[]) => void;
}

const DatePickerOverlay: FC<DatePickerOverlayProps> = ({
    value,
    timeZone,
    weekStartDay,
    locale,
    onValueChange,
    selectValues,
    onSelectValuesChange
}) => {
    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    return (
        <>
            <DatePickerPanel
                value={value}
                timeZone={timeZone}
                weekStartDay={weekStartDay}
                locale={locale}
                selectValues={selectValues}
                onSelect={(elements) => {
                    onSelectValuesChange?.(elements);
                }}
            />
            <div
                className={css`
                    margin-top: 0.5rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                `}
            >
                <RcButton
                    appearance="text"
                    size="small"
                    onClick={() => {
                        dispatch({
                            type: "setOpen",
                            payload: false
                        })
                    }}
                >
                    取消
                </RcButton>
                <RcButton
                    size="small"
                    appearance="primary"
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    确定
                </RcButton>
            </div>
        </>
    )
}

export default DatePickerOverlay;