import {
    useFloating,
    useHover,
    useDismiss,
    useInteractions,
    FloatingNode,
    useFloatingNodeId,
    useFloatingParentNodeId,
    autoUpdate,
    flip,
    shift,
    safePolygon,
} from "@floating-ui/react";
import { type FC, type ReactNode, type KeyboardEvent as ReactKeyboardEvent, useEffect, useEffectEvent, useId, useRef } from "react";
import { registerOverlayLayer } from '@crab-dev/rc-hooks/internal';
import { cx } from "@crab-dev/css";
import { type Item } from "../type.js";
import itemStyle from "./styles/itemNormal.styles.js";
import { type MenuProps, type MenuOpenKeysChangeDetails } from "../menu.js";
import { iconArrayBase, iconArrayRight } from "../icon.js";
import { menuActivationEvent } from '../keyboard.js';

interface ItemProps {
    item: Item;
    children: ReactNode[];
    depth: number;
    onClick?: (param: Parameters<NonNullable<MenuProps['onClick']>>[0] & { activationEvent?: ReactKeyboardEvent<HTMLElement> }) => void;
    selected?: boolean;
    open: boolean;
    onOpenChange?: (open: boolean, event?: MenuOpenKeysChangeDetails['event'], dismissal?: 'hover' | 'outside-press') => void;
}

const ItemNormal: FC<ItemProps> = ({
    item,
    children,
    depth: _depth,
    onClick,
    selected,
    open,
    onOpenChange,
}) => {
    const submenuId = useId();
    const triggerId = useId();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const isRootMenu = parentId == null;
    const hasChildren = children.length > 0;
    const trigger = useRef<HTMLDivElement | null>(null);
    // Mutable close metadata restores focus only after an accepted Escape request.
    const restoreEscapeFocus = useRef(false);
    const requestOpen = (next: boolean, event?: MenuOpenKeysChangeDetails['event'], dismissal?: 'hover' | 'outside-press') => {
        if (!hasChildren || next === open) return;
        restoreEscapeFocus.current = !next && event?.type === 'keydown' && 'key' in event && event.key === 'Escape';
        onOpenChange?.(next, event, dismissal);
    };
    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: (next, event, reason) => requestOpen(next, event, reason === 'outside-press' ? 'outside-press' : 'hover'),
        placement: isRootMenu ? "bottom-start" : "right-start",
        strategy: "fixed",
        nodeId,
        whileElementsMounted: autoUpdate,
        middleware: [flip(), shift({ padding: 8 })],
    });
    const hover = useHover(context, { handleClose: safePolygon() });
    const dismiss = useDismiss(context, {
        escapeKey: false,
        outsidePressEvent: 'pointerdown',
        referencePress: false,
        ancestorScroll: false,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);
    const dismissTop = useEffectEvent((event: KeyboardEvent) => requestOpen(false, event));
    useEffect(() => {
        const node = refs.floating.current;
        if (!open || !node) return;
        const layer = registerOverlayLayer(node, event => dismissTop(event), trigger.current);
        return () => layer.release({ restoreFocus: restoreEscapeFocus.current });
    }, [open, refs.floating, triggerId]);

    return (
        <li
            className={cx(itemStyle.item.base, isRootMenu ? itemStyle.item.withDivider : null)}
            ref={refs.setReference}
            {...getReferenceProps()}
        >
            <div
                ref={trigger}
                id={triggerId}
                role="button"
                tabIndex={0}
                data-menu-item=""
                aria-current={selected ? 'page' : undefined}
                aria-expanded={hasChildren ? open : undefined}
                aria-controls={hasChildren ? submenuId : undefined}
                className={cx(itemStyle.item.content, isRootMenu ? null : itemStyle.item.floatTrigger)}
                onClick={event => {
                    const activationEvent = menuActivationEvent(event.currentTarget);
                    if (hasChildren) requestOpen(!open, activationEvent ?? event);
                    onClick?.({ event, item, activationEvent });
                }}
            >
                {item.icon ? <span className={itemStyle.item.icon} data-menu-icon="">{item.icon}</span> : null}
                <span className={itemStyle.item.title} title={item.title}>{item.title}</span>
                {hasChildren && !isRootMenu ? (
                    <span className={itemStyle.item.leftIcon} aria-hidden="true">
                        <i className={cx(iconArrayBase, iconArrayRight)} />
                    </span>
                ) : null}
            </div>
            <FloatingNode id={nodeId}>
                {open && hasChildren ? (
                    <ul
                        id={submenuId}
                        {...getFloatingProps()}
                        className={cx(itemStyle.submenu.container, itemStyle.submenu.float)}
                        ref={refs.setFloating}
                        // Floating UI supplies measured runtime geometry; visual values use static tokens.
                        style={floatingStyles}
                    >
                        {children}
                    </ul>
                ) : null}
            </FloatingNode>
        </li>
    );
};

export default ItemNormal;
