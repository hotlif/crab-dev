import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { } from "@crab/rc-hooks";
import { TreeDataUtil } from "../util";
import { Node } from "../type";

const useTreeData = (): [Node[], Dispatch<SetStateAction<Node[]>>, TreeDataUtil] => {
    const [treeData, setTreeData] = useState<Node[]>([]);
    const treeApi = useRef<TreeDataUtil>(new TreeDataUtil({
        treeData,
        onTreeNodeChange: setTreeData
    }));
    return [treeData, setTreeData, treeApi.current]
}

export default useTreeData;
