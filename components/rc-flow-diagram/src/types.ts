import type { Pt, Side } from '@crab-dev/rc-canvas';

/** 端口 ID 在节点内稳定；不依赖字段顺序或屏幕位置。 */
export interface FlowEndpoint {
    nodeId: string;
    portId: string;
}

export interface FlowPort extends FlowEndpoint {
    /** 世界坐标；可由节点矩形、字段行或自定义形状计算。 */
    position: Pt;
    side: Side;
    direction: 'input' | 'output' | 'both';
}

export interface FlowConnection {
    source: FlowEndpoint;
    target: FlowEndpoint;
}

export interface FlowConnectionChange extends FlowConnection {
    /** 存在时为改接已有边；调用方应保留其业务属性。 */
    edgeId?: string;
}

export interface FlowConnectionEdge extends FlowConnection {
    id: string;
    /** 例如只读的入站引用边。默认 true。 */
    editable?: boolean;
}

export type InteractionCancelReason = 'escape' | 'blur' | 'hidden' | 'disabled' | 'inactive' | 'revision' | 'pointer-cancel' | 'capture-lost' | 'replaced' | 'unmount' | 'cancel';

export type InteractionEvent<T> =
    | { phase: 'start' | 'preview' | 'commit'; value: T }
    | { phase: 'cancel'; value: T; reason: InteractionCancelReason };
