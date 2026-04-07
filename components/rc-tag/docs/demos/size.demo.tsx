/**
 * title = "标签尺寸"
 * description = "通过 `size` 属性设置标签尺寸"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import Tag from "../../src/index.js";

const SizeDemo = () => {
    const [size, setSize] = useState<"large" | "middle" | "small">("middle");

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
                <label>请选择大小</label>
                <select
                    value={size}
                    onChange={e => setSize(e.target.value as "large" | "middle" | "small")}
                >
                    <option value="large">Large</option>
                    <option value="middle">Middle</option>
                    <option value="small">Small</option>
                </select>
            </div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                `}
            >
                <Tag size={size}>Default</Tag>
                <Tag size={size} color="primary">Primary</Tag>
                <Tag size={size} color="success">Success</Tag>
                <Tag size={size} color="warning">Warning</Tag>
                <Tag size={size} color="error">Error</Tag>
            </div>
        </div>
    );
};

export default SizeDemo;
