export const meta = {
    title: "日期范围选择",
    description: "演示如何选择一段日期区间。",
};

import { css } from "@crab-dev/css";
import { useState } from "react";

import DatePicker from "../../src/datePicker/datePicker.js";
import { formatTemporal } from "../../src/util.js";

const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {
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
