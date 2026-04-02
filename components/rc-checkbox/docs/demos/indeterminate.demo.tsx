/**
 * title = "半选状态"
 * description = "使用 `indeterminate` 属性表示半选状态, 常用于全选/全不选场景"
 */

import { useState } from "react";
import Checkbox, { CheckboxGroup } from "../../src/index.js";

const options = ["苹果", "香蕉", "橘子"];

const IndeterminateDemo = () => {
    const [value, setValue] = useState<Array<string | number>>(["苹果"]);

    const allChecked = value.length === options.length;
    const indeterminate = value.length > 0 && !allChecked;

    const handleCheckAll = (checked: boolean) => {
        setValue(checked ? [...options] : []);
    };

    return (
        <div>
            <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
            >
                全选
            </Checkbox>
            <br />
            <br />
            <CheckboxGroup value={value} onChange={setValue}>
                {options.map((opt) => (
                    <Checkbox key={opt} value={opt}>
                        {opt}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </div>
    );
};

export default IndeterminateDemo;
