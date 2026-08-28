export const meta = {
    title: "无边框",
    description: "设置 `bordered={false}` 可移除标签边框",
};

import { css } from "@crab-dev/css";
import Tag from "../../src/index.js";

const BorderedDemo = () => {
    return (
        <div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                `}
            >
                <Tag>Default</Tag>
                <Tag color="primary">Primary</Tag>
                <Tag color="success">Success</Tag>
                <Tag color="warning">Warning</Tag>
                <Tag color="error">Error</Tag>
            </div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                `}
            >
                <Tag bordered={false}>Default</Tag>
                <Tag bordered={false} color="primary">Primary</Tag>
                <Tag bordered={false} color="success">Success</Tag>
                <Tag bordered={false} color="warning">Warning</Tag>
                <Tag bordered={false} color="error">Error</Tag>
            </div>
        </div>
    );
};

export default BorderedDemo;
