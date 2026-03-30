/**
 * title = "日期选择器"
 * description = "多种规格的日期选择器演示。"
 */

import { css } from "@linaria/core";
import { useState } from "react";

import DatePicker from "../../src/datePicker/datePicker.js";
import { formatTemporal } from "../../src/util.js";


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
            <DatePicker
                value={value}
                size={size}
                renderDisplayString={(value) => formatTemporal(value, "yyyy-MM-dd")}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;