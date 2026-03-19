/**
 * title = "日期范围选择"
 * description = "演示如何选择一段日期区间。"
 */

import { Temporal } from "@js-temporal/polyfill";
import { css } from "@linaria/core";
import { useState } from "react";
import DatePicker from "../../src/datePicker/datePicker";
import { formatTemporal } from "../../src/util";

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
                renderDisplayString={(value) => formatTemporal(value, "yyyy-MM-dd")}
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