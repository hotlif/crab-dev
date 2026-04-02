/**
 * title = "禁用状态"
 * description = "添加 `disabled` 属性即可让复选框处于禁用状态"
 */

import Checkbox from "../../src/index.js";

const DisabledDemo = () => {
    return (
        <div>
            <Checkbox disabled>未选中禁用</Checkbox>
            <br />
            <br />
            <Checkbox disabled checked>选中禁用</Checkbox>
        </div>
    );
};

export default DisabledDemo;
