import Decimal from "decimal.js";
import { LoadStateType, type Node, OverStateEnum } from "./type";
import { type TreeProps } from "./tree";


const sortRules = (a: Node, b: Node) => {
    const aPriority = a.priority ?? 0;
    const bPriority = b.priority ?? 0;
    if (aPriority === bPriority) {
        return 0;
    } else if (aPriority < bPriority) {
        return -1;
    } else {
        return 1;
    }
}

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


    /**
     * 重新加载指定父节点的子节点数据。
     *
     * 此方法会先将指定父节点的加载状态设置为“加载中”，
     * 然后调用传入的异步加载函数 `func` 获取新的子节点数据。
     * 加载完成后，会将父节点的加载状态设置为“加载完成”，
     * 并用新获取的子节点替换原有的子节点。
     *
     * @param parent 父节点的唯一标识符（id）。
     * @param func   异步加载子节点数据的函数，接收父节点数据作为参数，返回新的子节点数据。
     */
    async reloadChildrenByParentId(parent: Node["id"], func: TreeProps["loadData"]) {
        let parentData = null;
        this.onTreeNodeChange(newTreeData => {
            for (let i = 0; i < newTreeData.length; i += 1) {
                if (newTreeData[i].id === parent) {
                    newTreeData[i].loadState = LoadStateType.LOADING;
                    parentData = newTreeData[i];
                    break;
                }
            }
            return newTreeData.slice();
        });
    
        const result = await func?.(parentData);

        if (result != null) {
            this.onTreeNodeChange(newTreeData => {
                for (let i = 0; i < newTreeData.length; i += 1) {
                    if (newTreeData[i].id === parent) {
                        newTreeData[i].loadState = LoadStateType.LOADING_COMPLETED;
                        break;
                    }
                }
                const deleteOldNodes = newTreeData.filter(element => element.parent?.id === parent);
                return [...deleteOldNodes, ...result];
            });
        }
    }


    /**
     * 在树结构中根据拖放操作移动节点。
     *
     * @param dragNodeId - 被拖动节点的 ID。
     * @param targetNodeId - 目标节点的 ID，即拖动节点放置的位置。
     * @param position - 拖动节点相对于目标节点的位置，可以是 `OverStateEnum` 的以下值之一：
     *                   - `UPWARD`: 将拖动节点放置在目标节点的上方。
     *                   - `DOWN`: 将拖动节点放置在目标节点的下方。
     *                   - `INSIDE`: 将拖动节点作为目标节点的子节点。
     *
     * @throws {Error} 如果在树数据中找不到目标节点。
     *
     * @remarks
     * - 此方法根据新位置更新拖动节点的 `priority`（优先级）。
     * - 如果位置为 `INSIDE`，则更新拖动节点的父节点为目标节点。
     * - 此方法确保操作后树结构的完整性。
     *
     * @example
     * ```typescript
     * moveNodeOnDrag('node1', 'node2', OverStateEnum.UPWARD);
     * ```
     */
    moveNodeOnDrag(dragNodeId: Node["id"], targetNodeId: Node["id"], position: OverStateEnum) {
        this.onTreeNodeChange(newTreeData => {
            const dragNode = newTreeData.find(element => element.id === dragNodeId);
            const targetNode = newTreeData.find(element => element.id === targetNodeId);

            const dragNodeIndex = newTreeData.findIndex(element => element.id === dragNode?.id);
   
            const targetNodes = newTreeData.filter(element => element?.parent?.id === (targetNode?.parent?.id ?? null)).sort(sortRules);

            let previousNode: Node | null = null;
            let nextNode: Node | null = null;

            const targetIndex = targetNodes.findIndex(element => element.id === targetNode?.id);

            if (targetIndex === -1) {
                throw new Error(`[TreeDataUtil::moveNodeOnDrag]: target node not found in the tree data.`);
            }

            if (targetIndex < targetNodes.length - 1) {
                nextNode = targetNodes[targetIndex + 1];
            }

            if (targetIndex > 0) {
                previousNode = targetNodes[targetIndex - 1];
            }

            if (position === OverStateEnum.UPWARD) {
                newTreeData[dragNodeIndex].parent = targetNode?.parent ?? null;
                newTreeData[dragNodeIndex].priority = new Decimal(previousNode?.priority ?? 0)
                                                .plus(new Decimal(targetNodes[targetIndex].priority ?? 0))
                                                .div(2).toNumber();
            } else if (position === OverStateEnum.DOWN) {
                newTreeData[dragNodeIndex].parent = targetNode?.parent ?? null;
                if (nextNode != null) {
                    newTreeData[dragNodeIndex].priority = new Decimal(nextNode?.priority ?? 0)
                                    .plus(new Decimal(targetNodes[targetIndex].priority ?? 0))
                                    .div(2).toNumber();
                } else {
                    newTreeData[dragNodeIndex].priority = (targetNodes[targetIndex].priority ?? 0) + 1;
                }
            } else if (position === OverStateEnum.INSIDE) {
                newTreeData[dragNodeIndex]!.parent = targetNode ?? null;
                newTreeData[dragNodeIndex]!.priority = newTreeData.filter(element => element?.parent?.id === (targetNode?.id ?? null)).length + 1;
            }
            return newTreeData.slice();
        })
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
    const datas = loadReadyNodeData.filter(element => element.parent?.id === parent?.id).sort(sortRules);
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

