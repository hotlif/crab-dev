import { use, useRef, useEffect, type CSSProperties, type PointerEvent } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { invertMat3, applyMat3 } from '../math/matrix.js';
import type { ColorRGBA } from '../math/color.js';
import type { DrawCommand } from '../renderer/draw-command.js';

export interface MinimapProps {
    /** Minimap 宽度（逻辑 px），默认 180 */
    width?: number;
    /** Minimap 高度（逻辑 px），默认 120 */
    height?: number;
    /** 显示位置，默认 'bottom-right' */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** 距 Canvas 边缘的内边距（px），默认 12 */
    padding?: number;
    /** 背景色，默认 'rgba(240,242,245,0.92)' */
    background?: string;
    /** 视口框描边色，默认 'rgba(59,130,246,0.8)' */
    viewportStroke?: string;
    /** 视口框填充色，默认 'rgba(59,130,246,0.08)' */
    viewportFill?: string;
}

// ── 颜色工具 ─────────────────────────────────────────────────────────────────

function toCSS([r, g, b, a]: ColorRGBA, alphaFactor = 0.85): string {
    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${(a * alphaFactor).toFixed(2)})`;
}

function cmdFillColor(cmd: DrawCommand): string | null {
    switch (cmd.kind) {
        case 'marker':
            return toCSS(cmd.fill);
        case 'flat-rect':
        case 'sdf-rect':
        case 'sdf-circle':
            return cmd.fill[3] > 0.01 ? toCSS(cmd.fill) : (cmd.stroke[3] > 0.01 ? toCSS(cmd.stroke, 0.6) : null);
        case 'line':
            return toCSS(cmd.color);
        case 'sdf-text':
            return toCSS(cmd.color, 0.7);
        case 'texture-image':
            return `rgba(160,160,160,${(cmd.opacity * 0.7).toFixed(2)})`;
        default:
            return null;
    }
}

// ── 坐标映射 ─────────────────────────────────────────────────────────────────

interface Mapping {
    minX: number;
    minY: number;
    scale: number;
    ox: number;
    oy: number;
}

/** 视口框在 minimap 坐标系中的轴对齐包围盒，供指针事件判断 hover */
interface ViewportBounds {
    mmMinX: number;
    mmMinY: number;
    mmMaxX: number;
    mmMaxY: number;
}

// ── 组件 ─────────────────────────────────────────────────────────────────────

function Minimap({
    width: mmW = 180,
    height: mmH = 120,
    position = 'bottom-right',
    padding = 12,
    background = 'rgba(240,242,245,0.92)',
    viewportStroke = 'rgba(59,130,246,0.8)',
    viewportFill = 'rgba(59,130,246,0.08)',
}: MinimapProps) {
    const ctx = use(CanvasContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef(0);

    // 可变实例状态 ref：每帧更新的映射参数，供指针事件读取
    const mappingRef = useRef<Mapping | null>(null);
    // 可变实例状态 ref：视口框在 minimap 坐标中的 AABB，供 cursor 判断
    const viewportBoundsRef = useRef<ViewportBounds | null>(null);
    // 可变实例状态 ref：是否处于拖拽状态
    const dragRef = useRef<{ lastMmX: number; lastMmY: number } | null>(null);

    // ── rAF 绘制循环 ──────────────────────────────────────────────────────────

    useEffect(() => {
        // 可变实例状态 ref：dpr 在 mount 时绑定，与 canvas attribute 保持一致
        const dpr = Math.max(window.devicePixelRatio ?? 1, 1);

        const draw = () => {
            const cvs = canvasRef.current;
            if (!cvs) { rafRef.current = requestAnimationFrame(draw); return; }
            const c = cvs.getContext('2d');
            if (!c) { rafRef.current = requestAnimationFrame(draw); return; }

            const commands = ctx.commandMapRef.current;
            const viewMat = ctx.viewMatrixRef.current;
            const { width: cW, height: cH } = ctx.canvasSizeRef.current;

            c.setTransform(dpr, 0, 0, dpr, 0, 0);
            c.clearRect(0, 0, mmW, mmH);

            c.fillStyle = background;
            c.fillRect(0, 0, mmW, mmH);

            // 收集世界坐标包围盒
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let hasAabb = false;

            for (const cmd of commands.values()) {
                if (!cmd.aabb) continue;
                hasAabb = true;
                if (cmd.aabb.minX < minX) minX = cmd.aabb.minX;
                if (cmd.aabb.minY < minY) minY = cmd.aabb.minY;
                if (cmd.aabb.maxX > maxX) maxX = cmd.aabb.maxX;
                if (cmd.aabb.maxY > maxY) maxY = cmd.aabb.maxY;
            }

            // 把视口四角纳入包围盒
            const invView = invertMat3(viewMat);
            let viewportCorners: [number, number][] | null = null;
            if (invView) {
                viewportCorners = [
                    applyMat3(invView, 0, 0),
                    applyMat3(invView, cW, 0),
                    applyMat3(invView, cW, cH),
                    applyMat3(invView, 0, cH),
                ];
                for (const [wx, wy] of viewportCorners) {
                    if (wx < minX) minX = wx; if (wy < minY) minY = wy;
                    if (wx > maxX) maxX = wx; if (wy > maxY) maxY = wy;
                    hasAabb = true;
                }
            }

            if (!hasAabb || maxX <= minX || maxY <= minY) {
                mappingRef.current = null;
                viewportBoundsRef.current = null;
                rafRef.current = requestAnimationFrame(draw);
                return;
            }

            // world → minimap 映射
            const INSET = 8;
            const worldW = maxX - minX;
            const worldH = maxY - minY;
            const scale = Math.min((mmW - INSET * 2) / worldW, (mmH - INSET * 2) / worldH);
            const ox = INSET + ((mmW - INSET * 2) - worldW * scale) / 2;
            const oy = INSET + ((mmH - INSET * 2) - worldH * scale) / 2;
            mappingRef.current = { minX, minY, scale, ox, oy };

            const toMm = (wx: number, wy: number): [number, number] => [
                ox + (wx - minX) * scale,
                oy + (wy - minY) * scale,
            ];

            // 绘制图元（精确形状：circle 用 arc，其余用 AABB 矩形）
            for (const cmd of commands.values()) {
                if (!cmd.aabb || cmd.kind === 'grid') continue;
                const color = cmdFillColor(cmd);
                if (!color) continue;

                c.fillStyle = color;

                if (cmd.kind === 'sdf-circle') {
                    // 从 AABB 反推圆心 + 半径，避免再做矩阵变换
                    const cx = (cmd.aabb.minX + cmd.aabb.maxX) / 2;
                    const cy = (cmd.aabb.minY + cmd.aabb.maxY) / 2;
                    const r = Math.max((cmd.aabb.maxX - cmd.aabb.minX) / 2 * scale, 1);
                    const [mmCx, mmCy] = toMm(cx, cy);
                    c.beginPath();
                    c.arc(mmCx, mmCy, r, 0, Math.PI * 2);
                    c.fill();
                } else if (cmd.kind === 'line') {
                    // 线段：用两端点连线（宽度固定为 1.5px，视觉优于细长矩形）
                    // 需要把 AABB 的中心轴还原——但 AABB 已经抹掉了方向信息。
                    // 退回用矩形：线宽通常很细，AABB 近似足够
                    const { minX: ax, minY: ay, maxX: bx, maxY: by } = cmd.aabb;
                    const [sx, sy] = toMm(ax, ay);
                    c.fillRect(sx, sy, Math.max((bx - ax) * scale, 1), Math.max((by - ay) * scale, 1));
                } else {
                    const { minX: ax, minY: ay, maxX: bx, maxY: by } = cmd.aabb;
                    const [sx, sy] = toMm(ax, ay);
                    c.fillRect(sx, sy, Math.max((bx - ax) * scale, 1), Math.max((by - ay) * scale, 1));
                }
            }

            // 绘制视口框
            if (viewportCorners) {
                const mmCorners = viewportCorners.map(([wx, wy]) => toMm(wx, wy));

                // 更新视口框 AABB（供 cursor 判断）
                let vbMinX = Infinity, vbMinY = Infinity, vbMaxX = -Infinity, vbMaxY = -Infinity;
                for (const [mx, my] of mmCorners) {
                    if (mx < vbMinX) vbMinX = mx; if (my < vbMinY) vbMinY = my;
                    if (mx > vbMaxX) vbMaxX = mx; if (my > vbMaxY) vbMaxY = my;
                }
                viewportBoundsRef.current = { mmMinX: vbMinX, mmMinY: vbMinY, mmMaxX: vbMaxX, mmMaxY: vbMaxY };

                c.beginPath();
                c.moveTo(mmCorners[0][0], mmCorners[0][1]);
                for (let i = 1; i < 4; i++) c.lineTo(mmCorners[i][0], mmCorners[i][1]);
                c.closePath();
                c.fillStyle = viewportFill;
                c.fill();
                c.strokeStyle = viewportStroke;
                c.lineWidth = 1.5;
                c.stroke();
            } else {
                viewportBoundsRef.current = null;
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [ctx, mmW, mmH, background, viewportFill, viewportStroke]);

    // ── 原生 wheel：控制主视口缩放 ───────────────────────────────────────────

    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const { width: cW, height: cH } = ctx.canvasSizeRef.current;
            // 以 canvas 中心为缩放锚点（Minimap 的鼠标位置转为世界坐标再映射代价高，用中心已足够直觉）
            ctx.applyZoomRef.current?.(e.deltaY, cW / 2, cH / 2);
        };
        cvs.addEventListener('wheel', onWheel, { passive: false });
        return () => cvs.removeEventListener('wheel', onWheel);
    }, [ctx]);

    // ── 指针事件工具 ──────────────────────────────────────────────────────────

    const toMmLocal = (e: PointerEvent<HTMLCanvasElement>): { mmX: number; mmY: number } => {
        const cvs = canvasRef.current;
        if (!cvs) return { mmX: 0, mmY: 0 };
        const rect = cvs.getBoundingClientRect();
        return {
            mmX: (e.clientX - rect.left) * (mmW / rect.width),
            mmY: (e.clientY - rect.top) * (mmH / rect.height),
        };
    };

    const isInViewport = (mmX: number, mmY: number): boolean => {
        const vb = viewportBoundsRef.current;
        if (!vb) return false;
        return mmX >= vb.mmMinX && mmX <= vb.mmMaxX && mmY >= vb.mmMinY && mmY <= vb.mmMaxY;
    };

    /** 将视口平移使世界坐标 (wx, wy) 对应 canvas 中心 */
    const seekWorld = (wx: number, wy: number) => {
        const viewMat = ctx.viewMatrixRef.current;
        const { width: cW, height: cH } = ctx.canvasSizeRef.current;
        const zoom = viewMat[0];
        ctx.seekPanRef.current?.(cW / 2 - zoom * wx, cH / 2 - zoom * wy);
    };

    // ── 指针事件处理 ──────────────────────────────────────────────────────────

    const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        const { mmX, mmY } = toMmLocal(e);

        if (!isInViewport(mmX, mmY)) {
            // 视口框外点击：先跳转视口中心到该世界坐标
            const m = mappingRef.current;
            if (m && m.scale !== 0) {
                seekWorld(
                    m.minX + (mmX - m.ox) / m.scale,
                    m.minY + (mmY - m.oy) / m.scale,
                );
            }
        }

        dragRef.current = { lastMmX: mmX, lastMmY: mmY };
        e.currentTarget.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
        const { mmX, mmY } = toMmLocal(e);
        const drag = dragRef.current;

        if (drag) {
            // 拖拽中：minimap 增量 → 世界增量 → 更新 pan
            const dmX = mmX - drag.lastMmX;
            const dmY = mmY - drag.lastMmY;
            drag.lastMmX = mmX;
            drag.lastMmY = mmY;

            const m = mappingRef.current;
            if (m && m.scale !== 0) {
                const viewMat = ctx.viewMatrixRef.current;
                const zoom = viewMat[0];
                ctx.seekPanRef.current?.(
                    viewMat[6] - zoom * (dmX / m.scale),
                    viewMat[7] - zoom * (dmY / m.scale),
                );
            }
        } else {
            // 非拖拽：根据是否在视口框内更新 cursor
            e.currentTarget.style.cursor = isInViewport(mmX, mmY) ? 'grab' : 'crosshair';
        }
    };

    const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragRef.current = null;
        // 恢复 cursor：检测当前鼠标位置
        const { mmX, mmY } = toMmLocal(e);
        e.currentTarget.style.cursor = isInViewport(mmX, mmY) ? 'grab' : 'crosshair';
    };

    // ── JSX ───────────────────────────────────────────────────────────────────

    const posStyle: CSSProperties = {
        position: 'absolute',
        ...(position.startsWith('bottom') ? { bottom: padding } : { top: padding }),
        ...(position.endsWith('right') ? { right: padding } : { left: padding }),
    };

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1;

    return (
        <canvas
            ref={canvasRef}
            width={Math.round(mmW * dpr)}
            height={Math.round(mmH * dpr)}
            style={{
                ...posStyle,
                width: mmW,
                height: mmH,
                borderRadius: 6,
                boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
                cursor: 'crosshair',
                border: '1px solid rgba(0,0,0,0.08)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        />
    );
}

export default Minimap;
