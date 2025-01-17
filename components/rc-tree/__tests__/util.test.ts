import { describe, it, expect } from "@jest/globals";
import { getLoadReadyTreeNodeData } from "../src/util";
import { LoadStateType, NodeType, type Node } from "../src/type";

describe('getLoadReadyTreeNodeData', () => {
    it("should group nodes by their parent", () => {
        const parent1 = {
            id: 1,
            parent: null,
            loadState: LoadStateType.UNLOADED,
            type: NodeType.FOLDER,
            title: "标题 一"
        }
    
        const parent15 = {
            id: 5,
            parent: parent1,
            type: NodeType.FOLDER,
            loadState: LoadStateType.UNLOADED,
            title: "标题 五"
        }
        
        const nodes: Node[] = [
            parent1,
            {
                id: 2,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 二",
                loadState: LoadStateType.UNLOADED,
            },
            {
                id: 3,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 三",
                loadState: LoadStateType.UNLOADED,
            },
            {
                id: 4,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 四",
                loadState: LoadStateType.UNLOADED,
            },
            parent15,
            {
                id: 6,
                parent: parent15,
                type: NodeType.FOLDER,
                loadState: LoadStateType.UNLOADED,
                title: "标题 六"
            },
        ];

        const resultNodes = getLoadReadyTreeNodeData(null, nodes);
        expect(resultNodes.length).toBe(6)
        expect(resultNodes).toMatchSnapshot();
    });
});
