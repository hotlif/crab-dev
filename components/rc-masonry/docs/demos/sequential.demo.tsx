import Checkbox from "@crab-dev/rc-checkbox";
export const meta = {
    title: "顺序排列",
    description: "设置 `sequential` 为 `true` 时，子项按 DOM 顺序从左到右依次排列，而非优先放入最短列",
};

import { cx } from "@crab-dev/css";
import { itemStyle, heightStyles, controlStyle } from "../demo-style.js";
import { useState } from "react";
import Masonry from "../../src/index.js";

const items = [
    { height: 100 },
    { height: 200 },
    { height: 120 },
    { height: 180 },
    { height: 90 },
    { height: 150 },
];

const SequentialDemo = () => {

    const [sequential, setSequential] = useState(false);

    return (
        <div>
            <div className={controlStyle}>
                <Checkbox checked={sequential} onChange={setSequential}>顺序排列</Checkbox>
            </div>
            <Masonry columns={3} gutter={12} sequential={sequential}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}

                    >
                        {i + 1}
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default SequentialDemo;
