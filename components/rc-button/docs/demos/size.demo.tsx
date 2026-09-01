export const meta = {
    title: "按钮尺寸",
    description: "通过 `size` 属性设置按钮尺寸",
};

import { css } from "@crab-dev/css";
import { useId, useState } from "react";
import Button from "../../src/index.js";

const SizeDemo = () => {
    const sizeSelectId = useId();
    const [size, setSize] = useState<"large" | "middle" | "small">("middle")

    return (
        <div
            className={css`
                margin-bottom: 1rem;
            `}
        >
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                `}
            >
                <label htmlFor={sizeSelectId}>
                    请选择大小
                </label>
                <select
                    id={sizeSelectId}
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
                    gap: 1rem;
                `}
            >
                <Button appearance="primary" size={size}>
                    primary
                </Button>
                <Button appearance="subtle" size={size}>
                    subtle
                </Button>
                <Button appearance="dashed" size={size}>
                    dashed
                </Button>
                <Button appearance="text" size={size}>
                    text
                </Button>
                <Button appearance="link" size={size}>
                    link
                </Button>
            </div>
        </div>
    )
}

export default SizeDemo;
