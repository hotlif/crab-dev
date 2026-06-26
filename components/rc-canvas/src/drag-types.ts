/** 指针/拖拽交互事件类型 */

export interface PointerHitEvent {
    /** canvas 逻辑坐标（已除以 DPR，对应 CSS px） */
    canvasX: number;
    canvasY: number;
    nativeEvent: PointerEvent;
}

export interface DragStartEvent {
    /** 按下时的 canvas 逻辑坐标（已除以 DPR，对应 CSS px） */
    canvasX: number;
    canvasY: number;
    nativeEvent: PointerEvent;
}

export interface DragMoveEvent {
    /** 当前 canvas 逻辑坐标 */
    canvasX: number;
    canvasY: number;
    /** 相对于 dragStart 的 canvas 坐标系总偏移（适合计算总移动距离） */
    canvasDx: number;
    canvasDy: number;
    /**
     * 相对于上一次 onDrag（或 dragStart）的 canvas 坐标系帧增量。
     * 适合将顶层 Group（父坐标系无旋转/缩放）随鼠标移动。
     */
    canvasFrameDx: number;
    canvasFrameDy: number;
    /**
     * 相对于上一次 onDrag（或 dragStart）的父坐标系帧增量。
     * 可直接加到形状自己的 x/y prop 上，使形状在其父坐标系中跟手。
     * 当父 Group 含旋转/缩放时，与 canvasFrameDx/canvasFrameDy 不同。
     */
    localDx: number;
    localDy: number;
    nativeEvent: PointerEvent;
}

export interface DragEndEvent {
    /** 释放时的 canvas 逻辑坐标 */
    canvasX: number;
    canvasY: number;
    nativeEvent: PointerEvent;
}
