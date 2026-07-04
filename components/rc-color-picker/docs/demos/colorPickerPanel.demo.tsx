/**
 * title = "颜色面板"
 * description = "内嵌式颜色面板:亮度 / 色度 / 色相 / 透明度 + 文本输入 + 预设色板。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import { ColorPickerPanel, type OKLCHValue } from "../../src/index.js";

const presets: OKLCHValue[] = [
    { lightness: 0.5, chroma: 0.2, hue: 0 },
    { lightness: 0.7, chroma: 0.18, hue: 145 },
    { lightness: 0.62, chroma: 0.19, hue: 255 },
    { lightness: 0.8, chroma: 0.15, hue: 90 },
];

const ColorPickerPanelDemo = () => {
    const [value, setValue] = useState<OKLCHValue>({
        lightness: 0.6,
        chroma: 0.12,
        hue: 200,
        alpha: 0.8,
    });

    return (
        <div
            className={css`
                width: 280px;
                margin-bottom: 2rem;
            `}
        >
            <ColorPickerPanel value={value} onValueChange={setValue} presets={presets} />
        </div>
    );
};

export default ColorPickerPanelDemo;
