import { type HTMLAttributes, type ReactNode, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { css, cx } from '@linaria/core';
import { useFloating, autoUpdate, offset, flip, FloatingPortal } from '@floating-ui/react';
import { motion, AnimatePresence } from 'motion/react';
import { dropdownReducer, initialDropdownState } from './reducer.js';
import { DropdownContext } from './context.js';
import token from './token.js';

export interface DropdownContainerProps extends HTMLAttributes<HTMLElement> {
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

const containerStyle = css`
    position: relative;
`;

const floatingContainerStyle = css`
    z-index: 1000;
    margin: 0;
    border: unset;
    border-radius: ${token['border-radius']};
`;

const overlayStyle = css`
    background-color: ${token['background-color']};
    box-shadow: ${token['box-shadow']};
    border-radius: inherit;
    transform-origin: top;
`;

function DropdownContainer({ className, children, overlay, overlayClassName, floatingContainerProps = {}, ...restProps }: DropdownContainerProps) {
    const [state, dispatch] = useReducer(dropdownReducer, initialDropdownState);
    const floatingElementRef = useRef<HTMLDivElement | null>(null);
    // 触发元素位于原生 <dialog>（showModal）内时，浮层必须挂载进该 dialog 子树：
    // modal dialog 会使 dialog 之外的整个文档 inert，挂在 body 下的浮层虽经 popover
    // 提升到 top layer 可见，但仍不可交互（点击穿透、无法聚焦）。
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const {
        onMouseDown,
        className: floatingClassName,
        style: floatingUserStyle,
        ...restFloatingContainerProps
    } = floatingContainerProps;

    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-start',
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip({
                fallbackPlacements: ['right-start', 'top-start', 'left-start'],
            }),
        ],
    });

    useEffect(() => {
        const el = floatingElementRef.current;
        if (!el || typeof el.showPopover !== 'function') return;

        el.popover = 'manual';

        if (state.open) {
            el.showPopover();
        } else {
            el.hidePopover();
        }
    }, [state.open]);

    const setFloatingRef = useCallback((node: HTMLDivElement | null) => {
        floatingElementRef.current = node;
        refs.setFloating(node);
    }, [refs]);

    return (
        <div
            className={cx(containerStyle, className)}
            ref={(node) => {
                if (node) {
                    const dialog = node.closest('dialog');
                    // 函数式更新 + 同值复用，避免 ref 回调重复挂载时触发多余渲染
                    setPortalRoot((prev) => (prev === dialog ? prev : dialog));
                }
            }}
            {...restProps}
        >
            <DropdownContext
                value={{
                    state,
                    dispatch,
                    refs: { setReference: refs.setReference },
                }}
            >
                {children}
                <FloatingPortal root={portalRoot}>
                    <AnimatePresence>
                        {state.open && (
                            <div
                                ref={setFloatingRef}
                                className={cx(floatingContainerStyle, floatingClassName)}
                                style={{ ...floatingStyles, ...floatingUserStyle }}
                                onMouseDown={(e) => {
                                    onMouseDown?.(e);
                                    e.preventDefault();
                                }}
                                {...restFloatingContainerProps}
                            >
                                <motion.div
                                    className={cx(overlayStyle, overlayClassName)}
                                    initial={{ opacity: 0, scaleY: 0.8, y: -8 }}
                                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                                    exit={{ opacity: 0, scaleY: 0.8, y: -8 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: [0.215, 0.61, 0.355, 1],
                                    }}
                                >
                                    {overlay}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </FloatingPortal>
            </DropdownContext>
        </div>
    );
}

export default DropdownContainer;
