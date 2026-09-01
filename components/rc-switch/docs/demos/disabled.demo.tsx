export const meta = {
    title: "禁用状态",
    description: "添加 `disabled` 属性即可让开关处于禁用状态",
};

import Switch from "../../src/index.js";

const DisabledDemo = () => {
    return (
        <div>
            <Switch disabled aria-label="未选中禁用">未选中禁用</Switch>
            <br />
            <br />
            <Switch disabled defaultChecked>选中禁用</Switch>
        </div>
    );
};

export default DisabledDemo;
