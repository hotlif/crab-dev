import { type ReactElement, type Ref, cloneElement, useRef, useState } from 'react';
import { useControllableOpen, usePresence } from '@crab-dev/rc-hooks';
import { css, cx } from '@crab-dev/css';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    arrow as arrowMiddleware,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
    useMergeRefs,
} from '@floating-ui/react';
import token from './token.js';
import type { TooltipProps } from './types.js';

// ─── 常量 ────────────────────────────────────────────────────────────────────

const ARROW_SIZE = 8;
const GAP = 4;

const OPPOSITE_SIDE: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

// ─── 样式 ────────────────────────────────────────────────────────────────────

const containerStyle = css`
    z-index: ${token.root['z-index']};
    pointer-events: none;
    opacity: 1;
    transition: opacity ${token.motion.interaction.transition};
    &[data-state="closed"] { opacity: 0; }
    @starting-style { opacity: 0; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const tooltipStyle = css`
    position: relative;
    box-sizing: border-box;
    max-width: ${token.root['max-width']};
    padding: ${token.root['padding-block']} ${token.root['padding-inline']};
    background-color: ${token.root['background-color']};
    color: ${token.root.color};
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
    border-radius: ${token.root['border-radius']};
    word-wrap: break-word;
`;

// ─── 箭头样式 ────────────────────────────────────────────────────────────────

const arrowBaseStyle = css`
    position: absolute;
    width: ${ARROW_SIZE}px;
    height: ${ARROW_SIZE}px;
    background: ${token.root['background-color']};
    transform: rotate(45deg);
`;

// ─── 组件 ────────────────────────────────────────────────────────────────────

/**
 * 文字提示气泡，鼠标悬浮或聚焦时展示说明性文字。
 */
function Tooltip({
    title,
    children,
    placement = 'top',
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    mouseEnterDelay = 100,
    mouseLeaveDelay = 100,
    arrow: showArrow = true,
    className,
}: TooltipProps) {
    const [isOpen, setOpen] = useControllableOpen({
        open: controlledOpen,
        defaultOpen,
        onOpenChange,
    });

    const arrowRef = useRef<HTMLDivElement>(null);
    const presence = usePresence<HTMLDivElement>(isOpen && title != null && title !== '');

    const { refs, floatingStyles, context, middlewareData, placement: resolvedPlacement } = useFloating({
        open: isOpen,
        onOpenChange: setOpen,
        placement,
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(ARROW_SIZE / 2 + GAP),
            flip(),
            shift({ padding: 8 }),
            ...(showArrow ? [arrowMiddleware({ element: arrowRef, padding: 10 })] : []),
        ],
    });

    const hover = useHover(context, {
        delay: { open: mouseEnterDelay, close: mouseLeaveDelay },
    });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    // 触发元素位于原生 <dialog>（showModal）内时，浮层必须挂载进该 dialog 子树：
    // modal dialog 位于 top-layer 且使外部文档 inert，挂在 body 下的 tooltip 会被
    // dialog 完全遮挡而不可见。语义与 rc-dropdown-container 的 portalRoot 一致：
    // null = 尚未探测（浮层不渲染），undefined = 不在 dialog 内，挂默认 body。
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null | undefined>(null);

    const childRef = (children as ReactElement & { props?: { ref?: Ref<unknown> } }).props?.ref;
    const mergedRef = useMergeRefs([
        refs.setReference,
        childRef,
        (node: Element | null) => {
            if (node) {
                // Shadow DOM 内的提示必须保留在同一主题边界，否则会丢失隔离样式。
                // 普通页面仍沿用 body Portal；原生模态 dialog 始终优先。
                const shadowTheme = node.getRootNode() instanceof globalThis.ShadowRoot
                    ? node.closest<HTMLElement>('[data-theme]') : null;
                const dialog = node.closest('dialog') ?? shadowTheme ?? undefined;
                // 同值复用，避免 ref 回调重复触发时产生多余渲染
                setPortalRoot((prev) => (prev === dialog ? prev : dialog));
            }
        },
    ]);

    const side = resolvedPlacement.split('-')[0] as string;
    const arrowData = middlewareData.arrow;
    const arrowPositionStyle = showArrow && arrowData
        ? {
            left: arrowData.x != null ? `${arrowData.x}px` : undefined,
            top: arrowData.y != null ? `${arrowData.y}px` : undefined,
            [OPPOSITE_SIDE[side] as string]: `${-(ARROW_SIZE / 2) + 1}px`,
        }
        : undefined;

    return (
        <>
            {cloneElement(
                children,
                getReferenceProps({ ref: mergedRef, ...(children.props as Record<string, unknown>) }),
            )}
            <FloatingPortal root={portalRoot}>
                {presence.present && (
                    <div
                        ref={(node) => { refs.setFloating(node); presence.ref(node); }}
                        data-state={presence.state}
                        aria-hidden={!isOpen || undefined}
                        style={floatingStyles}
                        className={containerStyle}
                        {...getFloatingProps()}
                    >
                        <div
                            className={cx(tooltipStyle, className)}
                        >
                            {title}
                            {showArrow && (
                                <div
                                    ref={arrowRef}
                                    className={arrowBaseStyle}
                                    style={arrowPositionStyle}
                                />
                            )}
                        </div>
                    </div>
                )}
            </FloatingPortal>
        </>
    );
}

export default Tooltip;
