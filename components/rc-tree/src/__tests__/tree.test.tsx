import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import { act } from "react";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
import { LoadStateType, NodeType, type Node } from "../type.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// Mock @dnd-kit/core
jest.mock("@dnd-kit/core", () => ({
    DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
    useDndContext: () => ({}),
}));

// Mock @dnd-kit/sortable
jest.mock("@dnd-kit/sortable", () => ({
    SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: jest.fn(),
        transform: null,
        transition: null,
    }),
}));

// Mock @crab-dev/rc-virtual
jest.mock("@crab-dev/rc-virtual", () => ({
    __esModule: true,
    default: ({ renderRows, viewportHeight, viewportWidth, gridTemplateRows, gridTemplateColumns, onWheel, ...rest }: any) => {
        const rows = renderRows?.([0, (gridTemplateRows?.length ?? 1) - 1]) ?? [];
        return <div data-testid="rc-virtual" style={{ height: viewportHeight, width: viewportWidth }} {...rest}>{rows}</div>;
    },
}));

// Mock @crab-dev/rc-hooks
jest.mock("@crab-dev/rc-hooks", () => ({
    useKeyDown: () => [{ current: {} }],
}));

// Mock @linaria/core
jest.mock("@linaria/core", () => ({
    css: () => "mocked-css",
    cx: (...args: any[]) => args.filter(Boolean).join(" "),
}));

import Tree from "../tree.js";
import { getLoadReadyTreeNodeData, loadDataFunc } from "../util.js";

const createNode = (id: string | number, overrides: Partial<Node> = {}): Node => ({
    id,
    type: NodeType.FOLDER,
    title: `Node ${id}`,
    parent: null,
    loadState: LoadStateType.UNLOADED,
    ...overrides,
});

describe("Tree component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders with no data", async () => {
        const onTreeNodeChange = jest.fn();
        const loadData = jest.fn(() => Promise.resolve([]));

        await act(async () => {
            render(
                <Tree
                    treeData={[]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    loadData={loadData}
                />
            );
        });

        expect(screen.getByTestId("dnd-context")).toBeTruthy();
    });

    it("renders tree nodes", async () => {
        const node1 = createNode("1", { loadState: LoadStateType.LOADING_COMPLETED, priority: 1 });
        const node2 = createNode("2", { loadState: LoadStateType.LOADING_COMPLETED, priority: 2 });
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[node1, node2]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    expandedKeys={[]}
                    selectKeys={[]}
                />
            );
        });

        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });

    it("renders with draggable enabled", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    draggable
                    onTreeNodeChange={onTreeNodeChange}
                />
            );
        });

        expect(screen.getByTestId("sortable-context")).toBeTruthy();
    });

    it("renders with showLine", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    showLine
                    onTreeNodeChange={onTreeNodeChange}
                />
            );
        });

        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });

    it("renders context menu when rendererContextMenu is provided", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();
        const rendererContextMenu = jest.fn(() => <div data-testid="ctx-menu">Menu</div>);

        await act(async () => {
            render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    rendererContextMenu={rendererContextMenu as any}
                />
            );
        });

        expect(rendererContextMenu).toHaveBeenCalled();
    });

    it("handles onContextMenu on the tree container", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();
        const onContextMenu = jest.fn();

        let container: HTMLElement;
        await act(async () => {
            const result = render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    onContextMenu={onContextMenu}
                    rendererContextMenu={({ node }) => <div>menu</div>}
                />
            );
            container = result.container;
        });

        const sortable = screen.getByTestId("sortable-context");
        const innerDiv = sortable.querySelector("div");
        if (innerDiv) {
            act(() => {
                fireEvent.contextMenu(innerDiv);
            });
            expect(onContextMenu).toHaveBeenCalled();
        }
    });

    it("passes extra props through", async () => {
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    data-custom="test"
                />
            );
        });

        const virtual = screen.getByTestId("rc-virtual");
        expect(virtual.getAttribute("data-custom")).toBe("test");
    });

    it("handles loading state on expand", async () => {
        const node1 = createNode("1", { priority: 1, loadState: LoadStateType.UNLOADED });
        node1.type = NodeType.FOLDER;
        const childNode = createNode("child", { parent: node1, priority: 1 });
        const onTreeNodeChange = jest.fn();
        const loadData = jest.fn(() => Promise.resolve([childNode]));

        await act(async () => {
            render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    loadData={loadData}
                    expandedKeys={[]}
                />
            );
        });

        // loadData should be called on mount (by useEffect)
        expect(loadData).toHaveBeenCalled();
    });

    it("renders with select keys", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();
        const onSelect = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[node1]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    selectKeys={["1"]}
                    onSelect={onSelect}
                />
            );
        });

        // Component should render without error
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });

    it("handles expanded keys for child nodes", async () => {
        const parent = createNode("p", { priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const child = createNode("c", { parent, priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[parent, child]}
                    height={300}
                    width={400}
                    onTreeNodeChange={onTreeNodeChange}
                    expandedKeys={["p"]}
                />
            );
        });

        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });

    it("renders with default node height", async () => {
        const node = createNode("1", { priority: 1 });
        const onTreeNodeChange = jest.fn();

        await act(async () => {
            render(
                <Tree
                    treeData={[node]}
                    height={300}
                    width={400}
                    defaultNodeHeight={40}
                    onTreeNodeChange={onTreeNodeChange}
                />
            );
        });

        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
});
