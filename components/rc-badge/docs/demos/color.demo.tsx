/**
 * title = "预设与自定义颜色"
 * description = "通过 `color` 指定预设语义色或任意 CSS 颜色字符串。"
 */

import { css } from "@linaria/core";
import Badge from "../../src/index.js";

const ColorDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            `}
        >
            <Badge count={1} color="default" />
            <Badge count={2} color="primary" />
            <Badge count={3} color="success" />
            <Badge count={4} color="warning" />
            <Badge count={5} color="error" />
            <Badge count={6} color="#ff6b00" />
            <Badge count={7} color="oklch(0.7 0.18 280)" />
        </div>
    );
};

export default ColorDemo;
