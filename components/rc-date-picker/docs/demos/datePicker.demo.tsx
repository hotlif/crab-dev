
/**
 * title = "基本"
 * description = "一个基础的日期选择组件"
 */

import { Temporal } from "@js-temporal/polyfill";
import { useState } from "react";
import DatePicker from "../../src/datePicker";


const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {
    const [value, setValue] = useState(now);
    return (
        <div>
            <DatePicker
                value={value}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;