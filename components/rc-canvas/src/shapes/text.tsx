import { type ReactNode, use, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CanvasContext } from '../context/canvas-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';
import { generateGlyph } from '../renderer/text-atlas.js';
import { invertMat3, applyMat3 } from '../math/matrix.js';
import type { CanvasInteractiveProps } from '../types.js';

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
    /** 双击进入内联编辑模式（createPortal 挂载到 Canvas 容器 div） */
    editable?: boolean;
    /** 编辑完成（失焦或按 Enter，Shift+Enter 换行）时触发，返回新文本内容 */
    onEdit?: (text: string) => void;
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
    editable = false,
    onEdit,
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

    // 内联编辑状态
    const [editing, setEditing] = useState(false);

    // latest-ref：onEdit 回调（避免 HitEntry 闭包陈旧）
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const onEditRef = useRef(onEdit);
    onEditRef.current = onEdit;

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
        onDblClick: editable ? () => { setEditing(true); } : undefined,
        onMouseEnter,
        onMouseLeave,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    const needsHit = draggable || !!onClick || !!onMouseEnter || !!onMouseLeave || !!cursor || editable;

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

    // 内联编辑 overlay
    const containerEl = ctx.containerRef.current;
    let overlay: ReactNode = null;
    if (editing && containerEl) {
        const glyph = glyphRef.current;
        // 计算文字左上角的 canvas 坐标（世界矩阵 × 局部偏移，再 × 视图矩阵）
        const zoom = ctx.viewMatrixRef.current[0];
        const ax = glyph ? x + alignOffset(glyph.width) : x;
        const ay = glyph ? y + baselineOffset(glyph.height) : y;
        const [wx, wy] = applyMat3(worldMatrixRef.current, ax, ay);
        const [canvasAnchorX, canvasAnchorY] = applyMat3(ctx.viewMatrixRef.current, wx, wy);
        const overlayW = Math.max((glyph?.width ?? 80) * zoom, 80);
        const overlayH = Math.max((glyph?.height ?? fontSize * zoom * 1.4) * zoom, fontSize * zoom * 1.4);

        overlay = createPortal(
            <textarea
                ref={(node) => { if (node) { node.focus(); node.select(); } }}
                defaultValue={children}
                style={{
                    position: 'absolute',
                    left: canvasAnchorX,
                    top: canvasAnchorY,
                    width: overlayW,
                    height: overlayH,
                    fontSize: fontSize * zoom,
                    fontFamily,
                    color: fill,
                    background: 'white',
                    border: '1.5px solid #4a9eff',
                    outline: 'none',
                    padding: 2,
                    boxSizing: 'border-box',
                    resize: 'none',
                    lineHeight: `${(lineHeight ?? fontSize * 1.4) * zoom}px`,
                    zIndex: 1000,
                }}
                onBlur={(e) => {
                    onEditRef.current?.(e.target.value);
                    setEditing(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onEditRef.current?.((e.target as HTMLTextAreaElement).value);
                        setEditing(false);
                    } else if (e.key === 'Escape') {
                        setEditing(false);
                    }
                    // 防止 keydown 传递到 Canvas 容器（会触发 canvas keydown 回调）
                    e.stopPropagation();
                }}
            />,
            containerEl,
        );
    }

    return overlay ?? null;
}

export default Text;
