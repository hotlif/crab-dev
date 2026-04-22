/**
 * title = "图片与失败回退"
 * description = "当图片加载失败时，自动回退到文本内容。"
 */

import { css } from "@linaria/core";
import Avatar from "../../src/index.js";

const dataImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%231f2937'/%3E%3Ccircle cx='80' cy='62' r='28' fill='%23f8fafc'/%3E%3Cpath d='M28 144c9-28 32-44 52-44s43 16 52 44' fill='%23f8fafc'/%3E%3C/svg%3E";

const wrapStyle = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ImageDemo = () => {
    return (
        <div className={wrapStyle}>
            <Avatar src={dataImage} alt="avatar image" />
            <Avatar src="https://example.com/not-found.png" alt="fallback avatar">
                fb
            </Avatar>
        </div>
    );
};

export default ImageDemo;