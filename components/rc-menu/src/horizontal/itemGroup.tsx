import { cx } from "@crab-dev/css";
import { type FC, type ReactNode } from "react";

import { type Item } from "../type.js";
import groupStyle from "./styles/itemGroup.styles.js";
import token from "../token.js";

const indentBase = token.horizontal["group-item"]["indent-base"];
const indentScale = token.horizontal["group-item"]["indent-scale"];

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
            className={cx(groupStyle.groupItem.container)}
        >
            <div
                className={cx(groupStyle.groupItem.header)}
                style={{
                    paddingLeft: `calc(${depth} * ${indentBase} * ${indentScale})`
                }}
            >
                {
                    item.icon ?  (
                        <span
                            className={groupStyle.groupItem.icon}
                        >
                            {item.icon}
                        </span>
                    ) : null
                }
                <span
                    className={groupStyle.groupItem.title}
                >
                    {item.title}
                </span>
            </div>
            <ul
                className={groupStyle.childrenList.container}
            >
                {children}
            </ul>
        </li>
    )
}


export default GroupItem;