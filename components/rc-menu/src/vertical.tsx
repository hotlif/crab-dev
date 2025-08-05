import { type FC, type ReactNode } from "react";
import { css, cx } from "@linaria/core";

import { motion, AnimatePresence } from "motion/react"

import { ChevronDown, ChevronUp } from "./icon";
import { type MenuProps } from "./menu";
import { ItemType, type Item } from "./type";
import Token from "./token/vertical";


interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}


const verticalItemTitleWidth = Token.vertical.item.title.width;
const verticalItemTitleMarginBottom = Token.vertical.item.title.marginBottom;
const verticalItemTitleMarginTop = Token.vertical.item.title.marginTop;
const verticalItemTitlePaddingInlineStart = Token.vertical.item.title.paddingInlineStart;
const verticalItemTitlePaddingInlineEnd = Token.vertical.item.title.paddingInlineEnd;
const verticalItemTitleBorderRadius = Token.vertical.item.title.borderRadius;
const verticalItemTitleBackgroundColorHover = Token.vertical.item.title.backgroundColor.hover;
const verticalItemTitleBackgroundColorActive = Token.vertical.item.title.backgroundColor.active;
const verticalItemTitleBackgroundColorSelect = Token.vertical.item.title.backgroundColor.select;
const verticalItemTitleHeight = Token.vertical.item.title.height;
const verticalItemFontSize = Token.vertical.item.title.fontSize;
const verticalItemInlineIndent = Token.vertical.item.inlineIndent;
const verticalItemChildrenBackgroundColor = Token.vertical.item.children.backgroundColor;
const verticalItemChildrenPadding = Token.vertical.item.children.padding;


const itemGroupTitleColor = Token.vertical.itemGroup.title.color;
const itemGroupTitleFontSize = Token.vertical.itemGroup.title.fontSize;
const itemGroupTitleHeight = Token.vertical.itemGroup.title.height;


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


    const renderChildrenStateIcon = (item: Item, children: ReactNode[]) => {
        if (children.length > 0 && openKeys?.includes(item.key) !== true) {
            return (
                <span
                    className={stateIconStyle}
                >
                    <ChevronDown />
                </span>
            )
        } else if (children.length > 0 && openKeys?.includes(item.key) === true) {
            return (
                <span
                    className={stateIconStyle}
                >
                    <ChevronUp />
                </span>
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
                    onClick={() => {
                        selectItemFunction(item);
                    }}
                >
                    <span
                        className={css`
                            flex: 1;
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
                        paddingLeft: `calc(${depth} * ${verticalItemInlineIndent} * 0.7)`
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
