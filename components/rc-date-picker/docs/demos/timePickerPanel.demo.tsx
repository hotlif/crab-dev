
/**
 * title = "时间面板"
 * description = "一个基础的时间选择面板组件"
 */

import { useState } from "react";
import TimePickerPanel, { type TimePickerValue } from "../../src/panels/timePickerPanel.js";


const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {
    const [value, setValue] = useState<TimePickerValue | null>({
        hour: now.hour,
        minute: now.minute,
        second: now.second
    });

    return (
        <div
            style={{
                width: 150
            }}
        >
            <TimePickerPanel value={value} onValueChange={setValue} />
        </div>
    )
}

export default SizeDemo;