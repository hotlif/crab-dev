import { type HTMLAttributes, type MouseEvent as ReactMouseEvent, type ReactNode, useReducer, useState } from 'react';
import { css, cx } from '@crab-dev/css';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    FloatingPortal,
    useDismiss,
    useInteractions,
    useFloatingNodeId,
    useFloatingParentNodeId,
    FloatingTree,
    FloatingNode,
} from '@floating-ui/react';
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
    z-index: ${token['z-index']};
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

function DropdownContainer(props: DropdownContainerProps) {
    // 多个 DropdownContainer 嵌套使用时(如 rc-select 用在 rc-color-picker 面板内),
    // 仅最外层建立 FloatingTree,内层通过 useFloatingParentNodeId 检测到已在树中而复用它。
    // 同一棵树下,useDismiss 才能识别"点击落在后代浮层内"而不误判为外部点击并整体关闭——
    // 后代浮层即便因各自独立的 FloatingPortal 而在 DOM 上只是兄弟节点,也能被正确识别。
    const parentId = useFloatingParentNodeId();
    const content = <DropdownContainerContent {...props} />;

    return parentId == null ? <FloatingTree>{content}</FloatingTree> : content;
}

function DropdownContainerContent({ className, children, overlay, overlayClassName, floatingContainerProps = {}, ...restProps }: DropdownContainerProps) {
    const [state, dispatch] = useReducer(dropdownReducer, initialDropdownState);
    // 触发元素位于原生 <dialog>（showModal）内时，浮层必须挂载进该 dialog 子树：
    // modal dialog 会使 dialog 之外的整个文档 inert，挂在 body 下的浮层不可交互
    // （点击穿透、无法聚焦），挂进 dialog 子树即可恢复交互。
    // FloatingPortal 对 root 的语义：null = 等待 root 就绪（不渲染），undefined = 挂默认 body。
    // 初始 null 表示"尚未检测"，检测后必须落到 dialog 或 undefined，否则面板永不渲染。
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null | undefined>(null);
    const {
        onMouseDown,
        className: floatingClassName,
        style: floatingUserStyle,
        ...restFloatingContainerProps
    } = floatingContainerProps;

    const nodeId = useFloatingNodeId();

    const { refs, floatingStyles, context } = useFloating({
        nodeId,
        placement: 'bottom-start',
        strategy: 'fixed',
        open: state.open,
        onOpenChange: (nextOpen) => dispatch({ type: 'setOpen', payload: nextOpen }),
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(6),
            flip({
                fallbackPlacements: ['right-start', 'top-start', 'left-start'],
            }),
        ],
    });

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
                    if (node) {
                        // 不在 dialog 内时落到 undefined（而非 null），让 FloatingPortal 挂默认 body
                        const dialog = node.closest('dialog') ?? undefined;
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
                                    ref={refs.setFloating}
                                    className={cx(floatingContainerStyle, floatingClassName)}
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
        </FloatingNode>
    );
}

export default DropdownContainer;
