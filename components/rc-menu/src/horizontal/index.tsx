import { type ReactNode, type FC } from "react";
import { css, cx } from "@linaria/core";

import { type MenuProps } from "../menu";
import { ItemType, type Item } from "../type";
import ItemGroup from "./itemGroup";
import ItemNormal from "./itemNormal";

const horizontalMenuRoot = css`
    display: flex;
    flex-direction: row;
    list-style-type: none;
    line-height: 46px;
    border-bottom: 1px solid rgba(5,5,5,0.06);
    box-sizing: border-box;
`

interface HorizontalMenuProps extends Omit<MenuProps, "mode"> {
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
    className,
    openKeys,
    selectedKeys = [],
    items = [],
    onSelectItem,
    onOpenChange,
    onClick,
    ...props
}) => {

    const renderItem = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <ItemNormal
                key={item.key}
                item={item}
                depth={depth}
            >
                {children}
            </ItemNormal>
        );
    }

    const renderItemGroup = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <ItemGroup
                key={item.key}
                item={item}
                depth={depth}
            >
                {children}
            </ItemGroup>
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
            className={cx(className, horizontalMenuRoot)}
            {...props}
        >
            {renderMenu(items, 1)}
        </ul>
    )
}

export default HorizontalMenu;
