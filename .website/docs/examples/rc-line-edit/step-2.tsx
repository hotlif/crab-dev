import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "@crab-dev/rc-line-edit";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const field = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    width: 100%;
    max-width: 20rem;
    font-size: ${token.font.size.body};
    font-weight: ${token.font.weight.label};
`;
export default function Example() {
    const [value, setValue] = useState("组件文档改版");
    return (
        <div className={layout}>
            <label className={field}>
                项目名称（最多 30 字）
                <LineEdit
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    maxLength={30}
                    showCount
                    allowClear
                    onClear={() => setValue("")}
                />
            </label>
            <output>当前内容：{value || "空"}</output>
        </div>
    );
}
