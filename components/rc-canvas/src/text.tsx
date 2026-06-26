import { use, useEffect, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import { parseColor } from './math/color.js';
import type { ColorRGBA } from './math/color.js';
import { generateGlyph } from './renderer/text-atlas.js';
import { invertMat3, applyMat3 } from './math/matrix.js';
import type { CanvasInteractiveProps } from './types.js';

export interface TextProps extends CanvasInteractiveProps {
    x: number;
    y: number;
    children: string;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    /** 水平对齐：x 为文字块左 / 中 / 右边的位置，默认 'left' */
    textAlign?: 'left' | 'center' | 'right';
    /** 垂直基线：y 为文字块顶 / 中 / 底边的位置，默认 'top' */
    textBaseline?: 'top' | 'middle' | 'bottom';
    /** 行高（world px），默认 fontSize × 1.4 */
    lineHeight?: number;
    /** 超出此宽度（world px）时自动词换行；不设则不限宽 */
    maxWidth?: number;
}

function Text({
    x,
    y,
    children,
    fontSize = 14,
    fontFamily = 'system-ui',
    fill = '#000000',
    opacity = 1,
    textAlign = 'left',
    textBaseline = 'top',
    lineHeight,
    maxWidth,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: TextProps) {
    const ctx = use(CanvasContext);
    // 可变实例状态 ref：持有注册 id
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：缓存当前字形的 key 和尺寸（避免 update effect 中丢失）
    const glyphRef = useRef<{ key: string; width: number; height: number } | undefined>(undefined);
    // 可变实例状态 ref：实时持有 worldMatrix，供 containsPoint 闭包读取
    const worldMatrixRef = useRef<Float32Array>(ctx.parentMatrix);
    worldMatrixRef.current = ctx.parentMatrix;

    const alignOffset = (w: number): number =>
        textAlign === 'center' ? -w / 2 : textAlign === 'right' ? -w : 0;

    const baselineOffset = (h: number): number =>
        textBaseline === 'middle' ? -h / 2 : textBaseline === 'bottom' ? -h : 0;

    const buildCmd = (glyphKey: string | undefined, glyphWidth: number, glyphHeight: number) => {
        const parsedFill = parseColor(fill);
        const appliedFill: ColorRGBA =
            opacity !== 1
                ? [parsedFill[0], parsedFill[1], parsedFill[2], parsedFill[3] * opacity]
                : parsedFill;
        return {
            kind: 'sdf-text' as const,
            x: x + alignOffset(glyphWidth),
            y: y + baselineOffset(glyphHeight),
            glyphKey,
            glyphWidth,
            glyphHeight,
            color: appliedFill,
            worldMatrix: ctx.parentMatrix,
            zIndexPath: [...ctx.parentZIndexPath, zIndex],
        };
    };

    const buildHitEntry = () => ({
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        parentMatrix: ctx.parentMatrix,
        containsPoint: (canvasX: number, canvasY: number): boolean => {
            // 字形未加载时不参与 hit-test
            const glyph = glyphRef.current;
            if (!glyph) return false;
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, canvasX, canvasY);
            const ex = x + alignOffset(glyph.width);
            const ey = y + baselineOffset(glyph.height);
            return lx >= ex && lx <= ex + glyph.width && ly >= ey && ly <= ey + glyph.height;
        },
        cursor,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    const needsHit = draggable || !!onClick || !!onMouseEnter || !!onMouseLeave || !!cursor;

    // mount 时注册（glyphKey 暂为 undefined）
    useEffect(() => {
        const id = ctx.register(buildCmd(undefined, 0, 0));
        cmdIdRef.current = id;
        if (needsHit) ctx.registerHit(id, buildHitEntry());
        return () => {
            ctx.unregister(id);
            if (needsHit) ctx.unregisterHit(id);
            cmdIdRef.current = null;
        };
    }, []);

    // 文字内容或字体变化时重新生成字形纹理并上传
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        const glyph = generateGlyph(children, fontSize, fontFamily, lineHeight, maxWidth);
        ctx.uploadGlyph(glyph.key, glyph.data, glyph.width, glyph.height);
        glyphRef.current = { key: glyph.key, width: glyph.worldWidth, height: glyph.worldHeight };
        ctx.update(cmdIdRef.current, buildCmd(glyph.key, glyph.worldWidth, glyph.worldHeight));
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    }, [children, fontSize, fontFamily]);

    // 颜色/位置/透明度变化时更新（使用缓存的字形尺寸，不重新上传）
    useEffect(() => {
        if (cmdIdRef.current === null || !glyphRef.current) return;
        const { key, width, height } = glyphRef.current;
        ctx.update(cmdIdRef.current, buildCmd(key, width, height));
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    });

    return null;
}

export default Text;
