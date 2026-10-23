export const meta = {
    title: "日期选择器",
    description: "字段和日期面板随文档站主题切换，使用同一日期和尺寸对照 macOS、MD3 与 shadcn。",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";

import DatePicker from "../../src/datePicker/datePicker.js";
import { formatTemporal } from "../../src/util.js";


const SizeDemo = () => {
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(null);
    const [size, setSize] = useState<"large" | "middle" | "small">("middle")
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: ${token.space['group-gap']};
                margin-bottom: ${token.space['section-gap']};
            `}
        >
            <div role="group" aria-label="字段尺寸" className={css`display: flex; gap: ${token.space['inline-gap']};`}>
                {(['small', 'middle', 'large'] as const).map(item => <Button key={item} appearance={size === item ? 'tonal' : 'outlined'} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</Button>)}
            </div>
            <DatePicker
                label="计划日期"
                supportingText="日期面板的选中项与今天标记分别呈现。"
                value={value}
                size={size}
                renderDisplayString={(value) => formatTemporal(value, "yyyy-MM-dd")}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;
