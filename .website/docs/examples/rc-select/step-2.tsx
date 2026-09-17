import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Select from "@crab-dev/rc-select";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const options = [
    {
        value: "hz",
        label: "杭州",
    },
    {
        value: "sh",
        label: "上海",
    },
    {
        value: "sg",
        label: "新加坡",
    },
];
export default function Example() {
    const [value, setValue] = useState<string>();
    return (
        <div className={layout}>
            <Select
                aria-label="工作城市"
                options={options}
                value={value}
                onChange={setValue}
                searchable
                allowClear
                placeholder="搜索城市"
            />
            <output>当前值：{value ?? "未选择"}</output>
        </div>
    );
}
