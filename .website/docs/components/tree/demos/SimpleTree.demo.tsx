/**
 * title = "简单的树组件"
 * description = "这是一个简单的树组件示例，支持懒加载"
 */

import { type Key, useState } from "react";
import Tree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData, type TreeProps } from "@crab/rc-tree";

const SimpleTree = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
	const [selectKeys, setSelectKeys] = useState<Key[]>([]);
	const [treeData, setTreeData] = useTreeData();

	const loadData: TreeProps["loadData"] = (parentNode) => {
		if (parentNode === null) {
			const nodes: Node[] = [];
			for (let i = 1; i < 2; i += 1) {
				nodes.push({
					id: i,
					type: NodeType.FOLDER,
					title: `节点 ${i}`,
					parent: null,
					loadState: LoadStateType.UNLOADED
				})
			}
			return new Promise((resolve) => {
				resolve(nodes)
			});
		} else {
			const depth = getTreeNodeDepth(parentNode);
			if (depth <= 10) {
				return new Promise((resolve) => {
					setTimeout(() => {
						const data = [];
						for (let i = 0; i < 2065; i += 1) {
							if (i % 9 === 0) {
								data.push({
									id: `${parentNode.id}-${i}`,
									type: NodeType.FOLDER,
									title: `节点 - ${parentNode.id} - ${i} 这是一个非常非常非常长的节点信息`,
									parent: parentNode,
									loadState: LoadStateType.UNLOADED
								})
							} else {
								data.push({
									id: `${parentNode.id}-${i}`,
									type: NodeType.FOLDER,
									title: `节点 - ${parentNode.id} - ${i}`,
									parent: parentNode,
									loadState: LoadStateType.UNLOADED
								})
							}
							
						}
						resolve(data);
					}, 0)
				});
			}
			return new Promise((resolve) => {
				resolve([]);
			})
		}
	}
    return (
		<Tree
			height={300}
			width={300}
			treeData={treeData}
			draggable
			onTreeNodeChange={setTreeData}
			expandedKeys={expandedKeys}
			selectKeys={selectKeys}
			onSelect={({
				selectKeys
			}) => {
				setSelectKeys(selectKeys)
			}}
			onExpanded={({
				node,
			}) => {
				if (expandedKeys.includes(node.id)) {
					const keys = expandedKeys.filter(element => element !== node.id);
					setExpandedKeys(keys)
				} else {
					expandedKeys.push(node.id);
					setExpandedKeys([...expandedKeys]);
				}
			}}
			loadData={loadData}			
		/>
    )
}

export default SimpleTree;
