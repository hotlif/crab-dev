/**
 * title = "可选中标签"
 * description = "通过 `CheckableTag` 实现可选中/取消选中的标签"
 */

import { css } from "@linaria/core";
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
            <div
                className={css`
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                `}
            >
                {options.map(item => (
                    <CheckableTag
                        key={item}
                        checked={selected.includes(item)}
                        onChange={checked => toggle(item, checked)}
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
