
/**
 * title = "日期范围限制"
 * description = "通过限定日期范围，用户只能选择指定范围内的日期。"
 */

import { Temporal } from "@js-temporal/polyfill";
import { css } from "@linaria/core";
import { useState } from "react";
import DatePicker from "../../src/datePicker/datePicker";

const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {
    const [value, setValue] = useState(now);
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

export default SizeDemo;