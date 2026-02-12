
import { css, cx } from "@linaria/core";
import { useEffect, useRef, type FC, type HTMLAttributes, type ReactNode} from "react";
import RcButton from "@crab-dev/rc-button";
import token from "./token";

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

export interface DialogProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {

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
     * 状态发生改变的时候触发的事件
     */
    onOpenChange: (open: boolean) => void;

    /**
     * 确定按钮点击时触发的事件， 如果返回 `true`, 则关闭对话框
     */
    onConfirm?: () => Promise<boolean>

    /**
     * 取消按钮点击时触发的事件, 如果返回 `true`, 则关闭对话框
     */
    onCancel?: () => Promise<boolean>

}

const colorOverlayBackgroundColor = token.color["overlay-background-color"];

const dimensionPadding = token.dimension.padding;
const dimensionBorderRadius = token.dimension["border-radius"];
const dimensionFooterMarginTop = token.dimension["footer-margin-top"];
const dimensionFooterButtonSpacing = token.dimension["footer-button-spacing"];
const dimensionHeadingMarginBottom = token.dimension["heading-margin-bottom"];

const typographyHeadingFontWeight = token.typography["heading-font-weight"];
const typographyHeadingFontSize = token.typography["heading-font-size"];
const typographyHeadingLineHeight = token.typography["heading-line-height"];

const elevationBoxShadow = token.elevation["box-shadow"];

const top = token.dimension.top;


const dialogReset = css`
  border: none;
  outline: none;
`

const Dialog: FC<DialogProps> = ({
    className,
    open,
    onOpenChange,
    title,
    children,
    shouldResetContent = true,
    onConfirm,
    onCancel,
    i18n = {
        cancelText: "取消",
        confirmText: "确定",
    },
    onClick,
    ...restProps
}) => {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const {
        cancelText,
        confirmText
    } = i18n;

    const cancel = () => {
        if (onCancel) {
            onCancel?.()
                .then(result => {
                    if (result === true) {
                        onOpenChange?.(false);
                    }
                });
        } else {
            onOpenChange?.(false);
        }
    }

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [open])

    return (
         <>
            <dialog
                ref={dialogRef}
                className={cx(css`
                    position: fixed;
                    top: ${top};
                    bottom: auto; 
                    margin: 0 auto;
                    min-width: 520px;
                    padding: ${dimensionPadding};
                    border-radius: ${dimensionBorderRadius};
                    box-shadow: ${elevationBoxShadow};
                    &::backdrop {
                        background-color: ${colorOverlayBackgroundColor};
                    }
                `, dialogReset, className)}
                key={shouldResetContent ? (open ? 1 : 0) : -1}
                onClick={(event) => {
                    const rect = dialogRef.current?.getBoundingClientRect();
                    if (rect) {
                        const isInDialog = (
                            event.clientX >= rect.left &&
                            event.clientX <= rect.right &&
                            event.clientY >= rect.top &&
                            event.clientY <= rect.bottom
                        );
                        if (!isInDialog) {
                            cancel();
                        } else {
                            onClick?.(event)
                        }
                    }
                }}
                {...restProps}
            >
                <div
                    className={css`
                        display: flex;
                        margin-bottom: ${dimensionHeadingMarginBottom};
                    `}
                >
                    <div
                        className={css`
                            font-weight: ${typographyHeadingFontWeight};
                            font-size: ${typographyHeadingFontSize};
                            line-height: ${typographyHeadingLineHeight};
                            flex: 1;
                        `}
                    >
                        {title}
                    </div>
                    <div
                        className={css`
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                        `}
                        onClick={cancel}
                    >
                        <svg
                            fill-rule="evenodd"
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
                    {children}
                </div>
                <div
                    className={css`
                        text-align: end;
                        margin-top: ${dimensionFooterMarginTop};
                    `}
                >
                    <RcButton
                        onClick={cancel}
                    >
                        {cancelText}
                    </RcButton>
                    <RcButton
                        className={css`
                            margin-inline-start: ${dimensionFooterButtonSpacing};    
                        `}
                        appearance="primary"
                        onClick={() => {
                            onConfirm?.()
                                .then((result) => {
                                    if (result === true) {
                                        onOpenChange?.(false);
                                    }
                                });
                        }}
                    >
                        {confirmText}
                    </RcButton>
                </div>
            </dialog>
        </>
    )
}

export default Dialog;