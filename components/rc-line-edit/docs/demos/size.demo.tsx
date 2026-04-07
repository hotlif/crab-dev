/**
 * title = "尺寸"
 * description = "通过 `size` 属性设置输入框尺寸"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import LineEdit from "../../src/index.js";

const SizeDemo = () => {
    const [size, setSize] = useState<"large" | "middle" | "small">("middle");

    return (
        <div
            className={css`
                padding: 1rem;
            `}
        >
            <div
                className={css`
					display: flex;
					align-items: flex-start;
					gap: 0.5rem;
					margin-bottom: 1rem;
				`}
            >
                <label>请选择大小</label>
                <select
                    value={size}
                    onChange={(e) =>
                        setSize(e.target.value as "large" | "middle" | "small")
                    }
                >
                    <option value="large">Large</option>
                    <option value="middle">Middle</option>
                    <option value="small">Small</option>
                </select>
            </div>
            <LineEdit size={size} placeholder="请输入内容" />
        </div>
    );
};

export default SizeDemo;
