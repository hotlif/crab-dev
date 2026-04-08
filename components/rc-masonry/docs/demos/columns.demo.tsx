/**
 * title = "多列布局"
 * description = "通过 `columns` 属性控制列数"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import Masonry from "../../src/index.js";

const itemStyle = css`
    border-radius: 8px;
    padding: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
`;

const items = [
    { height: 100, color: "oklch(0.65 0.15 250)" },
    { height: 160, color: "oklch(0.55 0.2 300)" },
    { height: 120, color: "oklch(0.7 0.12 150)" },
    { height: 200, color: "oklch(0.6 0.18 30)" },
    { height: 80, color: "oklch(0.58 0.16 200)" },
    { height: 140, color: "oklch(0.68 0.14 100)" },
    { height: 180, color: "oklch(0.62 0.17 60)" },
    { height: 110, color: "oklch(0.72 0.11 330)" },
];

const ColumnsDemo = () => {
    const [columns, setColumns] = useState(3);

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
                <label>列数</label>
                <select
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value))}
                >
                    <option value={2}>2 列</option>
                    <option value={3}>3 列</option>
                    <option value={4}>4 列</option>
                    <option value={5}>5 列</option>
                </select>
            </div>
            <Masonry columns={columns} gutter={12}>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={itemStyle}
                        style={{ height: item.height, backgroundColor: item.color }}
                    >
                        Item {i + 1}
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default ColumnsDemo;
