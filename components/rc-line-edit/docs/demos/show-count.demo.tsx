export const meta = {
    title: "字符计数",
    description: "设置 `showCount` 后在输入框右侧实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，帮助用户掌握剩余可输入量",
};

import { css } from "@crab-dev/css";
import { useState } from "react";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 320px;
`;

const ShowCountDemo = () => {
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("前端开发者");

    return (
        <div className={wrapperStyle}>
            <LineEdit
                value={title}
                showCount
                onChange={(e) => setTitle(e.target.value)}
                placeholder="标题（仅显示字符数）"
            />
            <LineEdit
                value={bio}
                showCount
                maxLength={30}
                onChange={(e) => setBio(e.target.value)}
                placeholder="简介（30 字以内）"
            />
        </div>
    );
};

export default ShowCountDemo;
