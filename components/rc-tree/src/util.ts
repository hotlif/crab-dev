import { type Node } from "./type";

export const getLoadReadyTreeNodeData = (loadReadyNodeData: Node[]): [Node[], Node[][]] => {
    const rootNodes: Node[] = [];
    const childNodes: Node[][] = [];
    for (let i = 0; i < loadReadyNodeData.length; i += 1) {
        const node = loadReadyNodeData[i];
        if (node.parent == null) {
            rootNodes.push(node);
            continue;
        }
        const nodeIndex = childNodes.findIndex(nodes => nodes.find(n => n.parent === node.parent));
        if (nodeIndex === -1) {
            childNodes.push([node]);
        } else {
            childNodes[nodeIndex].push(node);
        }
    }
    return [rootNodes, childNodes];
}


export const getTreeNodeDepth = (node: Node) => {
    let parentNode: Node | null = node;
    let depth = 0;
    while(true) {
        if (parentNode?.parent == null) {
            break;
        }
        parentNode = parentNode.parent;
        depth += 1;
    }
    return depth;
}
