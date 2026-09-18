
import { css, cx } from "@crab-dev/css";
import {
    useEffect,
    useId,
    useRef,
    useState,
    useTransition,
} from "react";
import type { DialogHTMLAttributes, ReactNode, MouseEvent, Ref } from "react";
import RcButton from "@crab-dev/rc-button";
import { usePresence } from "@crab-dev/rc-hooks";

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

const colorOverlayBackgroundColor = token.overlay['background-color'];
const colorDialogBackgroundColor = token.root['background-color'];

const dimensionMinWidth = token.root['min-width'];
const dimensionPadding = token.root.padding;
const dimensionBorderRadius = token.root['border-radius'];
const dimensionFooterMarginTop = token.footer['margin-top'];
const dimensionFooterButtonSpacing = token.footer.button.margin;
const dimensionHeadingMarginBottom = token.heading['margin-bottom'];

const typographyHeadingFontWeight = token.heading['font-weight'];
const typographyHeadingFontSize = token.heading['font-size'];
const typographyHeadingLineHeight = token.heading['line-height'];

const elevationBoxShadow = token.root['box-shadow'];

const top = token.root.top;

const fadeStyle = css`
    opacity: 1;
    transition: opacity ${token.motion.fade.transition};
    @starting-style { opacity: 0; }
    &[data-state="closed"] { opacity: 0; transition: opacity ${token.motion.interaction.transition}; }

    @media (prefers-reduced-motion: reduce) {
        &, &[data-state="closed"] { transition: none; }
    }
`;

