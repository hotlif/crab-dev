
/**
 * title = "时间选择器"
 * description = "三种不同规格的时间选择器示例"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import TimePicker from "../../src/timePicker/timePicker.js";
import type { TimePickerPanelProps } from "../../src/panels/timePickerPanel";


const SizeDemo = () => {
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
                <label>
                    请选择大小
                </label>
                <select
                    value={size}
                    onChange={e => setSize(e.target.value as "large" | "middle" | "small")}
                >
                    <option value="large">Large</option>
                    <option value="middle">Middle</option>
                    <option value="small">Small</option>
                </select>
            </div>
            <TimePicker
                value={value}
                size={size}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;