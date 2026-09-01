export const meta = {
    title: "基础用法",
    description: "最简单的 Radio 用法",
};

import { useState } from "react";
import Radio from "../../src/index.js";

const BasicDemo = () => {
    const [checked, setChecked] = useState(false);

    return (
        <Radio
            checked={checked}
            onChange={(val) => setChecked(val)}
        >
            Radio
        </Radio>
    );
};

export default BasicDemo;
