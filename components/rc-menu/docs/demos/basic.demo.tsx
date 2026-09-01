
export const meta = {
    title: "基础用法",
    description: "基础的垂直菜单，支持展开/收起子菜单和选中菜单项",
};

import { Key, useState } from "react";
import { css } from "@crab-dev/css";
import RcMenu, { MenuItemType } from "../../src/index.js";

const BasicDemo = () => {
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [openKeys, setOpenKeys] = useState<Key[]>([1]);

    return (
        <div
            className={css`
                display: flex;
                gap: 1rem;
            `}
        >
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
                                type: MenuItemType.Item,
                                key: 21,
                                title: "用户调整",
                            },
                            {
                                type: MenuItemType.Item,
                                key: 22,
                                title: "用户删除",
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
                            },
                            {
                                type: MenuItemType.Item,
                                key: 13,
                                title: "数据字典维护",
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default BasicDemo;
