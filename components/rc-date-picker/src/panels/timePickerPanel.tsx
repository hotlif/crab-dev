import { css, cx } from "@crab-dev/css";
import NumberEdit from "@crab-dev/rc-number-edit";
import type { FC, HTMLAttributes } from "react";

import token from "../token.js";

export interface TimePickerValue {
    hour: number;
    minute: number;
    second: number;
}

export interface TimePickerPanelProps extends HTMLAttributes<HTMLDivElement> {
    value?: TimePickerValue | null;
    onValueChange?: (value: TimePickerValue | null) => void;
}

const containerStyle = css`
    display: grid;
    width: calc(${token.time.input.width} * 3 + ${token.time.input.gap} * 2);
    max-width: 100%;
    gap: ${token.time.section.gap};
`;

const titleStyle = css`
    margin: 0;
    color: ${token.time.title.color};
    font-size: ${token.time.title['font-size']};
    font-weight: ${token.time.title['font-weight']};
    line-height: ${token.time.title['line-height']};
`;

const fieldsStyle = css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, ${token.time.input.width}));
    gap: ${token.time.input.gap};
    align-items: start;
`;

const inputStyle = css`
    width: ${token.time.input.width};
`;

const extensionStyle = css`
    margin: 0;
    color: ${token.time.support.color};
    font-size: ${token.time.support['font-size']};
    line-height: ${token.time.support['line-height']};
`;

const TimePickerPanel: FC<TimePickerPanelProps> = ({
    className,
    value,
    onValueChange,
    ...restProps
}) => {
    const now = Temporal.Now.zonedDateTimeISO();
    const resolvedValue = value ?? {
        hour: now.hour,
        minute: now.minute,
        second: now.second,
    };

    const update = (part: keyof TimePickerValue, next: number | null) => {
        if (next == null) {
            return;
        }
        onValueChange?.({ ...resolvedValue, [part]: next });
    };

    return (
        <div
            role="group"
            aria-label="输入时间"
            className={cx(containerStyle, className)}
            {...restProps}
        >
            <h2 className={titleStyle}>输入时间</h2>
            <div className={fieldsStyle}>
                <NumberEdit
                    aria-label="小时"
                    label="小时"
                    appearance="filled"
                    value={resolvedValue.hour}
                    min={0}
                    max={23}
                    precision={0}
                    controls={false}
                    className={inputStyle}
                    onChange={(next) => update("hour", next)}
                />
                <NumberEdit
                    aria-label="分钟"
                    label="分钟"
                    appearance="filled"
                    value={resolvedValue.minute}
                    min={0}
                    max={59}
                    precision={0}
                    controls={false}
                    className={inputStyle}
                    onChange={(next) => update("minute", next)}
                />
                <NumberEdit
                    aria-label="秒"
                    label="秒"
                    appearance="filled"
                    value={resolvedValue.second}
                    min={0}
                    max={59}
                    precision={0}
                    controls={false}
                    className={inputStyle}
                    onChange={(next) => update("second", next)}
                />
            </div>
            <p className={extensionStyle}>24 小时制；秒是企业场景扩展。</p>
        </div>
    );
};

export default TimePickerPanel;
