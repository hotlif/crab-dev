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

/** ColorRGBA（0-1）→ CSS rgba 字符串，alpha 额外乘以 factor */
function toCSS([r, g, b, a]: ColorRGBA, alphaFactor = 0.85): string {
    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${(a * alphaFactor).toFixed(2)})`;
}

/** 从 DrawCommand 中提取用于 Minimap 的填充色 */
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

/** Minimap 世界↔minimap 坐标映射参数，每帧更新 */
interface Mapping {
    minX: number;
    minY: number;
    scale: number;
    ox: number;
    oy: number;
}

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

    // 每帧更新的 world↔minimap 映射（供指针事件读取）
    // 可变实例状态 ref：不触发 re-render，指针处理器直接读取最新值
    const mappingRef = useRef<Mapping | null>(null);

    // 拖拽状态
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

            // 背景
            c.fillStyle = background;
            c.fillRect(0, 0, mmW, mmH);

            // 收集所有有 AABB 的命令的世界坐标包围盒
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
                rafRef.current = requestAnimationFrame(draw);
                return;
            }

            // world → minimap 映射（居中 + 8px 内边距）
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

            // 绘制每个图元（跳过网格；使用图元自身颜色）
            for (const cmd of commands.values()) {
                if (!cmd.aabb || cmd.kind === 'grid') continue;
                const color = cmdFillColor(cmd);
                if (!color) continue;
                const { minX: ax, minY: ay, maxX: bx, maxY: by } = cmd.aabb;
                const [sx, sy] = toMm(ax, ay);
                const w = Math.max((bx - ax) * scale, 1);
                const h = Math.max((by - ay) * scale, 1);
                c.fillStyle = color;
                c.fillRect(sx, sy, w, h);
            }

            // 绘制视口框
            if (viewportCorners) {
                c.beginPath();
                const [fx, fy] = toMm(viewportCorners[0][0], viewportCorners[0][1]);
                c.moveTo(fx, fy);
                for (let i = 1; i < 4; i++) {
                    const [px, py] = toMm(viewportCorners[i][0], viewportCorners[i][1]);
                    c.lineTo(px, py);
                }
                c.closePath();
                c.fillStyle = viewportFill;
                c.fill();
                c.strokeStyle = viewportStroke;
                c.lineWidth = 1.5;
                c.stroke();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [ctx, mmW, mmH, background, viewportFill, viewportStroke]);

    // ── 指针事件：拖拽 Minimap → 平移主视口 ───────────────────────────────────

    /** 将 Minimap 逻辑坐标转换为世界坐标 */
    const mmToWorld = (mmX: number, mmY: number): { wx: number; wy: number } | null => {
        const m = mappingRef.current;
        if (!m || m.scale === 0) return null;
        return {
            wx: m.minX + (mmX - m.ox) / m.scale,
            wy: m.minY + (mmY - m.oy) / m.scale,
        };
    };

    /** 获取相对 Minimap canvas 元素的逻辑坐标 */
    const toMmLocal = (e: PointerEvent<HTMLCanvasElement>): { mmX: number; mmY: number } => {
        const cvs = canvasRef.current;
        if (!cvs) return { mmX: 0, mmY: 0 };
        const rect = cvs.getBoundingClientRect();
        return {
            mmX: (e.clientX - rect.left) * (mmW / rect.width),
            mmY: (e.clientY - rect.top) * (mmH / rect.height),
        };
    };

    /** 将视口平移使世界坐标 (wx, wy) 对应 canvas 中心 */
    const seekWorld = (wx: number, wy: number) => {
        const viewMat = ctx.viewMatrixRef.current;
        const { width: cW, height: cH } = ctx.canvasSizeRef.current;
        // viewMatrix: canvas = zoom * world + pan  →  mat[0]=zoom, mat[6]=panX, mat[7]=panY
        const zoom = viewMat[0];
        const newPanX = cW / 2 - zoom * wx;
        const newPanY = cH / 2 - zoom * wy;
        ctx.seekPanRef.current?.(newPanX, newPanY);
    };

    const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const { mmX, mmY } = toMmLocal(e);
        dragRef.current = { lastMmX: mmX, lastMmY: mmY };

        // 点击时立即将视口中心移到该世界坐标
        const world = mmToWorld(mmX, mmY);
        if (world) seekWorld(world.wx, world.wy);
    };

    const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        const { mmX, mmY } = toMmLocal(e);
        const dmX = mmX - drag.lastMmX;
        const dmY = mmY - drag.lastMmY;
        drag.lastMmX = mmX;
        drag.lastMmY = mmY;

        const m = mappingRef.current;
        if (!m || m.scale === 0) return;

        // minimap 坐标增量 → 世界坐标增量
        const dWx = dmX / m.scale;
        const dWy = dmY / m.scale;

        // 世界坐标增量 → canvas pan 增量（canvas = zoom * world + pan）
        const viewMat = ctx.viewMatrixRef.current;
        const zoom = viewMat[0];
        const newPanX = viewMat[6] - zoom * dWx;
        const newPanY = viewMat[7] - zoom * dWy;
        ctx.seekPanRef.current?.(newPanX, newPanY);
    };

    const onPointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragRef.current = null;
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
