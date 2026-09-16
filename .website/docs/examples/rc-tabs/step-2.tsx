import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Tabs from "@crab-dev/rc-tabs";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-tabs/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const items = [
    {
        key: "overview",
        label: "概览",
        children: <p>项目运行正常。</p>,
    },
    {
        key: "activity",
        label: "活动",
        children: <p>林晓更新了文档。</p>,
    },
];
export default function Example() {
    const [active, setActive] = useState("overview");
    return (
        <div className={layout}>
            <Tabs items={items} activeKey={active} onChange={setActive} />
            <Button onClick={() => setActive("activity")}>查看活动</Button>
            <output>当前标签：{active}</output>
        </div>
    );
}
