import { use, useEffect, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import { invertMat3, applyMat3, computeRectAABB } from './math/matrix.js';
import type { CanvasInteractiveProps } from './types.js';

export interface ImageProps extends CanvasInteractiveProps {
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

function CanvasImage({
    src,
    x,
    y,
    width,
    height,
    opacity = 1,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: ImageProps) {
    const ctx = use(CanvasContext);
    // 可变实例状态 ref：持有注册 id
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：跟踪已成功上传的纹理 key（undefined 表示尚未加载）
    const loadedKeyRef = useRef<string | undefined>(undefined);
    // 可变实例状态 ref：实时持有 worldMatrix，供 containsPoint 闭包读取
    const worldMatrixRef = useRef<Float32Array>(ctx.parentMatrix);
    worldMatrixRef.current = ctx.parentMatrix;

    const buildCmd = (textureKey: string | undefined) => ({
        kind: 'texture-image' as const,
        x, y, width, height,
        textureKey,
        opacity,
        worldMatrix: ctx.parentMatrix,
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        aabb: computeRectAABB(x, y, width, height, ctx.parentMatrix),
    });

    const buildHitEntry = () => ({
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        parentMatrix: ctx.parentMatrix,
        containsPoint: (canvasX: number, canvasY: number): boolean => {
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, canvasX, canvasY);
            return lx >= x && lx <= x + width && ly >= y && ly <= y + height;
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

    // mount 时注册（textureKey 暂为 undefined）
    useEffect(() => {
        const id = ctx.register(buildCmd(undefined));
        cmdIdRef.current = id;
        if (needsHit) ctx.registerHit(id, buildHitEntry());
        return () => {
            ctx.unregister(id);
            if (needsHit) ctx.unregisterHit(id);
            cmdIdRef.current = null;
        };
    }, []);

    // src 变化时重新加载图片并上传纹理
    useEffect(() => {
        loadedKeyRef.current = undefined;
        if (cmdIdRef.current !== null) {
            ctx.update(cmdIdRef.current, buildCmd(undefined));
        }

        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            if (cancelled || cmdIdRef.current === null) return;
            loadedKeyRef.current = src;
            ctx.uploadTexture(src, img);
            ctx.update(cmdIdRef.current, buildCmd(src));
        };
        img.src = src;
        return () => { cancelled = true; };
    }, [src]);

    // 非 src props 变化时更新，保留已上传的 textureKey
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd(loadedKeyRef.current));
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    });

    return null;
}

export default CanvasImage;
