import { beforeAll, afterEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { render, fireEvent, screen, act } from "@crab-dev/wake/test/react";
import type { HTMLAttributes, ReactNode } from "react";
import { useRef, useState } from 'react';
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
let NodeEditStateType: (typeof import("../type.js"))["NodeEditStateType"];
let Tree: (typeof import("../tree.js"))["default"];
beforeAll(async () => {
    const typeModule = await mock.import<typeof import("../type.js")>("../type.js");
    const treeModule = await mock.import<typeof import("../tree.js")>("../tree.js");
    LoadStateType = typeModule.LoadStateType;
    NodeType = typeModule.NodeType;
    NodeEditStateType = typeModule.NodeEditStateType;
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
    const editHarness = (mode: 'finish' | 'retain' | 'move-focus' | 'blur-focus' | 'remove' | 'replace' | 'unmount', edited: (node: Node, value: string, cancelled: boolean) => void) => function EditHarness() {
        const [nodes, setNodes] = useState(() => [createNode('editing', { type: NodeType.FILE, title: '文档', editState: NodeEditStateType.UPDATE })]);
        const [generation, setGeneration] = useState(0);
        const [visible, setVisible] = useState(true);
        const outside = useRef<HTMLButtonElement>(null);
        return <>
            <button ref={outside}>Outside</button>
            {visible && <Tree key={generation} aria-label="Editable objects" treeData={nodes} width={400} height={300}
                defaultSelectedKeys={['editing']} onTreeNodeChange={setNodes}
                onEditEnd={(node, value, cancelled) => {
                    edited(node, value, cancelled);
                    if (mode === 'retain') return;
                    if (mode === 'move-focus') outside.current?.focus();
                    if (mode === 'blur-focus' && document.activeElement instanceof HTMLElement) document.activeElement.blur();
                    if (mode === 'unmount') { setVisible(false); return; }
                    setNodes(mode === 'remove' ? [] : [{ ...node, title: cancelled ? node.title : value, editState: undefined }]);
                    if (mode === 'replace') setGeneration(previous => previous + 1);
                }} />}
        </>;
    };
    for (const key of ['Enter', 'Escape']) {
        it(`returns default ${key} editing to the same tree and preserves its active node`, async () => {
            const edited = mock.fn();
            const Harness = editHarness('finish', edited);
            const view = await render(<Harness />);
            const tree = screen.getByRole('tree', { name: 'Editable objects' });
            const activeId = tree.getAttribute('aria-activedescendant');
            const input = screen.getByRole('textbox', { name: '文档' });
            await fireEvent.keyDown(input, { key });
            expect(screen.queryByRole('textbox')).toBeNull();
            expect(document.activeElement).toBe(tree);
            expect(tree.getAttribute('aria-activedescendant')).toBe(activeId);
            expect(view.container.querySelector('[role="treeitem"]')?.getAttribute('aria-selected')).toBe('true');
            expect(edited).toHaveBeenCalledTimes(1);
            expect(edited).toHaveBeenCalledWith(expect.objectContaining({ id: 'editing' }), key === 'Enter' ? '文档' : '', key === 'Escape');
        });
    }
    it('keeps rejected controlled editing focused and allows another explicit attempt', async () => {
        const edited = mock.fn();
        const Harness = editHarness('retain', edited);
        await render(<Harness />);
        const input = screen.getByRole('textbox', { name: '文档' });
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(document.activeElement).toBe(input);
        expect(edited).toHaveBeenCalledTimes(1);
        await fireEvent.keyDown(input, { key: 'Escape' });
        expect(document.activeElement).toBe(input);
        expect(edited).toHaveBeenCalledTimes(2);
    });
    it('expires a rejected keyboard attempt before a later unrelated external close', async () => {
        const edited = mock.fn();
        const original = createNode('editing', { type: NodeType.FILE, title: '文档', editState: NodeEditStateType.UPDATE });
        function RetainedEditor({ open }: { open: boolean }) {
            return <Tree aria-label="Retained editor" treeData={[{ ...original, editState: open ? NodeEditStateType.UPDATE : undefined }]}
                width={400} height={300} defaultSelectedKeys={['editing']} onTreeNodeChange={mock.fn()} onEditEnd={edited} />;
        }
        const view = await render(<RetainedEditor open />);
        const input = screen.getByRole('textbox', { name: '文档' });
        const tree = screen.getByRole('tree', { name: 'Retained editor' });
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(document.activeElement).toBe(input);
        expect(edited).toHaveBeenCalledTimes(1);
        // onEditEnd deliberately performed no parent state update. This later
        // render is not acceptance of the already-rejected keyboard request.
        await view.rerender(<RetainedEditor open={false} />);
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).not.toBe(tree);
        expect(edited).toHaveBeenCalledTimes(1);
    });
    it('respects an edit callback that explicitly blurs its still-mounted editor', async () => {
        const edited = mock.fn();
        const Harness = editHarness('blur-focus', edited);
        await render(<Harness />);
        const tree = screen.getByRole('tree', { name: 'Editable objects' });
        await fireEvent.keyDown(screen.getByRole('textbox', { name: '文档' }), { key: 'Enter' });
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(document.activeElement).not.toBe(tree);
        expect(edited).toHaveBeenCalledTimes(1);
    });
    it('does not reclaim focus explicitly moved by the edit callback', async () => {
        const edited = mock.fn();
        const Harness = editHarness('move-focus', edited);
        await render(<Harness />);
        await fireEvent.keyDown(screen.getByRole('textbox', { name: '文档' }), { key: 'Enter' });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Outside' }));
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(edited).toHaveBeenCalledTimes(1);
    });
    for (const mode of ['remove', 'replace', 'unmount'] as const) {
        it(`does not restore focus when the callback will ${mode} the original row or tree`, async () => {
            const edited = mock.fn();
            const Harness = editHarness(mode, edited);
            await render(<Harness />);
            const original = screen.getByRole('tree', { name: 'Editable objects' });
            await fireEvent.keyDown(screen.getByRole('textbox', { name: '文档' }), { key: 'Enter' });
            expect(document.activeElement).not.toBe(original);
            expect(document.activeElement).not.toBe(screen.queryByRole('tree', { name: 'Editable objects' }));
            expect(edited).toHaveBeenCalledTimes(1);
        });
    }
    it('commits a blur exit without stealing the next control focus', async () => {
        const edited = mock.fn();
        const Harness = editHarness('finish', edited);
        await render(<Harness />);
        const outside = screen.getByRole('button', { name: 'Outside' });
        await act(async () => { outside.focus(); });
        expect(document.activeElement).toBe(outside);
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(edited).toHaveBeenCalledTimes(1);
    });
    it('does not turn synthetic editing keys on an unfocused input into a focus request', async () => {
        const edited = mock.fn();
        const Harness = editHarness('retain', edited);
        await render(<Harness />);
        const input = screen.getByRole('textbox', { name: '文档' });
        const outside = screen.getByRole('button', { name: 'Outside' });
        await act(async () => { outside.focus(); });
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(document.activeElement).toBe(outside);
        expect(edited).toHaveBeenCalledTimes(2);
    });
    it('owns default selection once and reports the next keys with typed details', async () => {
        const nodes = [createNode('one', { type: NodeType.FILE, priority: 1 }), createNode('two', { type: NodeType.FILE, priority: 2 })];
        const changed = mock.fn();
        const view = await render(<Tree treeData={nodes} width={400} height={300} defaultSelectedKeys={['one']} onSelectedKeysChange={changed} onTreeNodeChange={mock.fn()} />);
        await fireEvent(view.container.querySelectorAll('[role="treeitem"]')[1], new MouseEvent('pointerup', { button: 0, bubbles: true }));
        expect(changed).toHaveBeenCalledWith(['two'], expect.objectContaining({ reason: 'select', node: nodes[1], selected: true }));
        expect(view.container.querySelectorAll('[role="treeitem"]')[1].getAttribute('aria-selected')).toBe('true');
        await view.rerender(<Tree treeData={nodes} width={400} height={300} defaultSelectedKeys={[]} onSelectedKeysChange={changed} onTreeNodeChange={mock.fn()} />);
        expect(view.container.querySelectorAll('[role="treeitem"]')[1].getAttribute('aria-selected')).toBe('true');
    });

    it('requests controlled selection without mutating the supplied collection', async () => {
        const nodes = [createNode('one', { type: NodeType.FILE, priority: 1 }), createNode('two', { type: NodeType.FILE, priority: 2 })];
        const selectedKeys = ['one'];
        Object.freeze(selectedKeys);
        const changed = mock.fn();
        const view = await render(<Tree treeData={nodes} width={400} height={300} selectedKeys={selectedKeys} onSelectedKeysChange={changed} onTreeNodeChange={mock.fn()} />);
        await fireEvent(view.container.querySelectorAll('[role="treeitem"]')[1], new MouseEvent('pointerup', { button: 0, bubbles: true }));
        expect(changed).toHaveBeenCalledWith(['two'], expect.objectContaining({ reason: 'select' }));
        expect(selectedKeys).toEqual(['one']);
        expect(view.container.querySelectorAll('[role="treeitem"]')[0].getAttribute('aria-selected')).toBe('true');
        expect(view.container.querySelectorAll('[role="treeitem"]')[1].getAttribute('aria-selected')).toBe('false');
    });

    it('owns expanded and checked defaults while preserving cascading key semantics', async () => {
        const parent = createNode('parent', { priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const child = createNode('child', { type: NodeType.FILE, parent, priority: 1, loadState: LoadStateType.LOADING_COMPLETED });
        const checked = mock.fn();
        const expanded = mock.fn();
        const view = await render(<Tree treeData={[parent, child]} width={400} height={300} checkable defaultExpandedKeys={['parent']} defaultSelectedKeys={['parent']} onCheckedKeysChange={checked} onExpandedKeysChange={expanded} onTreeNodeChange={mock.fn()} />);
        await fireEvent.click(view.container.querySelectorAll('input[type="checkbox"]')[0]);
        expect(checked).toHaveBeenCalledWith(['parent', 'child'], expect.objectContaining({ reason: 'check', node: parent, checked: true, halfCheckedKeys: [] }));
        expect((view.container.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement).checked).toBe(true);
        await fireEvent.keyDown(view.container.querySelector('[role="tree"]')!, { key: 'ArrowLeft' });
        expect(expanded).toHaveBeenCalledWith([], expect.objectContaining({ reason: 'expand', node: parent, expanded: false }));
        expect(view.container.querySelectorAll('[role="treeitem"]')).toHaveLength(1);
    });

    it('inherits built-in accessible names from the nearest locale boundary', async () => {
        await render(<ConfigProvider locale="en-US"><Tree treeData={[createNode('one')]} width={400} height={300} checkable onTreeNodeChange={mock.fn()} /></ConfigProvider>);
        expect(screen.getByRole('checkbox', { name: 'Select node' })).toBeTruthy();
    });

    it('updates adaptive default heights on controlled density, size, and pointer rerenders', async () => {
        const treeData = [createNode('one', { priority: 1 }), createNode('two', { priority: 2, height: 24 })];
        const change = mock.fn();
        const view = await render(<ConfigProvider density="compact" size="small"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([32, 24]);
        await view.rerender(<ConfigProvider density="standard" size="small"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([36, 24]);
        await view.rerender(<ConfigProvider density="comfortable" size="large"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([40, 24]);
        await view.rerender(<ConfigProvider density="comfortable" size="large"><Tree size="small" treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([40, 24]);
        coarsePointer = true;
        await view.rerender(<ConfigProvider density="compact" size="small"><Tree treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([48, 24]);
        await view.rerender(<ConfigProvider density="comfortable" size="large"><Tree density="compact" size="small" treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([48, 24]);
        coarsePointer = false;
        await view.rerender(<ConfigProvider density="comfortable" size="large"><Tree density="compact" treeData={treeData} width={400} height={300} onTreeNodeChange={change} /></ConfigProvider>);
        expect(virtualRows).toEqual([32, 24]);
        expect(Array.from(view.container.querySelectorAll('[role="treeitem"]'), node => node.parentElement?.style.height)).toEqual(['32px', '24px']);
        expect(view.container.querySelectorAll('[data-moving]')).toHaveLength(0);
        expect(change).not.toHaveBeenCalled();
    });
    it('labels the keyboard focus target and identifies its selected tree item', async () => {
        const node = createNode('selected');
        const view = await render(<Tree aria-label="Objects" treeData={[node]} selectedKeys={[node.id]} width={400} height={300} onTreeNodeChange={mock.fn()} />);
        const tree = view.container.querySelector('[role="tree"]')!;
        expect(tree.getAttribute('aria-label')).toBe('Objects');
        expect(tree.getAttribute('tabindex')).toBe('0');
        expect(tree.getAttribute('aria-activedescendant')).toBe(view.container.querySelector('[role="treeitem"]')?.id);
    });
    it("preserves node and default explicit heights before adaptive density or coarse defaults", async () => {
        const treeData = [createNode('one', { priority: 1 }), createNode('two', { priority: 2, height: 24 }), createNode('three', { priority: 3, height: 60 })];
        const onTreeNodeChange = mock.fn();
        const view = await render(<Tree treeData={treeData} width={400} height={300} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([36, 24, 60]);
        await view.rerender(<Tree treeData={treeData} width={400} height={300} defaultNodeHeight={36} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([36, 24, 60]);
        coarsePointer = true;
        await view.rerender(<Tree density="comfortable" size="large" treeData={treeData} width={400} height={300} defaultNodeHeight={36} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([36, 24, 60]);
        await view.rerender(<Tree density="compact" size="small" treeData={treeData} width={400} height={300} defaultNodeHeight={44} checkable onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([44, 24, 60]);
        expect(Array.from(view.container.querySelectorAll('[role="treeitem"]'), node => node.parentElement?.style.height)).toEqual(['44px', '24px', '60px']);
        expect(view.container.querySelectorAll('[data-moving]')).toHaveLength(0);
        await view.rerender(<Tree density="compact" treeData={treeData} width={400} height={300} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([48, 24, 60]);
        coarsePointer = false;
        await view.rerender(<Tree density="comfortable" treeData={treeData} width={400} height={300} onTreeNodeChange={onTreeNodeChange}/>);
        expect(virtualRows).toEqual([40, 24, 60]);
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
            await render(<Tree treeData={[node1, node2]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} expandedKeys={[]} selectedKeys={[]}/>);
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
            await render(<Tree treeData={[node1]} height={300} width={400} onTreeNodeChange={onTreeNodeChange} selectedKeys={["1"]} onSelectedKeysChange={onSelect}/>);
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
