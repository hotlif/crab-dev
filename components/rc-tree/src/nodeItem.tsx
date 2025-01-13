import { type MouseEvent, type FC, type HTMLAttributes } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { css, cx } from "@linaria/core";
import {
    fontSize,
    display,
    alignItems,
    cursor,
    height,
    padding,
    margin
} from "@crab/styleify";
import { NodeType, type Node } from "./type";
import { CaretDownFill, CaretRightFill } from "./icon";
import {
    TreeNodeIconHoverBgColor,
    TreeNodeTitleHoverBgColor
} from "./token";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    expanded: boolean
    loading: boolean
    onExpanded?: (param: {
        node: Node,
        event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
    }) => void
}

const expandedAndCloseIconIcon = css`
    ${cursor("pointer")}
    ${display("flex")}
    ${fontSize("xs")}
    ${alignItems("center")}
    ${padding("px-1.5")}
    ${height("full")}
    &:hover {
       ${TreeNodeIconHoverBgColor}
    }
`;

const NodeItem: FC<NodeItemProps> = ({
    className,
    node,
    draggable,
    style = {},
    expanded = false,
    onExpanded,
    ...restProps
}) => {
    const { attributes, listeners, setNodeRef } = useSortable({ id: node.id });
    const renderExpandedAndCloseIcon = () => {
        if (node.type === NodeType.FOLDER && expanded === false ) {
            return (
                <span
                    className={expandedAndCloseIconIcon}
                    onClick={(event) => {
                        onExpanded?.({
                            node,
                            event,
                        })
                    }}
                >
                    <CaretRightFill />
                </span>
            )
        } else if (node.type === NodeType.FOLDER && expanded === true) {
            return (
                <span
                    className={expandedAndCloseIconIcon}
                    onClick={(event) => {
                        onExpanded?.({
                            node,
                            event,
                        })
                    }}
                >
                    <CaretDownFill />
                </span>
            )
        } else {
            return null;
        }
    }

    return (
        <div
            ref={setNodeRef}
            className={cx(css`
                ${fontSize("sm")}
                ${display("flex")}
                ${alignItems("center")}
                user-select: none;
            `, className)}
            {...restProps}
            {...attributes}
            style={{
                ...style,
                height: node.height,
            }}
        >
            {draggable ? (
                <span
                    className={css`
                        ${cursor("grab")}
                        text-align: center;
                        color: rgba(0, 0, 0, 0.25);
                    `}
                    {...listeners}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                        />
                    </svg>
                </span>
            ): null }
            {renderExpandedAndCloseIcon()}
            <span
                className={css`
                    ${cursor("pointer")}
                    ${padding("px-1.5")}
                    &:hover {
                        ${TreeNodeTitleHoverBgColor}
                    }
                `}
            >
                {node.title}
            </span>
        </div>
    )
}

export default NodeItem;
