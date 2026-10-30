import { acquireScrollLock, registerOverlayLayer, type OverlayLayer } from '@crab-dev/rc-hooks/internal';
import { useComponentSize, useLocale } from '@crab-dev/rc-config-provider';
import { useConfigStyleBoundary } from '@crab-dev/rc-config-provider/internal';
import { useEffect, useId, useLayoutEffect, useRef } from "react";
import type { FC, HTMLAttributes, MouseEvent, ReactNode, SyntheticEvent } from "react";
import { cx } from "@crab-dev/css";
import { useControllableOpen, type ControlledOpenProps, usePresence } from "@crab-dev/rc-hooks";
import Button from "@crab-dev/rc-button";
import { dialogResetStyle, overlayStyle, panelBaseStyle, panelPlacementLeftStyle, panelPlacementRightStyle, panelPlacementTopStyle, panelPlacementBottomStyle, panelSizeSmallHorizontalStyle, panelSizeMediumHorizontalStyle, panelSizeLargeHorizontalStyle, panelSizeSmallVerticalStyle, panelSizeMediumVerticalStyle, panelSizeLargeVerticalStyle, headerStyle, titleStyle, bodyStyle, footerStyle, closeButtonStyle } from "./drawer.styles.js";
export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export type DrawerSize = "small" | "medium" | "large";

export interface DrawerOpenChangeDetails {
    reason: 'close-button' | 'escape' | 'outside-press';
    event: SyntheticEvent | KeyboardEvent;
}

interface DrawerBaseProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
    /**
     * 是否打开抽屉
     */


    /**
     * 打开状态改变时触发
     */


    /**
     * 关闭前回调。返回 `false` 或 resolve 为 `false` 时可阻止关闭。
     */
    onClose?: (event: SyntheticEvent | KeyboardEvent) => boolean | Promise<boolean> | void | Promise<void>;

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

export type DrawerProps = DrawerBaseProps & ControlledOpenProps<DrawerOpenChangeDetails>;

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


/* ──────────────────────────────────── 组件 ──────────────────────────────────── */

/**
 * 抽屉：从屏幕边缘滑出的浮层面板，用于承载临时任务、表单、详情等二级内容。
 *
 * 基于原生 `<dialog>` 的 `showModal()` 实现，天然具备焦点陷阱与 ESC 关闭支持。
 */
const Drawer: FC<DrawerProps> = ({
    className,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    onClose,
    title,
    footer,
    children,
    placement = "right",
    size: sizeProp,
    closable = true,
    maskClosable = true,
    shouldResetContent = true,
    closeLabel,
    onClick,
    ...restProps
}) => {
    const boundary = useConfigStyleBoundary();
    const { messages } = useLocale();
    const [open, setOpen] = useControllableOpen<DrawerOpenChangeDetails>({ open: controlledOpen, defaultOpen, onOpenChange });
    const configuredSize = useComponentSize(sizeProp);
    const size = configuredSize;
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    // Mutable instance state: retain the background lock until the panel has left.
    const restoreScroll = useRef<(() => void) | null>(null);
    const layer = useRef<OverlayLayer | null>(null);
    const presence = usePresence<HTMLDivElement>(open, () => {
        dialogRef.current?.close();
        restoreScroll.current?.();
        restoreScroll.current = null;
        layer.current?.release();
        layer.current = null;
    });

    // Enter the top layer before painting so the panel and mask start together.
    useLayoutEffect(() => {
        const node = dialogRef.current;
        if (!node || !open) return;
        restoreScroll.current ??= acquireScrollLock(node);
        layer.current ??= registerOverlayLayer(node);
        if (!node.open) node.showModal();
    }, [open]);

    useEffect(() => () => {
        restoreScroll.current?.();
        restoreScroll.current = null;
        layer.current?.release();
        layer.current = null;
    }, []);

    const requestClose = (event: SyntheticEvent | KeyboardEvent, reason: DrawerOpenChangeDetails["reason"]) => {
        const result = onClose?.(event);
        Promise.resolve(result).then((resolved) => {
            if (resolved === false) return;
            setOpen(false, { reason, event });
        });
    };

    const handleMaskClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!maskClosable) return;
        if (layer.current?.isTop()) requestClose(event, "outside-press");
    };

    const handleCloseButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        requestClose(event, "close-button");
    };

    const handleDialogCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        if (event.target !== event.currentTarget) return;
        // 原生 dialog 在 ESC 键下触发 cancel 事件；拦截后走统一关闭流程，保留动画
        event.preventDefault();
        if (layer.current?.isTop()) requestClose(event, "escape");
    };

    const placementStyle = getPlacementStyle(placement);
    const sizeStyle = getSizeStyle(placement, size);

    return (
        <dialog
            {...boundary.attributes}
            ref={dialogRef}
            className={cx(dialogResetStyle, boundary.className, className)}
            onClick={onClick}
            onCancel={handleDialogCancel}
            aria-modal="true"
            aria-labelledby={title && !restProps['aria-label'] ? titleId : undefined}
            {...restProps}
        >
            {boundary.brandStyle}
            {(presence.present || !shouldResetContent) && (
                <>
                    <div
                        key="overlay"
                        data-state={presence.state}
                        inert={!open}
                        className={overlayStyle}
                        onClick={handleMaskClick}
                        role="presentation"
                        data-testid="drawer-overlay"
                    />
                    <div
                        key="panel"
                        ref={presence.ref}
                        data-state={presence.state}
                        inert={!open}
                        className={cx(panelBaseStyle, placementStyle, sizeStyle)}
                        role="document"
                        data-placement={placement}
                        data-size={size}
                    >
                        {(title || closable) && (
                            <div className={headerStyle}>
                                <div id={titleId} className={titleStyle} title={typeof title === "string" ? title : undefined}>
                                    {title}
                                </div>
                                {closable && (
                                    <Button
                                        type="button"
                                        appearance="text"
                                        className={closeButtonStyle}
                                        onClick={handleCloseButtonClick}
                                        aria-label={closeLabel ?? messages.common.close}
                                        icon={<CloseIcon />}
                                    />
                                )}
                            </div>
                        )}
                        <div className={bodyStyle}>
                            {children}
                        </div>
                        {footer ? <div className={footerStyle}>{footer}</div> : null}
                    </div>
                </>
            )}
        </dialog>
    );
};

export default Drawer;
