/**
 * label="基础用法"
 * description="点击侧边栏菜单打开标签页，顶部展示路径面包屑"
 */
import { css } from "@linaria/core";
import { useCallback } from "react";
import AppMainLayout, {
    type TabItem,
    AppMainLayoutProvider,
    useAppMainLayoutTabs,
} from "../../src/index.js";
import { MenuItemType, type MenuItem } from "@crab-dev/rc-menu";
import type { BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";

const pageStyle = css`padding: 24px;`;

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
);

const RoleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const DictIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const Dashboard = () => {
    const { activeTabKey, getReloadVersion } = useAppMainLayoutTabs();
    return (
        <div className={pageStyle}>
            <h2>控制台</h2>
            <p>当前激活 key：{String(activeTabKey)}</p>
            <p>当前标签重载次数：{activeTabKey ? getReloadVersion(activeTabKey) : 0}</p>
            <p>点击左侧菜单可打开对应页面，顶部将展示路径。</p>
        </div>
    );
};

const initialTabs: TabItem[] = [
    {
        key: "dashboard",
        title: "控制台",
        icon: <DashboardIcon />,
        closable: false,
        breadcrumbs: [{ key: "dashboard", title: "控制台" }],
        children: <Dashboard />,
    },
];

const menus: MenuItem[] = [
    {
        type: MenuItemType.Item,
        key: "user",
        title: "人员信息",
        icon: <UserIcon />,
        children: [
            {
                type: MenuItemType.ItemGroup,
                key: "user-manage",
                title: "用户管理",
                icon: <UserIcon />,
                children: [
                    { type: MenuItemType.Item, key: "user-edit", title: "用户调整", icon: <EditIcon /> },
                    { type: MenuItemType.Item, key: "user-delete", title: "用户删除", icon: <TrashIcon /> },
                ],
            },
            {
                type: MenuItemType.ItemGroup,
                key: "role-manage",
                title: "角色管理",
                icon: <RoleIcon />,
                children: [
                    { type: MenuItemType.Item, key: "role-user", title: "人员角色", icon: <UserIcon /> },
                    { type: MenuItemType.Item, key: "role-system", title: "系统角色", icon: <RoleIcon /> },
                ],
            },
        ],
    },
    {
        type: MenuItemType.Item,
        key: "system",
        title: "系统管理",
        icon: <SettingsIcon />,
        children: [
            { type: MenuItemType.Item, key: "menu-maintain", title: "菜单维护", icon: <MenuIcon /> },
            { type: MenuItemType.Item, key: "dict-maintain", title: "数据字典维护", icon: <DictIcon /> },
        ],
    },
];

const isLeafMenu = (item: MenuItem) => item.type === MenuItemType.Item && !item.children?.length;

const toBreadcrumbs = (path: MenuItem[]): BreadcrumbsItem[] => path.map((m) => ({ key: String(m.key), title: m.title ?? "" }));

const sleep = (ms: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
});

const SimpleFrame = () => {
    const TabsBridge = () => {
        const { openTab } = useAppMainLayoutTabs();
        const loadHeaderUser = useCallback(async () => {
            await sleep(1200);
            return {
                name: "Admin",
                avatar: "A",
                roleName: "系统管理员",
            };
        }, []);
        const loadSidebarMenus = useCallback(async () => {
            await sleep(900);
            return menus;
        }, []);
        const handleSwitchRole = useCallback(() => {
            // 示例：业务可在此打开角色选择弹窗或跳转角色页
            console.info("[rc-app-main-layout demo] switch role");
        }, []);
        const handleLogout = useCallback(() => {
            // 示例：业务可在此清理登录态并跳转登录页
            console.info("[rc-app-main-layout demo] logout");
        }, []);

        return (
            <AppMainLayout
                className={css`body { margin: 0; }`}
                sidebarLogo={<ShieldIcon />}
                sidebarTitle="Crab Frame"
                headerLoadUser={loadHeaderUser}
                hasNotification
                onSwitchRole={handleSwitchRole}
                onLogout={handleLogout}
                sidebarLoadMenus={loadSidebarMenus}
                onSidebarMenuItemClick={({ item, path }) => {
                    if (!isLeafMenu(item)) return;
                    openTab({
                        key: item.key,
                        title: item.title ?? "",
                        icon: item.icon,
                        breadcrumbs: toBreadcrumbs(path),
                        children: (
                            <div className={pageStyle}>
                                <h2>{item.title}</h2>
                                <p>页面 key：{String(item.key)}</p>
                                <input />
                            </div>
                        ),
                    });
                }}
            />
        );
    };

    return (
        <AppMainLayoutProvider initialTabs={initialTabs} initialActiveTabKey="dashboard">
            <TabsBridge />
        </AppMainLayoutProvider>
    );
};

export default SimpleFrame;
