/**
 * title = "基础用法"
 * description = "最简单的 Checkbox 用法"
 */

import { useState } from "react";
import Checkbox from "../../src/index.js";

const BasicDemo = () => {
    const [checked, setChecked] = useState(false);

    return (
        <Checkbox
            checked={checked}
            onChange={(val) => setChecked(val)}
        >
            Checkbox
        </Checkbox>
    );
};

export default BasicDemo;
