import { type FC, type ReactNode } from "react";
import { css } from "@linaria/core";

import { type MenuProps } from "./menu";
import { ItemType, type Item } from "./type";

interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}

const itemTitleStyle = css`
`

const VerticalMenu: FC<VerticalMenuProps> = ({
    selectedKeys,
    items = [],
    ...props
}) => {

    const renderMenu = (items: Item[]): ReactNode[] => {
        return items.map(item => {

            if (item.type === ItemType.ItemGroup && item.children && item.children.length > 0) {
                return renderMenu(item.children)
            } else if (item.type === ItemType.ItemGroup && (item.children == null || item.children?.length == 0)) {

            } else if (item.type === ItemType.Item && item.children && item.children.length > 0) {
                return (
                    <li
                        key={item.key}
                    >
                        <span
                            className={itemTitleStyle}
                        >
                            {item.title}
                        </span>
                        <ul>
                            {renderMenu(item.children)}
                        </ul>
                    </li>
                )
            } else {
                return (
                    <li
                        key={item.key}
                    >
                        <span
                            className={itemTitleStyle}
                        >
                            {item.title}
                        </span>
                    </li>
                )
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
