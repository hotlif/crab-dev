import { type FC, type ReactNode } from "react";
import { css, cx } from "@linaria/core";

import { motion, AnimatePresence } from "motion/react"

import { iconArrayBase, iconArrayDown, iconArrayUp } from "../icon";
import { type MenuProps } from "../menu";
import { ItemType, type Item } from "../type";
import token from "../token";

const verticalItemTitleWidth = token.vertical.item.title.width;
const verticalItemTitleMarginBottom = token.vertical.item.title["margin-bottom"];
const verticalItemTitleMarginTop = token.vertical.item.title["margin-top"];
const verticalItemTitlePaddingInlineStart = token.vertical.item.title["padding-inline-start"];
const verticalItemTitlePaddingInlineEnd = token.vertical.item.title["padding-inline-end"];
const verticalItemTitleBorderRadius = token.vertical.item.title["border-radius"];
const verticalItemTitleBackgroundColorHover = token.vertical.item.title["background-color-hover"];
const verticalItemTitleBackgroundColorActive = token.vertical.item.title["background-color-active"];
const verticalItemTitleBackgroundColorSelect = token.vertical.item.title["background-color-select"];
const verticalItemTitleHeight = token.vertical.item.title.height;
const verticalItemFontSize = token.vertical.item.title["font-size"];
const verticalItemInlineIndent = token.vertical.item["inline-indent"];
const verticalItemChildrenBackgroundColor = token.vertical.item.children["background-color"];
const verticalItemChildrenPadding = token.vertical.item.children.padding;


const itemGroupTitleColor = token.vertical["item-group"].title.color;
const itemGroupTitleFontSize = token.vertical["item-group"].title["font-size"];
const itemGroupTitleHeight = token.vertical["item-group"].title.height;


const itemTitleStyle = css`
    display: flex;
    align-items: center;
    width: ${verticalItemTitleWidth};
    padding-inline-start: ${verticalItemTitlePaddingInlineStart};
    padding-inline-end: ${verticalItemTitlePaddingInlineEnd};
    margin-top: ${verticalItemTitleMarginTop};
    margin-bottom: ${verticalItemTitleMarginBottom};
    box-sizing: border-box;
`


const itemTitleBaseStyle = css`
    height: ${verticalItemTitleHeight};
    font-size: ${verticalItemFontSize};
    border-radius: ${verticalItemTitleBorderRadius};
    &:hover {
        background-color: ${verticalItemTitleBackgroundColorHover};
    }

    &:active {
        background-color: ${verticalItemTitleBackgroundColorActive};
    }
`

const itemStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    cursor: pointer;
    user-select: none;
`

const itemGroupTitleStyle = css`
    cursor: default;
    height: ${itemGroupTitleHeight};
    font-size: ${itemGroupTitleFontSize};
    color: ${itemGroupTitleColor};
`

const itemSelectStyle = css`
    background-color: ${verticalItemTitleBackgroundColorSelect};
`

const ulStyle = css`
    list-style-type: none;
    width: 100%;
    padding: 0px;
    margin: 0px;
`

const ulChildrenStyle = css`
    overflow: hidden;
    padding: ${verticalItemChildrenPadding};
    box-sizing: border-box;
    height: auto;
    background-color: ${verticalItemChildrenBackgroundColor};
`

const ulChildrenItemGroupStyle = css`
    overflow: hidden;
`

const stateIconStyle = css`
    font-size: 1rem; 
`

const menuItemIcon = css`
    margin-right: 8px;
`

interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}

const VerticalMenu: FC<VerticalMenuProps> = ({
    className,
    openKeys,
    selectedKeys = [],
    items = [],
    onSelectItem,
    onOpenChange,
    onClick,
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

    const renderChildrenStateIcon = (item: Item, children: ReactNode[]) => {
        if (children.length > 0 && openKeys?.includes(item.key) !== true) {
            return (
                <i
                    className={cx(stateIconStyle, iconArrayBase, iconArrayDown)}
                >
                </i>
            )
        } else if (children.length > 0 && openKeys?.includes(item.key) === true) {
            return (
                <i
                    className={cx(stateIconStyle, iconArrayBase, iconArrayUp)}
                >
                </i>
            )
        } else {
            return null;
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
                        paddingLeft: `calc(${depth} * ${verticalItemInlineIndent})`
                    }}
                    onClick={(e) => {
                        selectItemFunction(item);
                        onClick?.({
                            event: e,
                            item
                        });
                    }}
                >

                    {
                        item.icon ? (
                            <span
                                className={menuItemIcon}
                            >
                                {item.icon}
                            </span>
                        ) : null
                    }
                    <span
                        className={css`
                            flex: 1;
                            font-size: inherit;
                        `}
                    >
                        {item.title}
                    </span>
                    <AnimatePresence initial={false}>
                        {renderChildrenStateIcon(item, children)}
                    </AnimatePresence>
                </div>
                <AnimatePresence initial={false}>
                    {
                        openKeys?.includes(item.key) ?
                        (
                            <motion.ul
                                className={cx(ulStyle, ulChildrenStyle)}
                                animate="open"
                                initial="collapsed"
                                exit="collapsed"
                                variants={{
                                    open: { height: "auto" },
                                    collapsed: { height: 0 }
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
                        paddingLeft: `calc(${depth} * ${verticalItemInlineIndent} * 0.7)`
                    }}
                    onClick={() => {
                        selectItemFunction(item);
                    }}
                >
                    {
                        item.icon ? (
                            <span
                                className={menuItemIcon}
                            >
                                {item.icon}
                            </span>
                        ) : null
                    }
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
                return renderItem(item, renderMenu(item.children ?? [],depth + 1), depth);
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
