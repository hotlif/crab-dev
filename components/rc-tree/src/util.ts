import Decimal from "decimal.js";
import { LoadStateType, NodeType, type Node, OverStateEnum } from "./type.js";
import { type TreeProps } from "./tree.js";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    insert(parent: Node, nodes: Node[]) {
        this.onTreeNodeChange((newTreeData) => [...newTreeData, ...nodes.map(elemenet => ({ ...elemenet, parent }))]);
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
     * 此方法会先将父节点的加载状态设置为“加载中”，然后调用 `loadData` 方法异步加载子节点数据。
     * 加载完成后，如果有新数据返回，则会将父节点的加载状态设置为“加载完成”，并用新数据替换原有的子节点。
     *
     * @param params - 参数对象
     * @param params.parent 指定的父节点，如果为 null，则表示根节点
     * @param params.loadData 用于加载子节点数据的异步函数
     * @param params.expandedKeys 当前已展开的节点 key 列表
     *
     * @returns Promise<void>
     */
    async reloadChildrenByParent({
        parent,
        loadData,
        expandedKeys
    }: {
        parent: Node | null,
        loadData: TreeProps["loadData"]
        expandedKeys: TreeProps["expandedKeys"]
    }) {
        this.onTreeNodeChange(newTreeData => {
            for (let i = 0; i < newTreeData.length; i += 1) {
                if (newTreeData[i].id === parent?.id) {
                    newTreeData[i].loadState = LoadStateType.LOADING;
                    break;
                }
            }
            return newTreeData.slice();
        });
    
        const result = await loadDataFunc?.({
            parentNode: parent,
            loadData,
            expandedKeys
        });

        if (result != null) {
            this.onTreeNodeChange(newTreeData => {
                if (parent === null) {
                    return result.slice();
                }

                for (let i = 0; i < newTreeData.length; i += 1) {
                    if (newTreeData[i].id === parent?.id) {
                        newTreeData[i].loadState = LoadStateType.LOADING_COMPLETED;
                        break;
                    }
                }

                const oldNodes = newTreeData.filter(element => !belongsToNode(parent, element));

                return [...oldNodes, ...result];
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
    /**
     * 展开所有 FOLDER 类型节点。
     * @param onExpandedKeysChange 用于更新 expandedKeys 的回调
     */
    expandAll(onExpandedKeysChange: (keys: Node["id"][]) => void): void {
        const keys = this.treeData
            .filter(node => node.type === NodeType.FOLDER)
            .map(node => node.id);
        onExpandedKeysChange(keys);
    }

    /**
     * 折叠所有节点。
     * @param onExpandedKeysChange 用于更新 expandedKeys 的回调
     */
    collapseAll(onExpandedKeysChange: (keys: Node["id"][]) => void): void {
        onExpandedKeysChange([]);
    }

    moveNodeOnDrag(dragNodeId: Node["id"], targetNodeId: Node["id"], position: OverStateEnum) {
        this.onTreeNodeChange(newTreeData => {
            const dragNode = newTreeData.find(element => element.id === dragNodeId);
            const targetNode = newTreeData.find(element => element.id === targetNodeId);

            if (dragNode == null) {
                return newTreeData;
            }
            if (targetNode == null) {
                return newTreeData;
            }
            if (belongsToNode(dragNode, targetNode)) {
                return newTreeData;
            }

            const dragNodeIndex = newTreeData.findIndex(element => element.id === dragNode?.id);
   
            const targetNodes = newTreeData.filter(element => (element?.parent?.id ?? null) === (targetNode?.parent?.id ?? null)).sort(sortRules);

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
                if (previousNode != null) {
                    newTreeData[dragNodeIndex].priority = new Decimal(previousNode?.priority ?? 0)
                        .plus(new Decimal(targetNodes[targetIndex].priority ?? 0))
                        .div(2).toNumber();
                } else {
                    if (targetNodes.length === 0) {
                        newTreeData[dragNodeIndex].priority = 1;
                    } else {
                        newTreeData[dragNodeIndex].priority = new Decimal(targetNodes[0].priority ?? 0).div(2).toNumber();
                    }
                }

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

/**
 * 判断目标节点是否属于指定父节点的子孙节点。
 *
 * @param parent - 父节点
 * @param target - 目标节点
 * @returns 如果 target 是 parent 的子孙节点，则返回 true，否则返回 false
 */
export const belongsToNode = (parent: Node, target: Node): boolean => {
    if (target.parent == null) {
        return false;
    } else if (target.parent?.id === parent.id) {
        return true;
    } else if(target.parent) {
        return belongsToNode(parent, target.parent)
    } else {
        return false;
    }
}

/**
 * 获取某节点的所有后代节点 id（基于平铺 treeData）。
 */
export const getDescendantIds = (node: Node, treeData: Node[]): Node["id"][] => {
    const result: Node["id"][] = [];
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop()!;
        const children = treeData.filter(n => n.parent?.id === current.id);
        children.forEach(child => {
            result.push(child.id);
            stack.push(child);
        });
    }
    return result;
};

/**
 * 计算半选 key 列表。
 * FOLDER 节点中：有后代在 checkedKeys 里但自身不在 → 半选。
 */
export const getHalfCheckedKeys = (checkedKeys: Node["id"][], treeData: Node[]): Node["id"][] => {
    const checkedSet = new Set(checkedKeys);
    const halfChecked: Node["id"][] = [];
    treeData.filter(n => n.type === NodeType.FOLDER).forEach(folder => {
        if (checkedSet.has(folder.id)) return;
        const descendants = getDescendantIds(folder, treeData);
        if (descendants.some(id => checkedSet.has(id))) {
            halfChecked.push(folder.id);
        }
    });
    return halfChecked;
};

export const loadDataFunc = async ({
    parentNode,
    loadData,
    expandedKeys
}: {
    parentNode: Node | null,
    loadData: TreeProps["loadData"],
    expandedKeys: TreeProps["expandedKeys"]
}) => {
    const nodes = await loadData?.(parentNode);
    if (nodes) {
        const data = nodes.map((node, index) => ({...node, priority: (node.priority ?? index) + 1, parent: parentNode}));
        for (let i = 0; i < nodes.length; i += 1) {
            const node = data[i];
            if (expandedKeys?.includes(node.id)) {
                const nextNode = await loadDataFunc({
                    parentNode: node,
                    loadData,
                    expandedKeys
                });
                data.push(...nextNode);
                node.loadState = LoadStateType.LOADING_COMPLETED;
            }
        }
        return data;
    } else {
        return [];
    }
}
