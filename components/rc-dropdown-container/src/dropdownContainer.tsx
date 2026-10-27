import { registerOverlayLayer, resolveOverlayRoot } from '@crab-dev/rc-hooks/internal';
import { useComponentSize, ConfigBoundary, type ConfigSize } from '@crab-dev/rc-config-provider';
import { type HTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactNode, useEffect, useEffectEvent, useRef, useState } from 'react';
import { css, cx } from '@crab-dev/css';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
    detectOverflow,
    FloatingPortal,
    useDismiss,
    useInteractions,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useFloatingTree,
    FloatingTree,
    FloatingNode,
} from '@floating-ui/react';
import { useControllableOpen, type ControlledOpenProps, usePresence, useEventCallback } from '@crab-dev/rc-hooks';
import type { DropdownAction } from './reducer.js';
import { DropdownContext } from './context.js';
import { DropdownPositionReference } from './position-reference.js';
import token from './token.js';

export interface DropdownOpenChangeDetails {
    reason: 'trigger' | 'escape' | 'outside-press' | 'focus-out';
    event?: Event;
}

interface DropdownContainerBaseProps extends HTMLAttributes<HTMLElement> {
    /** 浮层尺寸档；省略时继承最近的 ConfigProvider。 */
    size?: ConfigSize;
    /** 非模态交互移出整个触发器／浮层分支时关闭；默认由消费组件管理。 */
    closeOnFocusOut?: boolean;
    /**
     * 下拉组件内容
     */
    overlay: ReactNode;

    /**
     * 浮层弹出面板的自定义类名
     */
    overlayClassName?: string;

    /**
     * 浮动面板的属性信息
     */
    floatingContainerProps?: HTMLAttributes<HTMLDivElement>;
}

export type DropdownContainerProps = DropdownContainerBaseProps & ControlledOpenProps<DropdownOpenChangeDetails>;

const containerStyle = css`
    position: relative;
`;

const floatingContainerStyle = css`
    @media (forced-colors: active) { border-color: CanvasText; box-shadow: none; }
    z-index: ${token.root['z-index']};
    margin: 0;
    border: 1px solid ${token.root['border-color']};
    box-sizing: border-box;
    max-width: ${token.root['max-width']};
    box-shadow: ${token.root['box-shadow']};
    border-radius: ${token.root['border-radius']};
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 1;
    translate: 0 0;
    transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition};
    @starting-style { opacity: 0; translate: 0 ${token.motion.offset.translate}; }
    &[data-state="closed"] { opacity: 0; translate: 0 ${token.motion.offset.translate}; pointer-events: none; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const overlayStyle = css`
    background-color: ${token.root['background-color']};
    border-radius: inherit;
    transform-origin: top;
