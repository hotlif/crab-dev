export const meta = {
    title: "图标占位",
    description: "可通过 `icon` 自定义头像占位图标。",
};

import { css } from "@crab-dev/css";
import Avatar from "../../src/index.js";

const wrapStyle = css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const UserIcon = () => {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0H4Z" />
        </svg>
    );
};

const IconDemo = () => {
    return (
        <div className={wrapStyle}>
            <Avatar aria-label="icon avatar" icon={<UserIcon />} />
            <Avatar aria-label="square icon avatar" shape="square" icon={<UserIcon />} />
        </div>
    );
};

export default IconDemo;
