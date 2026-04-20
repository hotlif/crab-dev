import { act } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "@jest/globals";
import type { TabItem } from "../types.js";
import useAppMainLayoutTabs from "../useTabs.js";
import AppMainLayoutProvider from "../context.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

interface HarnessProps {
    initialTabs: TabItem[]
    initialActiveTabKey?: string
    onReady: (result: ReturnType<typeof useAppMainLayoutTabs>) => void
}

const Consumer = ({ onReady }: { onReady: HarnessProps["onReady"] }) => {
    const result = useAppMainLayoutTabs();
    onReady(result);
    return null;
};

const Harness = ({ initialTabs, initialActiveTabKey, onReady }: HarnessProps) => (
    <AppMainLayoutProvider initialTabs={initialTabs} initialActiveTabKey={initialActiveTabKey}>
        <Consumer onReady={onReady} />
    </AppMainLayoutProvider>
);

describe("useAppMainLayoutTabs", () => {
    it("opens a new tab and activates it", () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;

        render(
            <Harness
                initialTabs={initialTabs}
                initialActiveTabKey="dashboard"
                onReady={(result) => { hookResult = result; }}
            />
        );

        act(() => {
            hookResult!.openTab({ key: "report", title: "报表中心" });
        });

        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard", "users", "report"]);
        expect(hookResult!.activeTabKey).toBe("report");
    });

    it("closes active tab and picks nearest neighbor as next active tab", () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
            { key: "settings", title: "系统设置" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;

        render(
            <Harness
                initialTabs={initialTabs}
                initialActiveTabKey="users"
                onReady={(result) => { hookResult = result; }}
            />
        );

        act(() => {
            hookResult!.closeTab("users");
        });

        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard", "settings"]);
        expect(hookResult!.activeTabKey).toBe("settings");

        act(() => {
            hookResult!.closeTab("settings");
        });

        expect(hookResult!.tabs.map((item) => item.key)).toEqual(["dashboard"]);
        expect(hookResult!.activeTabKey).toBe("dashboard");
    });

    it("reloads tab and increases reload version", () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;

        render(
            <Harness
                initialTabs={initialTabs}
                initialActiveTabKey="dashboard"
                onReady={(result) => { hookResult = result; }}
            />
        );

        act(() => {
            hookResult!.reloadTab();
        });
        act(() => {
            hookResult!.reloadTab("dashboard");
        });

        expect(hookResult!.getReloadVersion("dashboard")).toBe(2);
    });

    it("clears reload version when the tab is closed", () => {
        const initialTabs: TabItem[] = [
            { key: "dashboard", title: "控制台", closable: false },
            { key: "users", title: "用户管理" },
        ];
        let hookResult: ReturnType<typeof useAppMainLayoutTabs> | null = null;

        render(
            <Harness
                initialTabs={initialTabs}
                initialActiveTabKey="users"
                onReady={(result) => { hookResult = result; }}
            />
        );

        act(() => {
            hookResult!.reloadTab("users");
        });
        expect(hookResult!.getReloadVersion("users")).toBe(1);

        act(() => {
            hookResult!.closeTab("users");
        });
        expect(hookResult!.getReloadVersion("users")).toBe(0);
    });
});
