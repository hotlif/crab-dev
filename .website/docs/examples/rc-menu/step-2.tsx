import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Menu, { MenuItemType } from "@crab-dev/rc-menu";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const items = [
    {
        key: "overview",
        title: "项目概览",
        type: MenuItemType.Item,
    },
    {
        key: "members",
        title: "成员管理",
        type: MenuItemType.Item,
    },
];
export default function Example() {
    const [selected, setSelected] = useState(["overview"]);
    return (
        <div className={layout}>
            <Menu
                items={items}
                mode="horizontal"
                selectedKeys={selected}
                onSelectItem={({ selectedKeys }) => setSelected(selectedKeys.map(String))}
            />
            <output>当前区域：{selected[0] === "members" ? "成员管理" : "项目概览"}</output>
        </div>
    );
}
