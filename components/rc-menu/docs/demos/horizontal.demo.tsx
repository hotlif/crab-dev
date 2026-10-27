
export const meta = {
    title: "水平模式",
    description: "水平菜单支持图标与子菜单分组；切换方向后，图标间距与分组缩进跟随文字起点。",
};

import { Key, useState } from "react";
import RcMenu, { MenuItemType } from "../../src/index.js";

const NavigationIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
);

const HorizontalDemo = () => {
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [openKeys, setOpenKeys] = useState<Key[]>([]);

    return (
        <RcMenu
            mode="horizontal"
            selectedKeys={selectKeys}
            onSelectedKeysChange={(selectedKeys) => {
                setSelectKeys(selectedKeys);
            }}
            openKeys={openKeys}
            onOpenKeysChange={setOpenKeys}
            items={[
                {
                    type: MenuItemType.Item,
                    key: 1,
                    title: "首页",
                    icon: <NavigationIcon />,
                },
                {
                    type: MenuItemType.Item,
                    key: 2,
                    title: "用户管理",
                    icon: <NavigationIcon />,
                    children: [
                        {
                            type: MenuItemType.ItemGroup,
                            key: 'accounts',
                            title: "账户管理",
                            icon: <NavigationIcon />,
                            children: [
                                { type: MenuItemType.Item, key: 21, title: "用户列表", icon: <NavigationIcon /> },
                                { type: MenuItemType.Item, key: 22, title: "角色管理", icon: <NavigationIcon /> },
                            ],
                        },
                    ],
                },
                {
                    type: MenuItemType.Item,
                    key: 3,
                    title: "系统设置",
                    icon: <NavigationIcon />,
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
