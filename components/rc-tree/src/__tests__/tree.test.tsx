import { beforeAll, afterEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { render, fireEvent, screen, act } from "@crab-dev/wake/test/react";
import type { HTMLAttributes, ReactNode } from "react";
import type { VirtualHandle } from '@crab-dev/rc-virtual';
import type { Ref } from 'react';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// Mock @dnd-kit/core
mock.module("@dnd-kit/core", () => ({
    DndContext: ({ children }: { children?: ReactNode }) => <div data-testid="dnd-context">{children}</div>,
    DragOverlay: ({ children }: { children?: ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
    useDndContext: () => ({}),
}));
// Mock @dnd-kit/sortable
mock.module("@dnd-kit/sortable", () => ({
    SortableContext: ({ children }: { children?: ReactNode }) => <div data-testid="sortable-context">{children}</div>,
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: mock.fn(),
        transform: null,
        transition: null,
    }),
}));
// Mock @crab-dev/rc-virtual
interface MockVirtualProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    gridRef?: Ref<VirtualHandle>;
    renderRows?: (range: [number, number]) => ReactNode;
    viewportHeight?: number;
    viewportWidth?: number;
    gridTemplateRows?: number[];
    gridTemplateColumns?: number[];
}
let coarsePointer = false;
let virtualRows: number[] = [];
afterEach(() => { coarsePointer = false; virtualRows = []; });

