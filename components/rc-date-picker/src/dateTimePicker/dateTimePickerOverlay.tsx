import RcButton from "@crab-dev/rc-button"
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css } from '@crab-dev/css';
import { useState } from "react";
import type { FC } from "react";

import token from '../token.js';
import type { TimePickerPanelProps } from "../panels/timePickerPanel.js";
import DateTimePickerPanel, { type DateTimePickerPanelProps } from '../panels/dateTimePickerPanel.js';

interface DateTimePickerOverlayProps extends Omit<DateTimePickerPanelProps, 'selectTimeValue' | 'onSelectTimeValueChange'> {
    onValueChange?: (value: Temporal.ZonedDateTime) => void;
    onSelectValuesChange?: (values: Temporal.ZonedDateTime[]) => void;
}

const DateTimePickerOverlay: FC<DateTimePickerOverlayProps> = ({
    value,
    selectValues,
    onValueChange,
    onSelectValuesChange,
    ...restProps
}) => {
    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();

    const [selectTimeValue, setSelectTimeValue] = useState<TimePickerPanelProps["value"]>({
        hour: value?.hour ?? 0,
        minute: value?.minute ?? 0,
        second: value?.second ?? 0
    });
    const [timeValid, setTimeValid] = useState(true);

    return (
        <>
            <DateTimePickerPanel
                {...restProps}
                value={value}
                selectValues={selectValues}
                selectTimeValue={selectTimeValue}
                onSelectTimeValueChange={setSelectTimeValue}
                onTimeValidityChange={setTimeValid}
                onSelect={(elements) => {
                    onSelectValuesChange?.(elements);
                }}
            />
            <div
                className={css`
                    margin-top: ${token.action.bar["margin-top"]};
                    display: flex;
                    justify-content: flex-end;
                    gap: ${token.action.bar.gap};
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
                    disabled={!timeValid}
                    onClick={(e) => {
                        e.preventDefault();

                        if (timeValid && selectValues?.[0]) {
                            const newData = selectValues?.[0].with({ 
                                hour: selectTimeValue?.hour, 
                                minute: selectTimeValue?.minute,
                                second: selectTimeValue?.second 
                            });
                            onValueChange?.(newData);
                            dispatch({
                                type: "setOpen",
                                payload: false
                            });
                        }

                    }}
                >
                    确定
                </RcButton>
            </div>
        </>
    )
}

export default DateTimePickerOverlay;
