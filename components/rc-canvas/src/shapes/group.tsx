import { use, useEffect, useRef, type ReactNode } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from '../drag-types.js';
import {
    multiplyMat3,
    makeTranslateMat3,
    makeRotateMat3,
    makeScaleMat3,
    invertMat3,
    applyMat3,
} from '../math/matrix.js';

export interface GroupProps {
    /** 平移 x（px） */
    x?: number;
    /** 平移 y（px） */
    y?: number;
    /** 旋转角度（弧度，逆时针为正） */
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    /** zIndex 层级（在父坐标系中的排序值） */
    zIndex?: number;
    children?: ReactNode;
    /** 为 true 且提供 hitArea 时，Group 自身参与 hit-test */
    draggable?: boolean;
    /** Group 的可拖拽区域（Group 局部坐标系中的矩形），不提供时不参与 hit-test */
    hitArea?: { x: number; y: number; width: number; height: number };
    /** hover 时的 CSS cursor */
    cursor?: string;
    onDragStart?: (e: DragStartEvent) => void;
    onDrag?: (e: DragMoveEvent) => void;
    onDragEnd?: (e: DragEndEvent) => void;
}

function Group({
    x = 0,
    y = 0,
    rotation = 0,
    scaleX = 1,
    scaleY = 1,
    zIndex = 0,
    children,
    draggable = false,
    hitArea,
    cursor,
    onDragStart,
    onDrag,
    onDragEnd,
}: GroupProps) {
    const parent = use(CanvasContext);

    // TRS 顺序：先缩放，再旋转，再平移（矩阵从右到左应用）
    // React Compiler 自动记忆化此计算，无需手写 useMemo
    const localMatrix = multiplyMat3(
        makeTranslateMat3(x, y),
        multiplyMat3(makeRotateMat3(rotation), makeScaleMat3(scaleX, scaleY)),
    );
    const worldMatrix = multiplyMat3(parent.parentMatrix, localMatrix);

    const childCtx = {
        ...parent,
        parentMatrix: worldMatrix,
        parentZIndexPath: [...parent.parentZIndexPath, zIndex],
    };

    // 可变实例状态 ref：持有 hitArea 注册 id
    const hitIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：实时持有 worldMatrix（供 containsPoint 闭包读取）
    const worldMatrixRef = useRef<Float32Array>(worldMatrix);
    worldMatrixRef.current = worldMatrix;

    const buildHitEntry = () => ({
        zIndexPath: [...parent.parentZIndexPath, zIndex],
        parentMatrix: parent.parentMatrix,
        containsPoint: (cx: number, cy: number): boolean => {
            if (!hitArea) return false;
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, cx, cy);
            return (
                lx >= hitArea.x &&
                lx <= hitArea.x + hitArea.width &&
                ly >= hitArea.y &&
                ly <= hitArea.y + hitArea.height
            );
        },
        cursor,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    // mount/unmount：注册 / 注销 hitArea
    useEffect(() => {
        if (!draggable || !hitArea) return;
        const id = parent.nextId();
        hitIdRef.current = id;
        parent.registerHit(id, buildHitEntry());
        return () => {
            if (hitIdRef.current !== null) {
                parent.unregisterHit(hitIdRef.current);
                hitIdRef.current = null;
            }
        };
    }, []);

    // props 变化时同步更新 hit entry
    useEffect(() => {
        if (hitIdRef.current === null) return;
        parent.updateHit(hitIdRef.current, buildHitEntry());
    });

    return (
        <CanvasContext value={childCtx}>
            {children}
        </CanvasContext>
    );
}

export default Group;
