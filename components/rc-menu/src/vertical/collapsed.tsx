import { type FC, useState, type MouseEvent, useEffect, useEffectEvent, useRef, useId } from "react";
import { css, cx } from "@crab-dev/css";
import { useConfig, type ConfigDirection } from '@crab-dev/rc-config-provider';
import {
    useFloating,
    useHover,
    useDismiss,
    autoUpdate,
    useInteractions,
    useFloatingNodeId,
    FloatingNode,
    FloatingTree,
    useFloatingTree,
    offset,
    flip,
    shift,
    safePolygon,
} from "@floating-ui/react";

import { type MenuProps, type MenuOpenKeysChangeDetails } from "../menu.js";
import { ItemType, type Item } from "../type.js";
import token from "../token.js";
import VerticalNormalMenu from "./normal.js";
import { registerOverlayLayer } from '@crab-dev/rc-hooks/internal';
import { navigateMenu, menuActivationEvent } from '../keyboard.js';
import { useMenuDisclosure, useMenuSelectionFocus } from '../interactions.js';

const collapsedRootStyle = css`
    display: flex;
    flex-direction: column;
    list-style-type: none;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    transition: ${token.vertical.collapsed.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const collapsedItemStyle = css`
    list-style-type: none;
`;

const collapsedItemButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${token.vertical.collapsed.item.title.height};
    padding-inline: ${token.vertical.collapsed.item.title["padding-inline"]};
    margin-top: ${token.vertical.item.title["margin-top"]};
    margin-bottom: ${token.vertical.item.title["margin-bottom"]};
    color: ${token.vertical.item.title.color};
    font-size: ${token.vertical.item.title["font-size"]};
    border-radius: ${token.vertical.item.title["border-radius"]};
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    transition: ${token.vertical.item.title.transition};

    &:hover {
        background-color: ${token.vertical.item.title["background-color-hover"]};
        color: ${token.vertical.item.title["color-hover"]};
    }

    &:active {
        background-color: ${token.vertical.item.title["background-color-active"]};
        color: ${token.vertical.item.title["color-active"]};
    }

    &:focus-visible {
        outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']};
        outline-offset: -2px;
    }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const collapsedItemSelectStyle = css`
    background-color: ${token.vertical.item.title["background-color-selected"]};
    color: ${token.vertical.item.title["color-selected"]};
    font-weight: ${token.vertical.item.title["font-weight-selected"]};
    [data-menu-icon] { color: inherit; }
    &:hover, &:focus-visible {
        background-color: ${token.vertical.item.selection['background-color-hover']};
        color: ${token.vertical.item.title['color-selected']};
    }
    &:active { background-color: ${token.vertical.item.selection['background-color-pressed']}; }
    @media (forced-colors: active) {
        &, &:hover, &:active, &:focus-visible {
            forced-color-adjust: none;
            color: HighlightText;
            background-color: Highlight;
        }
    }
`;

const collapsedItemOpenStyle = css`
    background-color: ${token.vertical.item.title["background-color-open"]};
    color: ${token.vertical.item.title["color-open"]};
`;

const collapsedIconStyle = css`
    color: ${token.vertical.item.icon.color};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.vertical.collapsed.item.icon.width};
    height: ${token.vertical.collapsed.item.icon.width};
    flex-shrink: 0;
    line-height: 1;

    & > svg,
    & > img {
        width: 100%;
        height: 100%;
        display: block;
    }
`;

const collapsedFallbackTextStyle = css`
    font-size: inherit;
    font-weight: inherit;
    line-height: 1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const submenuFloatStyle = css`
    min-width: ${token.vertical.submenu["min-width"]};
    padding: ${token.vertical.submenu.padding};
    background-color: ${token.vertical.submenu["background-color"]};
    box-shadow: ${token.vertical.submenu["box-shadow"]};
    border-radius: ${token.vertical.submenu["border-radius"]};
    z-index: ${token.vertical.submenu["z-index"]};
    box-sizing: border-box;

    list-style: none;
    margin: 0;
`;

