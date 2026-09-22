import { use, useEffect, useEffectEvent, useId, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { invertMat3, applyMat3, computeRectAABB } from '../math/matrix.js';
import type { CanvasInteractiveProps } from '../types.js';

export interface ImageProps extends CanvasInteractiveProps {
    /** ImageBitmap 的所有权属于调用者；应在组件卸载或替换 src 后 close。 */
    src: string | ImageBitmap;
    onLoad?: () => void;
    onError?: (error: Error) => void;
    x: number;
    y: number;
    width: number;
    height: number;
}

function CanvasImage({
    src,
    onLoad,
    onError,
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
    const bitmapKey = useId();
    const notifyLoad = useEffectEvent(() => onLoad?.());
    const notifyError = useEffectEvent((error: Error) => onError?.(error));
    // 可变实例状态 ref：持有注册 id
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：跟踪已成功上传的纹理 key（undefined 表示尚未加载）
    const loadedKeyRef = useRef<string | undefined>(undefined);
    // 可变实例状态：每次上传使用独立 key，新纹理就绪前保留旧纹理。
    const generation = useRef(0);
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
            if (loadedKeyRef.current) ctx.releaseTexture(loadedKeyRef.current);
            loadedKeyRef.current = undefined;
        };
    }, []);

    // src 变化时重新加载图片并上传纹理
    useEffect(() => {
        let cancelled = false;
        const key = `image:${bitmapKey}:${++generation.current}`;
        const upload = (source: HTMLImageElement | ImageBitmap) => {
            if (cancelled || cmdIdRef.current === null) return;
            try {
                if (!source.width || !source.height) throw new Error('CanvasImage 图片已释放或尺寸无效');
                ctx.uploadTexture(key, source);
                const previous = loadedKeyRef.current;
                loadedKeyRef.current = key;
                ctx.update(cmdIdRef.current, buildCmd(key));
                if (previous) ctx.releaseTexture(previous);
                notifyLoad();
            } catch (error) { notifyError(error instanceof Error ? error : new Error('CanvasImage 上传失败')); }
        };
        let img: HTMLImageElement | undefined;
        if (typeof src === 'string') {
            img = new Image();
            img.onload = () => { if (img) upload(img); };
            img.onerror = () => { if (!cancelled) notifyError(new Error('CanvasImage 加载失败')); };
            img.src = src;
        } else upload(src);
        return () => {
            cancelled = true;
            if (img) { img.onload = null; img.onerror = null; }
        };
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
