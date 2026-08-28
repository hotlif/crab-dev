import { describe, expect, it, render, act } from "@crab-dev/wake/test/react";
import type { TabItem } from "../types.js";
import useAppMainLayoutTabs from "../useTabs.js";
import AppMainLayoutProvider from "../context.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
interface HarnessProps {
    initialTabs: TabItem[];
    initialActiveTabKey?: string;
    onReady: (result: ReturnType<typeof useAppMainLayoutTabs>) => void;
}
const Consumer = ({ onReady }: {
    onReady: HarnessProps["onReady"];
}) => {
    const result = useAppMainLayoutTabs();
    onReady(result);
    return null;
};
const Harness = ({ initialTabs, initialActiveTabKey, onReady }: HarnessProps) => (<AppMainLayoutProvider initialTabs={initialTabs} initialActiveTabKey={initialActiveTabKey}>
    <Consumer onReady={onReady}/>
</AppMainLayoutProvider>);
describe("useAppMainLayoutTabs", () => {
    it("opens a new tab and activates it", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="dashboard" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.openTab({ key: "report", title: "报表中心" });
        });
        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard", "users", "report"]);
        expect(hookResult!.activeTabKey).toBe("report");
    });
    it("closes active tab and picks nearest neighbor as next active tab", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
            { key: "settings", title: "系统设置" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="users" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.closeTab("users");
        });
        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard", "settings"]);
        expect(hookResult!.activeTabKey).toBe("settings");
        await act(() => {
            hookResult!.closeTab("settings");
        });
        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard"]);
        expect(hookResult!.activeTabKey).toBe("dashboard");
    });
    it("reloads tab and increases reload version", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="dashboard" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.reloadTab();
        });
        await act(() => {
            hookResult!.reloadTab("dashboard");
        });
        expect(hookResult!.getReloadVersion("dashboard")).toBe(2);
    });
    it("clears reload version when the tab is closed", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="users" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.reloadTab("users");
        });
        expect(hookResult!.getReloadVersion("users")).toBe(1);
        await act(() => {
            hookResult!.closeTab("users");
        });
        expect(hookResult!.getReloadVersion("users")).toBe(0);
    });
    it("closes other tabs while preserving non-closable tabs and activates target", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
            { key: "settings", title: "系统设置" },
            { key: "report", title: "报表中心" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="users" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.reloadTab("settings");
        });
        expect(hookResult!.getReloadVersion("settings")).toBe(1);
        await act(() => {
            hookResult!.closeOtherTabs("settings");
        });
        // 不可关闭的 dashboard 被保留；目标 settings 被激活；其他可关闭项被移除
        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard", "settings"]);
        expect(hookResult!.activeTabKey).toBe("settings");
        // 关闭的 tab 的 reloadVersion 不应残留；保留 tab 的 version 不变
        expect(hookResult!.getReloadVersion("users")).toBe(0);
        expect(hookResult!.getReloadVersion("settings")).toBe(1);
    });
    it("closeOtherTabs is a no-op when only the target and non-closable tabs remain", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="users" onReady={(result) => { hookResult = result; }}/>);
        const before = hookResult!.tabs;
        await act(() => {
            hookResult!.closeOtherTabs("users");
        });
        // 没有可关闭的"其他"标签 → state 应保持引用不变
        expect(hookResult!.tabs).toBe(before);
    });
    it("closes all closable tabs and falls back to first non-closable tab", async () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
            { key: "settings", title: "系统设置" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="settings" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.reloadTab("users");
        });
        expect(hookResult!.getReloadVersion("users")).toBe(1);
        await act(() => {
            hookResult!.closeAllTabs();
        });
        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard"]);
        expect(hookResult!.activeTabKey).toBe("dashboard");
        // 被关闭的 tab 的 reloadVersion 必须清空
        expect(hookResult!.getReloadVersion("users")).toBe(0);
        expect(hookResult!.getReloadVersion("settings")).toBe(0);
    });
    it("closeAllTabs leaves activeKey undefined when no tab survives", async () => {
        const initialTabs: TabItem[] = [
            { key: "users", title: "用户管理" },
            { key: "settings", title: "系统设置" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;
        await render(<Harness initialTabs={initialTabs} initialActiveTabKey="users" onReady={(result) => { hookResult = result; }}/>);
        await act(() => {
            hookResult!.closeAllTabs();
        });
        expect(hookResult!.tabs).toEqual([]);
        expect(hookResult!.activeTabKey).toBeUndefined();
    });
});
