
/**
 * title = "滑块基础用法"
 * description = "这是一个滑块的基础示例"
 */

import { useState } from "react";
import Slider from "../../src/slider";
import { css } from "@linaria/core";

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
        >
            <Slider
                style={{ width: 150 }}
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