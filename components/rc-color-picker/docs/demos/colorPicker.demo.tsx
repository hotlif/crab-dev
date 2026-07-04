/**
 * title = "颜色选择器"
 * description = "可视化取色:透明度、文本输入、格式切换、预设色板、吸管取色、受控/非受控、尺寸与禁用。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import ColorPicker, { type ColorPreset, type OKLCHValue } from "../../src/index.js";

const rowStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
    > span:first-child {
        width: 12rem;
        font-size: 13px;
        color: #666;
    }
`;

const presets: ColorPreset[] = [
    {
        label: "品牌色",
        colors: [
            { lightness: 0.62, chroma: 0.19, hue: 255 },
            { lightness: 0.7, chroma: 0.16, hue: 145 },
            { lightness: 0.68, chroma: 0.2, hue: 25 },
        ],
    },
    {
        label: "中性色",
        colors: [
            { lightness: 0.2, chroma: 0, hue: 0 },
            { lightness: 0.5, chroma: 0, hue: 0 },
            { lightness: 0.85, chroma: 0, hue: 0 },
        ],
    },
];

const ColorPickerDemo = () => {
    const [value, setValue] = useState<OKLCHValue>({
        lightness: 0.62,
        chroma: 0.19,
        hue: 255,
        alpha: 1,
    });

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                margin-bottom: 2rem;
            `}
        >
            <label className={rowStyle}>
                <span>基础(透明度 / 输入 / 格式 / 吸管 / 预设 / 重置)</span>
                <ColorPicker value={value} onValueChange={setValue} allowClear presets={presets} />
            </label>

            <label className={rowStyle}>
                <span>非受控 + 尺寸(small / large)</span>
                <ColorPicker defaultValue={{ lightness: 0.7, chroma: 0.16, hue: 145 }} size="small" />
                <ColorPicker defaultValue={{ lightness: 0.68, chroma: 0.2, hue: 25 }} size="large" />
            </label>

            <label className={rowStyle}>
                <span>无透明度 + RGB 格式</span>
                <ColorPicker
                    defaultValue={{ lightness: 0.7, chroma: 0.1, hue: 200 }}
                    showAlpha={false}
                    format="rgb"
                />
            </label>

            <label className={rowStyle}>
                <span>禁用</span>
                <ColorPicker value={value} onValueChange={setValue} disabled />
            </label>
        </div>
    );
};

export default ColorPickerDemo;
