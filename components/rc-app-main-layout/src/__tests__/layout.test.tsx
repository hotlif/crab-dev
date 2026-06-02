import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import Layout from "../layout.js";
import AppMainLayoutProvider from "../context.js";
import useAppMainLayoutTabs, { type UseAppMainLayoutTabsResult } from "../useTabs.js";
import type { HeaderUserEntity, TabItem } from "../types.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

const Probe = ({ onReady }: { onReady: (r: UseAppMainLayoutTabsResult) => void }) => {
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
    it("renders active tab content and keeps inactive panes mounted but hidden", () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];

        render(
            <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
                <Layout />
            </AppMainLayoutProvider>
        );

        const active = screen.getByText("users-content");
        const inactive = screen.getByText("dashboard-content");
        expect(active).toBeTruthy();
        expect(inactive).toBeTruthy();
        expect(active.closest("[role=tabpanel]")?.getAttribute("aria-hidden")).toBe("false");
        expect(inactive.closest("[role=tabpanel]")?.getAttribute("aria-hidden")).toBe("true");
    });

    it("destroys tab content when the tab is closed", () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];
        let api: UseAppMainLayoutTabsResult | null = null;

        render(
            <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
                <Layout />
                <Probe onReady={(r) => { api = r; }} />
            </AppMainLayoutProvider>
        );

        expect(screen.queryByText("users-content")).toBeTruthy();

        act(() => { api!.closeTab("users"); });

        expect(screen.queryByText("users-content")).toBeNull();
        expect(screen.queryByText("dashboard-content")).toBeTruthy();
    });

    it("defaults to the first tab when no active key is provided", () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <div>users-content</div> },
        ];

        render(
            <AppMainLayoutProvider initialTabs={tabs}>
                <Layout />
            </AppMainLayoutProvider>
        );

        const active = screen.getByText("dashboard-content").closest("[role=tabpanel]");
        expect(active?.getAttribute("aria-hidden")).toBe("false");
    });

    it("reloads tab content from context menu", () => {
        let mountCount = 0;
        const UsersContent = () => {
            mountCount += 1;
            return <div>{`users-content-v${mountCount}`}</div>;
        };
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
            { key: "users", title: "用户管理", children: <UsersContent /> },
        ];

        render(
            <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="users">
                <Layout />
            </AppMainLayoutProvider>
        );

        expect(screen.getByText("users-content-v1")).toBeTruthy();

        fireEvent.contextMenu(screen.getByRole("tab", { name: "用户管理" }));
        fireEvent.click(screen.getByRole("menuitem", { name: "重新加载页面" }));

        expect(screen.getByText("users-content-v2")).toBeTruthy();
    });

    it("toggles fullscreen mode from header button", () => {
        const tabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false, children: <div>dashboard-content</div> },
        ];

        const originalFullscreenElement = Object.getOwnPropertyDescriptor(document, "fullscreenElement");
        const originalExitFullscreen = Object.getOwnPropertyDescriptor(document, "exitFullscreen");
        const originalRequestFullscreen = Object.getOwnPropertyDescriptor(Element.prototype, "requestFullscreen");

        let fullscreenElement: Element | null = null;
        let layoutElement: Element | null = null;
        const requestFullscreen = jest.fn(() => {
            fullscreenElement = layoutElement;
            document.dispatchEvent(new Event("fullscreenchange"));
            return Promise.resolve();
        });
        const exitFullscreen = jest.fn(() => {
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
            render(
                <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
                    <Layout />
                </AppMainLayoutProvider>
            );

            layoutElement = screen.getByRole("main").parentElement?.parentElement ?? null;

            const enterButton = screen.getByRole("button", { name: "Enter fullscreen" });
            fireEvent.click(enterButton);

            expect(requestFullscreen).toHaveBeenCalledTimes(1);

            const exitButton = screen.getByRole("button", { name: "Exit fullscreen" });
            expect(exitButton.getAttribute("aria-pressed")).toBe("true");

            fireEvent.click(exitButton);

            expect(exitFullscreen).toHaveBeenCalledTimes(1);
            const resetButton = screen.getByRole("button", { name: "Enter fullscreen" });
            expect(resetButton.getAttribute("aria-pressed")).toBe("false");
        } finally {
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
        const loadHeaderUser = jest.fn(() => new Promise<HeaderUserEntity>((resolve) => {
            resolveUser = resolve;
        }));

        render(
            <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
                <Layout headerLoadUser={loadHeaderUser} />
            </AppMainLayoutProvider>
        );

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
        const onSwitchRole = jest.fn();
        const onLogout = jest.fn();

        render(
            <AppMainLayoutProvider initialTabs={tabs} initialActiveTabKey="dashboard">
                <Layout
                    headerLoadUser={async () => ({ name: "Admin", avatar: "A", roleName: "系统管理员" })}
                    onSwitchRole={onSwitchRole}
                    onLogout={onLogout}
                />
            </AppMainLayoutProvider>
        );

        const userButton = await screen.findByRole("button", { name: "Admin" });
        fireEvent.mouseEnter(userButton);

        fireEvent.click(await screen.findByRole("menuitem", { name: "切换角色" }));
        expect(onSwitchRole).toHaveBeenCalledTimes(1);

        fireEvent.mouseEnter(userButton);
        fireEvent.click(await screen.findByRole("menuitem", { name: "退出登录" }));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});
