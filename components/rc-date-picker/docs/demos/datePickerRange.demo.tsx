export const meta = {
    title: "可选日期范围",
    description: "限制单个日期只能在今天前后 7 天内选择；范围外的日期禁用。",
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
                label="计划日期"
                supportingText="只能选择今天前后 7 天内的一个日期。"
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
