import { type ReactNode, type FC, useState } from "react";
import { css, cx } from "@linaria/core";
import { useFloating, useHover, useInteractions, offset, safePolygon, flip} from "@floating-ui/react";

import { type MenuProps } from "./menu";
import { ItemType, type Item } from "./type";


const ulRootContainerStyle = css`
    display: flex;
    flex-direction: row;
    list-style-type: none;
    line-height: 46px;
    border-bottom: 1px solid rgba(5,5,5,0.06);
    box-sizing: border-box;
`

const ulChildrenContainerStyle = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: #000;
    line-height: 40px;
    border-radius: 4px;
`

const ulFloatContainer = css`
    white-space: nowrap;
    padding: 6px 4px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px;
`

const ulChildrenItemStyle = css`
    border-radius: 4px;
    padding-inline: 16px;
    display: flex;
    align-items: center;
`

const ulChildrenItemFloatStyle = css`
    margin: 4px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
`

const itemBottomLineStyle = css`
    &:hover {
        color: #1677ff;
        &::after {
            border-bottom: 2px solid #1677ff;
        }
    }
    &::after {
        position: absolute;
        content: "";
        inset-inline-end: 12px;
        inset-inline-start: 14px;
        bottom: 0;
        transition: border-bottom 0.3s;
        border-bottom: 2px solid transparent;
    }
`

const itemStyle = css`
    cursor: pointer;
    font-size: 14px;
    position: relative;
    user-select: none;
    transition: border-color 0.3s, color 0.3s;

`

const GroupItemTitleStyle = css`
    opacity: 0.5;
`

const GroupItemIconStyle = css`
    opacity: 0.5;
    margin-right: 8px;
`

interface GroupItemProps {
    item: Item,
    children: ReactNode[],
    depth: number
}

const GroupItem: FC<GroupItemProps> = ({
    item,
    children,
    depth
}) => {
    return (
        <li
            key={item.key}
            className={cx(itemStyle)}
        >
            <div
                className={cx(ulChildrenItemStyle)}
                style={{
                    paddingLeft: `calc(${depth} * 5px * 0.7)`
                }}
            >
                {
                    item.icon && (
                        <span
                            className={GroupItemIconStyle}
                        >
                            {item.icon}
                        </span>
                    )
                }
                <span
                    className={GroupItemTitleStyle}
                >
                    {item.title}
                </span>
            </div>
            <ul
                className={ulChildrenContainerStyle}
            >
                {children}
            </ul>
        </li>
    )
}

const itemTitleStyle = css`
    text-overflow: ellipsis;
    white-space: nowrap;
`

const itemIconStyle = css`
    margin-right: 8px;
`


interface ItemProps {
    item: Item,
    children: ReactNode[],
    depth: number
}

const Item: FC<ItemProps> = ({
    item,
    children,
    depth
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
        <>
            <li
                key={item.key}
                className={cx(itemStyle, isChildren ? null : itemBottomLineStyle)}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <div
                    className={cx(ulChildrenItemStyle, isChildren ? ulChildrenItemFloatStyle : null)}
                >
                    {
                        item.icon && (
                            <span
                                className={itemIconStyle}
                            >
                                {item.icon}
                            </span>
                        )
                    }
                    <span
                        className={itemTitleStyle}
                    >
                        {item.title}
                    </span>
                </div>
                {isOpen && (
                    <ul
                        className={cx(ulChildrenContainerStyle, isChildren ? null : ulFloatContainer)}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        {children}
                    </ul>
                )}
            </li>
        </>
    )
}


interface HorizontalMenuProps extends Omit<MenuProps, "mode"> {
}


const HorizontalMenu: FC<HorizontalMenuProps> = ({
    className,
    openKeys,
    selectedKeys = [],
    items = [],
    onSelectItem,
    onOpenChange,
    ...props
}) => {

    const renderItem = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <Item
                key={item.key}
                item={item}
                depth={depth}
            >
                {children}
            </Item>
        );
    }

    const renderItemGroup = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <GroupItem
                key={item.key}
                item={item}
                depth={depth}
            >
                {children}
            </GroupItem>
        );
    }


    const renderMenu = (items: Item[], depth: number): ReactNode[] => {
        return items.map(item => {
            if (item.type === ItemType.ItemGroup ) {
                return renderItemGroup(item, renderMenu(item.children ?? [], depth + 1), depth);
            } else if (item.type === ItemType.Item) {
                return renderItem(item, renderMenu(item.children ?? [],depth + 1), depth);
            } else {
                throw new Error(`[${item.type}] The parameter \`type\` is incorrect, please check.`)
            }
        })
    }

    return (
        <ul
            className={cx(className, ulRootContainerStyle)}
            {...props}
        >
            {renderMenu(items, 1)}
        </ul>
    )
}

export default HorizontalMenu;
