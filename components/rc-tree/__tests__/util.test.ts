import { describe, it, expect } from "@jest/globals";
import { getLoadReadyTreeNodeData } from "../src/util";
import { NodeType, type Node } from "../src/type";

describe('getLoadReadyTreeNodeData', () => {
    it("should group nodes by their parent", () => {
        const parent1 = {
            id: 1,
            parent: null,
            type: NodeType.FOLDER,
            title: "标题 一"
        }
    
        const nodes: Node[] = [
            parent1,
            {
                id: 2,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 二"
            },
            {
                id: 3,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 三"
            },
            {
                id: 4,
                parent: null,
                type: NodeType.FOLDER,
                title: "标题 四"
            },
            {
                id: 5,
                parent: parent1,
                type: NodeType.FOLDER,
                title: "标题 五"
            },
            {
                id: 6,
                parent: parent1,
                type: NodeType.FOLDER,
                title: "标题 六"
            },
        ];


        const [rootNodes, childNodes] = getLoadReadyTreeNodeData(nodes);
        expect(rootNodes).toEqual([
            nodes[0],
            nodes[1],
            nodes[2],
            nodes[3]
        ]);
        expect(rootNodes).toMatchSnapshot();
        expect(childNodes).toMatchSnapshot();
    });
});
