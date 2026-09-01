import { useRef, useState, type ReactNode } from "react";
import { css } from "@crab-dev/css";

import Dialog, { type DialogProps } from "../dialog.js";
import token from "../token.js";

// 额外 Omit "content"：HTMLAttributes 自带 RDFa 的 content?: string，与此处的 ReactNode 冲突
export interface ConfirmProps extends Omit<DialogProps, "open" | "onOpenChange" | "children" | "content"> {
    /**
     * 弹窗内容说明
     */
    content?: ReactNode;
}

const confirmDialogStyle = css`
    min-width: ${token.confirm.min.width};
`;

/**
 * 命令式确认对话框：返回 [占位节点, confirm]。
 * `confirm(props)` 打开对话框并返回 `Promise<boolean>`——用户确认时 resolve `true`，
 * 取消 / 关闭时 resolve `false`。
 */
const useConfirm = (): [ReactNode, (props: ConfirmProps) => Promise<boolean>] => {
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState<ConfirmProps | null>(null);
    // 例外 1（可变实例状态 ref）：跨事件持有未决 Promise 的 resolve，不应触发渲染。
    const resolveRef = useRef<((value: boolean) => void) | null>(null);

    const settle = (value: boolean) => {
        resolveRef.current?.(value);
        resolveRef.current = null;
    };

    const confirm = (nextProps: ConfirmProps) => {
        // 上一次尚未决议的 confirm 视为取消
        settle(false);
        setProps(nextProps);
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    };

    if (props === null) {
        return [null, confirm];
    }

    const { content, onConfirm, onCancel, className, ...dialogProps } = props;
    return [
        (
            <Dialog
                {...dialogProps}
                className={className ?? confirmDialogStyle}
                open={open}
                key="dialog-use-confirm"
                onOpenChange={(nextOpen) => {
                    // 兜底：ESC 强制关闭等非按钮路径也视为取消
                    if (!nextOpen) {
                        settle(false);
                    }
                    setOpen(nextOpen);
                }}
                onConfirm={async (event) => {
                    const result = await onConfirm?.(event);
                    if (result !== false) {
                        settle(true);
                    }
                    return result;
                }}
                onCancel={async (event) => {
                    const result = await onCancel?.(event);
                    if (result !== false) {
                        settle(false);
                    }
                    return result;
                }}
            >
                {content}
            </Dialog>
        ),
        confirm,
    ];
};

export default useConfirm;
