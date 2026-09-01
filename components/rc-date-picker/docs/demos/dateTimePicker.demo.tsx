export const meta = {
    title: "带时间的日期选择器",
    description: "三种不同规格的带时间的日期选择器示例",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import DateTimePicker from "../../src/dateTimePicker/index.js";


const SizeDemo = () => {
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(null);
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
            <DateTimePicker
                value={value}
                size={size}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;
