import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import AppMainLayoutProvider from "../context.js";
import useAppMainLayoutTabs, { type UseAppMainLayoutTabsResult } from "../useTabs.js";
import type { HeaderUserEntity, TabItem } from "../types.js";
import type { MenuItem } from "@crab-dev/rc-menu";

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
function restoreDescriptor(target: object, key: string, descriptor?: PropertyDescriptor): void {
    if (descriptor) {
        Object.defineProperty(target, key, descriptor);
        return;
    }
    delete (target as Record<string, unknown>)[key];
}
describe("Layout", () => {
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
        const menu = screen.getAllByRole('button', { name: 'Toggle sidebar' })[0];
        await fireEvent.click(screen.getAllByRole('button', { name: '关闭标签页' })[0]);
        expect(document.activeElement).toBe(menu);
        expect(screen.getAllByRole('tab').length).toBe(1);
        const remainingMenu = screen.getAllByRole('button', { name: 'Toggle sidebar' })[1];
        await fireEvent.keyDown(screen.getByRole('tab'), { key: 'F10', shiftKey: true });
        await fireEvent.click(screen.getByRole('menuitem', { name: '关闭所有' }));
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
            const enterButton = screen.getByRole("button", { name: "Enter fullscreen" });
            await fireEvent.click(enterButton);
            expect(requestFullscreen).toHaveBeenCalledTimes(1);
            const exitButton = screen.getByRole("button", { name: "Exit fullscreen" });
            expect(exitButton.getAttribute("aria-pressed")).toBe("true");
            await fireEvent.click(exitButton);
            expect(exitFullscreen).toHaveBeenCalledTimes(1);
            const resetButton = screen.getByRole("button", { name: "Enter fullscreen" });
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
        expect(await screen.findByRole("button", { name: "Loading user" })).toBeTruthy();
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
        expect(await screen.findByRole("button", { name: "User menu" })).toBeTruthy();
        expect(loadHeaderUser).toHaveBeenCalledTimes(1);
        expect(loadSidebarMenus).toHaveBeenCalledTimes(0);
    });
});
