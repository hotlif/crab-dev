
import { css } from "@linaria/core";
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
    open?: boolean;

    /**
     * 是否在关闭的时候重置内容
     */
    shouldResetContent?: boolean

    /**
     * 状态发生改变的时候触发的事件
     */
    onOpenChange?: (open: boolean) => void;

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
                        onCancel?.()
                            .then(result => {
                                if (result === true) {
                                    onOpenChange?.(false);
                                }
                            });
                    }}
                />
            ) : null}
            <dialog
                className={css`
                    padding: 20px 24px;
                    border-radius: 8px;
                    outline: none;
                    border: none;
                    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                `}
                key={shouldResetContent ? (open ? 1 : 0) : -1}
                open={open}
                {...restProps}
            >
                <div
                    className={css`
                        display: flex;
                        margin-bottom: 8px;
                    `}
                >
                    <div
                        className={css`
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 1.5;
                        `}
                    >
                        {title}
                    </div>
                </div>
                <div
                    className={css`
                    `}
                >
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
                            onCancel?.()
                                .then(result => {
                                    if (result === true) {
                                        onOpenChange?.(false);
                                    }
                                });
                            onOpenChange?.(false);
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