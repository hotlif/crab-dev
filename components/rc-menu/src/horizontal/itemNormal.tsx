import { useFloating, useHover, useInteractions, offset, safePolygon, flip} from "@floating-ui/react";
import { type FC, useState, type ReactNode } from "react";
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

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset({
                mainAxis: 4
            }),
            flip()
        ]
    });

    const hover = useHover(context, {
        handleClose: safePolygon(),
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
    const isChildren = depth > 1;

    return (
        <li
            key={item.key}
            className={cx(itemStyle.item.base, isChildren ? null : itemStyle.item.withDivider)}
            ref={refs.setReference}
            {...getReferenceProps()}
        >
            <div
                className={cx(itemStyle.item.content, isChildren ? itemStyle.item.floatTrigger : null)}
                onClick={(e) => {
                    onClick?.({
                        event: e,
                        item
                    })
                }}
            >
                {
                    item.icon && (
                        <span
                            className={itemStyle.item.icon}
                        >
                            {item.icon}
                        </span>
                    )
                }
                <span
                    className={itemStyle.item.title}
                >
                    {item.title}
                </span>
            </div>
            {isOpen && (
                <ul
                    className={cx(itemStyle.submenu.container, isChildren ? null : itemStyle.submenu.float)}
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                >
                    {children}
                </ul>
            )}
        </li>
    )
}

export default ItemNormal;