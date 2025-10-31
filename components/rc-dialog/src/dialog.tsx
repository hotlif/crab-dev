
import { css, cx } from "@linaria/core";
import { type FC, type HTMLAttributes, type ReactNode} from "react";
import RcButton from "@crab-dev/rc-button";

export interface DialogProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
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

const Dialog: FC<DialogProps> = ({
    className,
    open,
    onOpenChange,
    title,
    children,
    shouldResetContent = true,
    onConfirm,
    onCancel,
    ...restProps
}) => {
    return (
         <>
            {open ? (
                <div
                    className={css`
                        position: fixed;
                        inset: 0;
                        background-color: rgba(0,0,0,0.45);
                    `}
                    onClick={() => {
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
                    }}
                />
            ) : null}
            <dialog
                className={cx(css`
                    padding: 20px 24px;
                    border-radius: 8px;
                    outline: none;
                    border: none;
                    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                `, className)}
                key={shouldResetContent ? (open ? 1 : 0) : -1}
                open={open}
                {...restProps}
            >
                <div
                    className={css`
                        display: flex;
                        margin-bottom: 15px;
                    `}
                >
                    <div
                        className={css`
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 1.5;
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
                        margin-top: 12px;
                    `}
                >
                    <RcButton
                        onClick={() => {
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
                        }}
                    >
                        取消
                    </RcButton>
                    <RcButton
                        className={css`
                            margin-inline-start: 8px;    
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
                        确定
                    </RcButton>
                </div>
            </dialog>
        </>
    )
}

export default Dialog;