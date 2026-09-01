
export const meta = {
    title: "滑块基础用法",
    description: "这是一个滑块的基础示例",
};

import { useState } from "react";
import Slider from "../../src/slider.js";
import { css } from "@crab-dev/css";

const BaseDemo = () => {
    const [value, setValue] = useState(20);
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            `}
            style={{ width: 150 }}
        >
            <Slider
                min={0}
                max={360}
                step={1}
                value={value}
                onValueChange={setValue}
            />

            <div
                className={css`
                    margin-top: 1rem;
                `}
            >
                <label>Value:</label>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        setValue(e.currentTarget.valueAsNumber)
                    }}
                />
            </div>
        </div>
    )
}

export default BaseDemo;
