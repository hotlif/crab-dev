export const meta = {
    title: "可清除",
    description: "设置 `allowClear` 后，输入框有内容时右侧显示清除按钮；配合受控 `value` 和 `onClear` 回调使用，`disabled` 或 `readOnly` 时清除按钮自动隐藏",
};

import { css } from "@crab-dev/css";
import { Search } from "lucide-react";
import { useState } from "react";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 300px;
`;

const AllowClearDemo = () => {
    const [keyword, setKeyword] = useState("React 设计心理学");
    const [note, setNote] = useState("");

    return (
        <div className={wrapperStyle}>
            <LineEdit
                value={keyword}
                allowClear
                prefix={<Search />}
                onClear={() => setKeyword("")}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索"
            />
            <LineEdit
                value={note}
                allowClear
                onClear={() => setNote("")}
                onChange={(e) => setNote(e.target.value)}
                placeholder="备注（输入后可清除）"
            />
            <LineEdit
                value="禁用状态不显示清除按钮"
                allowClear
                disabled
                placeholder=""
            />
        </div>
    );
};

export default AllowClearDemo;