mock.module("@crab-dev/rc-virtual", () => ({
    __esModule: true,
    default: ({ renderRows, viewportHeight, viewportWidth, gridTemplateRows, gridTemplateColumns: _gridTemplateColumns, onWheel: _onWheel, gridRef: _gridRef, ...rest }: MockVirtualProps) => {
        virtualRows = gridTemplateRows ?? [];
        const rows = renderRows?.([0, (gridTemplateRows?.length ?? 1) - 1]) ?? [];
        return <div data-testid="rc-virtual" style={{ height: viewportHeight, width: viewportWidth }} {...rest}>{rows}</div>;
    },
}));
// Mock @crab-dev/rc-hooks
mock.module("@crab-dev/rc-hooks", async () => ({
    ...await mock.actual<typeof import('@crab-dev/rc-hooks')>('@crab-dev/rc-hooks'),
    useKeyDown: () => [{ current: {} }],
    useMediaQuery: () => coarsePointer,
}));
import type { Node } from "../type.js";
import type { TreeProps } from "../tree.js";
import ConfigProvider from '@crab-dev/rc-config-provider';
let LoadStateType: (typeof import("../type.js"))["LoadStateType"];
let NodeType: (typeof import("../type.js"))["NodeType"];
let Tree: (typeof import("../tree.js"))["default"];
beforeAll(async () => {
    const typeModule = await mock.import<typeof import("../type.js")>("../type.js");
    const treeModule = await mock.import<typeof import("../tree.js")>("../tree.js");
    LoadStateType = typeModule.LoadStateType;
    NodeType = typeModule.NodeType;
    Tree = treeModule.default;
});
const createNode = (id: string | number, overrides: Partial<Node> = {}): Node => ({
    id,
    type: NodeType.FOLDER,
    title: `Node ${id}`,
    parent: null,
    loadState: LoadStateType.UNLOADED,
    ...overrides,
});
describe("Tree component", () => {
    it('inherits global size without overriding explicit node geometry and protects coarse targets', async () => {
        const treeData = [createNode('one', { priority: 1 }), createNode('two', { priority: 2, height: 70 })];
        const change = mock.fn();
        const view = await render(<ConfigProvider size="small"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([44, 70]);
        await view.rerender(<ConfigProvider size="large"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([64, 70]);
        await view.rerender(<ConfigProvider size="large"><Tree size="small" treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([44, 70]);
        coarsePointer = true;
        await view.rerender(<ConfigProvider size="small"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([48, 70]);
    });
    it('labels the keyboard focus target and identifies its selected tree item', async () => {
        const node = createNode('selected');
        const view = await render(<Tree aria-label="Objects" treeData={[node]} selectKeys={[node.id]} width={400} height={300} onTreeNodeChange={mock.fn()} />);
        const tree = view.container.querySelector('[role="tree"]')!;
        expect(tree.getAttribute('aria-label')).toBe('Objects');
        expect(tree.getAttribute('tabindex')).toBe('0');
        expect(tree.getAttribute('aria-activedescendant')).toBe(view.container.querySelector('[role="treeitem"]')?.id);
    });
    it("updates virtual row offsets when density or pointer mode changes", async () => {
        const treeData = [createNode('one', { priority: 1 }), createNode('two', { priority: 2, height: 60 })];
        const onTreeNodeChange = mock.fn();
        const view = await render(<Tree treeData={treeData} width={400} height={300} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([56, 60]);
        await view.rerender(<Tree treeData={treeData} width={400} height={300} defaultNodeHeight={36} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([36, 60]);
        coarsePointer = true;
        await view.rerender(<Tree treeData={treeData} width={400} height={300} defaultNodeHeight={36} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([48, 60]);
        await view.rerender(<Tree treeData={treeData} width={400} height={300} defaultNodeHeight={36} checkable onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([48, 60]);
    });
    it("renders with no data", async () => {
        const onTreeNodeChange = mock.fn();
        const loadData = mock.fn(() => Promise.resolve([]));
        await act(async () => {
            await render(<Tree treeData={[]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} loadData={loadData}/>);
        });
        expect(screen.getByTestId("dnd-context")).toBeTruthy();
    });
    it("renders tree nodes", async () => {
        const node1 = createNode("1", { loadState: LoadStateType.LOADING_COMPLETED, priority: 1 });
        const node2 = createNode("2", { loadState: LoadStateType.LOADING_COMPLETED, priority: 2 });
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node1, node2]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} expandedKeys={[]} selectKeys={[]}/>);
        });
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
    it("renders with draggable enabled", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} draggable onTreeNodeChange={onTreeNodeChange}/>);
        });
        expect(screen.getByTestId("sortable-context")).toBeTruthy();
    });
    it("renders with showLine", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} showLine onTreeNodeChange={onTreeNodeChange}/>);
        });
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
    it("renders context menu when rendererContextMenu is provided", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        const rendererContextMenu = mock.fn(() => <div data-testid="ctx-menu">Menu</div>);
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} rendererContextMenu={rendererContextMenu as TreeProps["rendererContextMenu"]}/>);
        });
        expect(rendererContextMenu).toHaveBeenCalled();
    });
    it("handles onContextMenu on the tree container", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        const onContextMenu = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} onContextMenu={onContextMenu} rendererContextMenu={() => <div>menu</div>}/>);
        });
        const sortable = screen.getByTestId("sortable-context");
        const innerDiv = sortable.querySelector("div");
        if (innerDiv) {
            await act(async () => {
                await fireEvent(innerDiv, new MouseEvent("contextmenu", { bubbles: true }));
            });
            expect(onContextMenu).toHaveBeenCalled();
        }
    });
    it("passes extra props through", async () => {
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} data-custom="test"/>);
        });
        const virtual = screen.getByTestId("rc-virtual");
        expect(virtual.getAttribute("data-custom")).toBe("test");
    });
    it("handles loading state on expand", async () => {
        const node1 = createNode("1", { priority: 1, loadState: LoadStateType.UNLOADED });
        node1.type = NodeType.FOLDER;
        const childNode = createNode("child", { parent: node1, priority: 1 });
        const onTreeNodeChange = mock.fn();
        const loadData = mock.fn(() => Promise.resolve([childNode]));
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} loadData={loadData} expandedKeys={[]}/>);
        });
        // loadData should be called on mount (by useEffect)
        expect(loadData).toHaveBeenCalled();
    });
    it("renders with select keys", async () => {
        const node1 = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        const onSelect = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node1]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} selectKeys={["1"]} onSelect={onSelect}/>);
        });
        // Component should render without error
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
    it("handles expanded keys for child nodes", async () => {
        const parent = createNode("p", { priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const child = createNode("c", { parent, priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[parent, child]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} expandedKeys={["p"]}/>);
        });
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
    it("renders with default node height", async () => {
        const node = createNode("1", { priority: 1 });
        const onTreeNodeChange = mock.fn();
        await act(async () => {
            await render(<Tree treeData={[node]} height={300} width={400} defaultNodeHeight={40} onTreeNodeChange={onTreeNodeChange}/>);
        });
        expect(screen.getByTestId("rc-virtual")).toBeTruthy();
    });
});
