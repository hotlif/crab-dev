/**
 * title = "单选框尺寸"
 * description = "通过 `size` 属性设置单选框尺寸, 支持 `large`、`middle`、`small` 三种"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import Radio, { RadioGroup } from "../../src/index.js";

const SizeDemo = () => {
    const [value, setValue] = useState<string | number>("a");

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `}
        >
            <RadioGroup value={value} onChange={setValue} size="large">
                <Radio value="a">Large A</Radio>
                <Radio value="b">Large B</Radio>
            </RadioGroup>
            <RadioGroup value={value} onChange={setValue} size="middle">
                <Radio value="a">Middle A</Radio>
                <Radio value="b">Middle B</Radio>
            </RadioGroup>
            <RadioGroup value={value} onChange={setValue} size="small">
                <Radio value="a">Small A</Radio>
                <Radio value="b">Small B</Radio>
            </RadioGroup>
        </div>
    );
};

export default SizeDemo;
