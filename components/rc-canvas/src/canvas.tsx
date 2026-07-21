import { type CSSProperties, type ReactNode, type Ref, type RefObject, useEffect, useRef, useState } from 'react';
import { CanvasContext, type CanvasContextValue, type HitEntry } from './context/canvas-context.js';
import { WebGLRenderer } from './renderer/renderer.js';
import type { DrawCommand, LineCommand } from './renderer/draw-command.js';
import { identityMat3, invertMat3, applyMat3, applyMat3Vector } from './math/matrix.js';
import type { DragMoveEvent } from './drag-types.js';

export interface CanvasProps {
    width?: number;
    height?: number;
    /**
     * 自动填充父容器尺寸（ResizeObserver 驱动）。
     * 开启时 width/height 被忽略；父容器必须有明确的 CSS 尺寸。
     */
    fillParent?: boolean;
    /** 设备像素比，默认 window.devicePixelRatio（≥1）*/
    dpr?: number;
    children?: ReactNode;
    ref?: Ref<HTMLCanvasElement>;
    className?: string;
    style?: CSSProperties;
    /** 点击空白区域（无命中形状）时触发，常用于取消选中 */
    onEmptyClick?: () => void;
    /** 键盘按下时触发（容器 div 默认 tabIndex=0） */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** 键盘释放时触发 */
    onKeyUp?: (e: KeyboardEvent) => void;
    /**
     * 容器 div 的 tabIndex。消费方在 Canvas 外自建键盘通道
     * （如 aria-hidden 包裹绘制层）时传 -1 将其移出 Tab 流。
     * @default 0
     */
    tabIndex?: number;
}

/** 是否为需要逐帧重绘的动画命令（当前仅流动虚线 Line：flowSpeed ≠ 0）。 */
function isAnimatedCommand(cmd: Omit<DrawCommand, 'id'>): boolean {
    return cmd.kind === 'line' && !!(cmd as Omit<LineCommand, 'id'>).flowSpeed;
}

/** 字典序比较两个 zIndexPath（与 renderer 保持一致）。 */
function compareZIndexPaths(a: number[], b: number[]): number {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const av = i < a.length ? a[i] : -Infinity;
        const bv = i < b.length ? b[i] : -Infinity;
        if (av !== bv) return av - bv;
    }
    return 0;
}

/** 在 hitRegistry 中找 zIndexPath 最大（最顶层）的命中 entry，未命中返回 null。 */
function findTopHit(
    registry: Map<number, HitEntry>,
    cx: number,
    cy: number,
): { id: number; entry: HitEntry } | null {
    let topId: number | null = null;
    let topEntry: HitEntry | null = null;
    for (const [id, entry] of registry.entries()) {
        if (!entry.containsPoint(cx, cy)) continue;
        if (topEntry === null || compareZIndexPaths(entry.zIndexPath, topEntry.zIndexPath) > 0) {
            topId = id;
            topEntry = entry;
        }
    }
    return topEntry !== null ? { id: topId!, entry: topEntry } : null;
}

