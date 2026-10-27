import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen, act, waitFor } from "@crab-dev/wake/test/react";
import type { Key } from 'react';
import AppMainLayoutProvider from "../context.js";
import useAppMainLayoutTabs, { type UseAppMainLayoutTabsResult } from "../useTabs.js";
import type { HeaderUserEntity, TabItem } from "../types.js";
import type { MenuItem } from "@crab-dev/rc-menu";
import ConfigProvider, { localeMessages } from '@crab-dev/rc-config-provider';

mock.module('@floating-ui/react', async () => {
    const floating = await mock.actual<typeof import('@floating-ui/react')>('@floating-ui/react');
    return {
        ...floating,
        // The DOM runner has no layout engine. Preserve the real menu events and
        // replace only positioning; alignment and viewport edges are checked in-browser.
        useFloating: () => ({
            refs: { setReference: mock.fn(), setFloating: mock.fn() },
            floatingStyles: {},
        }),
    };
});

let Layout: (typeof import("../layout.js"))["default"];
let MenuItemType: (typeof import("@crab-dev/rc-menu"))["MenuItemType"];
beforeAll(async () => {
    const menuModule = await mock.import<typeof import("@crab-dev/rc-menu")>("@crab-dev/rc-menu");
    const layoutModule = await mock.import<typeof import("../layout.js")>("../layout.js");
    MenuItemType = menuModule.MenuItemType;
    Layout = layoutModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const Probe = ({ onReady }: {
    onReady: (r: UseAppMainLayoutTabsResult) => void;
}) => {
    onReady(useAppMainLayoutTabs());
    return null;
};

function navigationItems(): MenuItem[] {
    return [
        { key: 'users', type: MenuItemType.Item, title: 'Users navigation' },
        { key: 'reports', type: MenuItemType.Item, title: 'Reports navigation' },
        { key: 0, type: MenuItemType.Item, title: 'Zero navigation' },
    ];
}

function createNavigationLoader() {
    const pending = Promise.withResolvers<MenuItem[]>();
    return {
        loadMenus: mock.fn(() => pending.promise),
        complete: async () => {
            // Resolve the actual SidebarBody request inside React's test boundary.
            // A resolved Promise returned during render can otherwise settle after
            // render's act scope has closed, before findBy starts observing it.
            await act(async () => {
                pending.resolve(navigationItems());
                await pending.promise;
            });
        },
    };
}

describe('Layout sidebar selection ownership', () => {
    it('tracks tab activation, close and close-all without replaying a menu click', async () => {
        const { loadMenus, complete } = createNavigationLoader();
        const onMenuClick = mock.fn();
        let api: UseAppMainLayoutTabsResult | undefined;
        function Bridge() {
            const tabs = useAppMainLayoutTabs();
            return <Layout sidebarLoadMenus={loadMenus} onSidebarMenuItemClick={(param) => {
                onMenuClick(param);
                tabs.openTab({ key: param.item.key, title: String(param.item.key), children: String(param.item.key) });
            }} />;
        }
        await render(<AppMainLayoutProvider initialTabs={[{ key: 'dashboard', title: 'Dashboard', closable: false }]}>
            <Bridge /><Probe onReady={(value) => { api = value; }} />
        </AppMainLayoutProvider>);
        await complete();
        const users = await screen.findByText('Users navigation');
        const reports = screen.getByText('Reports navigation');
        const current = () => [...document.querySelectorAll('aside [data-menu-item][aria-current]')].map((item) => item.textContent);
        expect(current()).toEqual([]);
        await fireEvent.click(users);
        expect(current()).toEqual(['Users navigation']);
        await fireEvent.click(reports);
        expect(current()).toEqual(['Reports navigation']);
        expect(onMenuClick).toHaveBeenCalledTimes(2);
        await fireEvent.click(screen.getByRole('tab', { name: 'users' }));
        expect(current()).toEqual(['Users navigation']);
        await act(() => { api!.closeTab('users'); });
        expect(current()).toEqual(['Reports navigation']);
        await act(() => { api!.closeAllTabs(); });
        expect(current()).toEqual([]);
        expect(screen.getByRole('tab', { name: 'Dashboard' }).getAttribute('aria-selected')).toBe('true');
        expect(onMenuClick).toHaveBeenCalledTimes(2);
    });

    it('does not claim navigation succeeded before the business callback activates its page', async () => {
        const { loadMenus, complete } = createNavigationLoader();
        const onMenuClick = mock.fn();
        let api: UseAppMainLayoutTabsResult | undefined;
        await render(<AppMainLayoutProvider initialTabs={[{ key: 'users', title: 'Users' }]}>
            <Layout sidebarLoadMenus={loadMenus} onSidebarMenuItemClick={onMenuClick} />
            <Probe onReady={(value) => { api = value; }} />
        </AppMainLayoutProvider>);
        await complete();
        const users = await screen.findByText('Users navigation');
        const reports = screen.getByText('Reports navigation');
        await fireEvent.click(reports);
        expect(onMenuClick).toHaveBeenCalledTimes(1);
        expect(users.closest('[data-menu-item]')?.getAttribute('aria-current')).toBe('page');
        expect(reports.closest('[data-menu-item]')?.hasAttribute('aria-current')).toBe(false);
        // A denied navigation may remain here indefinitely. A later successful
        // business action updates the tab state, without another synthetic click.
        await act(() => { api!.openTab({ key: 'reports', title: 'Reports' }); });
        expect(reports.closest('[data-menu-item]')?.getAttribute('aria-current')).toBe('page');
        expect(users.closest('[data-menu-item]')?.hasAttribute('aria-current')).toBe(false);
        expect(onMenuClick).toHaveBeenCalledTimes(1);
    });

    it('supports explicit business mapping, empty selection and Key 0 without inferring breadcrumbs', async () => {
        const { loadMenus, complete } = createNavigationLoader();
        const onMenuClick = mock.fn();
        let api: UseAppMainLayoutTabsResult | undefined;
        const initialTabs: TabItem[] = [{ key: 'route:/users/42', title: 'User details', breadcrumbs: [{ key: 'users', title: 'Users' }] }];
        const content = (keys: Key[] | undefined) => <AppMainLayoutProvider initialTabs={initialTabs}>
            <Layout sidebarLoadMenus={loadMenus} sidebarSelectedKeys={keys} onSidebarMenuItemClick={onMenuClick} />
            <Probe onReady={(value) => { api = value; }} />
        </AppMainLayoutProvider>;
        const view = await render(content(undefined));
        await complete();
        await screen.findByText('Users navigation');
        const current = () => [...document.querySelectorAll('aside [data-menu-item][aria-current]')].map((item) => item.textContent);
        expect(current()).toEqual([]);
        await view.rerender(content(['users']));
        expect(current()).toEqual(['Users navigation']);
        await view.rerender(content([]));
        expect(current()).toEqual([]);
        await view.rerender(content(undefined));
        expect(current()).toEqual([]);
        await act(() => { api!.openTab({ key: 0, title: 'Zero' }); });
        expect(current()).toEqual(['Zero navigation']);
        expect(onMenuClick).toHaveBeenCalledTimes(0);
    });

    it('passes the same controlled selection into the mobile Drawer branch', async () => {
        // DOM tests establish responsive branch state only, not viewport layout.
        // Published-browser and native narrow-viewport review cover real geometry.
        const descriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: (media: string): MediaQueryList => ({
            media, matches: media === '(max-width: 767px)', onchange: null,
            addListener: () => undefined, removeListener: () => undefined,
            addEventListener: () => undefined, removeEventListener: () => undefined, dispatchEvent: () => true,
        }) });
        const { loadMenus, complete } = createNavigationLoader();
        const onMenuClick = mock.fn();
        let api: UseAppMainLayoutTabsResult | undefined;
        const content = (keys?: Key[]) => <AppMainLayoutProvider initialTabs={[{ key: 'users', title: 'Users' }, { key: 'reports', title: 'Reports' }]}>
            <Layout sidebarLoadMenus={loadMenus} sidebarSelectedKeys={keys} onSidebarMenuItemClick={onMenuClick} />
            <Probe onReady={(value) => { api = value; }} />
        </AppMainLayoutProvider>;
        const view = await render(content());
        try {
            expect(document.querySelector('aside')).toBeNull();
            await fireEvent.click(screen.getByRole('button', { name: '切换侧边栏' }));
            await complete();
            const users = await screen.findByText('Users navigation');
            const reports = screen.getByText('Reports navigation');
            expect(users.closest('[data-menu-item]')?.getAttribute('aria-current')).toBe('page');
            await act(() => { api!.activateTab('reports'); });
            await waitFor(() => expect(reports.closest('[data-menu-item]')?.getAttribute('aria-current')).toBe('page'));
            expect(users.closest('[data-menu-item]')?.hasAttribute('aria-current')).toBe(false);
            await view.rerender(content([]));
            expect(document.querySelector('[data-menu-item][aria-current]')).toBeNull();
            await view.rerender(content(['users']));
            expect(users.closest('[data-menu-item]')?.getAttribute('aria-current')).toBe('page');
            expect(onMenuClick).toHaveBeenCalledTimes(0);
        } finally {
            await view.unmount();
            restoreDescriptor(window, 'matchMedia', descriptor);
        }
    });
});
function restoreDescriptor(target: object, key: string, descriptor?: PropertyDescriptor): void {
    if (descriptor) {
        Object.defineProperty(target, key, descriptor);
        return;
    }
    delete (target as Record<string, unknown>)[key];
}
describe("Layout", () => {
    it('updates built-in toolbar names when locale changes without altering business tabs', async () => {
        const tabs: TabItem[] = [{ key: 'orders', title: 'Orders', children: <p>Business content</p> }];
        const view = await render(<ConfigProvider locale="en-US"><AppMainLayoutProvider initialTabs={tabs}><Layout /></AppMainLayoutProvider></ConfigProvider>);
        expect(screen.getByRole('button', { name: localeMessages['en-US'].appLayout.toggleSidebar })).toBeTruthy();
        expect(screen.getByRole('button', { name: localeMessages['en-US'].appLayout.notifications })).toBeTruthy();
        await view.rerender(<ConfigProvider locale="zh-CN"><AppMainLayoutProvider initialTabs={tabs}><Layout /></AppMainLayoutProvider></ConfigProvider>);
        expect(screen.getByRole('button', { name: localeMessages['zh-CN'].appLayout.toggleSidebar })).toBeTruthy();
        expect(screen.getByRole('tab', { name: 'Orders' })).toBeTruthy();
    });
    it("connects named panels to unique tabs and restores focus when all tabs close", async () => {
        const tabs: TabItem[] = [{ key: "home", title: "概览", children: <p>内容</p> }];
        await render(<>
            <AppMainLayoutProvider initialTabs={tabs}><Layout /></AppMainLayoutProvider>
            <AppMainLayoutProvider initialTabs={tabs}><Layout /></AppMainLayoutProvider>
        </>);
        const buttons = screen.getAllByRole('tab', { name: '概览' });
        const panels = screen.getAllByRole('tabpanel', { name: '概览' });
        expect(buttons[0].id).not.toBe(buttons[1].id);
        buttons.forEach((button, index) => {
            expect(button.getAttribute('aria-controls')).toBe(panels[index].id);
            expect(panels[index].getAttribute('aria-labelledby')).toBe(button.id);
        });
        const menu = screen.getAllByRole('button', { name: '切换侧边栏' })[0];
        await fireEvent.click(screen.getAllByRole('button', { name: '关闭标签页' })[0]);
        expect(document.activeElement).toBe(menu);
        expect(screen.getAllByRole('tab').length).toBe(1);
        const remainingMenu = screen.getAllByRole('button', { name: '切换侧边栏' })[1];
        await fireEvent.keyDown(screen.getByRole('tab'), { key: 'F10', shiftKey: true });
        await fireEvent.click(screen.getByRole('menuitem', { name: '关闭全部页面' }));
        expect(screen.queryByRole('tab')).toBeNull();
        expect(document.activeElement).toBe(remainingMenu);
    });
    it("keeps the default main and uses a named region when embedded", async () => {
        const tabs: TabItem[] = [{ key: "dashboard", title: "控制台", children: <p>示例内容</p> }];
        const view = await render(<AppMainLayoutProvider initialTabs={tabs}><Layout /></AppMainLayoutProvider>);
        expect(screen.getByRole("main").tagName).toBe("MAIN");
        await view.rerender(<AppMainLayoutProvider initialTabs={tabs}>
            <Layout contentLandmark={{ role: "region", "aria-label": "后台工作区示例" }} />
        </AppMainLayoutProvider>);
        expect(screen.queryByRole("main")).toBeNull();
        expect(screen.getByRole("region", { name: "后台工作区示例" }).tagName).toBe("SECTION");
        expect(screen.getByText("示例内容")).toBeTruthy();
    });
    it("renders active tab content and keeps inactive panes mounted but hidden", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
            <Layout />
        </AppMainLayoutProvider>);
        const active = screen.getByText("users-content");
        const inactive = screen.getByText("dashboard-content");
        expect(active).toBeTruthy();
        expect(inactive).toBeTruthy();
        expect(active.closest("[role=tabpanel]")?.getAttribute("aria-hidden")).toBe("false");
        expect(inactive.closest("[role=tabpanel]")?.getAttribute("aria-hidden")).toBe("true");
    });
    it("destroys tab content when the tab is closed", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];
        let api: UseAppMainLayoutTabsResult | null = null;
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
            <Layout />
            <Probe onReady={(r) => { api = r; }}/>
        </AppMainLayoutProvider>);
        expect(screen.queryByText("users-content")).toBeTruthy();
        await act(() => { api!.closeTab("users"); });
        expect(screen.queryByText("users-content")).toBeNull();
        expect(screen.queryByText("dashboard-content")).toBeTruthy();
    });
    it("defaults to the first tab when no active key is provided", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];
        await render(<AppMainLayoutProvider initialTabs={tabs}>
            <Layout />
        </AppMainLayoutProvider>);
        const active = screen.getByText("dashboard-content").closest("[role=tabpanel]");
        expect(active?.getAttribute("aria-hidden")).toBe("false");
    });
    it("reloads tab content from context menu", async () => {
        let mountCount = 0;
        const UsersContent = () => {
            mountCount += 1;
            return <div>{`users-content-v${mountCount}`}</div>;
        };
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <UsersContent /> },
        ];
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
            <Layout />
        </AppMainLayoutProvider>);
        expect(screen.getByText("users-content-v1")).toBeTruthy();
        await fireEvent(screen.getByRole("tab", { name: "用户管理" }), new MouseEvent("contextmenu", { bubbles: true }));
        await fireEvent.click(screen.getByRole("menuitem", { name: "重新加载页面" }));
        expect(screen.getByText("users-content-v2")).toBeTruthy();
    });
    it("toggles fullscreen mode from header button", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];
        const originalFullscreenElement = Object.getOwnPropertyDescriptor(document, "fullscreenElement");
        const originalExitFullscreen = Object.getOwnPropertyDescriptor(document, "exitFullscreen");
        const originalRequestFullscreen = Object.getOwnPropertyDescriptor(Element.prototype, "requestFullscreen");
        let fullscreenElement: Element | null = null;
        let layoutElement: Element | null = null;
        const requestFullscreen = mock.fn(() => {
            fullscreenElement = layoutElement;
            document.dispatchEvent(new Event("fullscreenchange"));
            return Promise.resolve();
        });
        const exitFullscreen = mock.fn(() => {
            fullscreenElement = null;
            document.dispatchEvent(new Event("fullscreenchange"));
            return Promise.resolve();
        });
        Object.defineProperty(document, "fullscreenElement", {
            configurable: true,
            get: () => fullscreenElement,
        });
        Object.defineProperty(document, "exitFullscreen", {
            configurable: true,
            value: exitFullscreen,
        });
        Object.defineProperty(Element.prototype, "requestFullscreen", {
            configurable: true,
            value: requestFullscreen,
        });
        try {
            const { container } = await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
                <Layout />
            </AppMainLayoutProvider>);
            layoutElement = container.querySelector("main")?.parentElement?.parentElement ?? null;
            const enterButton = screen.getByRole("button", { name: "进入全屏" });
            await fireEvent.click(enterButton);
            expect(requestFullscreen).toHaveBeenCalledTimes(1);
            const exitButton = screen.getByRole("button", { name: "退出全屏" });
            expect(exitButton.getAttribute("aria-pressed")).toBe("true");
            await fireEvent.click(exitButton);
            expect(exitFullscreen).toHaveBeenCalledTimes(1);
            const resetButton = screen.getByRole("button", { name: "进入全屏" });
            expect(resetButton.getAttribute("aria-pressed")).toBe("false");
        }
        finally {
            restoreDescriptor(document, "fullscreenElement", originalFullscreenElement);
            restoreDescriptor(document, "exitFullscreen", originalExitFullscreen);
            restoreDescriptor(Element.prototype, "requestFullscreen", originalRequestFullscreen);
        }
    });
    it("shows skeleton while loading remote header user and renders loaded entity", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];
        let resolveUser: ((value: HeaderUserEntity) => void) | null = null;
        const loadHeaderUser = mock.fn(() => new Promise<HeaderUserEntity>((resolve) => {
            resolveUser = resolve;
        }));
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
            <Layout headerLoadUser={loadHeaderUser}/>
        </AppMainLayoutProvider>);
        expect(loadHeaderUser).toHaveBeenCalledTimes(1);
        expect(await screen.findByRole("button", { name: "加载用户" })).toBeTruthy();
        await act(async () => {
            resolveUser?.({
                name: "Admin",
                roleName: "系统管理员",
                avatar: "A",
            });
            await Promise.resolve();
        });
        expect(await screen.findByText("Admin")).toBeTruthy();
        expect(screen.getByText("系统管理员")).toBeTruthy();
    });
    it("shows user menu on hover and triggers switch role/logout actions", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];
        const onSwitchRole = mock.fn();
        const onLogout = mock.fn();
        let resolveHeaderUser: ((value: HeaderUserEntity) => void) | undefined;
        const loadHeaderUser = mock.fn(() => new Promise<HeaderUserEntity>((resolve) => {
            resolveHeaderUser = resolve;
        }));
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
            <Layout headerLoadUser={loadHeaderUser} onSwitchRole={onSwitchRole} onLogout={onLogout}/>
        </AppMainLayoutProvider>);
        await act(async () => {
            resolveHeaderUser?.({ name: "Admin", avatar: "A", roleName: "系统管理员" });
            await Promise.resolve();
        });
        const userButton = await screen.findByRole("button", { name: "Admin" });
        await fireEvent(userButton, new MouseEvent("mouseover", { bubbles: true }));
        await fireEvent.click(await screen.findByRole("menuitem", { name: "切换角色" }));
        expect(onSwitchRole).toHaveBeenCalledTimes(1);
        await fireEvent(userButton, new MouseEvent("mouseover", { bubbles: true }));
        await fireEvent.click(await screen.findByRole("menuitem", { name: "退出登录" }));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
    it("loads header user before sidebar menus and passes resolved user to sidebarLoadMenus", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];
        const events: string[] = [];
        const menuItems: MenuItem[] = [{ key: "dashboard", type: MenuItemType.Item, title: "控制台" }];
        const resolvedUser: HeaderUserEntity = {
            name: "Admin",
            roleName: "系统管理员",
            avatar: "A",
        };
        let resolveHeaderUser: ((value: HeaderUserEntity) => void) | undefined;
        const loadHeaderUser = mock.fn(() => {
            events.push("header-start");
            return new Promise<HeaderUserEntity>((resolve) => {
                resolveHeaderUser = (value) => {
                    events.push("header-done");
                    resolve(value);
                };
            });
        });
        let resolveSidebarMenus: ((value: MenuItem[]) => void) | undefined;
        const loadSidebarMenus = mock.fn((headerUser?: HeaderUserEntity) => {
            events.push(`sidebar:${String(headerUser?.name ?? "")}`);
            return new Promise<MenuItem[]>((resolve) => {
                resolveSidebarMenus = resolve;
            });
        });
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
            <Layout headerLoadUser={loadHeaderUser} sidebarLoadMenus={loadSidebarMenus}/>
        </AppMainLayoutProvider>);
        await act(async () => {
            resolveHeaderUser?.(resolvedUser);
            await Promise.resolve();
            await Promise.resolve();
            resolveSidebarMenus?.(menuItems);
            await Promise.resolve();
        });
        expect(await screen.findByText("Admin")).toBeTruthy();
        expect(loadHeaderUser).toHaveBeenCalledTimes(1);
        expect(loadSidebarMenus).toHaveBeenCalledTimes(1);
        expect(loadSidebarMenus).toHaveBeenCalledWith(resolvedUser);
        expect(events).toEqual(["header-start", "header-done", "sidebar:Admin"]);
    });
    it("does not call sidebarLoadMenus when headerLoadUser fails", async () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];
        let rejectHeaderUser: ((reason: Error) => void) | undefined;
        const loadHeaderUser = mock.fn(() => new Promise<HeaderUserEntity>((_resolve, reject) => {
            rejectHeaderUser = reject;
        }));
        const loadSidebarMenus = mock.fn(async () => {
            return [{ key: "dashboard", type: MenuItemType.Item, title: "控制台" }];
        });
        await render(<AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
            <Layout headerLoadUser={loadHeaderUser} sidebarLoadMenus={loadSidebarMenus}/>
        </AppMainLayoutProvider>);
        await act(async () => {
            rejectHeaderUser?.(new Error("failed"));
            await Promise.resolve();
            await Promise.resolve();
        });
        expect(await screen.findByRole("button", { name: "用户菜单" })).toBeTruthy();
        expect(loadHeaderUser).toHaveBeenCalledTimes(1);
        expect(loadSidebarMenus).toHaveBeenCalledTimes(0);
    });
});
