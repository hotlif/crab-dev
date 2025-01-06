import { type FC, type ReactNode } from "react";
import { css } from "@linaria/core";
import {
    padding
} from "@crab/styleify";

import { type MenuProps } from "./menu";
import { ItemType, type Item } from "./type";

interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}

const itemTitleStyle = css`
    ${padding("ps-4")}
    ${padding("pe-4")}
`

const VerticalMenu: FC<VerticalMenuProps> = ({
    selectedKeys,
    items = [],
    ...props
}) => {

    const renderItem = (item: Item) => {
        return (
            <li>
                <span className={itemTitleStyle}>
                    {item.title}
                </span>
            </li>
        );
    }

    const renderItemGroup = (item: Item) => {
        return (
            <li>
                <span className={itemTitleStyle}>
                    {item.title}
                </span>
            </li>
        );
    }

    const renderMenu = (items: Item[]): ReactNode[] => {
        return items.map(item => {
            if (item.type === ItemType.ItemGroup ) {
                return renderItemGroup(item);
            } else if (item.type === ItemType.Item) {
                return renderItem(item);
            } else {
                throw new Error("The parameter `type` is incorrect, please check.")
            }
        })
    }
    
    return (
        <ul
            {...props}
        >
            {renderMenu(items)}
        </ul>
    )
}

export default VerticalMenu;
