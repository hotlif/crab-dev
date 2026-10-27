import { type ReactNode, use, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from '@crab-dev/rc-config-provider';
import { CanvasContext } from '../context/canvas-context.js';
import { CanvasPaletteContext } from '../context/palette-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';
import { generateGlyph, generateBitmapGlyph } from '../renderer/text-atlas.js';
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
    /**
     * 文本渲染模式，默认 'sdf'：
     * - 'sdf'：距离场纹理，任意缩放级别下边缘平滑，适合可缩放画布（Viewport）；
     *   代价是小字号（≲14px）细节圆化、发虚。
     * - 'bitmap'：按设备像素比直接光栅化（ECharts/zrender 清晰文本同机制），
     *   配合渲染器物理像素吸附，小字号下与 DOM 文本同等清晰；
     *   适合视图不缩放的场景（图表轴文本等），放大后会呈现位图插值模糊。
     */
    mode?: 'sdf' | 'bitmap';
    /** 双击进入内联编辑模式（createPortal 挂载到 Canvas 容器 div） */
    editable?: boolean;
    /** 内联文本编辑器的无障碍名称；未提供或仅为空白时使用当前语言的默认名称。 */
    editorLabel?: string;
    /** 编辑完成（失焦或非输入法组合态的 Enter，Shift+Enter 换行）时触发，每次编辑只通知一次。 */
    onEdit?: (text: string) => void;
}

// 无捕获的稳定 ref：只在编辑器挂载时初始化焦点与选区，语言/主题更新不重选草稿。
function initializeTextEditor(node: HTMLTextAreaElement | null) {
    if (node) {
        node.focus();
        node.select();
    }
}

function Text({
    x,
    y,
    children,
    fontSize = 14,
    fontFamily = 'system-ui',
    fill: fillProp,
    opacity = 1,
    textAlign = 'left',
    textBaseline = 'top',
    lineHeight,
    maxWidth,
    mode = 'sdf',
    zIndex = 0,
    draggable = false,
    cursor,
    editable = false,
    editorLabel,
    onEdit,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: TextProps) {
    const ctx = use(CanvasContext);
    const { palette } = use(CanvasPaletteContext);
    const { messages } = useLocale();
    const fill = fillProp ?? palette.foreground;
    // 可变实例状态 ref：持有注册 id
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：缓存当前字形的 key 和尺寸（避免 update effect 中丢失）
    const glyphRef = useRef<{ key: string; width: number; height: number } | undefined>(undefined);
    // 可变实例状态 ref：实时持有 worldMatrix，供 containsPoint 闭包读取
    const worldMatrixRef = useRef<Float32Array>(ctx.parentMatrix);
    worldMatrixRef.current = ctx.parentMatrix;

    // 内联编辑状态
    const [editing, setEditing] = useState(false);
    // 可变实例状态：先结束会话，再通知应用，避免应用移焦触发 blur 重复提交。
    const editingSessionRef = useRef(false);

    // latest-ref：onEdit 回调（避免 HitEntry 闭包陈旧）
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const onEditRef = useRef(onEdit);
    onEditRef.current = onEdit;

    const finishEditing = (editor: HTMLTextAreaElement, commit: boolean, restoreFocus: boolean) => {
        if (!editingSessionRef.current) return;
        editingSessionRef.current = false;
        const container = ctx.containerRef.current;
        const ownerDocument = editor.ownerDocument;
        const ownedFocus = ownerDocument.activeElement === editor;
        setEditing(false);
        if (commit) onEditRef.current?.(editor.value);
        // 显式结束才返回画布。应用回调可能转移焦点或同步卸载，不能覆盖它的决定。
        if (restoreFocus && ownedFocus && ownerDocument.activeElement === editor
            && container?.isConnected && ctx.containerRef.current === container) {
            container.focus({ preventScroll: true });
        }
    };

    const alignOffset = (w: number): number =>
        textAlign === 'center' ? -w / 2 : textAlign === 'right' ? -w : 0;

    const baselineOffset = (h: number): number =>
        textBaseline === 'middle' ? -h / 2 : textBaseline === 'bottom' ? -h : 0;

    const buildCmd = (glyphKey: string | undefined, glyphWidth: number, glyphHeight: number) => {
        const parsedFill = parseColor(ctx.resolveColor(fill, palette.foreground, 'foreground'));
        const appliedFill: ColorRGBA =
            opacity !== 1
                ? [parsedFill[0], parsedFill[1], parsedFill[2], parsedFill[3] * opacity]
                : parsedFill;
        return {
            kind: mode === 'bitmap' ? ('bitmap-text' as const) : ('sdf-text' as const),
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
        onDblClick: editable ? () => {
            if (editingSessionRef.current) return;
            editingSessionRef.current = true;
            setEditing(true);
        } : undefined,
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

    // 文字内容、字体或渲染模式变化时重新生成字形纹理并上传。
    // bitmap 模式按 dprRef 当帧值光栅化；dpr 事后变化（跨屏拖动窗口）不触发
    // 重新光栅化，仅轻微失去 1:1 对齐——与 ECharts v6.2.0 之前的行为一致。
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        const glyph = mode === 'bitmap'
            ? generateBitmapGlyph(children, fontSize, fontFamily, ctx.dprRef.current, lineHeight, maxWidth)
            : generateGlyph(children, fontSize, fontFamily, lineHeight, maxWidth);
        ctx.uploadGlyph(glyph.key, glyph.data, glyph.width, glyph.height);
        glyphRef.current = { key: glyph.key, width: glyph.worldWidth, height: glyph.worldHeight };
        ctx.update(cmdIdRef.current, buildCmd(glyph.key, glyph.worldWidth, glyph.worldHeight));
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
        return () => { ctx.releaseTexture(glyph.key); };
    }, [children, fontSize, fontFamily, lineHeight, maxWidth, mode]);

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
                aria-label={editorLabel?.trim() || messages.canvas.editText}
                ref={initializeTextEditor}
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
                    background: palette.editorBackground,
                    border: `1.5px solid ${palette.editorBorder}`,
                    outline: 'none',
                    padding: 2,
                    boxSizing: 'border-box',
                    resize: 'none',
                    lineHeight: `${(lineHeight ?? fontSize * 1.4) * zoom}px`,
                    zIndex: 1000,
                }}
                onBlur={(e) => {
                    finishEditing(e.currentTarget, true, false);
                }}
                onKeyDownCapture={(e) => {
                    // 捕获阶段阻止事件，早于 Canvas 容器上的原生 keydown 监听器。
                    e.stopPropagation();
                    // 组合输入的确认/取消属于输入法；229 兼容结束组合时 isComposing 已复位的浏览器。
                    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        finishEditing(e.currentTarget, true, true);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        finishEditing(e.currentTarget, false, true);
                    }
                }}
            />,
            containerEl,
        );
    }

    return overlay ?? null;
}

export default Text;
