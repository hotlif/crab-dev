/**
 * title = "分组菜单"
 * description = "使用 `ItemGroup` 类型对菜单项进行分组"
 */

import { Key, useState } from "react";
import RcMenu, { MenuItemType } from "@crab-dev/rc-menu";

const GroupDemo = () => {
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [openKeys, setOpenKeys] = useState<Key[]>([1, 11]);

    return (
        <RcMenu
            style={{ width: 250 }}
            mode="vertical"
            selectedKeys={selectKeys}
            onSelectItem={({ selectedKeys }) => {
                setSelectKeys(selectedKeys);
            }}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            items={[
                {
                    type: MenuItemType.Item,
                    key: 1,
                    title: "人员信息",
                    children: [
                        {
                            type: MenuItemType.ItemGroup,
                            key: 2,
                            title: "用户管理",
                            children: [
                                { type: MenuItemType.Item, key: 21, title: "用户调整" },
                                { type: MenuItemType.Item, key: 22, title: "用户删除" },
                            ],
                        },
                        {
                            type: MenuItemType.ItemGroup,
                            key: 3,
                            title: "角色管理",
                            children: [
                                { type: MenuItemType.Item, key: 31, title: "人员角色" },
                                { type: MenuItemType.Item, key: 32, title: "系统角色" },
                            ],
                        },
                    ],
                },
                {
                    type: MenuItemType.Item,
                    key: 11,
                    title: "系统管理",
                    children: [
                        {
                            type: MenuItemType.Item,
                            key: 12,
                            title: "菜单维护",
                            children: [
                                { type: MenuItemType.Item, key: 121, title: "菜单新增" },
                                { type: MenuItemType.Item, key: 122, title: "菜单编辑" },
                                { type: MenuItemType.Item, key: 123, title: "菜单删除" },
                            ],
                        },
                        { type: MenuItemType.Item, key: 13, title: "数据字典维护" },
                    ],
                },
            ]}
        />
    );
};

export default GroupDemo;
