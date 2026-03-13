import { type HTMLAttributes, type ReactNode, useMemo, useReducer } from 'react';
import { css, cx } from '@linaria/core';
import { useFloating, autoUpdate, offset, flip, FloatingPortal } from '@floating-ui/react';
import { motion, AnimatePresence } from 'motion/react';
import { dropdownReducer, initialDropdownState } from './reducer';
import { DropdownContext } from './context';

export interface DropdownContainerProps extends HTMLAttributes<HTMLElement> {
    /**
     * 下拉组件内容
     */
    overlay: ReactNode;
}

function DropdownContainer({ className, children, overlay, ...restProps }: DropdownContainerProps) {
    const [state, dispatch] = useReducer(dropdownReducer, initialDropdownState);
    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip({
                fallbackPlacements: ['top', 'right', 'left'],
            }),
        ],
    });
    return (
        <div
            className={cx(
                className,
                css`
                    position: relative;
                `,
            )}
            {...restProps}
        >
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
                                ref={refs.setFloating}
                                style={floatingStyles}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <motion.div
                                    className={css`
                                        background-color: #fff;
                                        box-shadow:
                                            0 6px 16px 0 rgba(0, 0, 0, 0.08),
                                            0 3px 6px -4px rgba(0, 0, 0, 0.12),
                                            0 9px 28px 8px rgba(0, 0, 0, 0.05);
                                        border-radius: 8px;
                                        padding: 0.2rem 1rem 1rem 1rem;
                                        transform-origin: top;
                                    `}
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