`;

const VIEWPORT_PADDING = 8;

function DropdownContainer(props: DropdownContainerProps) {
    // 多个 DropdownContainer 嵌套使用时(如 rc-select 用在 rc-color-picker 面板内),
    // 仅最外层建立 FloatingTree,内层通过 useFloatingParentNodeId 检测到已在树中而复用它。
    // 同一棵树下,useDismiss 才能识别"点击落在后代浮层内"而不误判为外部点击并整体关闭——
    // 后代浮层即便因各自独立的 FloatingPortal 而在 DOM 上只是兄弟节点,也能被正确识别。
    const parentId = useFloatingParentNodeId();
    const content = <DropdownContainerContent {...props} />;

    return parentId == null ? <FloatingTree>{content}</FloatingTree> : content;
}

function DropdownContainerContent({ size: sizeProp, closeOnFocusOut = false, open: controlledOpen, defaultOpen, onOpenChange, className, children, overlay, overlayClassName, floatingContainerProps = {}, onFocusCapture, onBlurCapture, ...restProps }: DropdownContainerProps) {
    const componentSize = useComponentSize(sizeProp);
    const [open, setOpen] = useControllableOpen<DropdownOpenChangeDetails>({ open: controlledOpen, defaultOpen, onOpenChange });
    const state = { open };
    // Mutable request metadata: restoration belongs to Escape, never blur/outside dismissal.
    const closeReason = useRef<DropdownOpenChangeDetails['reason'] | null>(null);
    // A branch exit can include both outside pointerdown and focusout. A controlled
    // owner may keep the layer open; that still represents one dismissal request.
    const requestedFocusExit = useRef(false);
    const focusSequence = useRef(0);
    const branchRoot = useRef<HTMLDivElement | null>(null);
    // Escape restoration synchronously focuses the reference. Its consumer may
    // open on focus; that restoration must not become a new user open request.
    const restoringFocus = useRef(false);
    // The deferred focus check must read the latest committed controlled state.
    const requestOpen = useEventCallback((next: boolean, details: DropdownOpenChangeDetails) => {
        if (next && restoringFocus.current) return;
        if (closeOnFocusOut && (next === open || (!next && details.reason === 'focus-out' && requestedFocusExit.current))) return;
        requestedFocusExit.current = !next;
        closeReason.current = next ? null : details.reason;
        setOpen(next, details);
    });
    const dispatch = (action: DropdownAction) => requestOpen(action.payload, action.details ?? { reason: 'trigger' });
    const presence = usePresence<HTMLDivElement>(state.open);
    // 触发元素位于原生 <dialog>（showModal）内时，浮层必须挂载进该 dialog 子树：
    // modal dialog 会使 dialog 之外的整个文档 inert，挂在 body 下的浮层不可交互
    // （点击穿透、无法聚焦），挂进 dialog 子树即可恢复交互。
    // FloatingPortal 对 root 的语义：null = 等待 root 就绪（不渲染），undefined = 挂默认 body。
    // 初始 null 表示"尚未检测"，检测后必须落到 dialog 或 undefined，否则面板永不渲染。
    const [portalRoot, setPortalRoot] = useState<HTMLElement | ShadowRoot | null>(null);
    const {
        onMouseDown,
        className: floatingClassName,
        style: floatingUserStyle,
        ...restFloatingContainerProps
    } = floatingContainerProps;

    const nodeId = useFloatingNodeId();
    const tree = useFloatingTree();

    const { refs, elements, floatingStyles, context } = useFloating({
        nodeId,
        placement: 'bottom-start',
        strategy: 'fixed',
        open: state.open,
        onOpenChange: (nextOpen, event, reason) => requestOpen(nextOpen, { reason: reason === 'escape-key' ? 'escape' : 'outside-press', event }),
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            {
                name: 'crabSideRoom',
                async fn(state) {
                    const { reference, floating } = state.rects;
                    const [left, right] = await Promise.all([
                        detectOverflow({ ...state, placement: 'left-start', x: reference.x - floating.width - 6, y: reference.y }, { padding: VIEWPORT_PADDING }),
                        detectOverflow({ ...state, placement: 'right-start', x: reference.x + reference.width + 6, y: reference.y }, { padding: VIEWPORT_PADDING }),
                    ]);
                    return { data: { left: left.left <= 0 && left.right <= 0, right: right.left <= 0 && right.right <= 0 } };
                },
            },
            flip(({ middlewareData }) => ({
                padding: VIEWPORT_PADDING,
                // Keep feasible lateral placements. Otherwise compare the two
                // vertical directions, so size() can use the larger scroll area
                // without sending a fixed frame outside the horizontal viewport.
                fallbackPlacements: [
                    'top-start',
                    ...(middlewareData.crabSideRoom?.right ? ['right-start' as const] : []),
                    ...(middlewareData.crabSideRoom?.left ? ['left-start' as const] : []),
                ],
            })),
            shift({ padding: VIEWPORT_PADDING }),
            size({
                padding: VIEWPORT_PADDING,
                apply({ availableHeight, elements }) {
                    // Floating UI computes this value from the current viewport and placement.
                    // It is runtime geometry, so it must remain an inline measurement result.
                    elements.floating.style.maxHeight = `${Math.max(0, Math.floor(availableHeight))}px`;
                },
            }),
        ],
    });

    const dismissTop = useEffectEvent((event: KeyboardEvent) => requestOpen(false, { reason: 'escape', event }));
    useEffect(() => {
        const node = elements.floating;
        if (!open || !node) return;
        const reference = elements.domReference;
        const returnFocus = reference?.matches('button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])')
            ? reference : reference?.querySelector('input,button,textarea,select,a[href],[tabindex]:not([tabindex="-1"])') ?? reference;
        const layer = registerOverlayLayer(node, event => dismissTop(event), returnFocus);
        return () => {
            restoringFocus.current = closeReason.current === 'escape';
            try { layer.release({ restoreFocus: restoringFocus.current }); }
            finally { restoringFocus.current = false; }
        };
    // Portal content mounts after its root is resolved. Ref objects remain
    // stable, so their identities cannot signal that an actual layer appeared.
    }, [open, elements.floating, elements.domReference, portalRoot]);

    // 点击外部关闭:统一收口在此,消费方不必各自手写 document 监听 + ref.contains() 判定
    // ——那种写法对"嵌套的另一个 DropdownContainer 浮层"必然误判(见上方 FloatingTree 注释)。
    // escapeKey / referencePress 关闭仍由各消费方按需自行处理,此处只负责"点击外部"这一种。
    const dismiss = useDismiss(context, {
        outsidePress: true,
        outsidePressEvent: 'pointerdown',
        escapeKey: false,
        referencePress: false,
        ancestorScroll: false,
    });

    const { getFloatingProps } = useInteractions([dismiss]);

    return (
        <FloatingNode id={nodeId}>
            <div
                className={cx(containerStyle, className)}
                ref={(node) => {
                    branchRoot.current = node;
                    if (node) {
                        // Preserve the nearest public theme boundary (tokens and font), while
                        // keeping modal descendants inside the browser's interactive top layer.
                        const root = resolveOverlayRoot(node);
                        // 函数式更新 + 同值复用，避免 ref 回调重复挂载时触发多余渲染
                        setPortalRoot((prev) => (prev === root ? prev : root));
                    }
                }}
                {...restProps}
                onFocusCapture={(event) => {
                    onFocusCapture?.(event);
                    focusSequence.current += 1;
                    requestedFocusExit.current = false;
                }}
                onBlurCapture={(event) => {
                    onBlurCapture?.(event);
                    if (!closeOnFocusOut || !state.open || event.defaultPrevented) return;
                    const sequence = focusSequence.current;
                    const branch = event.currentTarget;
                    const nativeEvent = event.nativeEvent;
                    const destination = event.relatedTarget;
                    const ownerNode = branch.ownerDocument.defaultView?.Node;
                    if (ownerNode && destination instanceof ownerNode) {
                        // Native Tab can run a microtask checkpoint between blur
                        // and focus. relatedTarget already identifies that move;
                        // waiting for the later focus event would close the panel.
                        if (branch.contains(destination) || elements.floating?.contains(destination)) return;
                        // Nested FloatingPortals are DOM siblings. Only this
                        // node's descendants belong to its focus branch, never
                        // an ancestor or an unrelated floating tree node.
                        const nodes = tree?.nodesRef.current ?? [];
                        for (const node of nodes) {
                            if (!node.context?.open || !node.context.elements.floating?.contains(destination)) continue;
                            let parentId = node.parentId;
                            while (parentId != null) {
                                if (parentId === nodeId) return;
                                parentId = nodes.find(parent => parent.id === parentId)?.parentId ?? null;
                            }
                        }
                    }
                    // Unknown/null destinations still allow a synchronous React
                    // portal focus or layout-effect restoration to cancel exit.
                    // Real external moves retain the existing dismissal contract.
                    queueMicrotask(() => {
                        if (branchRoot.current === branch && branch.isConnected && focusSequence.current === sequence) {
                            requestOpen(false, { reason: 'focus-out', event: nativeEvent });
                        }
                    });
                }}
            >
                <DropdownContext
                    value={{
                        state,
                        dispatch,
                        refs: { setReference: refs.setReference },
                    }}
                >
                    <DropdownPositionReference value={refs.setPositionReference}>
                        {children}
                    </DropdownPositionReference>
                    <FloatingPortal root={portalRoot}>
                        {presence.present && (
                            <ConfigBoundary
                                ref={(node) => { refs.setFloating(node); presence.ref(node); }}
                                className={cx(floatingContainerStyle, floatingClassName)}
                                size={componentSize}
                                data-state={presence.state}
                                inert={!state.open}
                                style={{ ...floatingStyles, ...floatingUserStyle }}
                                {...getFloatingProps({
                                    onMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => {
                                        onMouseDown?.(e);
                                        // 阻止 mousedown 默认行为,是为了点击选项 / 空白时不抢走
                                        // 触发器的焦点;但落点是浮层内的表单控件时(如 rc-cron-picker
                                        // 面板里的数字输入框),preventDefault 会连"点击聚焦"一起吞掉,
                                        // 使控件永远无法进入编辑态——这类目标必须放行默认聚焦。
                                        const target = e.target as HTMLElement;
                                        if (!target.closest('input, textarea, select, [contenteditable="true"]')) {
                                            e.preventDefault();
                                        }
                                    },
                                    ...restFloatingContainerProps,
                                })}
                            >
                                <div
                                    className={cx(overlayStyle, overlayClassName)}
                                >
                                    {overlay}
                                </div>
                            </ConfigBoundary>
                        )}
                    </FloatingPortal>
                </DropdownContext>
            </div>
        </FloatingNode>
    );
}

export default DropdownContainer;
