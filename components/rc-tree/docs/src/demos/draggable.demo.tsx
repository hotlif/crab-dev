import { type Key, useState } from "react"
import RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData } from "../../../src/index";

const DraggableTree = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
	const [selectKeys, setSelectKeys] = useState<Key[]>([]);
	const [treeData, setTreeData, treeDataUtils] = useTreeData();
    return (
		<RcTree
			height={200}
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
								padding: "1rem"
							}}
						>
							<button disabled>添加</button>
							<button disabled>删除</button>
							<button disabled>修改</button>
						</div>
					)
				}
				return (
					<div
						style={{
							backgroundColor: "red",
							padding: "1rem"
						}}
					>
						<button>添加</button>
						<button
							onClick={() => {
								treeDataUtils.delete(node.id);
								hide();
							}}
						>
							删除
						</button>
						<button>修改</button>
					</div>
				)
			}}
			onDragEnd={(event, context) => {
				const over = event.over;
				const active = event.active;
				treeDataUtils.moveNodeOnDrag(active!.id, over!.id, context.overState!.state)
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
			loadData={(parentNode) => {
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
								resolve([{
									id: `${parentNode.id}-0`,
									type: NodeType.FOLDER,
									title: `节点 - ${parentNode.id} - 0`,
									parent: parentNode,
									loadState: LoadStateType.UNLOADED
								},{
									id: `${parentNode.id}-1`,
									type: NodeType.FOLDER,
									title: `节点 - ${parentNode.id} - 1`,
									parent: parentNode,
									loadState: LoadStateType.UNLOADED
								}])
							}, 0)
						});
					}
					return new Promise((resolve) => {
						resolve([]);
					})
				}
			}}			
		/>
    )
}

export default DraggableTree;
