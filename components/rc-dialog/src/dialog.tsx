
import { css, cx } from "@linaria/core";
import {
    useEffect,
    useId,
    useRef,
    useState,
    useTransition,
    type DialogHTMLAttributes,
    type ReactNode,
    type MouseEvent,
    type Ref
} from "react";
import RcButton from "@crab-dev/rc-button";
import { motion, AnimatePresence } from "motion/react";

import token from "./token.js";

/**
 * 国际化内容
 */
interface DialogI18n {
    /**
     * 确认按钮文本
     */
    confirmText?: string;

    /**
     * 取消按钮文本
     */
    cancelText?: string;
}

type DialogResultHandler = (
    event?: MouseEvent<HTMLElement, globalThis.MouseEvent>,
) => boolean | void | Promise<boolean | void>;

export interface DialogProps extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    "title" | "open" | "onCancel" | "onClose"
> {

    /**
     * 对话框根元素（原生 dialog）的 ref
     */
    ref?: Ref<HTMLDialogElement>;

    /**
     * 国际化内容
     */
    i18n?: DialogI18n;

    /**
     *  标题
     */
    title?: ReactNode;

    /**
     * 是否开启
     */
    open: boolean;

    /**
     * 是否在关闭的时候重置内容
     */
    shouldResetContent?: boolean

    /**
     * 点击遮罩（对话框外部区域）是否触发取消并关闭，默认 `false`
     */
    maskClosable?: boolean

    /**
     * 状态发生改变的时候触发的事件
     */
    onOpenChange: (open: boolean) => void;

    /**
     * 确定按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭
     */
    onConfirm?: DialogResultHandler

    /**
     * 取消按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭
     */
    onCancel?: DialogResultHandler

}

const colorOverlayBackgroundColor = token.overlay.background.color;
const colorDialogBackgroundColor = token.background.color;

const dimensionMinWidth = token.min.width;
const dimensionPadding = token.padding;
const dimensionBorderRadius = token.border.radius;
const dimensionFooterMarginTop = token.footer.margin.top;
const dimensionFooterButtonSpacing = token.footer.button.spacing;
const dimensionHeadingMarginBottom = token.heading.margin.bottom;

const typographyHeadingFontWeight = token.heading.font.weight;
const typographyHeadingFontSize = token.heading.font.size;
const typographyHeadingLineHeight = token.heading.line.height;

const elevationBoxShadow = token.box.shadow;

const top = token.top;

// 进出场动画的位移距离（动效参数，与 spring 配置同级，不属于设计令牌）
const contentMotionOffset = -12;


const dialogReset = css`
  border: none;
  outline: none;
`

