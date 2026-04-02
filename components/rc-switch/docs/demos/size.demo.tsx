/**
 * title = "开关尺寸"
 * description = "通过 `size` 属性设置开关尺寸, 支持 `default` 和 `small` 两种"
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
                checked={checked}
                onChange={(val) => setChecked(val)}
            >
                Default
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