const tooltipStyle = css`
    background-color: ${token.vertical.tooltip["background-color"]};
    color: ${token.vertical.tooltip.color};
    padding-inline: ${token.vertical.tooltip["padding-inline"]};
    padding-block: ${token.vertical.tooltip["padding-block"]};
    border-radius: ${token.vertical.tooltip["border-radius"]};
    font-size: ${token.vertical.tooltip["font-size"]};
    z-index: ${token.vertical.tooltip["z-index"]};
    pointer-events: none;
    white-space: nowrap;
`;

const flattenTopLevel = (items: Item[]): Item[] => {
    const result: Item[] = [];
    for (const item of items) {
        if (item.type === ItemType.ItemGroup) {
            result.push(...flattenTopLevel(item.children ?? []));
        } else if (item.type === ItemType.Item) {
            result.push(item);
        } else {
            throw new Error(`[${item.type}] The parameter \`type\` is incorrect, please check.`);
        }
    }
    return result;
};

interface CollapsedItemProps {
    item: Item;
    selected: boolean;
    open: boolean;
    direction: ConfigDirection;
    onSelect: (item: Item, event: MouseEvent<HTMLElement>) => void;
    onLeafSelect: (item: Item, event: MouseEvent<HTMLElement>) => void;
    onOpenChange: (open: boolean, event?: MenuOpenKeysChangeDetails['event'], dismissal?: 'hover' | 'outside-press') => void;
    baseProps: Omit<CollapsedMenuProps, "items" | "inlineCollapsed" | "className" | "style">;
}

const CollapsedItem: FC<CollapsedItemProps> = ({ item, selected, open, direction, onSelect, onLeafSelect, onOpenChange, baseProps }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const hasChildren = Boolean(item.children?.length);
    const isOpen = hasChildren ? open : tooltipOpen;
    const popupId = useId();
    const trigger = useRef<HTMLDivElement | null>(null);
    // Mutable close metadata belongs to the last user request, not rendered state.
    const escapeClose = useRef(false);
    const nodeId = useFloatingNodeId();
    const tree = useFloatingTree();
    const requestOpen = (next: boolean, event?: MenuOpenKeysChangeDetails['event'], dismissal?: 'hover' | 'outside-press') => {
        if (!hasChildren) { escapeClose.current = false; setTooltipOpen(next); return; }
        if (next === open) return;
        escapeClose.current = !next && event?.type === 'keydown' && 'key' in event && event.key === 'Escape';
        onOpenChange(next, event, dismissal);
    };
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: (next, event, reason) => requestOpen(next, event, reason === 'outside-press' ? 'outside-press' : 'hover'),
        placement: direction === 'rtl' ? 'left-start' : 'right-start',
        strategy: "fixed",
        nodeId,
        whileElementsMounted: autoUpdate,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    });
    const hover = useHover(context, {
        handleClose: safePolygon({ blockPointerEvents: false, buffer: 1 }),
        delay: { open: 60, close: 120 },
    });
    const dismiss = useDismiss(context, { escapeKey: false, outsidePressEvent: 'pointerdown', referencePress: false, ancestorScroll: false });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);
    const dismissTop = useEffectEvent((event: KeyboardEvent) => requestOpen(false, event));
    useEffect(() => {
        const node = refs.floating.current;
        if (!isOpen || !node) return;
        const layer = registerOverlayLayer(node, event => dismissTop(event), trigger.current);
        return () => layer.release({ restoreFocus: escapeClose.current });
    }, [isOpen, refs.floating]);
    useEffect(() => {
        if (!tree) return;
        const closeTooltip = () => setTooltipOpen(false);
        tree.events.on("close", closeTooltip);
        return () => { tree.events.off("close", closeTooltip); };
    }, [tree]);

    return (
        <li className={collapsedItemStyle} ref={refs.setReference} {...getReferenceProps()}>
            <div
                ref={trigger}
                role="menuitem"
                tabIndex={0}
                data-menu-item=""
                aria-label={item.title}
                aria-haspopup={hasChildren ? "menu" : undefined}
                aria-expanded={hasChildren ? open : undefined}
                aria-controls={hasChildren ? popupId : undefined}
                aria-describedby={!hasChildren && tooltipOpen ? popupId : undefined}
                aria-current={selected ? "true" : undefined}
                title={hasChildren ? undefined : item.title}
                className={cx(collapsedItemButtonStyle, selected ? collapsedItemSelectStyle : null, hasChildren && open ? collapsedItemOpenStyle : null)}
                onClick={event => {
                    if (hasChildren) requestOpen(!open, menuActivationEvent(event.currentTarget) ?? event);
                    else tree?.events.emit("close");
                    onSelect(item, event);
                }}
            >
                {item.icon ? <span className={collapsedIconStyle} data-menu-icon="">{item.icon}</span> : (
                    <span className={collapsedFallbackTextStyle}>{item.title?.slice(0, 1)}</span>
                )}
            </div>
            <FloatingNode id={nodeId}>
                {isOpen ? hasChildren ? (
                    <div id={popupId} ref={refs.setFloating} style={floatingStyles} className={submenuFloatStyle} {...getFloatingProps()}>
                        <VerticalNormalMenu
                            {...baseProps}
                            items={item.children ?? []}
                            onClick={param => {
                                if (!param.item.children?.length) {
                                    tree?.events.emit("close");
                                    onLeafSelect(param.item, param.event);
                                } else baseProps.onClick?.(param);
                            }}
                        />
                    </div>
                ) : item.title ? (
                    <div id={popupId} ref={refs.setFloating} style={floatingStyles} className={tooltipStyle} role="tooltip" {...getFloatingProps()}>
                        {item.title}
                    </div>
                ) : null : null}
            </FloatingNode>
        </li>
    );
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CollapsedMenuProps extends Omit<MenuProps, "mode"> {}

