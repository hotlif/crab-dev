import { act, afterEach, beforeAll, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { type ReactNode, type HTMLAttributes, type Key } from "react";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
mock.module("motion/react", () => ({
    AnimatePresence: ({ children }: {
        children?: ReactNode;
    }) => <>{children}</>,
    motion: {
        ul: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => <ul {...props}>{children}</ul>,
    },
}));
let mockFloatingCloseHandler: (() => void) | undefined;
let mockFloatingEmit = mock.fn();
let mockFloatingParentId: string | null = null;
let mockFloatingForceOpen = false;
let mockFloatingOnOpenChange: ((value: boolean) => void) | undefined;
mock.module("@floating-ui/react", () => ({
    FloatingTree: ({ children }: {
        children?: ReactNode;
    }) => <>{children}</>,
    FloatingNode: ({ children }: {
        children?: ReactNode;
    }) => <>{children}</>,
    useFloatingNodeId: () => "node-id",
    useFloatingTree: () => ({
        events: {
            emit: mockFloatingEmit,
            on: mock.fn((event: string, handler: () => void) => {
                if (event === "close") {
                    mockFloatingCloseHandler = handler;
                }
            }),
            off: mock.fn(),
        },
    }),
    useFloatingParentNodeId: () => mockFloatingParentId,
    useFloating: (options: {
        onOpenChange?: (value: boolean) => void;
    }) => {
        mockFloatingOnOpenChange = options.onOpenChange;
        if (mockFloatingForceOpen) {
            // Do not call onOpenChange asynchronously here;
            // tests trigger it within act to avoid React warnings.
        }
        return {
            refs: {
                setReference: mock.fn(),
                setFloating: mock.fn(),
            },
            floatingStyles: {},
            context: {},
        };
    },
    useHover: () => ({}),
    useInteractions: () => ({
        getReferenceProps: () => ({}),
        getFloatingProps: () => ({}),
    }),
    offset: mock.fn(() => ({})),
    flip: mock.fn(() => ({})),
    shift: mock.fn(() => ({})),
    safePolygon: mock.fn(() => mock.fn()),
}));
let Menu: (typeof import("../menu.js"))["default"];
let ItemType: (typeof import("../type.js"))["ItemType"];
let ItemNormal: (typeof import("../horizontal/itemNormal.js"))["default"];
beforeAll(async () => {
    const menuModule = await mock.import<typeof import("../menu.js")>("../menu.js");
    const typeModule = await mock.import<typeof import("../type.js")>("../type.js");
    const itemNormalModule = await mock.import<typeof import("../horizontal/itemNormal.js")>("../horizontal/itemNormal.js");
    Menu = menuModule.default;
    ItemType = typeModule.ItemType;
    ItemNormal = itemNormalModule.default;
});
afterEach(() => {
    mockFloatingCloseHandler = undefined;
    mockFloatingEmit = mock.fn();
    mockFloatingParentId = null;
    mockFloatingForceOpen = false;
    mockFloatingOnOpenChange = undefined;
});
describe("Menu", () => {
    it("renders vertical menu and triggers callbacks on item click", async () => {
        const onClick = mock.fn();
        const onSelectItem = mock.fn();
        const onOpenChange = mock.fn();
        const openKeys: Key[] = [];
        await render(<Menu mode="vertical" items={[
            {
                type: ItemType.Item,
                key: "parent",
                title: "Parent",
                children: [
                    {
                        type: ItemType.Item,
                        key: "child",
                        title: "Child",
                    },
                ],
            },
        ]} openKeys={openKeys} onClick={onClick} onSelectItem={onSelectItem} onOpenChange={onOpenChange}/>);
        const parentTitle = screen.getByText("Parent");
        await act(async () => {
            await fireEvent.click(parentTitle);
        });
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "parent", title: "Parent" }),
        }));
        expect(onSelectItem).toHaveBeenCalledTimes(1);
        expect(onSelectItem).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "parent" }),
            selectedKeys: ["parent"],
        }));
        expect(onOpenChange).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(["parent"]);
    });
    it("renders horizontal menu items", async () => {
        await render(<Menu mode="horizontal" items={[
            {
                type: ItemType.Item,
                key: "home",
                title: "Home",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-no-icon",
                title: "Group No Icon",
            },
            {
                type: ItemType.ItemGroup,
                key: "group",
                title: "Group",
                icon: <span data-testid="group-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "about",
                        title: "About",
                    },
                ],
            },
        ]}/>);
        expect(screen.getByText("Home")).toBeTruthy();
        expect(screen.getByText("Group No Icon")).toBeTruthy();
        expect(screen.getByText("Group")).toBeTruthy();
        expect(screen.getByText("About")).toBeTruthy();
        expect(screen.getByTestId("group-icon")).toBeTruthy();
    });
    it("renders horizontal menu with default props", async () => {
        await render(<Menu mode="horizontal"/>);
        expect(screen.getByRole("list")).toBeTruthy();
    });
    it("uses vertical mode by default when mode is omitted", async () => {
        await render(<Menu items={[
            {
                type: ItemType.Item,
                key: "default-mode-item",
                title: "Default Mode Item",
            },
        ]}/>);
        expect(screen.getByText("Default Mode Item")).toBeTruthy();
    });
    it("renders vertical menu with default empty items", async () => {
        await render(<Menu mode="vertical"/>);
        expect(screen.getByRole("list")).toBeTruthy();
    });
    it("throws when mode is unsupported", async () => {
        const renderInvalidMode = async () => {
            await render(<Menu mode={"invalid" as unknown as "vertical"} items={[]}/>);
        };
        await expect(renderInvalidMode()).rejects.toThrow("The parameter `mode` is incorrect");
    });
    it("throws when item type is invalid", async () => {
        const renderInvalidType = async () => {
            await render(<Menu mode="vertical" items={[
                {
                    type: 999 as never,
                    key: "invalid",
                    title: "Invalid",
                },
            ]}/>);
        };
        await expect(renderInvalidType()).rejects.toThrow("The parameter `type` is incorrect");
    });
    it("throws in horizontal mode when item type is invalid", async () => {
        const renderInvalidType = async () => {
            await render(<Menu mode="horizontal" items={[
                {
                    type: 999 as never,
                    key: "invalid-horizontal",
                    title: "Invalid Horizontal",
                },
            ]}/>);
        };
        await expect(renderInvalidType()).rejects.toThrow("The parameter `type` is incorrect");
    });
    it("covers vertical item group branch and open icon state", async () => {
        const onSelectItem = mock.fn();
        const onOpenChange = mock.fn();
        const openKeys: Key[] = ["open-parent", "toggle-item", "group-parent"];
        await render(<Menu mode="vertical" openKeys={openKeys} selectedKeys={["toggle-item"]} onSelectItem={onSelectItem} onOpenChange={onOpenChange} items={[
            {
                type: ItemType.Item,
                key: "open-parent",
                title: "Open Parent",
                icon: <span data-testid="open-parent-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "open-child",
                        title: "Open Child",
                    },
                ],
            },
            {
                type: ItemType.Item,
                key: "toggle-item",
                title: "Toggle Item",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-empty",
                title: "Group Empty",
            },
            {
                type: ItemType.ItemGroup,
                key: "group-parent",
                title: "Group Parent",
                icon: <span data-testid="group-parent-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "group-child",
                        title: "Group Child",
                    },
                ],
            },
        ]}/>);
        await act(async () => {
            await fireEvent.click(screen.getByText("Group Parent"));
        });
        await act(async () => {
            await fireEvent.click(screen.getByText("Toggle Item"));
        });
        expect(onSelectItem).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "group-parent" }),
        }));
        expect(onOpenChange).toHaveBeenCalledWith(["open-parent", "group-parent"]);
        expect(screen.getByText("Group Empty")).toBeTruthy();
        expect(screen.getByText("Group Child")).toBeTruthy();
        expect(screen.getByTestId("open-parent-icon")).toBeTruthy();
        expect(screen.getByTestId("group-parent-icon")).toBeTruthy();
    });
    it("covers itemNormal click callback, icon path and open floating branch", async () => {
        const onClick = mock.fn();
        mockFloatingParentId = "parent-node";
        mockFloatingForceOpen = true;
        const consoleErrorSpy = mock.spyOn(console, "error").implement(() => { });
        await render(<ItemNormal item={{
            type: ItemType.Item,
            key: "direct-item",
            title: "Direct Item",
            icon: <span data-testid="direct-item-icon"/>,
        }} depth={1} onClick={onClick}>
            {[<li key="child">Direct Child</li>]}
        </ItemNormal>);
        await act(() => {
            mockFloatingOnOpenChange?.(true);
        });
        await act(async () => {
            await fireEvent.click(screen.getByText("Direct Item"));
        });
        expect(screen.getByTestId("direct-item-icon")).toBeTruthy();
        expect(screen.getByText("Direct Child")).toBeTruthy();
        expect(mockFloatingEmit).toHaveBeenCalledWith("close");
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "direct-item" }),
        }));
        await act(() => {
            mockFloatingCloseHandler?.();
        });
        consoleErrorSpy.restore();
    });
    it("renders inline-collapsed vertical menu with icons only and opens floating submenu on hover", async () => {
        mockFloatingForceOpen = true;
        const onSelectItem = mock.fn();
        const onClick = mock.fn();
        await render(<Menu mode="inline" inlineCollapsed selectedKeys={["dashboard"]} onSelectItem={onSelectItem} onClick={onClick} items={[
            {
                type: ItemType.Item,
                key: "dashboard",
                title: "仪表盘",
                icon: <span data-testid="dashboard-icon"/>,
            },
            {
                type: ItemType.Item,
                key: "system",
                title: "系统管理",
                icon: <span data-testid="system-icon"/>,
                children: [
                    {
                        type: ItemType.Item,
                        key: "system-menu",
                        title: "菜单维护",
                    },
                ],
            },
            {
                type: ItemType.ItemGroup,
                key: "tools-group",
                title: "工具",
                children: [
                    {
                        type: ItemType.Item,
                        key: "tools-logs",
                        title: "日志",
                        icon: <span data-testid="tools-logs-icon"/>,
                    },
                ],
            },
        ]}/>);
        expect(screen.getByTestId("dashboard-icon")).toBeTruthy();
        expect(screen.getByTestId("system-icon")).toBeTruthy();
        expect(screen.getByTestId("tools-logs-icon")).toBeTruthy();
        await act(() => {
            mockFloatingOnOpenChange?.(true);
        });
        await act(async () => {
            await fireEvent.click(screen.getByLabelText("系统管理"));
        });
        await act(async () => {
            await fireEvent.click(screen.getByLabelText("仪表盘"));
        });
        expect(onSelectItem).toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({
            item: expect.objectContaining({ key: "dashboard" }),
        }));
        await act(async () => {
            await fireEvent.keyDown(screen.getByLabelText("仪表盘"), { key: "Enter" });
        });
        expect(screen.getByRole("tooltip")).toBeTruthy();
        await act(() => {
            mockFloatingCloseHandler?.();
        });
    });
});
