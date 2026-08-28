import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { TreeDataUtil } from "../util.js";
import type { Node } from "../type.js";

const useTreeData = (initialData?: Node[] | (() => Node[])): [Node[], Dispatch<SetStateAction<Node[]>>, TreeDataUtil] => {
    const [treeData, setTreeData] = useState<Node[]>(initialData ?? []);
    const treeApi = useRef<TreeDataUtil>(new TreeDataUtil({
        treeData,
        onTreeNodeChange: setTreeData
    }));
    return [treeData, setTreeData, treeApi.current]
}

export default useTreeData;
