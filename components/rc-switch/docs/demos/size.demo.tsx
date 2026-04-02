/**
 * title = "开关尺寸"
 * description = "通过 `size` 属性设置开关尺寸, 支持 `large`、`middle`、`small` 三种"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import Switch from "../../src/index.js";

const SizeDemo = () => {
    const [checked, setChecked] = useState(false);

    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
            `}
        >
            <Switch
                size="large"
                checked={checked}
                onChange={(val) => setChecked(val)}
            >
                Large
            </Switch>
            <Switch
                size="middle"
                checked={checked}
                onChange={(val) => setChecked(val)}
            >
                Middle
            </Switch>
            <Switch
                size="small"
                checked={checked}
                onChange={(val) => setChecked(val)}
            >
                Small
            </Switch>
        </div>
    );
};

export default SizeDemo;
