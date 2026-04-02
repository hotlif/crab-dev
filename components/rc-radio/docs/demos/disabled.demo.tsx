/**
 * title = "禁用状态"
 * description = "添加 `disabled` 属性即可让单选框处于禁用状态"
 */

import Radio from "../../src/index.js";

const DisabledDemo = () => {
    return (
        <div>
            <Radio disabled>未选中禁用</Radio>
            <br />
            <br />
            <Radio disabled checked>选中禁用</Radio>
        </div>
    );
};

export default DisabledDemo;
