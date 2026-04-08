/**
 * title = "基础用法"
 * description = "默认 2 列瀑布流布局"
 */

import { css } from "@linaria/core";
import Masonry from "../../src/index.js";

const itemStyle = css`
    border-radius: 8px;
    padding: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
`;

const items = [
    { height: 120, color: "oklch(0.65 0.15 250)" },
    { height: 180, color: "oklch(0.55 0.2 300)" },
    { height: 100, color: "oklch(0.7 0.12 150)" },
    { height: 200, color: "oklch(0.6 0.18 30)" },
    { height: 140, color: "oklch(0.58 0.16 200)" },
    { height: 160, color: "oklch(0.68 0.14 100)" },
];

const BasicDemo = () => {
    return (
        <Masonry columns={2} gutter={16}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={itemStyle}
                    style={{ height: item.height, backgroundColor: item.color }}
                >
                    Item {i + 1} — {item.height}px
                </div>
            ))}
        </Masonry>
    );
};

export default BasicDemo;
