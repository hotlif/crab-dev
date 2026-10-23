export const meta = {
    title: "收起内嵌菜单",
    description: "通过 inlineCollapsed 控制菜单的收起与展开。收起时仅显示图标，悬停显示 Tooltip 或浮层子菜单。",
};

import { Key, useState } from "react";
import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import RcMenu, { MenuItemType } from "../../src/index.js";

const containerStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["stack-gap"]};
    align-items: flex-start;
`;

const menuShellStyle = css`
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
    padding: ${token.space["inline-gap"]};
    box-sizing: border-box;
    width: calc(${token.size["touch-target"]} * 5);
    max-width: 100%;
    transition: width ${token.motion.interaction};
    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const collapsedShellStyle = css`width: calc(${token.size["touch-target"]} + ${token.size.icon});`;

const Dot = () => (
    <span
        aria-hidden
        className={css`
            display: inline-block;
            width: ${token.size.icon};
            height: ${token.size.icon};
            border-radius: ${token.shape.full};
            background: currentColor;
        `}
    />
);

const CollapsedDemo = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectKeys, setSelectKeys] = useState<Key[]>([21]);
    const [openKeys, setOpenKeys] = useState<Key[]>([1]);

    return (
        <div className={containerStyle}>
            <Button
                onClick={() => setCollapsed((v) => !v)}
                aria-pressed={collapsed}
            >
                {collapsed ? "展开菜单" : "收起菜单"}
            </Button>

            <div
                className={cx(menuShellStyle, collapsed && collapsedShellStyle)}
            >
                <RcMenu
                    mode="vertical"
                    inlineCollapsed={collapsed}
                    selectedKeys={selectKeys}
                    onSelectItem={({ selectedKeys }) => setSelectKeys(selectedKeys)}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                    items={[
                        {
                            type: MenuItemType.Item,
                            key: 1,
                            title: "人员信息",
                            icon: <Dot />,
                            children: [
                                { type: MenuItemType.Item, key: 21, title: "用户调整" },
                                { type: MenuItemType.Item, key: 22, title: "用户删除" },
                            ],
                        },
                        {
                            type: MenuItemType.Item,
                            key: 11,
                            title: "系统管理",
                            icon: <Dot />,
                            children: [
                                { type: MenuItemType.Item, key: 12, title: "菜单维护" },
                                { type: MenuItemType.Item, key: 13, title: "数据字典维护" },
                            ],
                        },
                        {
                            type: MenuItemType.Item,
                            key: 30,
                            title: "工作台",
                            icon: <Dot />,
                        },
                        {
                            type: MenuItemType.Item,
                            key: 31,
                            title: "消息中心",
                            icon: <Dot />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default CollapsedDemo;
