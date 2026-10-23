export const meta = {
    title: "基础用法",
    description: "默认 2 列瀑布流布局，省略 gutter 时使用主题令牌间距。",
};

import { cx } from "@crab-dev/css";
import { itemStyle, heightStyles } from "../demo-style.js";
import Masonry from "../../src/index.js";

const items = [
    { height: 120 },
    { height: 180 },
    { height: 100 },
    { height: 200 },
    { height: 140 },
    { height: 160 },
];

const BasicDemo = () => {
    return (
        <Masonry columns={2}>
            {items.map((item, i) => (
                <div
                    key={i}
                    className={cx.call(undefined, itemStyle, heightStyles[item.height])}

                >
                    Item {i + 1} — {item.height}px
                </div>
            ))}
        </Masonry>
    );
};

export default BasicDemo;
