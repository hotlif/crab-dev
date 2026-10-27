export const meta = {
    title: "复选框尺寸",
    description: "通过 `size` 属性设置复选框尺寸, 支持 `large`、`medium`、`small` 三种",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Checkbox, { CheckboxGroup } from "../../src/index.js";

const SizeDemo = () => {
    const [value, setValue] = useState<Array<string | number>>([]);

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `}
        >
            <CheckboxGroup value={value} onValueChange={setValue} size="large">
                <Checkbox value="a">Large A</Checkbox>
                <Checkbox value="b">Large B</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup value={value} onValueChange={setValue} size="medium">
                <Checkbox value="a">Middle A</Checkbox>
                <Checkbox value="b">Middle B</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup value={value} onValueChange={setValue} size="small">
                <Checkbox value="a">Small A</Checkbox>
                <Checkbox value="b">Small B</Checkbox>
            </CheckboxGroup>
        </div>
    );
};

export default SizeDemo;
