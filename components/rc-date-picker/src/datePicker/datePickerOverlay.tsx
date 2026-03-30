import RcButton from "@crab-dev/rc-button"
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import { css } from '@linaria/core';
import { FC } from "react";
import DatePickerPanel, { type DatePickerPanelProps } from '../panels/datePickerPanel.js';
import token from '../token.js';

interface DatePickerOverlayProps extends DatePickerPanelProps {
    onValueChange?: (value: Temporal.ZonedDateTime) => void;
    onSelectValuesChange?: (values: Temporal.ZonedDateTime[]) => void;
}

const DatePickerOverlay: FC<DatePickerOverlayProps> = ({
    value,
    selectValues,
    onValueChange,
    onSelectValuesChange,
    ...restProps
}) => {
    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();
    return (
        <>
            <DatePickerPanel
                value={value}
                selectValues={selectValues}
                onSelect={(elements) => {
                    onSelectValuesChange?.(elements);
                }}
                {...restProps}
            />
            <div
                className={css`
                    margin-top: ${token.action.bar.margin.top};
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
                    onClick={(e) => {
                        e.preventDefault();
                        if (selectValues?.[0]) {
                            onValueChange?.(selectValues![0]);
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

export default DatePickerOverlay;