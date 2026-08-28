import { type FC, useState, type MouseEvent, useEffect } from "react";
import { css, cx } from "@crab-dev/css";
import {
    useFloating,
    useHover,
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

import { type MenuProps } from "../menu.js";
import { ItemType, type Item } from "../type.js";
import token from "../token.js";
import VerticalNormalMenu from "./normal.js";

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
        outline: 2px solid ${token.vertical.item.title["background-color-select"]};
        outline-offset: -2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const collapsedItemSelectStyle = css`
    background-color: ${token.vertical.item.title["background-color-select"]};
    color: ${token.vertical.item.title["color-select"]};
    font-weight: ${token.vertical.item.title["font-weight-select"]};
`;

const collapsedItemOpenStyle = css`
    background-color: ${token.vertical.item.title["background-color-open"]};
    color: ${token.vertical.item.title["color-open"]};
`;

const collapsedIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.vertical.collapsed.item.icon.size};
    height: ${token.vertical.collapsed.item.icon.size};
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

const collectAllKeys = (items: Item[]): Item["key"][] => {
    const keys: Item["key"][] = [];
    for (const item of items) {
        keys.push(item.key);
        if (item.children && item.children.length > 0) {
            keys.push(...collectAllKeys(item.children));
        }
    }
    return keys;
};

interface CollapsedItemProps {
    item: Item;
    selected: boolean;
    onSelect: (item: Item, event: MouseEvent<HTMLElement>) => void;
    baseProps: Omit<CollapsedMenuProps, "items" | "inlineCollapsed" | "className" | "style">;
}

const CollapsedItem: FC<CollapsedItemProps> = ({ item, selected, onSelect, baseProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = (item.children?.length ?? 0) > 0;
    const nodeId = useFloatingNodeId();
    const tree = useFloatingTree();

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "right-start",
        strategy: "fixed",
        nodeId,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    });

    const hover = useHover(context, {
        // safePolygon 允许鼠标沿参考元素 → 浮层之间的三角安全区平滑移动，
        // 不会因短暂离开参考元素而立即收起浮层。
        handleClose: safePolygon({ blockPointerEvents: false, buffer: 1 }),
        delay: { open: 60, close: 120 },
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

    useEffect(() => {
        if (!tree) return;
        const close = () => setIsOpen(false);
        tree.events.on("close", close);
        return () => {
            tree.events.off("close", close);
        };
    }, [tree]);

    return (
        <li
            className={collapsedItemStyle}
            ref={refs.setReference}
            {...getReferenceProps()}
        >
            <div
                role="menuitem"
                tabIndex={0}
                aria-label={item.title}
                aria-haspopup={hasChildren ? "menu" : undefined}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-current={selected ? "true" : undefined}
                title={hasChildren ? undefined : item.title}
                className={cx(
                    collapsedItemButtonStyle,
                    selected ? collapsedItemSelectStyle : null,
                    hasChildren && isOpen ? collapsedItemOpenStyle : null,
                )}
                onClick={(e) => {
                    if (!hasChildren) {
                        tree?.events.emit("close");
                    }
                    onSelect(item, e);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!hasChildren) {
                            tree?.events.emit("close");
                        }
                        onSelect(item, e as unknown as MouseEvent<HTMLElement>);
                    }
                }}
            >
                {item.icon ? (
                    <span className={collapsedIconStyle}>{item.icon}</span>
                ) : (
                    <span className={collapsedFallbackTextStyle}>
                        {typeof item.title === "string" && item.title.length > 0
                            ? item.title.slice(0, 1)
                            : null}
                    </span>
                )}
            </div>
            <FloatingNode id={nodeId}>
                {isOpen
                    ? (
                        hasChildren
                            ? (
                                <div
                                    ref={refs.setFloating}
                                    style={floatingStyles}
                                    className={submenuFloatStyle}
                                    {...getFloatingProps()}
                                >
                                    <VerticalNormalMenu
                                        {...baseProps}
                                        items={item.children ?? []}
                                        openKeys={collectAllKeys(item.children ?? [])}
                                        onClick={(param) => {
                                            tree?.events.emit("close");
                                            baseProps.onClick?.(param);
                                        }}
                                    />
                                </div>
                            )
                            : (
                                item.title
                                    ? (
                                        <div
                                            ref={refs.setFloating}
                                            style={floatingStyles}
                                            className={tooltipStyle}
                                            role="tooltip"
                                            {...getFloatingProps()}
                                        >
                                            {item.title}
                                        </div>
                                    )
                                    : null
                            )
                    )
                    : null}
            </FloatingNode>
        </li>
    );
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CollapsedMenuProps extends Omit<MenuProps, "mode"> {}

const VerticalCollapsedMenu: FC<CollapsedMenuProps> = ({
    className,
    style,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    openKeys,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onOpenChange,
    selectedKeys = [],
    items = [],
    onSelectItem,
    onClick,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inlineCollapsed,
    ...props
}) => {
    const topItems = flattenTopLevel(items);

    const handleSelect = (item: Item, event: MouseEvent<HTMLElement>) => {
        const keys: typeof selectedKeys = [];
        if (!selectedKeys.includes(item.key)) {
            keys.push(item.key);
        }
        onSelectItem?.({ item, selectedKeys: keys });
        onClick?.({ event, item });
    };

    return (
        <FloatingTree>
            <ul
                className={cx(className, collapsedRootStyle)}
                style={style}
                role="menu"
                {...props}
            >
                {topItems.map((item) => (
                    <CollapsedItem
                        key={item.key}
                        item={item}
                        selected={selectedKeys.includes(item.key)}
                        onSelect={handleSelect}
                        baseProps={{
                            selectedKeys,
                            onSelectItem,
                            onClick,
                        }}
                    />
                ))}
            </ul>
        </FloatingTree>
    );
};

export default VerticalCollapsedMenu;
