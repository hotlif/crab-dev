import { type UniqueIdentifier } from "@dnd-kit/core";
import { type ReactNode } from "react";

export interface OverState {
    id: UniqueIdentifier,
    activeNode?: Node,
    overNode?: Node,
    state: OverStateEnum
} 

export enum OverStateEnum {
    UPWARD,
    DOWN,
    INSIDE,
}


export enum NodeType {
    FOLDER,
    FILE
}

export enum NodeEditStateType {
    CREATE,
    DELETE,
    UPDATE 
}

export enum LoadStateType {
    UNLOADED,
    LOADING,
    LOADING_COMPLETED,
}

/**
 * 表示树节点的接口。
 */
export interface Node {

    /**
     * 状态
     */
    editState?: NodeEditStateType

    /**
     * 父节点信息
     */
    parent: Node | null

    /**
     * 加载状态
     */
    loadState: LoadStateType

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

    /**
     * 排序字段, 用于树的排序字段
     */
    priority?: number
}
