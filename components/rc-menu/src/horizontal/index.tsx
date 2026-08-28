import { type ReactNode, type FC } from "react";
import { css, cx } from "@crab-dev/css";

import { type MenuProps } from "../menu.js";
import { ItemType, type Item } from "../type.js";
import ItemGroup from "./itemGroup.js";
import ItemNormal from "./itemNormal.js";
import { FloatingTree } from "@floating-ui/react";
import token from "../token.js";

const horizontalMenuRoot = css`
    display: flex;
    position: relative;
    flex-direction: row;
    list-style-type: none;
    border-bottom: 1px solid ${token.horizontal["border-color"]};
    box-sizing: border-box;
`

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HorizontalMenuProps extends Omit<MenuProps, "mode"> {
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
    className,
    openKeys: _openKeys,
    selectedKeys: _selectedKeys = [],
    items = [],
    onSelectItem: _onSelectItem,
    onOpenChange: _onOpenChange,
    onClick: _onClick,
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
        <FloatingTree>
            <ul
                className={cx(className, horizontalMenuRoot)}
                {...props}
            >
                {renderMenu(items, 1)}
            </ul>
        </FloatingTree>
    )
}

export default HorizontalMenu;
