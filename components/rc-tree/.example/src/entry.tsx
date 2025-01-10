import React, { Key, useState } from "react";
import { createRoot } from "react-dom/client";
import RcTree from "../../src/index";
import { NodeType, type Node } from "../../src/type";
import "@crab/rc-virtual/esm/index.styles.css"

const App = () => {
	const [expandedKeys, setExpandedKeys] = useState<Key[]>([])

    return (
        <RcTree
			height={200}
			width={300}
			draggable
			expandedKeys={expandedKeys}
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
			loadData={async (parentNode) => {
				if (parentNode === null) {
					const nodes: Node[] = [];
					for (let i = 1; i < 10000; i += 1) {
						nodes.push({
							id: i,
							type: NodeType.FOLDER,
							title: `节点 ${i}`,
							parent: null
						})
					}
					return nodes;
				} else {
					return []
				}
			}}			
		/>
    )
}

const rootDom = document.querySelector("#root");

if (rootDom != null) {
	const root = createRoot(rootDom);
	root.render(<App />);
}
