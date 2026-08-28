import { describe, expect, it, render, act } from "@crab-dev/wake/test/react";
import useTreeData from "../hooks/useTreeData.js";
import { LoadStateType, NodeType, type Node } from "../type.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const TestComponent = ({ onData }: {
    onData: (data: ReturnType<typeof useTreeData>) => void;
}) => {
    const result = useTreeData();
    onData(result);
    return null;
};
describe("useTreeData", () => {
    it("returns initial empty array", async () => {
        let hookResult: ReturnType<typeof useTreeData> | null = null;
        await render(<TestComponent onData={(data) => { hookResult = data; }}/>);
        expect(hookResult).not.toBeNull();
        const [treeData, , treeDataUtil] = hookResult!;
        expect(treeData).toEqual([]);
        expect(treeDataUtil).toBeDefined();
    });
    it("returns a stable TreeDataUtil instance across renders", async () => {
        const refs: Array<ReturnType<typeof useTreeData>[2]> = [];
        const { rerender } = await render(<TestComponent onData={(data) => { refs.push(data[2]); }}/>);
        await rerender(<TestComponent onData={(data) => { refs.push(data[2]); }}/>);
        expect(refs[0]).toBe(refs[1]);
    });
    it("allows updating tree data via setter", async () => {
        let hookResult: ReturnType<typeof useTreeData> | null = null;
        await render(<TestComponent onData={(data) => { hookResult = data; }}/>);
        const [, setTreeData] = hookResult!;
        const newNode: Node = {
            id: "test",
            type: NodeType.FOLDER,
            title: "Test",
            parent: null,
            loadState: LoadStateType.UNLOADED,
        };
        await act(() => {
            setTreeData([newNode]);
        });
        expect(hookResult![0]).toHaveLength(1);
        expect(hookResult![0][0].id).toBe("test");
    });
});
