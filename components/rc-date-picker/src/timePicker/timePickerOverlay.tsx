import { useState, type FC } from "react";
import { css } from "@crab-dev/css";
import RcButton from "@crab-dev/rc-button";
import { useDropdownContext } from "@crab-dev/rc-dropdown-container";

import token from "../token.js";
import TimePickerPanel, { type TimePickerPanelProps } from "../panels/timePickerPanel.js";


interface TimePickerOverlayProps extends TimePickerPanelProps {
    onValueChange?: TimePickerPanelProps["onValueChange"];
    onSelectValuesChange?: TimePickerPanelProps["onValueChange"];
}

const TimePickerOverlay: FC<TimePickerOverlayProps> = ({
    value,
    onValueChange,
    ...restProps
}) => {
    const [selectValues, setSelectValues] = useState<TimePickerPanelProps["value"]>(value);

    const {
        dispatch
    } = useDropdownContext<HTMLInputElement>();

    return (
        <>
            <TimePickerPanel
                value={selectValues}
                onValueChange={setSelectValues}
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
                        if (selectValues) {
                            onValueChange?.(selectValues);
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

export default TimePickerOverlay;