import {
    useFloating,
    useHover,
    useInteractions,
    offset,
    safePolygon,
    flip,
    FloatingNode,
    useFloatingNodeId,
    useFloatingTree,
    useFloatingParentNodeId
} from "@floating-ui/react";
import { type FC, useState, type ReactNode, useEffect } from "react";
import { cx } from "@linaria/core";
import { type Item } from "../type";
import itemStyle from "./styles/itemNormal.styles";
import { type MenuProps } from "../menu";

interface ItemProps {
    item: Item,
    children: ReactNode[],
    depth: number
    onClick?: MenuProps["onClick"]
}

const ItemNormal: FC<ItemProps> = ({
    item,
    children,
    depth,
    onClick
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const nodeId = useFloatingNodeId();

    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    const isRootMenu = parentId == null;

    const { refs, floatingStyles, context } = useFloating({
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

    return (
        <>
            <li
                key={item.key}
                className={cx(itemStyle.item.base, isRootMenu ? itemStyle.item.withDivider : null)}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <div
                    className={cx(itemStyle.item.content, isRootMenu ? null : itemStyle.item.floatTrigger)}
                    onClick={(e) => {
                        tree?.events.emit("close");
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
                </div>
                <FloatingNode id={nodeId}>
                {
                    isOpen && children.length > 0 ? (
                        <ul
                            className={cx(itemStyle.submenu.container, itemStyle.submenu.float)}
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
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