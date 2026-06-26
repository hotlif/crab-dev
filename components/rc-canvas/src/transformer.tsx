import { use, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import Group from './group.js';
import Rect from './rect.js';
import Circle from './circle.js';
import Line from './line.js';
import type { TransformState } from './transform-types.js';
import { applyMat3, applyMat3Vector, invertMat3, makeRotateMat3 } from './math/matrix.js';
import type { DragMoveEvent, DragStartEvent } from './drag-types.js';

export type { TransformState };

export interface TransformerProps extends TransformState {
    minWidth?: number;
    minHeight?: number;
    /** resize 手柄边长（px），默认 12 */
    handleSize?: number;
    /** 旋转手柄半径（px），默认 handleSize/2 + 2 */
    rotateHandleRadius?: number;
    /** 旋转手柄距矩形上边的距离（px），默认 24 */
    rotateHandleOffset?: number;
    handleFill?: string;
    handleStroke?: string;
    handleStrokeWidth?: number;
    selectionStroke?: string;
    selectionStrokeWidth?: number;
    /** 选中边框虚线实段长度（world px），默认 6；设为 0 则实线 */
    selectionDashLength?: number;
    /** 选中边框虚线空隙长度（world px），默认 4 */
    selectionGapLength?: number;
    zIndex?: number;
    onChange?: (state: TransformState) => void;
    onChangeEnd?: (state: TransformState) => void;
}

interface HandleConfig {
    dir: string;
    /** 相对中心的位置比例（-0.5 / 0 / 0.5） */
    lx: number;
    ly: number;
    /** localDx / localDy 对 width / height 的符号影响（-1 / 0 / +1） */
    widthSign: number;
    heightSign: number;
    cursor: string;
}

const HANDLE_CONFIGS: HandleConfig[] = [
    { dir: 'nw', lx: -0.5, ly: -0.5, widthSign: -1, heightSign: -1, cursor: 'nwse-resize' },
    { dir: 'n',  lx:  0,   ly: -0.5, widthSign:  0, heightSign: -1, cursor: 'ns-resize'   },
    { dir: 'ne', lx:  0.5, ly: -0.5, widthSign:  1, heightSign: -1, cursor: 'nesw-resize'  },
    { dir: 'e',  lx:  0.5, ly:  0,   widthSign:  1, heightSign:  0, cursor: 'ew-resize'   },
    { dir: 'se', lx:  0.5, ly:  0.5, widthSign:  1, heightSign:  1, cursor: 'nwse-resize'  },
    { dir: 's',  lx:  0,   ly:  0.5, widthSign:  0, heightSign:  1, cursor: 'ns-resize'   },
    { dir: 'sw', lx: -0.5, ly:  0.5, widthSign: -1, heightSign:  1, cursor: 'nesw-resize'  },
    { dir: 'w',  lx: -0.5, ly:  0,   widthSign: -1, heightSign:  0, cursor: 'ew-resize'   },
];

function Transformer({
    x, y, width, height, rotation = 0,
    minWidth = 20,
    minHeight = 20,
    handleSize = 12,
    rotateHandleRadius,
    rotateHandleOffset = 24,
    handleFill = '#ffffff',
    handleStroke = '#4a90e2',
    handleStrokeWidth = 1.5,
    selectionStroke = '#4a90e2',
    selectionStrokeWidth = 1.5,
    selectionDashLength = 6,
    selectionGapLength = 4,
    zIndex = 0,
    onChange,
    onChangeEnd,
}: TransformerProps) {
    const ctx = use(CanvasContext);

    // Group 以矩形中心为锚点，rotation 绕此旋转
    const cx = x + width / 2;
    const cy = y + height / 2;

    // latest-ref 兼 committedState：渲染期同步 props，drag 处理器中也主动写入
    // 确保 onChangeEnd 在 pointerup 时读到最后一次 onChange 提交的值
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const stateRef = useRef<TransformState>({ x, y, width, height, rotation });
    stateRef.current = { x, y, width, height, rotation };

    // 可变实例状态 ref：旋转拖拽开始时的角度偏移快照（onDragStart 写，onDrag 读）
    const rotateStartRef = useRef<number | null>(null);

    // ── 移动整体 ─────────────────────────────────────────────────────────────
    // 用 canvasFrameDx/canvasFrameDy 经 viewMatrix 逆变换得到世界增量，
    // 避免依赖旋转局部坐标系（移动方向应与鼠标一致）
    const handleBodyDrag = ({ canvasFrameDx, canvasFrameDy }: DragMoveEvent) => {
        const s = stateRef.current;
        const invView = invertMat3(ctx.viewMatrixRef.current);
        const [worldDx, worldDy] = invView
            ? applyMat3Vector(invView, canvasFrameDx, canvasFrameDy)
            : [canvasFrameDx, canvasFrameDy];
        const next: TransformState = { ...s, x: s.x + worldDx, y: s.y + worldDy };
        stateRef.current = next;
        onChange?.(next);
    };

    const handleBodyDragEnd = () => {
        onChangeEnd?.(stateRef.current);
    };

    // ── Resize ───────────────────────────────────────────────────────────────
    // 公式：对任意 handle，对面角在世界坐标中固定不动
    //   新中心局部偏移 = (actualWidthDelta/2, actualHeightDelta/2)
    //   世界偏移 = rotate(局部偏移, rotation)
    //   新 x/y = 新中心世界坐标 - 新尺寸的一半
    const makeResizeDrag = (widthSign: number, heightSign: number) =>
        ({ localDx, localDy }: DragMoveEvent) => {
            const s = stateRef.current;
            const newWidth = Math.max(minWidth, s.width + widthSign * localDx);
            const newHeight = Math.max(minHeight, s.height + heightSign * localDy);
            // 受 min 约束后的实际增量
            const actualDx = widthSign * (newWidth - s.width);
            const actualDy = heightSign * (newHeight - s.height);
            // 局部中心偏移 → 世界坐标偏移
            const [wCxD, wCyD] = applyMat3Vector(
                makeRotateMat3(s.rotation),
                actualDx / 2,
                actualDy / 2,
            );
            const oldCx = s.x + s.width / 2;
            const oldCy = s.y + s.height / 2;
            const next: TransformState = {
                x: oldCx + wCxD - newWidth / 2,
                y: oldCy + wCyD - newHeight / 2,
                width: newWidth,
                height: newHeight,
                rotation: s.rotation,
            };
            stateRef.current = next;
            onChange?.(next);
        };

    const handleResizeDragEnd = () => {
        onChangeEnd?.(stateRef.current);
    };

    // ── Rotate ───────────────────────────────────────────────────────────────
    const handleRotateDragStart = ({ canvasX, canvasY }: DragStartEvent) => {
        const s = stateRef.current;
        const invView = invertMat3(ctx.viewMatrixRef.current);
        const [wX, wY] = invView ? applyMat3(invView, canvasX, canvasY) : [canvasX, canvasY];
        const worldCx = s.x + s.width / 2;
        const worldCy = s.y + s.height / 2;
        // 记录 "鼠标角度 - 当前旋转角" 的偏移量，保持手柄与矩形的相对角度
        rotateStartRef.current = Math.atan2(wY - worldCy, wX - worldCx) - s.rotation;
    };

    const handleRotateDrag = ({ canvasX, canvasY }: DragMoveEvent) => {
        if (rotateStartRef.current === null) return;
        const s = stateRef.current;
        const invView = invertMat3(ctx.viewMatrixRef.current);
        const [wX, wY] = invView ? applyMat3(invView, canvasX, canvasY) : [canvasX, canvasY];
        const worldCx = s.x + s.width / 2;
        const worldCy = s.y + s.height / 2;
        const newRotation = Math.atan2(wY - worldCy, wX - worldCx) - rotateStartRef.current;
        const next: TransformState = { ...s, rotation: newRotation };
        stateRef.current = next;
        onChange?.(next);
    };

    const handleRotateDragEnd = () => {
        rotateStartRef.current = null;
        onChangeEnd?.(stateRef.current);
    };

    const hs = handleSize;
    const rhr = rotateHandleRadius ?? hs / 2 + 2;

    return (
        <Group x={cx} y={cy} rotation={rotation} zIndex={zIndex}>
            {/* 主体可拖拽区域（透明，负责移动整体） */}
            <Rect
                x={-width / 2} y={-height / 2}
                width={width} height={height}
                fill="transparent"
                zIndex={0}
                draggable
                cursor="move"
                onDrag={handleBodyDrag}
                onDragEnd={handleBodyDragEnd}
            />

            {/* 选中边框（虚线） */}
            <Rect
                x={-width / 2} y={-height / 2}
                width={width} height={height}
                fill="transparent"
                stroke={selectionStroke}
                strokeWidth={selectionStrokeWidth}
                dashLength={selectionDashLength}
                gapLength={selectionGapLength}
                zIndex={1}
            />

            {/* 8 个 resize handles */}
            {HANDLE_CONFIGS.map(cfg => (
                <Rect
                    key={cfg.dir}
                    x={cfg.lx * width - hs / 2}
                    y={cfg.ly * height - hs / 2}
                    width={hs}
                    height={hs}
                    fill={handleFill}
                    stroke={handleStroke}
                    strokeWidth={handleStrokeWidth}
                    radius={2}
                    zIndex={2}
                    draggable
                    cursor={cfg.cursor}
                    onDrag={makeResizeDrag(cfg.widthSign, cfg.heightSign)}
                    onDragEnd={handleResizeDragEnd}
                />
            ))}

            {/* 旋转手柄连接线 */}
            <Line
                x1={0} y1={-height / 2}
                x2={0} y2={-height / 2 - rotateHandleOffset + rhr}
                color={selectionStroke}
                lineWidth={1}
                zIndex={2}
            />

            {/* 旋转手柄（矩形正上方） */}
            <Circle
                cx={0}
                cy={-height / 2 - rotateHandleOffset}
                r={rhr}
                fill={handleFill}
                stroke={handleStroke}
                strokeWidth={handleStrokeWidth}
                zIndex={3}
                draggable
                cursor="grab"
                onDragStart={handleRotateDragStart}
                onDrag={handleRotateDrag}
                onDragEnd={handleRotateDragEnd}
            />
        </Group>
    );
}

export default Transformer;
