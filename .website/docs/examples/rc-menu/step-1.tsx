import Menu, { MenuItemType } from "@crab-dev/rc-menu";
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
    return <Menu items={items} mode="horizontal" />;
}
