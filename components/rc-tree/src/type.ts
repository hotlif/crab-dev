import type { ReactNode } from "react";

/** 稳定的树节点标识，不依赖内部拖拽实现。 */
export type TreeNodeId = string | number;

export interface OverState {
    id: TreeNodeId,
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
    id: TreeNodeId,

    /**
     * 节点是否被禁用
     */
    disabled?: boolean

    /**
     * 节点前置图标，渲染在展开图标与标题之间
     */
    icon?: ReactNode

    /**
     * 显式节点高度，优先于 Tree 的 defaultNodeHeight 和自适应默认值；调用方负责触控目标。
     */
    height?: number

    /**
     * 排序字段, 用于树的排序字段
     */
    priority?: number
}
