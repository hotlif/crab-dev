export const meta = {
    title: "自定义颜色与关闭图标",
    description: "支持自定义颜色字符串与 `closeIcon`",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Tag from "../../src/index.js";

const DotIcon = () => (
    <span
        className={css`
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: currentColor;
            display: inline-block;
        `}
    />
);

const CustomColorAndCloseIconDemo = () => {
    const [visible, setVisible] = useState(true);

    return (
        <div
            className={css`
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                align-items: center;
            `}
        >
            <Tag color="#1677ff">#1677ff</Tag>
            <Tag color="#722ed1">#722ed1</Tag>
            <Tag color="#eb2f96">#eb2f96</Tag>
            {visible ? (
                <Tag
                    color="#13c2c2"
                    closable
                    closeIcon={<DotIcon />}
                    onClose={() => setVisible(false)}
                >
                    Custom Close Icon
                </Tag>
            ) : (
                <Tag color="success">已关闭</Tag>
            )}
            <Tag closable closeIcon={false}>closeIcon=false</Tag>
        </div>
    );
};

export default CustomColorAndCloseIconDemo;
