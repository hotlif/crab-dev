import {
    useEffect,
    useRef,
    useState,
    type FC,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
    type SyntheticEvent,
} from "react";
import { css, cx } from "@linaria/core";
import { AnimatePresence, motion } from "motion/react";

import token from "./token.js";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export type DrawerSize = "small" | "medium" | "large";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
    /**
     * 是否打开抽屉
     */
    open: boolean;

    /**
     * 打开状态改变时触发
     */
    onOpenChange: (open: boolean) => void;

    /**
     * 关闭前回调。返回 `false` 或 resolve 为 `false` 时可阻止关闭。
     */
    onClose?: (event: SyntheticEvent) => boolean | Promise<boolean> | void | Promise<void>;

    /**
     * 抽屉标题
     */
    title?: ReactNode;

    /**
     * 抽屉底部操作区
     */
    footer?: ReactNode;

    /**
     * 弹出位置
     * @default "right"
     */
    placement?: DrawerPlacement;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    size?: DrawerSize;

    /**
     * 是否展示关闭图标按钮
     * @default true
     */
    closable?: boolean;

    /**
     * 点击遮罩是否关闭
     * @default true
     */
    maskClosable?: boolean;

    /**
     * 关闭后是否卸载内容
     * @default true
     */
    shouldResetContent?: boolean;

    /**
     * 关闭按钮的无障碍标签
     * @default "Close"
     */
    closeLabel?: string;
}

/* ────────────────────────────────── 静态样式 ────────────────────────────────── */

const dialogResetStyle = css`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: transparent;
    overflow: hidden;

    &::backdrop {
        background-color: transparent;
    }
`;

const overlayStyle = css`
    position: fixed;
    inset: 0;
    background-color: ${token.overlay.background.color};
`;

const panelBaseStyle = css`
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: ${token.background.color};
    box-shadow: ${token.box.shadow};
    overflow: hidden;
    box-sizing: border-box;
    max-width: 100vw;
    max-height: 100dvh;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* ---- placement：位置锚定 ---- */

const panelPlacementLeftStyle = css`
    inset-block: 0;
    inset-inline-start: 0;
    height: 100dvh;
`;

const panelPlacementRightStyle = css`
    inset-block: 0;
    inset-inline-end: 0;
    height: 100dvh;
`;

const panelPlacementTopStyle = css`
    inset-inline: 0;
    inset-block-start: 0;
    width: 100vw;
`;

const panelPlacementBottomStyle = css`
    inset-inline: 0;
    inset-block-end: 0;
    width: 100vw;
`;

/* ---- size × orientation（水平 / 垂直）静态样式矩阵 ---- */

const panelSizeSmallHorizontalStyle = css`
    width: ${token.size.small.width};
`;

const panelSizeMediumHorizontalStyle = css`
    width: ${token.size.medium.width};
`;

const panelSizeLargeHorizontalStyle = css`
    width: ${token.size.large.width};
`;

const panelSizeSmallVerticalStyle = css`
    height: ${token.size.small.height};
`;

const panelSizeMediumVerticalStyle = css`
    height: ${token.size.medium.height};
`;

const panelSizeLargeVerticalStyle = css`
    height: ${token.size.large.height};
`;

/* ---- 头部 / 主体 / 底部 / 关闭按钮 ---- */

const headerStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.footer.gap};
    padding: ${token.header.padding};
    border-block-end: 1px solid ${token.header.border.color};
    flex-shrink: 0;
`;

const titleStyle = css`
    flex: 1;
    min-width: 0;
    font-weight: ${token.header.title.font.weight};
    font-size: ${token.header.title.font.size};
    line-height: ${token.header.title.line.height};
    letter-spacing: ${token.header.title.letter.spacing};
    color: ${token.header.title.color};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const bodyStyle = css`
    flex: 1;
    min-height: 0;
    padding: ${token.body.padding};
    overflow: auto;
`;

const footerStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.footer.gap};
    padding: ${token.footer.padding};
    border-block-start: 1px solid ${token.footer.border.color};
    flex-shrink: 0;
`;

const closeButtonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.close.size};
    height: ${token.close.size};
    padding: 0;
    border: none;
    background: transparent;
    color: ${token.close.color};
    cursor: pointer;
    border-radius: ${token.close.border.radius};
    transition:
        color 120ms cubic-bezier(0.4, 0, 0.2, 1),
        background-color 120ms cubic-bezier(0.4, 0, 0.2, 1),
        transform 120ms cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;

    & > svg {
        width: ${token.close.icon.size};
        height: ${token.close.icon.size};
    }

    &:hover:not(:disabled) {
        color: ${token.close["color-hover"]};
        background-color: ${token.close.background["color-hover"]};
    }

    &:active:not(:disabled) {
        transform: scale(0.96);
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/* ────────────────────────────────── Icons ────────────────────────────────── */

const CloseIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
    >
        <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" />
        <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" />
    </svg>
);

