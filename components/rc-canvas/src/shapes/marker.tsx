import { use, useEffect, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';

export interface MarkerProps {
    /** 箭头尖端位置（局部坐标） */
    x: number;
    y: number;
    /** 箭头指向角度（弧度，0 = 向右） */
    angle: number;
    /** 箭头大小（px），默认 10 */
    size: number;
    fill?: string;
    opacity?: number;
    zIndex?: number;
}

function Marker({
    x,
    y,
    angle,
    size,
    fill = '#000000',
    opacity = 1,
    zIndex = 0,
}: MarkerProps) {
    const ctx = use(CanvasContext);
    // 可变实例状态 ref：持有注册 id，跨渲染不触发 rerender
    const cmdIdRef = useRef<number | null>(null);

    const buildCmd = () => {
        const parsedColor = parseColor(fill);
        const appliedColor: ColorRGBA =
            opacity !== 1
                ? [parsedColor[0], parsedColor[1], parsedColor[2], parsedColor[3] * opacity]
                : parsedColor;
        return {
            kind: 'marker' as const,
            x,
            y,
            angle,
            size,
            fill: appliedColor,
            worldMatrix: ctx.parentMatrix,
            zIndexPath: [...ctx.parentZIndexPath, zIndex],
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

    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
    });

    return null;
}

export default Marker;
