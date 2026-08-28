export const meta = {
    title: "基础用法",
    description: "通过文本缩写与语义变体展示头像。",
};

import { css } from "@crab-dev/css";
import Avatar from "../../src/index.js";

const listStyle = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const BasicDemo = () => {
    return (
        <div className={listStyle}>
            <Avatar>cd</Avatar>
            <Avatar variant="primary">op</Avatar>
            <Avatar variant="success">ok</Avatar>
            <Avatar variant="warning">wr</Avatar>
            <Avatar variant="error">er</Avatar>
        </div>
    );
};

export default BasicDemo;
