export const meta = {
    title: "可选中标签",
    description: "通过 `CheckableTag` 实现可选中/取消选中的标签",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { useState } from "react";
import Tag, { CheckableTag } from "../../src/index.js";

const options = ["Movies", "Books", "Music", "Sports"];

const CheckableDemo = () => {
    const [selected, setSelected] = useState<string[]>(["Movies"]);

    const toggle = (item: string, checked: boolean) => {
        setSelected(prev =>
            checked ? [...prev, item] : prev.filter(value => value !== item)
        );
    };

    return (
        <div>
            <p className={css`color: ${token.color.text.secondary}; font-size: ${token.typography.body['font-size']}; margin-block: 0 ${token.space['component-gap']};`}>选择内容类型，可同时选择多个选项：</p>
            <div
                role="toolbar"
                aria-label="内容类型筛选"
                className={css`
                    display: flex;
                    gap: ${token.space['component-gap']};
                    flex-wrap: wrap;
                    margin-bottom: ${token.space['section-gap']};
                `}
            >
                {options.map(item => (
                    <CheckableTag
                        key={item}
                        checked={selected.includes(item)}
                        onCheckedChange={checked => toggle(item, checked)}
                    >
                        {item}
                    </CheckableTag>
                ))}
            </div>
            <Tag color="primary">已选择：{selected.join(" / ") || "无"}</Tag>
        </div>
    );
};

export default CheckableDemo;
