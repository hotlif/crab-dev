
/**
 * title = "水平模式"
 * description = "通过 `mode` 属性设置为 `horizontal` 来使用水平菜单"
 */

import { Key, useState } from "react";
import RcMenu, { MenuItemType } from "../../src/index.js";

const HorizontalDemo = () => {
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [openKeys, setOpenKeys] = useState<Key[]>([]);

    return (
        <RcMenu
            mode="horizontal"
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
                    title: "首页",
                },
                {
                    type: MenuItemType.Item,
                    key: 2,
                    title: "用户管理",
                    children: [
                        {
                            type: MenuItemType.Item,
                            key: 21,
                            title: "用户列表",
                        },
                        {
                            type: MenuItemType.Item,
                            key: 22,
                            title: "角色管理",
                        },
                    ],
                },
                {
                    type: MenuItemType.Item,
                    key: 3,
                    title: "系统设置",
                    children: [
                        {
                            type: MenuItemType.Item,
                            key: 31,
                            title: "菜单维护",
                        },
                        {
                            type: MenuItemType.Item,
                            key: 32,
                            title: "数据字典",
                        },
                    ],
                },
            ]}
        />
    );
};

export default HorizontalDemo;
