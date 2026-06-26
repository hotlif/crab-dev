import { createContext } from 'react';
import type { DrawCommand } from '../renderer/draw-command.js';
import type { PointerHitEvent, DragStartEvent, DragMoveEvent, DragEndEvent } from '../drag-types.js';
import { identityMat3 } from '../math/matrix.js';

/** 单位矩阵（所有叶子组件的默认父矩阵） */
const IDENTITY = identityMat3();

/** hit-test 注册项，由各形状/Group 在 mount 后注册 */
export interface HitEntry {
    /** 层叠路径，用于命中多个目标时取最顶层 */
    zIndexPath: number[];
    /**
     * 形状所在父坐标系的世界矩阵（ctx.parentMatrix）。
     * Canvas 用其逆矩阵将 canvas 位移转换为 localDx/localDy。
     */
    parentMatrix: Float32Array;
    /** 判断 canvas 逻辑坐标 (cx, cy) 是否在形状内 */
    containsPoint: (cx: number, cy: number) => boolean;
    /** hover 时显示的 CSS cursor */
    cursor?: string;
    /** 点击时触发（pointerdown→up 移动 < 4px） */
    onClick?: (e: PointerHitEvent) => void;
    /** 指针进入形状时触发 */
    onMouseEnter?: (e: PointerHitEvent) => void;
    /** 指针离开形状时触发 */
    onMouseLeave?: (e: PointerHitEvent) => void;
    onDragStart?: (e: DragStartEvent) => void;
    onDrag?: (e: DragMoveEvent) => void;
    onDragEnd?: (e: DragEndEvent) => void;
}

export interface CanvasContextValue {
    /**
     * 注册一条 DrawCommand，返回分配的 id。
     * 叶子组件在 mount 后（useEffect）调用，将返回的 id 存入 useRef。
     */
    register(cmd: Omit<DrawCommand, 'id'>): number;

    /**
     * 更新已注册的 DrawCommand（全量替换属性）。
     * props 变化时调用。
     */
    update(id: number, cmd: Omit<DrawCommand, 'id'>): void;

    /**
     * 注销 DrawCommand。
     * unmount cleanup 时调用。
     */
    unregister(id: number): void;

    /**
     * 父 Group 传递的世界变换矩阵（mat3 列主序）。
     * 叶子组件将此矩阵写入 DrawCommand.worldMatrix。
     * 默认值为单位矩阵。
     */
    parentMatrix: Float32Array;

    /**
     * 父 Group 传递的层叠路径。
     * 叶子组件将自身 zIndex 追加后写入 DrawCommand.zIndexPath。
     * 默认值为空数组（根级别）。
     */
    parentZIndexPath: number[];

    /**
     * 请求将图片 URL 对应的 WebGLTexture 上传到 GPU。
     * Image 组件在加载完成后调用；返回纹理 key，可用于后续 DrawCommand。
     */
    uploadTexture(key: string, source: HTMLImageElement | ImageBitmap): void;

    uploadGlyph(key: string, data: Uint8Array, width: number, height: number): void;

    /**
     * 注册 hit-test 条目（与 register DrawCommand 共用 id 空间）。
     * draggable 形状/Group 在 mount 后调用。
     */
    registerHit(id: number, entry: HitEntry): void;

    /** 注销 hit-test 条目（unmount cleanup 时调用）。 */
    unregisterHit(id: number): void;

    /** 更新 hit-test 条目（props 变化时与 update 同步调用）。 */
    updateHit(id: number, entry: HitEntry): void;

    /** 由 Canvas 提供：分配下一个 id（供 Group 的 hitArea 使用）。 */
    nextId(): number;

    /**
     * 当前 viewMatrix 的只读 ref（canvas 坐标 → 世界坐标的变换的逆，即 world → canvas）。
     * Viewport 写入，InfiniteGrid / 外部工具可读取。
     * 直接持有 ref 而非值，避免每次读取触发 React 渲染。
     */
    readonly viewMatrixRef: { readonly current: Float32Array };

    /**
     * 由 Viewport 调用：将新的 viewMatrix 写入 Canvas 内部 ref，下一帧自动注入 GPU。
     * 不触发任何 React 渲染。
     */
    setViewMatrix(mat: Float32Array): void;

    /**
     * 订阅 canvas DOM 节点上的原生事件。
     * Viewport 用此订阅 'wheel'（缩放）和空白区平移所需事件。
     * 返回取消订阅函数，在 useEffect cleanup 中调用。
     */
    subscribeCanvasEvent<K extends keyof HTMLElementEventMap>( // eslint-disable-line no-undef
        type: K,
        handler: (e: HTMLElementEventMap[K]) => void, // eslint-disable-line no-undef
    ): () => void;
}

const DEFAULT_VIEW_MATRIX_REF = { current: identityMat3() };

export const CanvasContext = createContext<CanvasContextValue>({
    register: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    update: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    unregister: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    uploadTexture: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    uploadGlyph: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    registerHit: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    unregisterHit: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    updateHit: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    nextId: () => { throw new Error('[rc-canvas] CanvasContext not provided'); },
    viewMatrixRef: DEFAULT_VIEW_MATRIX_REF,
    setViewMatrix: () => {},
    subscribeCanvasEvent: () => () => {},
    parentMatrix: IDENTITY,
    parentZIndexPath: [],
});
