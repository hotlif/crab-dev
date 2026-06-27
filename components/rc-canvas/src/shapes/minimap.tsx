import { use, useRef, useEffect, type CSSProperties } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { invertMat3, applyMat3 } from '../math/matrix.js';

export interface MinimapProps {
    /** Minimap 宽度（逻辑 px），默认 180 */
    width?: number;
    /** Minimap 高度（逻辑 px），默认 120 */
    height?: number;
    /** 显示位置，默认 'bottom-right' */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** 距 Canvas 边缘的内边距（px），默认 12 */
    padding?: number;
    /** 背景色，默认 'rgba(255,255,255,0.85)' */
    background?: string;
    /** 视口框填充色，默认 'rgba(59,130,246,0.2)' */
    viewportColor?: string;
}

function Minimap({
    width: mmW = 180,
    height: mmH = 120,
    position = 'bottom-right',
    padding = 12,
    background = 'rgba(255,255,255,0.85)',
    viewportColor = 'rgba(59,130,246,0.2)',
}: MinimapProps) {
    const ctx = use(CanvasContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef(0);

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

            // 把视口四角纳入包围盒，确保视口框不被裁切
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

            const toMm = (wx: number, wy: number): [number, number] => [
                ox + (wx - minX) * scale,
                oy + (wy - minY) * scale,
            ];

            // 绘制每个图元的 AABB（跳过网格）
            c.fillStyle = 'rgba(100,120,200,0.4)';
            for (const cmd of commands.values()) {
                if (!cmd.aabb || cmd.kind === 'grid') continue;
                const { minX: ax, minY: ay, maxX: bx, maxY: by } = cmd.aabb;
                const [sx, sy] = toMm(ax, ay);
                c.fillRect(sx, sy, Math.max((bx - ax) * scale, 1), Math.max((by - ay) * scale, 1));
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
                c.fillStyle = viewportColor;
                c.fill();
                c.strokeStyle = 'rgba(59,130,246,0.6)';
                c.lineWidth = 1.5;
                c.stroke();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [ctx, mmW, mmH, background, viewportColor]);

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
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                pointerEvents: 'none',
            }}
        />
    );
}

export default Minimap;
