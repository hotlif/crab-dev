import { type ReactElement, type Ref, cloneElement, useRef } from 'react';
import { useControllableOpen } from '@crab-dev/rc-hooks';
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
import { motion, AnimatePresence } from 'motion/react';
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
    z-index: ${token['z-index']};
    pointer-events: none;
`;

const tooltipStyle = css`
    position: relative;
    box-sizing: border-box;
    max-width: ${token['max-width']};
    padding: ${token['padding-y']} ${token['padding-x']};
    background-color: ${token['background-color']};
    color: ${token.color};
    font-size: ${token['font-size']};
    line-height: ${token['line-height']};
    border-radius: ${token['border-radius']};
    word-wrap: break-word;
`;

// ─── 箭头样式 ────────────────────────────────────────────────────────────────

const arrowBaseStyle = css`
    position: absolute;
    width: ${ARROW_SIZE}px;
    height: ${ARROW_SIZE}px;
    background: ${token['background-color']};
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

    const childRef = (children as ReactElement & { props?: { ref?: Ref<unknown> } }).props?.ref;
    const mergedRef = useMergeRefs([refs.setReference, childRef]);

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
            <FloatingPortal>
                <AnimatePresence>
                    {isOpen && title != null && title !== '' && (
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            className={containerStyle}
                            {...getFloatingProps()}
                        >
                            <motion.div
                                className={cx(tooltipStyle, className)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                            >
                                {title}
                                {showArrow && (
                                    <div
                                        ref={arrowRef}
                                        className={arrowBaseStyle}
                                        style={arrowPositionStyle}
                                    />
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </>
    );
}

export default Tooltip;
