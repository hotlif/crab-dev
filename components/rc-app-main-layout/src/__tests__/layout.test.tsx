import { act } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "@jest/globals";
import Layout from "../layout.js";
import AppMainLayoutProvider from "../context.js";
import useAppMainLayoutTabs, { type UseAppMainLayoutTabsResult } from "../useTabs.js";
import type { TabItem } from "../types.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

const Probe = ({ onReady }: { onReady: (r: UseAppMainLayoutTabsResult) => void }) => {
    onReady(useAppMainLayoutTabs());
    return null;
};

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
});
