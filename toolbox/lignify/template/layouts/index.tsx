import { css } from "@linaria/core";
import RcTree, { useTreeData, type Node} from "@crab-dev/rc-tree";
import { Key, useEffect, useState } from "react";
import { useNavigate, useOutlet } from "react-router";
import demos from "@@@/demos";
import mdxs from "@@@/mdxs";
import sidebar from "@@/docs/sidebar";

const LayoutIndex = () => {
    const [treeData, setTreeData, treeDataUtil] = useTreeData();
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const outlet = useOutlet();
    const navigate = useNavigate();
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                height: 100%;
            `}
        >
            <header
                className={css`
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.025), 0 2px 6px rgba(0,0,0,0.035);
                    height: 50px;
                    flex-shrink: 0;
                    padding-left: 1rem;
                `}
            >
                <div
                    className={css`
                        font-size: 16px;
                        cursor: pointer;
                    `}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Lignify
                </div>
            </header>
            <div
                className={css`
                    display: flex;
                    flex: 1;
                `}
            >
                <aside
                    className={css`
                        width: 250px;
                        border-right: 1px solid #eaeaea;
                    `}
                >
                    <RcTree
                        className={css`
                            margin-top: 1rem;
                        `}
                        treeData={treeData}
                        height={500}
                        width={250}
                        expandedKeys={expandedKeys}
                        onSelect={({
                            node
                        }) => {
                            if (node.type === 1) {
                                navigate(node.id as string);
                            }
                        }}
                        onExpanded={({
                            node
                        }) => {
                            let newExpandedKeys = [...expandedKeys];
                            if (newExpandedKeys.includes(node.id)) {
                                newExpandedKeys = newExpandedKeys.filter(key => key !== node.id);
                            } else {
                                newExpandedKeys.push(node.id);
                            }
                            setExpandedKeys(newExpandedKeys)
                        }}
                        onTreeNodeChange={setTreeData}
                        loadData={async (parentNode) => {
                            const sidebarData: Node[] = sidebar();
                            if (parentNode == null) {
                                return sidebarData.filter(item => item.parent == null);
                            } else {
                                return sidebarData.filter(item => item.parent?.id === parentNode.id);
                            }
                        }}                        
                    />
                </aside>   
                <main
                    className={css`
                        margin-left: 1rem;
                    `}
                >
                    {outlet}
                </main>
            </div>
        </div>
    )
}

export default LayoutIndex;
