/**
 * title = "基础用法"
 * description = "基础的标签展示，通过 `color` 属性设置不同颜色预设"
 */

import { css } from "@linaria/core";
import Tag from "../../src/index.js";

const BasicDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex-wrap: wrap;
            `}
        >
            <Tag>Default</Tag>
            <Tag color="primary">Primary</Tag>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="error">Error</Tag>
        </div>
    );
};

export default BasicDemo;
