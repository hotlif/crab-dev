/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, afterEach } from "@jest/globals";
import { act } from "react";
import { cleanup, render } from "@testing-library/react";
import useTreeData from "../hooks/useTreeData.js";
import { LoadStateType, NodeType, type Node } from "../type.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const TestComponent = ({ onData }: { onData: (data: ReturnType<typeof useTreeData>) => void }) => {
    const result = useTreeData();
    onData(result);
    return null;
};

describe("useTreeData", () => {
    afterEach(() => {
        cleanup();
    });

    it("returns initial empty array", () => {
        let hookResult: ReturnType<typeof useTreeData> | null = null;
        render(<TestComponent onData={(data) => { hookResult = data; }} />);

        expect(hookResult).not.toBeNull();
        const [treeData, , treeDataUtil] = hookResult!;
        expect(treeData).toEqual([]);
        expect(treeDataUtil).toBeDefined();
    });

    it("returns a stable TreeDataUtil instance across renders", () => {
        const refs: any[] = [];
        const { rerender } = render(<TestComponent onData={(data) => { refs.push(data[2]); }} />);
        rerender(<TestComponent onData={(data) => { refs.push(data[2]); }} />);

        expect(refs[0]).toBe(refs[1]);
    });

    it("allows updating tree data via setter", () => {
        let hookResult: ReturnType<typeof useTreeData> | null = null;
        render(<TestComponent onData={(data) => { hookResult = data; }} />);

        const [, setTreeData] = hookResult!;

        const newNode: Node = {
            id: "test",
            type: NodeType.FOLDER,
            title: "Test",
            parent: null,
            loadState: LoadStateType.UNLOADED,
        };

        act(() => {
            setTreeData([newNode]);
        });

        expect(hookResult![0]).toHaveLength(1);
        expect(hookResult![0][0].id).toBe("test");
    });
});
