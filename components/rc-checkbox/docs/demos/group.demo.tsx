/**
 * title = "复选框组"
 * description = "使用 `CheckboxGroup` 管理一组复选框的状态"
 */

import { useState } from "react";
import Checkbox, { CheckboxGroup } from "../../src/index.js";

const GroupDemo = () => {
    const [value, setValue] = useState<Array<string | number>>(["apple"]);

    return (
        <div>
            <CheckboxGroup value={value} onChange={setValue}>
                <Checkbox value="apple">苹果</Checkbox>
                <Checkbox value="banana">香蕉</Checkbox>
                <Checkbox value="orange">橘子</Checkbox>
            </CheckboxGroup>
            <p>当前选中: {value.join(", ")}</p>
        </div>
    );
};

export default GroupDemo;