const VerticalCollapsedMenu: FC<CollapsedMenuProps> = ({
    className,
    style,
    openKeys = [],
    onOpenKeysChange,
    selectedKeys = [],
    items = [],
    onSelectedKeysChange,
    onClick,
    onKeyDown,
    inlineCollapsed: _inlineCollapsed,
    ...props
}) => {
    const config = useConfig();
    const direction = props.dir === 'ltr' || props.dir === 'rtl' ? props.dir : config.direction;
    const root = useRef<HTMLUListElement | null>(null);
    const { requestOpen, closeAll } = useMenuDisclosure(openKeys, onOpenKeysChange, root);
    const captureSelectionFocus = useMenuSelectionFocus(openKeys, root);
    const topItems = flattenTopLevel(items);
    const handleLeafSelect = (item: Item, event: MouseEvent<HTMLElement>) => {
        captureSelectionFocus(event.currentTarget);
        onClick?.({ event, item });
        closeAll(item, menuActivationEvent(event.currentTarget) ?? event);
    };
    const handleSelect = (item: Item, event: MouseEvent<HTMLElement>) => {
        if (!item.children?.length) captureSelectionFocus(event.currentTarget);
        const keys = selectedKeys.includes(item.key) ? [] : [item.key];
        const semanticEvent = menuActivationEvent(event.currentTarget) ?? event;
        onSelectedKeysChange?.(keys, { reason: keys.length ? 'select' : 'deselect', item, event: semanticEvent });
        onClick?.({ event, item });
        if (!item.children?.length) closeAll(item, semanticEvent);
    };

    return (
        <FloatingTree>
            <ul
                ref={root}
                className={cx(className, collapsedRootStyle)}
                style={style}
                role="menu"
                {...props}
                onKeyDown={event => {
                    const view = event.currentTarget.ownerDocument.defaultView;
                    if (view && event.target instanceof view.HTMLElement && event.target.closest('ul') !== event.currentTarget) return;
                    onKeyDown?.(event);
                    navigateMenu(event);
                }}
            >
                {topItems.map(item => (
                    <CollapsedItem
                        key={item.key}
                        item={item}
                        selected={selectedKeys.includes(item.key)}
                        open={openKeys.includes(item.key)}
                        direction={direction}
                        onOpenChange={(next, event, dismissal) => requestOpen(item, 1, next, event, dismissal)}
                        onSelect={handleSelect}
                        onLeafSelect={handleLeafSelect}
                        baseProps={{ selectedKeys, onSelectedKeysChange, openKeys, onOpenKeysChange, onClick, onKeyDown }}
                    />
                ))}
            </ul>
        </FloatingTree>
    );
};

export default VerticalCollapsedMenu;
