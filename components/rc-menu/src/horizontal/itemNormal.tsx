import {
    useFloating,
    useHover,
    useInteractions,
    FloatingNode,
    useFloatingNodeId,
    useFloatingTree,
    useFloatingParentNodeId
} from "@floating-ui/react";
import { type FC, useState, type ReactNode, useEffect, useId } from "react";
import { cx } from "@crab-dev/css";
import { type Item } from "../type.js";
import itemStyle from "./styles/itemNormal.styles.js";
import { type MenuProps } from "../menu.js";
import { iconArrayBase, iconArrayRight } from "../icon.js";


interface ItemProps {
    item: Item,
    children: ReactNode[],
    depth: number
    onClick?: MenuProps["onClick"]
    selected?: boolean
}

const ItemNormal: FC<ItemProps> = ({
    item,
    children,
    depth: _depth,
    onClick,
    selected
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const submenuId = useId();
    const triggerId = useId();
    const nodeId = useFloatingNodeId();

    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    const isRootMenu = parentId == null;

    const { refs, floatingStyles, context  } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: isRootMenu ? "bottom-start" : "right-start",
        strategy: "fixed",
        nodeId,
    });

    const hover = useHover(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

    useEffect(() => {
        const close = () => {
            setIsOpen(false);
        }
        tree?.events.on("close", close);
        return () => {
            tree?.events.off("close", close);
        };
    }, [])


    const isOpenFloatChildren = isOpen && children.length > 0;

    return (
        <>
            <li
                key={item.key}
                className={cx.call(undefined, itemStyle.item.base, isRootMenu ? itemStyle.item.withDivider : null)}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <div
                    id={triggerId}
                    role="button"
                    tabIndex={0}
                    data-menu-item=""
                    aria-current={selected ? 'page' : undefined}
                    aria-expanded={children.length > 0 ? isOpen : undefined}
                    aria-controls={children.length > 0 ? submenuId : undefined}
                    className={cx.call(undefined, itemStyle.item.content, isRootMenu ? null : itemStyle.item.floatTrigger)}
                    onClick={(e) => {
                        if (children.length > 0) setIsOpen(value => !value);
                        else tree?.events.emit("close");
                        onClick?.({
                            event: e,
                            item
                        });
                    }}
                >
                    {
                        item.icon ? (
                            <span
                                className={itemStyle.item.icon}
                            >
                                {item.icon}
                            </span>
                        ) : null
                    }
                    <span
                        className={itemStyle.item.title}
                    >
                        {item.title}
                    </span>

                    <span className={itemStyle.item.leftIcon}>
                        {
                            children.length > 0 && !isRootMenu ? (
                                <i className={cx.call(undefined, iconArrayBase, iconArrayRight)}/>
                            ) : null
                        }
                    </span>
                </div>
                <FloatingNode id={nodeId}>
                    {
                        isOpenFloatChildren ? (
                            <ul
                                id={submenuId}
                                {...getFloatingProps()}
                                onKeyDown={event => {
                                    if (event.key === 'Escape') {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setIsOpen(false);
                                        document.getElementById(triggerId)?.focus();
                                    }
                                }}
                                className={cx.call(undefined, itemStyle.submenu.container, itemStyle.submenu.float)}
                                ref={refs.setFloating}
                                style={floatingStyles}
                            >
                                {children}
                            </ul>
                        ) : null
                    }
                </FloatingNode>
            </li>
        </>
    )
}

export default ItemNormal;