/* ────────────────────────────── 辅助：placement 映射 ────────────────────────────── */

const isHorizontalPlacement = (placement: DrawerPlacement): boolean =>
    placement === "left" || placement === "right";

const getPlacementStyle = (placement: DrawerPlacement): string => {
    if (placement === "left") return panelPlacementLeftStyle;
    if (placement === "top") return panelPlacementTopStyle;
    if (placement === "bottom") return panelPlacementBottomStyle;
    return panelPlacementRightStyle;
};

const getSizeStyle = (placement: DrawerPlacement, size: DrawerSize): string => {
    if (isHorizontalPlacement(placement)) {
        if (size === "small") return panelSizeSmallHorizontalStyle;
        if (size === "large") return panelSizeLargeHorizontalStyle;
        return panelSizeMediumHorizontalStyle;
    }
    if (size === "small") return panelSizeSmallVerticalStyle;
    if (size === "large") return panelSizeLargeVerticalStyle;
    return panelSizeMediumVerticalStyle;
};

const getMotionOffset = (placement: DrawerPlacement): { axis: "x" | "y"; from: string } => {
    if (placement === "left") return { axis: "x", from: "-100%" };
    if (placement === "top") return { axis: "y", from: "-100%" };
    if (placement === "bottom") return { axis: "y", from: "100%" };
    return { axis: "x", from: "100%" };
};

/* ──────────────────────────────────── 组件 ──────────────────────────────────── */

/**
 * 抽屉：从屏幕边缘滑出的浮层面板，用于承载临时任务、表单、详情等二级内容。
 *
 * 基于原生 `<dialog>` 的 `showModal()` 实现，天然具备焦点陷阱与 ESC 关闭支持。
 */
const Drawer: FC<DrawerProps> = ({
    className,
    open,
    onOpenChange,
    onClose,
    title,
    footer,
    children,
    placement = "right",
    size = "medium",
    closable = true,
    maskClosable = true,
    shouldResetContent = true,
    closeLabel = "Close",
    onClick,
    ...restProps
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [contentReset, setContentReset] = useState(false);

    useEffect(() => {
        const node = dialogRef.current;
        if (!node) return;
        if (open && !node.open) {
            node.showModal();
        }
    }, [open]);

    useEffect(() => {
        if (!open && shouldResetContent) {
            setContentReset(true);
            return;
        }
        if (open) {
            setContentReset(false);
        }
    }, [open, shouldResetContent]);

    const requestClose = (event: SyntheticEvent) => {
        const result = onClose?.(event);
        Promise.resolve(result).then((resolved) => {
            if (resolved === false) return;
            onOpenChange(false);
        });
    };

    const handleMaskClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!maskClosable) return;
        requestClose(event);
    };

    const handleCloseButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        requestClose(event);
    };

    const handleDialogCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        // 原生 dialog 在 ESC 键下触发 cancel 事件；拦截后走统一关闭流程，保留动画
        event.preventDefault();
        requestClose(event);
    };

    const placementStyle = getPlacementStyle(placement);
    const sizeStyle = getSizeStyle(placement, size);
    const { axis, from } = getMotionOffset(placement);

    const motionInitial = axis === "x" ? { x: from } : { y: from };
    const motionAnimate = axis === "x" ? { x: 0 } : { y: 0 };
    const motionExit = motionInitial;

    return (
        <dialog
            ref={dialogRef}
            className={cx(dialogResetStyle, className)}
            onClick={onClick}
            onCancel={handleDialogCancel}
            aria-modal="true"
            {...restProps}
        >
            <AnimatePresence
                onExitComplete={() => {
                    dialogRef.current?.close();
                }}
            >
                {open && (
                    <>
                        <motion.div
                            key="overlay"
                            className={overlayStyle}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                            onClick={handleMaskClick}
                            role="presentation"
                            data-testid="drawer-overlay"
                        />
                        <motion.div
                            key="panel"
                            className={cx(panelBaseStyle, placementStyle, sizeStyle)}
                            initial={motionInitial}
                            animate={motionAnimate}
                            exit={motionExit}
                            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                            role="document"
                            data-placement={placement}
                            data-size={size}
                        >
                            {(title || closable) && (
                                <div className={headerStyle}>
                                    <div className={titleStyle} title={typeof title === "string" ? title : undefined}>
                                        {title}
                                    </div>
                                    {closable && (
                                        <button
                                            type="button"
                                            className={closeButtonStyle}
                                            onClick={handleCloseButtonClick}
                                            aria-label={closeLabel}
                                        >
                                            <CloseIcon />
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className={bodyStyle}>
                                {!contentReset && children}
                            </div>
                            {footer ? <div className={footerStyle}>{footer}</div> : null}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </dialog>
    );
};

export default Drawer;
