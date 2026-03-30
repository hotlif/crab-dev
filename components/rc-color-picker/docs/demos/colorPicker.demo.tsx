/**
 * title = "颜色面板"
 * description = "选择颜色的面板演示。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import ColorPicker from "../../src/colorPicker/index.js";


const ColorPickerDemo = () => {
    const [value, setValue] = useState({
        lightness: 0.6,
        chroma: 0,
        hue: 0
    })

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                margin-bottom: 2rem;
            `}
            style={{ width: 250 }}
        >
            <ColorPicker value={value} onValueChange={setValue} />
        </div>
    )
}

export default ColorPickerDemo;