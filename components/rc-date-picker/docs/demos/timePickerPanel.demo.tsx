

export const meta = {
    title: "时间面板",
    description: "一个基础的时间选择面板组件",
};

import { useState } from "react";
import TimePickerPanel, { type TimePickerValue } from "../../src/panels/timePickerPanel.js";


const now = new Date();

const SizeDemo = () => {
    const [value, setValue] = useState<TimePickerValue | null>({
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
    });

    return <TimePickerPanel value={value} onValueChange={setValue} />;
}

export default SizeDemo;
