export const meta = {
    title: "顺序排列",
    description: "设置 `sequential` 为 `true` 时，子项按 DOM 顺序从左到右依次排列，而非优先放入最短列",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import Masonry from "../../src/index.js";

const itemStyle = css`
    border-radius: 8px;
    padding: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const items = [
    { height: 100, color: "oklch(0.65 0.15 250)" },
    { height: 200, color: "oklch(0.55 0.2 300)" },
    { height: 120, color: "oklch(0.7 0.12 150)" },
    { height: 180, color: "oklch(0.6 0.18 30)" },
    { height: 90, color: "oklch(0.58 0.16 200)" },
    { height: 150, color: "oklch(0.68 0.14 100)" },
];

const SequentialDemo = () => {
    const [sequential, setSequential] = useState(false);

    return (
        <div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                `}
            >
                <label>顺序排列</label>
                <input
                    type="checkbox"
                    checked={sequential}
                    onChange={() => setSequential(!sequential)}
                />
            </div>
            <Masonry columns={3} gutter={12} sequential={sequential}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={itemStyle}
                        style={{ height: item.height, backgroundColor: item.color }}
                    >
                        {i + 1}
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default SequentialDemo;
