
import { LoadStateType, NodeType } from "@crab-dev/rc-tree";

const Sidebar = () => {
    const button = {
        title: "Buttons - 按钮",
        id: "buttons",
        parent: null,
        loadState: LoadStateType.UNLOADED,
        type: NodeType.FOLDER,
    }

    return [button, {
        title: "SimpleButton - 简单按钮",
        id: "/docs/buttons/SimpleButton",
        parent: button,
        loadState: LoadStateType.UNLOADED,
        type: NodeType.FILE,
    }]
}

export default Sidebar;