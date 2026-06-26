import { use, useEffect, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { identityMat3 } from '../math/matrix.js';
import { parseColor } from '../math/color.js';

export interface InfiniteGridProps {
    /** 基础网格间距（world 坐标 px），默认 50 */
    baseSpacing?: number;
    /** 细分数，每大格内的细线数量，默认 5 */
    subdivisions?: number;
    /** 网格颜色，默认 '#b0b0b0' */
    color?: string;
    /** 整体不透明度，默认 1 */
    opacity?: number;
    /** 原点标记颜色；未设置时不渲染原点 */
    originColor?: string;
}

function InfiniteGrid({
    baseSpacing = 50,
    subdivisions = 5,
    color = '#b0b0b0',
    opacity = 1,
    originColor,
}: InfiniteGridProps) {
    const ctx = use(CanvasContext);
    const cmdIdRef = useRef<number | null>(null);

    const buildCmd = (): Omit<import('../renderer/draw-command.js').GridCommand, 'id'> => {
        const parsedColor = parseColor(color);
        const parsedOriginColor = originColor ? parseColor(originColor) : [0, 0, 0, 0] as import('../math/color.js').ColorRGBA;
        // GridCommand 不需要 AABB（始终全屏渲染，跳过剔除）
        return {
            kind: 'grid',
            worldMatrix: identityMat3(),
            // MIN_SAFE_INTEGER 确保网格始终在最底层渲染
            zIndexPath: [Number.MIN_SAFE_INTEGER],
            baseSpacing,
            subdivisions,
            color: opacity !== 1
                ? [parsedColor[0], parsedColor[1], parsedColor[2], parsedColor[3] * opacity]
                : parsedColor,
            originColor: parsedOriginColor,
        };
    };

    useEffect(() => {
        const id = ctx.register(buildCmd());
        cmdIdRef.current = id;
        return () => {
            ctx.unregister(id);
            cmdIdRef.current = null;
        };
    }, []);

    // props 变化时同步更新（与其他图元组件的 update pattern 保持一致）
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
    });

    return null;
}

export default InfiniteGrid;
