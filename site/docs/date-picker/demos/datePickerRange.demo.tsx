/**
 * title = "日期范围选择"
 * description = "演示如何选择一段日期区间。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import { DatePicker } from "@crab-dev/rc-date-picker";

const now = Temporal.Now.zonedDateTimeISO();

const DatePickerRangeDemo = () => {
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(now);
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                margin-bottom: 2rem;
            `}
        >
            <DatePicker
                value={value}
                range={{
                    start: now.subtract({ days: 7 }),
                    end: now.add({ days: 7 }),
                }}
                onValueChange={setValue}
            />
        </div>
    )
}

export default DatePickerRangeDemo;
