
export const meta = {
    title: "时间选择器",
    description: "三种不同规格的时间选择器示例",
};

import { css } from "@crab-dev/css";
import { useId, useState } from "react";
import TimePicker from "../../src/timePicker/timePicker.js";
import type { TimePickerPanelProps } from "../../src/panels/timePickerPanel.js";


const SizeDemo = () => {
    const controlId = useId();
    const [value, setValue] = useState<TimePickerPanelProps["value"]>();
    const [size, setSize] = useState<"large" | "middle" | "small">("middle")
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                margin-bottom: 2rem;
            `}
        >
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                `}
            >
                <label htmlFor={controlId}>
                    请选择大小
                </label>
                <select
                    id={controlId}
                    value={size}
                    onChange={e => setSize(e.target.value as "large" | "middle" | "small")}
                >
                    <option value="large">Large</option>
                    <option value="middle">Middle</option>
                    <option value="small">Small</option>
                </select>
            </div>
            <TimePicker
                label="开始时间"
                supportingText="使用 24 小时制输入。"
                appearance="filled"
                value={value}
                size={size}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;
