import { type Node } from "./type";
import { TreeProps } from "./tree";

export class TreeDataUtil {
    private treeData: TreeProps["treeData"];
    private onTreeNodeChange: TreeProps["onTreeNodeChange"];

    constructor(param: {
        treeData: TreeProps["treeData"],
        onTreeNodeChange: TreeProps["onTreeNodeChange"]
    }) {
        this.treeData = param.treeData;
        this.onTreeNodeChange = param.onTreeNodeChange;
    }

    delete(param: Node["id"] | Node["id"][]) {
        if (Array.isArray(param)) {
            this.deleteByFilter(element => param.includes(element.id));
        } else {
            this.deleteByFilter(element => element.id === param);
        }
    }

    deleteByFilter(predicate: (value: Node, index: number, array: Node[]) => unknown, thisArg?: any) {
        this.onTreeNodeChange((newTreeData) => {
            return newTreeData.filter((element, elementIndex, elementArray) => !predicate(element, elementIndex, elementArray), thisArg);
        })
    }

    insert(parent: Node["id"] | Node, nodes: Node[]) {
        if (typeof parent === "string" || typeof parent === "number") {
            this.onTreeNodeChange((newTreeData) => {
                const parentNode = newTreeData.find(element => element.id === parent);
                if (parentNode != null) {
                    return [...newTreeData, ...nodes.map(elemenet => ({ ...elemenet, parentNode}))]
                } else {
                    console.warn(`WARN: To find the corresponding parent node information based on the id, please check if the id is correct. [${parent}]`)
                    return newTreeData;
                }
            })
        } else {
            this.onTreeNodeChange((newTreeData) => {
                return [...newTreeData, ...nodes.map(elemenet => ({ ...elemenet, parent  }))]
            })
        }
    }

    /**
     * 修改节点数据
     */
    update(update: Node) {
        const {
            id: uid,
            ...restUpdateInfo
        } = update;
        this.onTreeNodeChange(newTreeData => {
            for (let i = 0; i < newTreeData.length; i += 1) {
                if (newTreeData[i].id === uid) {
                    newTreeData[i] = {
                        ...newTreeData[i],
                        ...restUpdateInfo
                    }
                    break;
                }
            }
            return newTreeData.slice();
        });
    }
}


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
    return result.sort((a, b) => {
        if ((a.priority ?? 0) > (b.priority ?? 0)) {
            return 1;
        } else if ((a.priority ?? 0) > (b.priority ?? 0)) {
            return -1;
        } else {
            return 0;
        }
    })
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

