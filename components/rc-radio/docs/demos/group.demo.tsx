/**
 * title = "单选框组"
 * description = "使用 `RadioGroup` 管理一组单选框的状态, 实现互斥选择"
 */

import { useState } from "react";
import Radio, { RadioGroup } from "../../src/index.js";

const GroupDemo = () => {
    const [value, setValue] = useState<string | number>("apple");

    return (
        <div>
            <RadioGroup value={value} onChange={setValue}>
                <Radio value="apple">苹果</Radio>
                <Radio value="banana">香蕉</Radio>
                <Radio value="orange">橘子</Radio>
            </RadioGroup>
            <p>当前选中: {value}</p>
        </div>
    );
};

export default GroupDemo;
