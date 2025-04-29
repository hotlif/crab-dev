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

    /**
     * 删除数据
     * @param param  id 或者 ids 数组
     */
    delete(param: Node["id"] | Node["id"][]) {
        if (Array.isArray(param)) {
            this.deleteByFilter(element => param.includes(element.id));
        } else {
            this.deleteByFilter(element => element.id === param);
        }
    }

    /**
     * 删除过滤的数据
     * @param predicate 过滤方法
     * @param thisArg 传入的 this
     */
    deleteByFilter(predicate: (value: Node, index: number, array: Node[]) => unknown, thisArg?: any) {
        this.onTreeNodeChange((newTreeData) => {
            return newTreeData.filter((element, elementIndex, elementArray) => !predicate(element, elementIndex, elementArray), thisArg);
        })
    }

    /**
     * 插入数据
     * @param parent 父节点
     * @param nodes  要插入的数据
     */
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
    const datas = loadReadyNodeData.filter(element => element.parent?.id === parent?.id);
    datas.forEach(element => {
        result.push(element);
        const child = loadReadyNodeData.filter(childElement => childElement.parent?.id === element?.id);
        if (child.length > 0) {
            result.push(...getLoadReadyTreeNodeData(element, loadReadyNodeData));
        }
    });
    return result;
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

