import { type HTMLAttributes, type ReactNode, useCallback, useEffect, useReducer, useRef } from 'react';
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

function DropdownContainer({ className, children, overlay, floatingContainerProps = {}, ...restProps }: DropdownContainerProps) {
    const [state, dispatch] = useReducer(dropdownReducer, initialDropdownState);
    const floatingElementRef = useRef<HTMLDivElement | null>(null);
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
        <div className={cx(containerStyle, className)} {...restProps}>
            <DropdownContext.Provider
                value={{
                    state,
                    dispatch,
                    refs: { setReference: refs.setReference },
                }}
            >
                {children}
                <FloatingPortal>
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
                                    className={overlayStyle}
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
            </DropdownContext.Provider>
        </div>
    );
}

export default DropdownContainer;