const contentMotionStyle = css`
    opacity: 1;
    translate: 0 0;
    transition: opacity ${token.motion.fade.transition}, translate ${token.motion.fade.transition};
    @starting-style { opacity: 0; translate: 0 ${token.motion.offset.translate}; }
    &[data-state="closed"] {
        opacity: 0; translate: 0 ${token.motion.offset.translate};
        transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.interaction.transition};
    }

    @media (prefers-reduced-motion: reduce) {
        &, &[data-state="closed"] { transition: none; }
    }
`;


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
    // Mutable instance state: hold the scroll restoration through the entire exit.
    const restoreScroll = useRef<(() => void) | null>(null);
    const [contentHidden, setContentHidden] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<"confirm" | "cancel" | "close" | null>(null);
    // Mutable instance guard: re-entry can happen before React renders pending.
    const inFlight = useRef(false);
    const titleId = useId();
    const presence = usePresence<HTMLDivElement>(open, () => {
        dialogRef.current?.close();
        restoreScroll.current?.();
        if (shouldResetContent) setContentHidden(true);
    });
    const {
        cancelText = "取消",
        confirmText = "确定"
    } = i18n;

    useEffect(() => {
        if (!open) {
            return;
        }
        if (!dialogRef.current?.open) dialogRef.current?.showModal();
        // 原生 modal dialog 不会锁定背景滚动，这里手动锁定并在关闭时恢复
        if (!restoreScroll.current) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            restoreScroll.current = () => {
                document.body.style.overflow = previousOverflow;
                restoreScroll.current = null;
            };
        }
    }, [open])

    useEffect(() => () => restoreScroll.current?.(), []);

    // 打开时恢复内容渲染；关闭时的重置延后到 CSS 退场结束，
    // 避免关闭动画播放期间内容提前消失。
    useEffect(() => {
        if (open) {
            setContentHidden(false);
        }
    }, [open])


    const settle = (
        action: "confirm" | "cancel" | "close",
        handler: DialogResultHandler | undefined,
        event?: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    ) => {
        // 回调在途时忽略再次触发（ESC / 遮罩点击不受按钮 disabled 保护）
        if (inFlight.current) {
            return;
        }
        inFlight.current = true;
        setPendingAction(action);
        startTransition(async () => {
            try {
                const result = await handler?.(event);
                if (result !== false) {
                    onOpenChange(false);
                }
            } finally {
                inFlight.current = false;
                setPendingAction(null);
            }
        });
    }

    const cancel = (event?: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        if (inFlight.current) return;
        // Escape / backdrop have no button initiator. Move to the matching action
        // before its siblings become disabled, so an async cancellation keeps focus.
        if (event?.currentTarget.tagName !== "BUTTON") {
            dialogRef.current?.querySelector<HTMLButtonElement>('[data-dialog-action="cancel"]')?.focus();
        }
        settle("cancel", onCancel, event);
    };

    const confirm = (event?: MouseEvent<HTMLElement, globalThis.MouseEvent>) => settle("confirm", onConfirm, event);

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
            aria-busy={isPending || undefined}
            className={cx(css`
                position: fixed;
                top: min(${top}, ${token.root['max-height']} / 4);
                bottom: auto;
                margin: 0 auto;
                width: ${dimensionMinWidth};
                min-width: min(${dimensionMinWidth}, ${token.root['max-width']});
                max-width: ${token.root['max-width']};
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
            {(presence.present || !shouldResetContent) && (
                <>
                    <div
                        key="overlay"
                        data-state={presence.state}
                        inert={!open}
                        onClick={(event) => {
                            // 遮罩点击属于「外部点击」，阻止冒泡以免触发透传给 <dialog> 的 onClick。
                            event.stopPropagation();
                            // 与 antd Modal 的 maskClosable 对齐：默认点击遮罩不关闭，
                            // 避免表单场景误触丢失内容；需要时显式开启。
                            if (maskClosable) {
                                cancel(event);
                            }
                        }}
                        className={cx(fadeStyle, css`
                            position: fixed;
                            inset: 0;
                            background-color: ${colorOverlayBackgroundColor};
                        `)}
                    />
                    <div
                        key="content"
                        ref={presence.ref}
                        data-state={presence.state}
                        inert={!open}
                        className={cx(contentMotionStyle, css`
                            position: relative;
                            box-sizing: border-box;
                            max-height: calc(100dvh - min(${top}, ${token.root['max-height']} / 4) - (100vw - ${token.root['max-width']}) / 2);
                            overflow: auto;
                            overflow-wrap: anywhere;
                            padding: ${dimensionPadding};
                            border-radius: ${dimensionBorderRadius};
                            box-shadow: ${elevationBoxShadow};
                            background: ${colorDialogBackgroundColor};
                            @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
                        `)}
                    >
                        <div
                            className={css`
                                display: flex;
                                align-items: flex-start;
                                gap: ${token.heading.gap};
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
                                    min-width: 0;
                                `}
                            >
                                {title}
                            </div>
                            <RcButton
                                type="button"
                                appearance="text"
                                aria-label={cancelText}
                                disabled={isPending && pendingAction !== "close"}
                                loading={isPending && pendingAction === "close"}
                                className={css`
                                    flex-shrink: 0;
                                    width: ${token.close.width};
                                    height: ${token.close.height};
                                    padding: 0;
                                    @media (pointer: coarse) {
                                        width: ${token.close.touch['min-width']};
                                        height: ${token.close.touch['min-height']};
                                    }
                                `}
                                onClick={(event) => settle("close", onCancel, event)}
                                icon={(
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
                                )}
                            />
                        </div>
                        <div>
                            {!contentHidden && children}
                        </div>
                        <div
                            className={css`
                                display: flex;
                                flex-wrap: wrap;
                                justify-content: flex-end;
                                gap: ${dimensionFooterButtonSpacing};
                                margin-top: ${dimensionFooterMarginTop};
                                & > button {
                                    min-width: 0;
                                    max-width: 100%;
                                    height: auto;
                                    min-height: ${token.footer.button['min-height']};
                                    padding-block: ${token.footer.button['padding-block']};
                                    white-space: normal;
                                }
                                & > button > span { min-width: 0; }
                                @media (pointer: coarse) {
                                    & > button { min-height: ${token.close.touch['min-height']}; }
                                }
                            `}
                        >
                            <RcButton
                                data-dialog-action="cancel"
                                disabled={isPending && pendingAction !== "cancel"}
                                loading={isPending && pendingAction === "cancel"}
                                onClick={cancel}
                            >
                                {cancelText}
                            </RcButton>
                            <RcButton
                                appearance="primary"
                                disabled={isPending && pendingAction !== "confirm"}
                                loading={isPending && pendingAction === "confirm"}
                                onClick={confirm}
                            >
                                {confirmText}
                            </RcButton>
                        </div>
                    </div>
                </>
            )}
        </dialog>
    )
}

export default Dialog;