function Dialog({
    ref,
    className,
    open,
    onOpenChange,
    title,
    children,
    shouldResetContent = true,
    maskClosable = false,
    onConfirm,
    onCancel,
    i18n = {},
    ...restProps
}: DialogProps) {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const [contentHidden, setContentHidden] = useState(false);
    const [isPending, startTransition] = useTransition();
    const titleId = useId();
    const {
        cancelText = "取消",
        confirmText = "确定"
    } = i18n;

    useEffect(() => {
        if (!open) {
            return;
        }
        dialogRef.current?.showModal();
        // 原生 modal dialog 不会锁定背景滚动，这里手动锁定并在关闭时恢复
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open])

    // 打开时恢复内容渲染；关闭时的重置延后到退场动画结束（见 AnimatePresence 的 onExitComplete），
    // 避免关闭动画播放期间内容提前消失。
    useEffect(() => {
        if (open) {
            setContentHidden(false);
        }
    }, [open])


    const settle = (
        handler: DialogResultHandler | undefined,
        event?: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    ) => {
        // 回调在途时忽略再次触发（ESC / 遮罩点击不受按钮 disabled 保护）
        if (isPending) {
            return;
        }
        startTransition(async () => {
            const result = await handler?.(event);
            if (result !== false) {
                onOpenChange(false);
            }
        });
    }

    const cancel = (event?: MouseEvent<HTMLElement, globalThis.MouseEvent>) => settle(onCancel, event);

    const confirm = (event?: MouseEvent<HTMLElement, globalThis.MouseEvent>) => settle(onConfirm, event);

    return (
        <dialog
            ref={(node) => {
                // 例外 1（可变实例状态 ref）：内部需要持有 dialog 节点以驱动 showModal/close，
                // 同时把节点透传给外部 ref prop（React 19 ref-as-prop）。
                dialogRef.current = node;
                const cleanup = typeof ref === "function" ? ref(node) : undefined;
                if (ref && typeof ref !== "function") {
                    ref.current = node;
                }
                return () => {
                    dialogRef.current = null;
                    if (typeof cleanup === "function") {
                        cleanup();
                    } else if (typeof ref === "function") {
                        ref(null);
                    } else if (ref) {
                        ref.current = null;
                    }
                };
            }}
            aria-labelledby={title ? titleId : undefined}
            className={cx(css`
                position: fixed;
                top: ${top};
                bottom: auto;
                margin: 0 auto;
                min-width: ${dimensionMinWidth};
                padding: 0;
                overflow: visible;
                background: transparent;
                border-radius: ${dimensionBorderRadius};
                &::backdrop {
                    background-color: transparent;
                }
            `, dialogReset, className)}
            // 原生 <dialog>（showModal 打开）在按 ESC 时会触发 cancel 事件并直接关闭，绕过受控的 open 状态。
            // 这里拦截原生 cancel，改走受控关闭流程（同时保留退场动画）。
            onCancel={(event) => {
                event.preventDefault();
                cancel();
            }}
            // 兜底：Chrome 对连续第二次 ESC 的关闭不可取消（preventDefault 无效），
            // DOM 已关闭而 open 仍为 true 时在此同步受控状态，避免之后无法再次打开。
            onClose={() => {
                if (open) {
                    onOpenChange(false);
                }
            }}
            {...restProps}
        >
            <AnimatePresence
                onExitComplete={() => {
                    dialogRef.current?.close();
                    // 退场动画结束后再重置内容，保证关闭过程中内容仍可见。
                    if (shouldResetContent) {
                        setContentHidden(true);
                    }
                }}
            >
                {open && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(event) => {
                                // 遮罩点击属于「外部点击」，阻止冒泡以免触发透传给 <dialog> 的 onClick。
                                event.stopPropagation();
                                // 与 antd Modal 的 maskClosable 对齐：默认点击遮罩不关闭，
                                // 避免表单场景误触丢失内容；需要时显式开启。
                                if (maskClosable) {
                                    cancel(event);
                                }
                            }}
                            className={css`
                                position: fixed;
                                inset: 0;
                                background-color: ${colorOverlayBackgroundColor};
                            `}
                        />
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: contentMotionOffset }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: contentMotionOffset }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 24,
                                mass: 1,
                            }}
                            className={css`
                                position: relative;
                                padding: ${dimensionPadding};
                                border-radius: ${dimensionBorderRadius};
                                box-shadow: ${elevationBoxShadow};
                                background:${colorDialogBackgroundColor};
                            `}
                        >
                            <div
                                className={css`
                                    display: flex;
                                    margin-bottom: ${dimensionHeadingMarginBottom};
                                `}
                            >
                                <div
                                    id={titleId}
                                    className={css`
                                        font-weight: ${typographyHeadingFontWeight};
                                        font-size: ${typographyHeadingFontSize};
                                        line-height: ${typographyHeadingLineHeight};
                                        flex: 1;
                                    `}
                                >
                                    {title}
                                </div>
                                {/* 有意不用可聚焦的 button：showModal 会把初始焦点落到第一个可聚焦元素，
                                    关闭图标获得焦点环观感突兀。这里从无障碍树整体移除（aria-hidden），
                                    键盘 / 读屏用户通过 ESC（原生 cancel）或「取消」按钮这两条等效路径关闭。 */}
                                <div
                                    aria-hidden="true"
                                    className={css`
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                    `}
                                    onClick={cancel}
                                >
                                    <svg
                                        fillRule="evenodd"
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        data-icon="close"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                {!contentHidden && children}
                            </div>
                            <div
                                className={css`
                                    text-align: end;
                                    margin-top: ${dimensionFooterMarginTop};
                                `}
                            >
                                <RcButton
                                    disabled={isPending}
                                    onClick={cancel}
                                >
                                    {cancelText}
                                </RcButton>
                                <RcButton
                                    className={css`
                                        margin-inline-start: ${dimensionFooterButtonSpacing};
                                    `}
                                    appearance="primary"
                                    loading={isPending}
                                    disabled={isPending}
                                    onClick={confirm}
                                >
                                    {confirmText}
                                </RcButton>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </dialog>
    )
}

export default Dialog;
