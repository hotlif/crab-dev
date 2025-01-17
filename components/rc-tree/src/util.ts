import { type Node } from "./type";

/**
 * 从给定的父节点开始检索准备加载的树节点数据。
 *
 * @param parent - 要开始加载树节点数据的父节点。可以为 null。
 * @param loadReadyNodeData - 准备加载的节点数组。
 * @returns 准备加载的节点数组，包括它们的子节点。
 */
export const getLoadReadyTreeNodeData = (parent: Node | null, loadReadyNodeData: Node[]): Node[] => {
    const result: Node[] = [];
    const nodesData: Node[] = [];
    const otherData: Node[] = [];
    loadReadyNodeData.forEach(node => {
        if (parent?.id === node?.parent?.id) {
            nodesData.push({
                ...node,
            });
        } else {
            otherData.push(node);
        }
    })
    nodesData.forEach(element => {
        result.push({
            ...element,
        });
        const childrenNodes: Node[] = []
        const otherChildrenData: Node[] = []
        otherData.forEach(node => {
            if (node.parent?.id === element.id) {
                childrenNodes.push({
                    ...node,
                });
            } else {
                otherChildrenData.push(node);
            }
        })
        result.push(...childrenNodes);
        childrenNodes.forEach(cNode => {
            const data = getLoadReadyTreeNodeData(cNode, otherChildrenData)
            result.push(...data)
        });
    })
    return result
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