function Canvas({
    width: propWidth,
    height: propHeight,
    fillParent = false,
    dpr,
    children,
    ref: externalRef,
    className,
    style,
    onEmptyClick,
    onKeyDown,
    onKeyUp,
    tabIndex = 0,
}: CanvasProps) {
    // fillParent 模式下由 ResizeObserver 驱动容器尺寸
    const [containerSize, setContainerSize] = useState({ width: propWidth ?? 0, height: propHeight ?? 0 });
    const effectiveWidth = fillParent ? containerSize.width : (propWidth ?? 0);
    const effectiveHeight = fillParent ? containerSize.height : (propHeight ?? 0);

    const devicePixelRatio = dpr ?? (typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1);

    // 可变实例状态 ref：持有 <canvas> DOM 节点
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    // 可变实例状态 ref：持有容器 div，供 portal overlay 使用
    const containerDivRef = useRef<HTMLDivElement | null>(null);
    // 可变实例状态 ref：持有 WebGLRenderer 实例，跨渲染不触发 rerender
    const rendererRef = useRef<WebGLRenderer | null>(null);
    // 可变实例状态 ref：DrawCommand 队列
    const commandMapRef = useRef<Map<number, DrawCommand>>(new Map());
    // 可变实例状态 ref：ID 单调递增分配器（DrawCommand 与 HitEntry 共用）
    const nextIdRef = useRef(0);
    // 可变实例状态 ref：rAF 句柄
    const rafHandleRef = useRef(0);
    // 可变实例状态 ref：脏标记，命令队列或视图矩阵变更时置 true，tick 渲染后清零
    const dirtyRef = useRef(true);
    // 可变实例状态 ref：动画命令计数（flowSpeed ≠ 0 的 Line），> 0 时渲染循环持续重绘
    const animatedCountRef = useRef(0);
    // 可变实例状态 ref：prefers-reduced-motion 偏好，reduce 时流动动画降级为静态
    const reducedMotionRef = useRef(false);
    // 可变实例状态 ref：commands 版本号，仅 register/update/unregister 时递增
    const commandsVersionRef = useRef(0);
    // 可变实例状态 ref：待上传纹理 / 字形缓存
    const pendingGlyphsRef = useRef<Map<string, { data: Uint8Array; w: number; h: number }>>(new Map());
    const pendingTexturesRef = useRef<Map<string, HTMLImageElement | ImageBitmap>>(new Map());
    // 可变实例状态 ref：hit-test 注册表
    const hitRegistryRef = useRef<Map<number, HitEntry>>(new Map());
    // 可变实例状态 ref：viewMatrix（world → canvas），由 Viewport 写入，tick 时注入 GPU
    const viewMatrixRef = useRef<Float32Array>(identityMat3());
    // 可变实例状态 ref：viewMatrix 的逆矩阵缓存
    const invViewMatrixRef = useRef<Float32Array | null>(null);
    // 可变实例状态 ref：canvas 事件订阅总线
    const eventBusRef = useRef<Map<string, Set<(e: Event) => void>>>(new Map());
    // 可变实例状态 ref：当前悬停图元的 id，null = 无悬停
    const hoveredIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：pointerdown 时的快照，用于区分 click vs drag
    const clickStateRef = useRef<{
        pointerId: number;
        startLx: number;
        startLy: number;
        hitEntry: HitEntry | null;
    } | null>(null);
    // 可变实例状态 ref：上次 click 的时间/位置（用于 dblclick 检测）
    const lastClickRef = useRef<{ time: number; lx: number; ly: number } | null>(null);
    // latest-ref：供单次注册的 effect 内读取最新 onEmptyClick
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const onEmptyClickRef = useRef(onEmptyClick);
    onEmptyClickRef.current = onEmptyClick;
    const onKeyDownRef = useRef(onKeyDown);
    onKeyDownRef.current = onKeyDown;
    const onKeyUpRef = useRef(onKeyUp);
    onKeyUpRef.current = onKeyUp;

    // 可变实例状态 ref：canvas 逻辑尺寸，供 Minimap / fitView 读取
    const canvasSizeRef = useRef({ width: effectiveWidth, height: effectiveHeight });
    // 可变实例状态 ref：设备像素比，供 Text bitmap 模式光栅化读取。
    // 初值渲染期求值：子组件（Text）的 effect 先于 Canvas 的 effect 执行，
    // 首次生成字形时必须已经拿到正确 dpr。
    const dprRef = useRef(devicePixelRatio);
    // 可变实例状态 ref：Viewport 注入的 seekPan 回调
    const seekPanRef = useRef<((panX: number, panY: number) => void) | null>(null);
    // 可变实例状态 ref：Viewport 注入的 applyZoom 回调
    const applyZoomRef = useRef<((deltaY: number, pivotX: number, pivotY: number) => void) | null>(null);
    // 可变实例状态 ref：Viewport 注入的 fitView 回调
    const fitViewRef = useRef<((padding?: number) => void) | null>(null);

    // 可变实例状态 ref：当前活跃拖拽状态
    const dragStateRef = useRef<{
        pointerId: number;
        entryId: number;
        startCanvasX: number;
        startCanvasY: number;
        prevCanvasX: number;
        prevCanvasY: number;
        invertedParentMatrix: Float32Array;
        entry: HitEntry;
    } | null>(null);

    // 逻辑坐标计算：通过 getBoundingClientRect 归一化，始终用 canvasSizeRef（fillParent 兼容）
    const toLogical = (e: PointerEvent): { lx: number; ly: number } => {
        const node = internalCanvasRef.current;
        if (!node) return { lx: 0, ly: 0 };
        const { width: w, height: h } = canvasSizeRef.current;
        const rect = node.getBoundingClientRect();
        return {
            lx: (e.clientX - rect.left) * (w / rect.width),
            ly: (e.clientY - rect.top) * (h / rect.height),
        };
    };

    // mount 时初始化 WebGL context、渲染循环和 pointer 事件，unmount 时清理
    useEffect(() => {
        const node = internalCanvasRef.current;
        if (!node) return;
        // preserveDrawingBuffer: true 允许 toDataURL() 在帧结束后读取
        const gl = node.getContext('webgl2', { preserveDrawingBuffer: true });
        if (!gl) {
            console.error('[rc-canvas] WebGL2 is not supported in this environment.');
            return;
        }
        const { width: w, height: h } = canvasSizeRef.current;
        const renderer = new WebGLRenderer(gl, w, h, dprRef.current);
        rendererRef.current = renderer;

        // 重放在 renderer 就绪前由子组件缓存的上传请求
        for (const [key, g] of pendingGlyphsRef.current) {
            renderer.uploadGlyph(key, g.data, g.w, g.h);
        }
        for (const [key, source] of pendingTexturesRef.current) {
            renderer.uploadTexture(key, source);
        }

        // wheel 事件分发给 eventBus 订阅者（Viewport 通过 subscribeCanvasEvent 注册）
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            eventBusRef.current.get('wheel')?.forEach(h => h(e));
        };
        node.addEventListener('wheel', onWheel, { passive: false });

        // prefers-reduced-motion：reduce 时流动虚线降级为静态虚线
        // （渲染循环回到按需模式，renderer 侧将 flowSpeed 视为 0）
        let motionQuery: MediaQueryList | null = null;
        const onMotionChange = () => {
            const reduce = motionQuery?.matches ?? false;
            reducedMotionRef.current = reduce;
            renderer.reducedMotion = reduce;
            dirtyRef.current = true;
        };
        if (typeof window.matchMedia === 'function') {
            motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            onMotionChange();
            motionQuery.addEventListener('change', onMotionChange);
        }

        const tick = () => {
            // 存在动画命令且未开启"减弱动态"偏好时持续重绘；否则按脏标记按需渲染
            if (dirtyRef.current || (animatedCountRef.current > 0 && !reducedMotionRef.current)) {
                renderer.setViewMatrix(viewMatrixRef.current);
                renderer.render(commandMapRef.current, commandsVersionRef.current);
                dirtyRef.current = false;
            }
            rafHandleRef.current = requestAnimationFrame(tick);
        };
        rafHandleRef.current = requestAnimationFrame(tick);

        // ─── pointer 事件处理 ────────────────────────────────────────────────

        const onPointerDown = (e: PointerEvent) => {
            if (dragStateRef.current !== null) return;

            const { lx, ly } = toLogical(e);
            const invView = invViewMatrixRef.current;
            const [wx, wy] = invView ? applyMat3(invView, lx, ly) : [lx, ly];
            const result = findTopHit(hitRegistryRef.current, wx, wy);
            const hit = result?.entry ?? null;

            clickStateRef.current = { pointerId: e.pointerId, startLx: lx, startLy: ly, hitEntry: hit };

            if (!hit) return;
            if (!hit.onDragStart && !hit.onDrag && !hit.onDragEnd) return;

            const inv = invertMat3(hit.parentMatrix);
            if (!inv) return;

            node.setPointerCapture(e.pointerId);

            const prevHoveredId = hoveredIdRef.current;
            if (prevHoveredId !== null) {
                hitRegistryRef.current.get(prevHoveredId)?.onMouseLeave?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                hoveredIdRef.current = null;
            }

            dragStateRef.current = {
                pointerId: e.pointerId,
                entryId: result!.id,
                startCanvasX: lx,
                startCanvasY: ly,
                prevCanvasX: lx,
                prevCanvasY: ly,
                invertedParentMatrix: inv,
                entry: hit,
            };

            hit.onDragStart?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
        };

        const onPointerMove = (e: PointerEvent) => {
            const { lx, ly } = toLogical(e);
            const drag = dragStateRef.current;

            if (drag && e.pointerId === drag.pointerId) {
                const canvasDx = lx - drag.startCanvasX;
                const canvasDy = ly - drag.startCanvasY;
                const frameDx = lx - drag.prevCanvasX;
                const frameDy = ly - drag.prevCanvasY;
                const invView = invViewMatrixRef.current;
                const [worldDx, worldDy] = invView
                    ? applyMat3Vector(invView, frameDx, frameDy)
                    : [frameDx, frameDy];
                const [localDx, localDy] = applyMat3Vector(drag.invertedParentMatrix, worldDx, worldDy);
                drag.prevCanvasX = lx;
                drag.prevCanvasY = ly;
                const event: DragMoveEvent = {
                    canvasX: lx, canvasY: ly,
                    canvasDx, canvasDy,
                    canvasFrameDx: frameDx,
                    canvasFrameDy: frameDy,
                    localDx, localDy,
                    nativeEvent: e,
                };
                drag.entry.onDrag?.(event);
            } else {
                const invView = invViewMatrixRef.current;
                const [wx, wy] = invView ? applyMat3(invView, lx, ly) : [lx, ly];
                const result = findTopHit(hitRegistryRef.current, wx, wy);
                const newId = result?.id ?? null;
                const prevId = hoveredIdRef.current;
                if (prevId !== newId) {
                    if (prevId !== null) {
                        hitRegistryRef.current.get(prevId)?.onMouseLeave?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                    }
                    if (newId !== null) {
                        result!.entry.onMouseEnter?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                    }
                    hoveredIdRef.current = newId;
                }
                node.style.cursor = result?.entry.cursor ?? '';
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            const drag = dragStateRef.current;
            if (drag && e.pointerId === drag.pointerId) {
                const { lx, ly } = toLogical(e);
                drag.entry.onDragEnd?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                node.releasePointerCapture(e.pointerId);
                node.style.cursor = '';
                dragStateRef.current = null;
            }

            // click / dblclick 判断
            const click = clickStateRef.current;
            if (click && e.pointerId === click.pointerId) {
                const { lx, ly } = toLogical(e);
                if (Math.hypot(lx - click.startLx, ly - click.startLy) < 4) {
                    const invView = invViewMatrixRef.current;
                    const [wx, wy] = invView ? applyMat3(invView, lx, ly) : [lx, ly];

                    const now = performance.now();
                    const last = lastClickRef.current;
                    const isDbl = last !== null &&
                        (now - last.time) < 300 &&
                        Math.hypot(lx - last.lx, ly - last.ly) < 8;

                    if (isDbl) {
                        const result = findTopHit(hitRegistryRef.current, wx, wy);
                        result?.entry.onDblClick?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                        lastClickRef.current = null;
                    } else {
                        if (click.hitEntry?.onClick) {
                            click.hitEntry.onClick({ canvasX: lx, canvasY: ly, nativeEvent: e });
                        } else if (!click.hitEntry) {
                            onEmptyClickRef.current?.();
                        }
                        lastClickRef.current = { time: now, lx, ly };
                    }
                } else {
                    lastClickRef.current = null;
                }
                clickStateRef.current = null;
            }
        };

        const onPointerLeave = (e: PointerEvent) => {
            const { lx, ly } = toLogical(e);
            const prevId = hoveredIdRef.current;
            if (prevId !== null) {
                hitRegistryRef.current.get(prevId)?.onMouseLeave?.({ canvasX: lx, canvasY: ly, nativeEvent: e });
                hoveredIdRef.current = null;
                node.style.cursor = '';
            }
        };

        node.addEventListener('pointerdown', onPointerDown);
        node.addEventListener('pointermove', onPointerMove);
        node.addEventListener('pointerup', onPointerUp);
        node.addEventListener('pointercancel', onPointerUp);
        node.addEventListener('pointerleave', onPointerLeave);

        return () => {
            cancelAnimationFrame(rafHandleRef.current);
            motionQuery?.removeEventListener('change', onMotionChange);
            renderer.dispose();
            rendererRef.current = null;
            node.removeEventListener('wheel', onWheel);
            node.removeEventListener('pointerdown', onPointerDown);
            node.removeEventListener('pointermove', onPointerMove);
            node.removeEventListener('pointerup', onPointerUp);
            node.removeEventListener('pointercancel', onPointerUp);
            node.removeEventListener('pointerleave', onPointerLeave);
        };
    }, []);

    // 有效尺寸变化时更新 renderer 和 canvasSizeRef / dprRef
    useEffect(() => {
        canvasSizeRef.current = { width: effectiveWidth, height: effectiveHeight };
        const nextDpr = dpr ?? window.devicePixelRatio ?? 1;
        dprRef.current = nextDpr;
        rendererRef.current?.resize(effectiveWidth, effectiveHeight, nextDpr);
        dirtyRef.current = true;
    }, [effectiveWidth, effectiveHeight, dpr]);

    // fillParent 模式：ResizeObserver 监听容器 div
    useEffect(() => {
        if (!fillParent) return;
        const div = containerDivRef.current;
        if (!div) return;
        const ro = new ResizeObserver(entries => {
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;
            setContainerSize({ width: Math.round(width), height: Math.round(height) });
        });
        ro.observe(div);
        return () => ro.disconnect();
    }, [fillParent]);

    // 键盘事件：在容器 div 上监听，通过 eventBus 分发，同时调用 prop 回调
    useEffect(() => {
        const div = containerDivRef.current;
        if (!div) return;
        const onKD = (e: KeyboardEvent) => {
            eventBusRef.current.get('keydown')?.forEach(h => h(e));
            onKeyDownRef.current?.(e);
        };
        const onKU = (e: KeyboardEvent) => {
            eventBusRef.current.get('keyup')?.forEach(h => h(e));
            onKeyUpRef.current?.(e);
        };
        div.addEventListener('keydown', onKD);
        div.addEventListener('keyup', onKU);
        return () => {
            div.removeEventListener('keydown', onKD);
            div.removeEventListener('keyup', onKU);
        };
    }, []);

    // 合并内部 ref 和外部 ref
    const mergedRefCallback = (node: HTMLCanvasElement | null) => {
        internalCanvasRef.current = node;
        if (typeof externalRef === 'function') {
            externalRef(node);
        } else if (externalRef && typeof externalRef === 'object') {
            (externalRef as RefObject<HTMLCanvasElement | null>).current = node;
        }
    };

    // 面向库消费方的稳定化（例外白名单）：ctxValue 只在 mount 时创建一次
    const ctxValueRef = useRef<CanvasContextValue | null>(null);
    if (ctxValueRef.current === null) {
        ctxValueRef.current = {
            register(cmd) {
                const id = nextIdRef.current++;
                commandMapRef.current.set(id, { ...cmd, id } as DrawCommand);
                commandsVersionRef.current++;
                dirtyRef.current = true;
                if (isAnimatedCommand(cmd)) animatedCountRef.current++;
                return id;
            },
            update(id, cmd) {
                const prev = commandMapRef.current.get(id);
                commandMapRef.current.set(id, { ...cmd, id } as DrawCommand);
                commandsVersionRef.current++;
                dirtyRef.current = true;
                animatedCountRef.current +=
                    (isAnimatedCommand(cmd) ? 1 : 0) - (prev && isAnimatedCommand(prev) ? 1 : 0);
            },
            unregister(id) {
                const prev = commandMapRef.current.get(id);
                commandMapRef.current.delete(id);
                commandsVersionRef.current++;
                dirtyRef.current = true;
                if (prev && isAnimatedCommand(prev)) animatedCountRef.current--;
            },
            uploadTexture(key, source) {
                pendingTexturesRef.current.set(key, source);
                rendererRef.current?.uploadTexture(key, source);
                dirtyRef.current = true;
            },
            uploadGlyph(key, data, w, h) {
                pendingGlyphsRef.current.set(key, { data, w, h });
                rendererRef.current?.uploadGlyph(key, data, w, h);
                dirtyRef.current = true;
            },
            registerHit(id, entry) {
                hitRegistryRef.current.set(id, entry);
            },
            unregisterHit(id) {
                hitRegistryRef.current.delete(id);
                if (dragStateRef.current?.entryId === id) {
                    dragStateRef.current = null;
                }
                if (hoveredIdRef.current === id) {
                    hoveredIdRef.current = null;
                }
            },
            updateHit(id, entry) {
                hitRegistryRef.current.set(id, entry);
                if (dragStateRef.current?.entryId === id) {
                    dragStateRef.current.entry = entry;
                    const inv = invertMat3(entry.parentMatrix);
                    if (inv) dragStateRef.current.invertedParentMatrix = inv;
                }
            },
            nextId() {
                return nextIdRef.current++;
            },
            viewMatrixRef,
            commandMapRef,
            canvasSizeRef,
            dprRef,
            seekPanRef,
            applyZoomRef,
            fitViewRef,
            containerRef: containerDivRef,
            exportPNG() {
                return internalCanvasRef.current?.toDataURL('image/png') ?? '';
            },
            setViewMatrix(mat) {
                viewMatrixRef.current = mat;
                invViewMatrixRef.current = invertMat3(mat);
                dirtyRef.current = true;
            },
            subscribeCanvasEvent(type, handler) {
                const bus = eventBusRef.current;
                if (!bus.has(type)) bus.set(type, new Set());
                const handlers = bus.get(type)!;
                handlers.add(handler as (e: Event) => void);
                return () => handlers.delete(handler as (e: Event) => void);
            },
            parentMatrix: identityMat3(),
            parentZIndexPath: [],
        };
    }
    const ctxValue = ctxValueRef.current;

    const divStyle: CSSProperties = fillParent
        ? { position: 'relative', width: '100%', height: '100%', ...style }
        : { position: 'relative', display: 'inline-block', ...style };

    return (
        <CanvasContext value={ctxValue}>
            <div
                ref={containerDivRef}
                className={className}
                style={divStyle}
                tabIndex={tabIndex}
            >
                <canvas
                    ref={mergedRefCallback}
                    style={{ display: 'block', width: effectiveWidth, height: effectiveHeight, touchAction: 'none' }}
                    width={Math.round(effectiveWidth * devicePixelRatio)}
                    height={Math.round(effectiveHeight * devicePixelRatio)}
                />
                {children}
            </div>
        </CanvasContext>
    );
}

export default Canvas;
