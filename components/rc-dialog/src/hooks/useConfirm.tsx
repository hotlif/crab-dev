import { ReactNode, useState } from "react";
import { css } from "@linaria/core";
import Dialog from "../dialog";


interface ConfirmProps {
    // 弹窗标题
    title?: ReactNode; 
    // 弹窗内容说明
    content?: ReactNode;
    // 点击确认的回调
    onConfirm?: () => Promise<boolean>;
    // 点击取消的回调
    onCancel?: () => Promise<boolean>;
}

const useConfirm = (): [ReactNode, (param: ConfirmProps) => void] =>  {
    const [open, setOpen] = useState(false);
    const [param, setParam] = useState<ConfirmProps | null>(null)
    const confirm = (param: ConfirmProps) => {
        setOpen(true)
        setParam(param);
    }
    if (param === null) {
        return [
            null,
            confirm
        ]
    } else {
        const {
            title,
            content,
            onConfirm,
            onCancel
        } = param;
        return [
            (
                <Dialog
                    className={css`
                        min-width: 22rem;
                    `}
                    title={title}
                    open={open}
                    onOpenChange={setOpen}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    {content}
                </Dialog>
            )
        , confirm]
    }
}

export default useConfirm;