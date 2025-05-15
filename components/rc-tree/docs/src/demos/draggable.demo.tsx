import { type Key, useState } from "react"
import RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData, TreeProps } from "../../../src/index";

const DraggableTree = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
	const [selectKeys, setSelectKeys] = useState<Key[]>([]);
	const [treeData, setTreeData, treeDataUtils] = useTreeData();

	const loadData: TreeProps["loadData"] = (parentNode) => {
		if (parentNode === null) {
			const nodes: Node[] = [];
			for (let i = 1; i < 10; i += 1) {
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
							data.push({
								id: `${parentNode.id}-${i}`,
								type: NodeType.FOLDER,
								title: `节点 - ${parentNode.id} - ${i}`,
								parent: parentNode,
								loadState: LoadStateType.UNLOADED
							})
						}
						resolve(data);
					}, 300)
				});
			}
			return new Promise((resolve) => {
				resolve([]);
			})
		}
	}
    return (
		<RcTree
			height={400}
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
			rendererContextMenu={({
				node,
				hide
			}) => {
				if (node === null) {
					return (
						<div
							style={{
								backgroundColor: "red",
								padding: "1rem",
							}}
						>
							<button disabled>添加</button>
							<br />
							<button disabled>删除</button>
							<br />
							<button
								onClick={() => {
									treeDataUtils.reloadChildrenByParent({
										parent: null,
										loadData,
										expandedKeys,
									})
								}}
							>
								刷新所有节点
							</button>
						</div>
					)
				}
				return (
					<div
						style={{
							backgroundColor: "red",
							padding: "1rem",
						}}
					>
						<button>添加</button>
						<br />
						<button
							onClick={() => {
								treeDataUtils.delete(node.id);
								hide();
							}}
						>
							删除
						</button>
						<br />
						<button
							onClick={() => {
								treeDataUtils.reloadChildrenByParent({
									parent: node,
									loadData,
									expandedKeys,
								})
							}}
						>
							刷新子节点数据
						</button>
					</div>
				)
			}}
			onDragEnd={(event, context) => {
				const over = event.over;
				const active = event.active;
				if (context.overState?.state != null) {
					treeDataUtils.moveNodeOnDrag(active!.id, over!.id, context.overState.state)
				}
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

export default DraggableTree;
