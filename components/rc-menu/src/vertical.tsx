import { type FC, type ReactNode } from "react";
import { css, cx } from "@linaria/core";
import {
    display,
    padding,
    listStyleType,
    height,
    alignItems,
    cursor,
    width,
    flexDirection,
    fontSize,
    margin,
    overflow,
    boxSizing
} from "@crab/styleify";

import { motion, AnimatePresence } from "motion/react"

import { type MenuProps } from "./menu";
import { ItemType, type Item } from "./type";
import {
    MenuItemBackgroundHoverColor,
    MenuItemBorderRadius,
    MenuItemSelectdColor,
    MenuItemActiveColor,
    MenuItemInLineIndent,
    MenuItemChildrenBgColor,
    MenuItemGroupTitleColor,
    globals
} from "./token";

export {
    globals
}

interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}

const itemStyle = css`
    ${display("flex")}
    ${flexDirection("col")}
    ${alignItems("center")}
    ${width("full")}
    ${cursor("pointer")}
    ${flexDirection("col")}
    user-select: none;
`

const itemTitleStyle = css`
    ${display("flex")}
    ${alignItems("center")}
    ${width("full")}
    ${padding("ps-4")}
    ${padding("pe-4")}
    ${margin("my-0.5")}
    ${boxSizing("border")}
`

const itemTitleBaseStyle = css`
    ${height("10")}
    ${fontSize("base")}
    border-radius: ${MenuItemBorderRadius};
    &:hover {
        background-color: ${MenuItemBackgroundHoverColor};
    }

    &:active {
        background-color: ${MenuItemActiveColor};
    }
`

const itemGroupTitleStyle = css`
    cursor: default;
    ${height("9")}
    ${fontSize("sm")}
    color: ${MenuItemGroupTitleColor};
`

const itemSelectStyle = css`
    background-color: ${MenuItemSelectdColor};
`

const ulStyle = css`
    ${listStyleType("none")}
    ${width("full")}
    ${padding("p-0")}
    ${margin("m-0")}
`

const ulChildrenStyle = css`
    ${overflow("hidden")}
    ${padding("px-4")}
    ${boxSizing("border")}
    height: auto;
    background-color: ${MenuItemChildrenBgColor};
`

const ulChildrenItemGroupStyle = css`
    ${overflow("hidden")}
`

const VerticalMenu: FC<VerticalMenuProps> = ({
    className,
    openKeys,
    selectedKeys = [],
    items = [],
    onSelectItem,
    onOpenChange,
    ...props
}) => {
    const selectItemFunction = (item: Item) => {
        const keys = []
        if (!selectedKeys.includes(item.key)) {
            keys.push(item.key)
        }

        onSelectItem?.({
            item,
            selectedKeys: keys
        });

        if (openKeys && item.type != ItemType.ItemGroup) {
            const index = openKeys.indexOf(item.key);
            if (index >= 0) {
                openKeys.splice(index, 1);
            } else {
                openKeys.push(item.key);
            }
            onOpenChange?.([...openKeys]);
        }
    }

    const renderItem = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <li
                className={itemStyle}
                key={item.key}
            >
                <div
                    className={cx(
                        itemTitleStyle,
                        itemTitleBaseStyle,
                        children.length === 0 && selectedKeys.includes(item.key) ? itemSelectStyle : null)
                    }
                    style={{
                        paddingLeft: `calc(${depth} * ${MenuItemInLineIndent})`
                    }}
                    onClick={() => {
                        selectItemFunction(item);
                    }}
                >
                    {item.title}
                </div>
                <AnimatePresence initial={false}>
                    {
                        children?.length > 0 ?
                        (
                            <motion.ul
                                className={cx(ulStyle, ulChildrenStyle)}
                                animate="open"
                                initial="collapsed"
                                exit="collapsed"
                                variants={{
                                    open: { opacity: 1, height: "auto" },
                                    collapsed: { opacity: 0, height: 0 }
                                }}
                                transition={{ duration: 0.4, ease: "anticipate"}}
                            >
                                {children}
                            </motion.ul>
                        ) : null
                    }
                </AnimatePresence>
            </li>
        );
    }

    const renderItemGroup = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <li
                className={itemStyle}
                key={item.key}
            >
                <div
                    className={cx(itemTitleStyle, itemGroupTitleStyle)}
                    style={{
                        paddingLeft: `calc(${depth} * ${MenuItemInLineIndent} * 0.7)`
                    }}
                    onClick={() => {
                        selectItemFunction(item);
                    }}
                >
                    {item.title}
                </div>
                <ul
                    className={cx(ulStyle, ulChildrenItemGroupStyle)}
                >
                    {children}
                </ul>
            </li>
        );
    }

    const renderMenu = (items: Item[], depth: number): ReactNode[] => {
        return items.map(item => {
            if (item.type === ItemType.ItemGroup ) {
                return renderItemGroup(item, renderMenu(item.children ?? [], depth + 1), depth);
            } else if (item.type === ItemType.Item) {
                return renderItem(item, openKeys?.includes(item.key) ? (renderMenu(item.children ?? [],depth + 1)) : [], depth);
            } else {
                throw new Error(`[${item.type}] The parameter \`type\` is incorrect, please check.`)
            }
        })
    }
    
    return (
        <ul
            className={cx(className, ulStyle)}
            {...props}
        >
            {renderMenu(items, 1)}
        </ul>
    )
}

export default VerticalMenu;
