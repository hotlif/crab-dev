export const meta = {
    title: "日期选择器",
    description: "日期字段与面板继承当前文档主题；选择日期、清除并检查标签与焦点。",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";

import DatePicker from '@crab-dev/rc-date-picker';


const SizeDemo = () => {
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(null);
    const [size, setSize] = useState<"large" | "medium" | "small">("medium")
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
                {(['small', 'medium', 'large'] as const).map(item => <Button key={item} appearance={size === item ? 'tonal' : 'outlined'} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</Button>)}
            </div>
            <DatePicker
                label="计划日期"
                supportingText="日期面板的选中项与今天标记分别呈现。"
                value={value}
                size={size}
                renderDisplayString={(value) => value?.toPlainDate().toString() ?? ""}
                onValueChange={setValue}
            />
        </div>
    )
}

export default SizeDemo;
