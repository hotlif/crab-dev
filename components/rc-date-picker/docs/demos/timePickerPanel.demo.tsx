
/**
 * title = "时间面板"
 * description = "一个基础的时间选择面板组件"
 */

import TimePickerPanel from "../../src/panels/timePickerPanel";
import { useState } from "react";


const now = Temporal.Now.zonedDateTimeISO();

const SizeDemo = () => {
    const [value, setValue] = useState({
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