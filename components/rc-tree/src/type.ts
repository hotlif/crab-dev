import { type UniqueIdentifier } from "@dnd-kit/core";
import { type ReactNode } from "react";

export enum NodeType {
    FOLDER,
    FILE
}

export enum NodeStateType {
    CREATE,
    DELETE,
    UPDATE 
}

/**
 * 表示树节点的接口。
 */
export interface Node {

    /**
     * 状态
     */
    state?: NodeStateType

    /**
     * 父节点信息
     */
    parent: Node | null

    /**
     * 当前节点类型
     */
    type: NodeType,
    
    /**
     * 节点标题
     */
    title: ReactNode,

    /**
     * 节点的唯一标识
     */
    id: UniqueIdentifier,

    /**
     * 节点是否被禁用
     */
    disabled?: boolean

    /**
     * 节点高度, 默认 24px
     */
    height?: number
}
