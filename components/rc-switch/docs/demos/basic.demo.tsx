export const meta = {
    title: "基础用法",
    description: "最简单的 Switch 用法",
};

import { useState } from "react";
import Switch from "../../src/index.js";

const BasicDemo = () => {
    const [checked, setChecked] = useState(false);

    return (
        <Switch
            checked={checked}
            onChange={(val) => setChecked(val)}
        >
            开关
        </Switch>
    );
};

export default BasicDemo;
