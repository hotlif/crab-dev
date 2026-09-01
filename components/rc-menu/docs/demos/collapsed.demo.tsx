export const meta = {
    title: "收起内嵌菜单",
    description: "通过 inlineCollapsed 控制菜单的收起与展开。收起时仅显示图标，悬停显示 Tooltip 或浮层子菜单。",
};

import { Key, useState } from "react";
import { css } from "@crab-dev/css";
import RcMenu, { MenuItemType } from "../../src/index.js";

const containerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
`;

const toggleStyle = css`
    appearance: none;
    border: 1px solid oklch(0.88 0.01 260);
    background: oklch(0.98 0 0);
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 120ms cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        background: oklch(0.94 0 0);
    }

    &:focus-visible {
        outline: 2px solid oklch(0.68 0.14 265);
        outline-offset: 2px;
    }
`;

const menuShellStyle = css`
    border: 1px solid oklch(0.9 0.005 260);
    border-radius: 0.5rem;
    background: oklch(1 0 0);
    padding: 0.25rem;
    box-sizing: border-box;
`;

const Dot = ({ color }: { color: string }) => (
    <span
        aria-hidden
        className={css`
            display: inline-block;
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
        `}
        style={{ background: color }}
    />
);

const CollapsedDemo = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectKeys, setSelectKeys] = useState<Key[]>([21]);
    const [openKeys, setOpenKeys] = useState<Key[]>([1]);

    return (
        <div className={containerStyle}>
            <button
                type="button"
                className={toggleStyle}
                onClick={() => setCollapsed((v) => !v)}
                aria-pressed={collapsed}
            >
                {collapsed ? "展开菜单" : "收起菜单"}
            </button>

            <div
                className={menuShellStyle}
                style={{ width: collapsed ? 64 : 240, transition: "width 240ms cubic-bezier(0.4, 0, 0.2, 1)" }}
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
                            icon: <Dot color="oklch(0.72 0.15 265)" />,
                            children: [
                                { type: MenuItemType.Item, key: 21, title: "用户调整" },
                                { type: MenuItemType.Item, key: 22, title: "用户删除" },
                            ],
                        },
                        {
                            type: MenuItemType.Item,
                            key: 11,
                            title: "系统管理",
                            icon: <Dot color="oklch(0.72 0.15 150)" />,
                            children: [
                                { type: MenuItemType.Item, key: 12, title: "菜单维护" },
                                { type: MenuItemType.Item, key: 13, title: "数据字典维护" },
                            ],
                        },
                        {
                            type: MenuItemType.Item,
                            key: 30,
                            title: "工作台",
                            icon: <Dot color="oklch(0.72 0.14 60)" />,
                        },
                        {
                            type: MenuItemType.Item,
                            key: 31,
                            title: "消息中心",
                            icon: <Dot color="oklch(0.68 0.16 15)" />,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default CollapsedDemo;
