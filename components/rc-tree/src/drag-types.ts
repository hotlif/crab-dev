import type { RefObject } from 'react';
import type { OverState, TreeNodeId } from './type.js';

/** 拖拽回调的公开结构；内部拖拽库不属于 Tree 的声明依赖。 */
export interface TreeDragCoordinates { x: number; y: number; }

export interface TreeDragRect {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface TreeDragActive {
    id: TreeNodeId;
    data: RefObject<Record<string, unknown> | undefined>;
    rect: RefObject<{ initial: TreeDragRect | null; translated: TreeDragRect | null }>;
}

export interface TreeDragOver {
    id: TreeNodeId;
    rect: TreeDragRect;
    disabled: boolean;
    data: RefObject<Record<string, unknown> | undefined>;
}

export interface TreeDragContext { overState: OverState | null; }
export interface TreeDragAbortEvent { id: TreeNodeId; }

export type TreeDragDistance = number | TreeDragCoordinates | Pick<TreeDragCoordinates, 'x'> | Pick<TreeDragCoordinates, 'y'>;
export type TreeDragActivationConstraint =
    | { distance: TreeDragDistance; tolerance?: TreeDragDistance }
    | { delay: number; tolerance: TreeDragDistance; distance?: TreeDragDistance };

export interface TreeDragPendingEvent {
    id: TreeNodeId;
    constraint: TreeDragActivationConstraint;
    initialCoordinates: TreeDragCoordinates;
    offset?: TreeDragCoordinates;
}

export interface TreeDragStartEvent {
    activatorEvent: Event;
    active: TreeDragActive;
}

export interface TreeDragEvent extends TreeDragStartEvent {
    collisions: { id: TreeNodeId; data?: Record<string, unknown> }[] | null;
    delta: TreeDragCoordinates;
    over: TreeDragOver | null;
}

export type TreeDragMoveEvent = TreeDragEvent;
export type TreeDragOverEvent = TreeDragEvent;
export type TreeDragEndEvent = TreeDragEvent;
export type TreeDragCancelEvent = TreeDragEvent;
