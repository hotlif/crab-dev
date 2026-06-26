import { type CSSProperties, type ReactNode, type Ref, type RefObject, useEffect, useRef } from 'react';
import { CanvasContext, type CanvasContextValue, type HitEntry } from './context/canvas-context.js';
import { WebGLRenderer } from './renderer/renderer.js';
import type { DrawCommand } from './renderer/draw-command.js';
import { identityMat3, invertMat3, applyMat3, applyMat3Vector } from './math/matrix.js';
import type { DragMoveEvent } from './drag-types.js';

export interface CanvasProps {
    width: number;
    height: number;
    /** 设备像素比，默认 window.devicePixelRatio（≥1）*/
    dpr?: number;
    children?: ReactNode;
    ref?: Ref<HTMLCanvasElement>;
    className?: string;
    style?: CSSProperties;
    /** 点击空白区域（无命中形状）时触发，常用于取消选中 */
    onEmptyClick?: () => void;
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
    width,
    height,
    dpr,
    children,
    ref: externalRef,
    className,
    style,
    onEmptyClick,
}: CanvasProps) {
    // 可变实例状态 ref：持有 <canvas> DOM 节点
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
    // 可变实例状态 ref：commands 版本号，仅 register/update/unregister 时递增，
    // 传给 renderer.render 以区分"commands 变化"与"仅 viewMatrix 变化"，避免重排
    const commandsVersionRef = useRef(0);
    // 可变实例状态 ref：待上传纹理 / 字形缓存。
    // React effect 执行顺序为「子先于父」，叶子组件（Text / Image）在 mount effect 中
    // 请求上传时，本组件的 init effect 尚未运行、renderer 还是 null。这里先缓存请求，
    // 待 renderer 创建后统一重放；renderer 因尺寸变化重建时也可据此恢复纹理。
    const pendingGlyphsRef = useRef<Map<string, { data: Uint8Array; w: number; h: number }>>(new Map());
    const pendingTexturesRef = useRef<Map<string, HTMLImageElement | ImageBitmap>>(new Map());
    // 可变实例状态 ref：hit-test 注册表
    const hitRegistryRef = useRef<Map<number, HitEntry>>(new Map());
    // 可变实例状态 ref：viewMatrix（world → canvas），由 Viewport 写入，tick 时注入 GPU
    const viewMatrixRef = useRef<Float32Array>(identityMat3());
    // 可变实例状态 ref：viewMatrix 的逆矩阵缓存，setViewMatrix 时同步更新，避免 pointer 事件每次重算
    const invViewMatrixRef = useRef<Float32Array | null>(null);
    // 可变实例状态 ref：canvas 事件订阅总线（Viewport 通过 subscribeCanvasEvent 注册）
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
    // latest-ref：供单次注册的 effect 内读取最新 onEmptyClick
    // 注：渲染期写 ref 违反 Rules of React，使编译器降级——是 latest-ref 的有意取舍
    const onEmptyClickRef = useRef(onEmptyClick);
    onEmptyClickRef.current = onEmptyClick;

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

    // 逻辑坐标计算：用 getBoundingClientRect 归一化，兼容 CSS 缩放
    const toLogical = (e: PointerEvent): { lx: number; ly: number } => {
        const node = internalCanvasRef.current;
        if (!node) return { lx: 0, ly: 0 };
        const rect = node.getBoundingClientRect();
        return {
            lx: (e.clientX - rect.left) * (width / rect.width),
            ly: (e.clientY - rect.top) * (height / rect.height),
        };
    };

    // mount 时初始化 WebGL context、渲染循环和 pointer 事件，unmount 时清理
    useEffect(() => {
        const node = internalCanvasRef.current;
        if (!node) return;
        const gl = node.getContext('webgl2');
        if (!gl) {
            console.error('[rc-canvas] WebGL2 is not supported in this environment.');
            return;
        }
        const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
        const renderer = new WebGLRenderer(gl, width, height, devicePixelRatio);
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

        const tick = () => {
            if (dirtyRef.current) {
                renderer.setViewMatrix(viewMatrixRef.current);
                renderer.render(commandMapRef.current, commandsVersionRef.current);
                dirtyRef.current = false;
            }
            rafHandleRef.current = requestAnimationFrame(tick);
        };
        rafHandleRef.current = requestAnimationFrame(tick);

        // ─── pointer 事件处理 ────────────────────────────────────────────────

        const onPointerDown = (e: PointerEvent) => {
            // 已有活跃 drag 时忽略新 pointer（单 pointer 语义）
            if (dragStateRef.current !== null) return;

            const { lx, ly } = toLogical(e);
            // hit-test 在世界坐标系中进行：先用缓存的逆矩阵变换到世界坐标
            const invView = invViewMatrixRef.current;
            const [wx, wy] = invView ? applyMat3(invView, lx, ly) : [lx, ly];
            const result = findTopHit(hitRegistryRef.current, wx, wy);
            const hit = result?.entry ?? null;

            // 无论是否命中，都记录 click 快照（用于 pointerUp 时判断 click）
            clickStateRef.current = { pointerId: e.pointerId, startLx: lx, startLy: ly, hitEntry: hit };

            if (!hit) return;
            // 只有携带 drag 事件的命中才进入 drag 模式
            if (!hit.onDragStart && !hit.onDrag && !hit.onDragEnd) return;

            const inv = invertMat3(hit.parentMatrix);
            if (!inv) return;

            node.setPointerCapture(e.pointerId);

            // 进入 drag 前清除 hover 状态（拖拽期间不响应 hover）
            const prevHoveredId = hoveredIdRef.current;
            if (prevHoveredId !== null) {
                hitRegistryRef.current.get(prevHoveredId)?.onMouseLeave?.();
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
                // 拖拽中：canvasDx/canvasDy 为相对起点的 canvas 坐标总偏移
                const canvasDx = lx - drag.startCanvasX;
                const canvasDy = ly - drag.startCanvasY;
                const frameDx = lx - drag.prevCanvasX;
                const frameDy = ly - drag.prevCanvasY;
                // canvas 帧增量 → 世界坐标帧增量 → 局部坐标帧增量（用缓存的逆矩阵）
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
                // 非拖拽：hit-test 在世界坐标系中查找，更新 cursor 并触发 enter/leave
                const invView = invViewMatrixRef.current;
                const [wx, wy] = invView ? applyMat3(invView, lx, ly) : [lx, ly];
                const result = findTopHit(hitRegistryRef.current, wx, wy);
                const newId = result?.id ?? null;
                const prevId = hoveredIdRef.current;
                if (prevId !== newId) {
                    if (prevId !== null) {
                        hitRegistryRef.current.get(prevId)?.onMouseLeave?.();
                    }
                    if (newId !== null) {
                        result!.entry.onMouseEnter?.();
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

            // click 判断：移动距离 < 4px 视为点击
            const click = clickStateRef.current;
            if (click && e.pointerId === click.pointerId) {
                const { lx, ly } = toLogical(e);
                if (Math.hypot(lx - click.startLx, ly - click.startLy) < 4) {
                    if (click.hitEntry?.onClick) {
                        click.hitEntry.onClick();
                    } else if (!click.hitEntry) {
                        onEmptyClickRef.current?.();
                    }
                }
                clickStateRef.current = null;
            }
        };

        const onPointerLeave = () => {
            const prevId = hoveredIdRef.current;
            if (prevId !== null) {
                hitRegistryRef.current.get(prevId)?.onMouseLeave?.();
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

    // width/height/dpr 变化时更新 viewport（仅在 mount 后生效）
    useEffect(() => {
        const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
        rendererRef.current?.resize(width, height, devicePixelRatio);
        dirtyRef.current = true;
    }, [width, height, dpr]);

    // 合并内部 ref 和外部 ref 的回调（React 19：ref 作为普通 prop）
    const mergedRefCallback = (node: HTMLCanvasElement | null) => {
        internalCanvasRef.current = node;
        if (typeof externalRef === 'function') {
            externalRef(node);
        } else if (externalRef && typeof externalRef === 'object') {
            (externalRef as RefObject<HTMLCanvasElement | null>).current = node;
        }
    };

    // 面向库消费方的稳定化（例外白名单）：ctxValue 只在 mount 时创建一次，
    // 所有方法通过 ref 访问最新状态，Canvas 重渲染不产生新对象，避免触发全量子树重渲染。
    const ctxValueRef = useRef<CanvasContextValue | null>(null);
    if (ctxValueRef.current === null) {
        ctxValueRef.current = {
            register(cmd) {
                const id = nextIdRef.current++;
                commandMapRef.current.set(id, { ...cmd, id } as DrawCommand);
                commandsVersionRef.current++;
                dirtyRef.current = true;
                return id;
            },
            update(id, cmd) {
                commandMapRef.current.set(id, { ...cmd, id } as DrawCommand);
                commandsVersionRef.current++;
                dirtyRef.current = true;
            },
            unregister(id) {
                commandMapRef.current.delete(id);
                commandsVersionRef.current++;
                dirtyRef.current = true;
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
                // 图元卸载时不触发 onMouseLeave（回调已随组件销毁），仅清除 id
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

    const devicePixelRatio = dpr ?? (typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1);

    return (
        <CanvasContext value={ctxValue}>
            <canvas
                ref={mergedRefCallback}
                className={className}
                style={{ display: 'block', width, height, touchAction: 'none', ...style }}
                width={Math.round(width * devicePixelRatio)}
                height={Math.round(height * devicePixelRatio)}
            />
            {children}
        </CanvasContext>
    );
}

export default Canvas;
