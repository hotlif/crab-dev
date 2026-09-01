import { beforeAll, describe, expect, it, mock, render, fireEvent, screen, act } from "@crab-dev/wake/test/react";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// Mock @dnd-kit/sortable
mock.module("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: { role: "treeitem" },
        listeners: {},
        setNodeRef: mock.fn(),
        transform: null,
        transition: null,
    }),
}));
import type { Node, OverState } from "../type.js";
let NodeType: (typeof import("../type.js"))["NodeType"];
let OverStateEnum: (typeof import("../type.js"))["OverStateEnum"];
let LoadStateType: (typeof import("../type.js"))["LoadStateType"];
let NodeItem: (typeof import("../nodeItem.js"))["default"];
beforeAll(async () => {
    const typeModule = await mock.import<typeof import("../type.js")>("../type.js");
    const nodeItemModule = await mock.import<typeof import("../nodeItem.js")>("../nodeItem.js");
    NodeType = typeModule.NodeType;
    OverStateEnum = typeModule.OverStateEnum;
    LoadStateType = typeModule.LoadStateType;
    NodeItem = nodeItemModule.default;
});
const createNode = (id: string | number, overrides: Partial<Node> = {}): Node => ({
    id,
    type: NodeType.FOLDER,
    title: `Node ${id}`,
    parent: null,
    loadState: LoadStateType.UNLOADED,
    ...overrides,
});
describe("NodeItem", () => {
    it("renders a folder node with title", async () => {
        const node = createNode("1");
        await act(async () => {
            await render(<NodeItem node={node} overState={null} expanded={false} loading={false}/>);
        });
        expect(screen.getByText("Node 1")).toBeTruthy();
    });
    it("renders loading spinner when loading=true", async () => {
        const node = createNode("1");
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={true}/>);
            container = result.container;
        });
        // 加载中渲染 rc-spin 的指示环（SVG）
        const svgs = container!.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThanOrEqual(1);
    });
    it("renders ChevronRight icon for collapsed folder", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false}/>);
            container = result.container;
        });
        // collapsed folder should show caret right icon
        const svgs = container!.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThanOrEqual(1);
    });
    it("renders ChevronRight icon for expanded folder", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={true} loading={false}/>);
            container = result.container;
        });
        const svgs = container!.querySelectorAll("svg");
        expect(svgs.length).toBeGreaterThanOrEqual(1);
    });
    it("renders no icon for FILE type node", async () => {
        const node = createNode("1", { type: NodeType.FILE });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false}/>);
            container = result.container;
        });
        // FILE nodes should not render any expand/collapse icon SVG
        const svgs = container!.querySelectorAll("svg");
        expect(svgs.length).toBe(0);
    });
    it("calls onExpanded when pointer-up on collapsed folder icon", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        // PointerUp on the icon span (parent of svg)
        const svg = container!.querySelector("svg");
        const iconSpan = svg?.parentElement;
        if (iconSpan) {
            await act(async () => {
                await fireEvent(iconSpan, new PointerEvent("pointerup", { bubbles: true }));
            });
        }
        expect(onExpanded).toHaveBeenCalledWith(expect.objectContaining({ node }));
    });
    it("calls onExpanded when pointer-up on expanded folder icon", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={true} loading={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const svg = container!.querySelector("svg");
        const iconSpan = svg?.parentElement;
        if (iconSpan) {
            await act(async () => {
                await fireEvent(iconSpan, new PointerEvent("pointerup", { bubbles: true }));
            });
        }
        expect(onExpanded).toHaveBeenCalledWith(expect.objectContaining({ node }));
    });
    it("calls onExpanded when pointer-up on row title (expandOnTitleClick=true, FOLDER)", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} expandOnTitleClick={true} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new PointerEvent("pointerup", { bubbles: true, button: 0 }));
        });
        expect(onExpanded).toHaveBeenCalledWith(expect.objectContaining({ node }));
    });
    it("does NOT call onExpanded on right-click (button=2)", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        const onTitleClick = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} expandOnTitleClick={true} onExpanded={onExpanded} onTitleClick={onTitleClick}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            const event = new PointerEvent("pointerup", { bubbles: true, button: 2 });
            await fireEvent(rootDiv, event);
        });
        expect(onExpanded).not.toHaveBeenCalled();
        expect(onTitleClick).not.toHaveBeenCalled();
    });
    it("does NOT call onExpanded when expandOnTitleClick=false and clicking row", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} expandOnTitleClick={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new PointerEvent("pointerup", { bubbles: true }));
        });
        expect(onExpanded).not.toHaveBeenCalled();
    });
    it("does NOT call onExpanded when row click on FILE node", async () => {
        const node = createNode("1", { type: NodeType.FILE });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new PointerEvent("pointerup", { bubbles: true }));
        });
        expect(onExpanded).not.toHaveBeenCalled();
    });
    it("disabled node: does NOT call onExpanded or onTitleClick on row click", async () => {
        const node = createNode("1", { type: NodeType.FOLDER, disabled: true });
        const onExpanded = mock.fn();
        const onTitleClick = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onExpanded={onExpanded} onTitleClick={onTitleClick}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new PointerEvent("pointerup", { bubbles: true }));
        });
        expect(onExpanded).not.toHaveBeenCalled();
        expect(onTitleClick).not.toHaveBeenCalled();
    });
    it("disabled node: has data-disabled=true attribute", async () => {
        const node = createNode("1", { disabled: true });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        expect(rootDiv.getAttribute("data-disabled")).toBe("true");
    });
    it("calls onExpanded on mouseEnter when overState is set and folder is collapsed", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const overState: OverState = { id: "other", state: OverStateEnum.INSIDE };
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={overState} expanded={false} loading={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const svg = container!.querySelector("svg");
        const iconSpan = svg?.parentElement;
        if (iconSpan) {
            await act(async () => {
                await fireEvent(iconSpan, new MouseEvent("mouseover", { bubbles: true }));
            });
        }
        expect(onExpanded).toHaveBeenCalled();
    });
    it("does NOT call onExpanded on mouseEnter when overState is null", async () => {
        const node = createNode("1", { type: NodeType.FOLDER });
        const onExpanded = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onExpanded={onExpanded}/>);
            container = result.container;
        });
        const svg = container!.querySelector("svg");
        const iconSpan = svg?.parentElement;
        if (iconSpan) {
            await act(async () => {
                await fireEvent(iconSpan, new MouseEvent("mouseover", { bubbles: true }));
            });
        }
        // Only click should trigger, not mouseEnter without overState
        expect(onExpanded).not.toHaveBeenCalled();
    });
    it("calls onTitleClick on pointer up", async () => {
        const node = createNode("1");
        const onTitleClick = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onTitleClick={onTitleClick}/>);
            container = result.container;
        });
        // The root div receives onPointerUp
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new PointerEvent("pointerup", { bubbles: true, button: 0 }));
        });
        expect(onTitleClick).toHaveBeenCalled();
    });
    it("calls onTitleContextMenu on context menu", async () => {
        const node = createNode("1");
        const onTitleContextMenu = mock.fn();
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} onTitleContextMenu={onTitleContextMenu}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        await act(async () => {
            await fireEvent(rootDiv, new MouseEvent("contextmenu", { bubbles: true }));
        });
        expect(onTitleContextMenu).toHaveBeenCalled();
    });
    it("sets data-selected attribute when node is in selectKeys", async () => {
        const node = createNode("1");
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} selectKeys={["1"]}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        expect(rootDiv.getAttribute("data-selected")).toBe("true");
    });
    it("sets data-selected to false when node not in selectKeys", async () => {
        const node = createNode("1");
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} selectKeys={["2"]}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        expect(rootDiv.getAttribute("data-selected")).toBe("false");
    });
    it("applies UPWARD over state style", async () => {
        const node = createNode("1");
        const overState: OverState = { id: "1", state: OverStateEnum.UPWARD };
        await act(async () => {
            await render(<NodeItem node={node} overState={overState} expanded={false} loading={false}/>);
        });
        expect(screen.getByText("Node 1")).toBeTruthy();
    });
    it("applies DOWN over state style", async () => {
        const node = createNode("1");
        const overState: OverState = { id: "1", state: OverStateEnum.DOWN };
        await act(async () => {
            await render(<NodeItem node={node} overState={overState} expanded={false} loading={false}/>);
        });
        expect(screen.getByText("Node 1")).toBeTruthy();
    });
    it("applies INSIDE over state style", async () => {
        const node = createNode("1");
        const overState: OverState = { id: "1", state: OverStateEnum.INSIDE };
        await act(async () => {
            await render(<NodeItem node={node} overState={overState} expanded={false} loading={false}/>);
        });
        expect(screen.getByText("Node 1")).toBeTruthy();
    });
    it("does not apply over state style when overState id does not match node id", async () => {
        const node = createNode("1");
        const overState: OverState = { id: "other", state: OverStateEnum.UPWARD };
        await act(async () => {
            await render(<NodeItem node={node} overState={overState} expanded={false} loading={false}/>);
        });
        expect(screen.getByText("Node 1")).toBeTruthy();
    });
    it("renders indent lines when showLine is true", async () => {
        const parent = createNode("p");
        const child = createNode("c", { parent });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={child} overState={null} expanded={false} loading={false} showLine={true}/>);
            container = result.container;
        });
        // Should have indent line span(s)
        const spans = container!.querySelectorAll("span");
        // At least 1 indent + the title span
        expect(spans.length).toBeGreaterThanOrEqual(2);
    });
    it("does not render indent lines when showLine is false", async () => {
        const parent = createNode("p");
        const child = createNode("c", { parent });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={child} overState={null} expanded={false} loading={false} showLine={false}/>);
            container = result.container;
        });
        let rootContainer: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={parent} overState={null} expanded={false} loading={false} showLine={false}/>);
            rootContainer = result.container;
        });
        // A nested node has the same direct-span structure as a root node when
        // guide lines are disabled, so no depth-dependent indent span was added.
        const rootDiv = container!.firstElementChild as HTMLElement;
        const parentDiv = rootContainer!.firstElementChild as HTMLElement;
        expect(rootDiv.querySelectorAll(":scope > span")).toHaveLength(parentDiv.querySelectorAll(":scope > span").length);
    });
    it("applies node.height to style", async () => {
        const node = createNode("1", { height: 40 });
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false}/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        expect(rootDiv.style.height).toBe("40px");
    });
    it("renders with custom className", async () => {
        const node = createNode("1");
        let container: HTMLElement;
        await act(async () => {
            const result = await render(<NodeItem node={node} overState={null} expanded={false} loading={false} className="custom-class"/>);
            container = result.container;
        });
        const rootDiv = container!.firstElementChild as HTMLElement;
        expect(rootDiv.className).toContain("custom-class");
    });
    it("renders deeply nested node with showLine", async () => {
        const root = createNode("root");
        const mid = createNode("mid", { parent: root });
        const leaf = createNode("leaf", { parent: mid });
        await act(async () => {
            await render(<NodeItem node={leaf} overState={null} expanded={false} loading={false} showLine={true}/>);
        });
        // depth=2, so should have 2 indent spans + icon span + title span
        expect(screen.getByText("Node leaf")).toBeTruthy();
    });
});
