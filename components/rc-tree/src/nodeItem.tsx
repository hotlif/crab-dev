import { type MouseEvent, type FC, type HTMLAttributes } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { css, cx } from "@linaria/core";
import { fontSize, display, alignItems, cursor, margin } from "@crab/styleify";
import { NodeType, type Node } from "./type";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    expanded: boolean
    onExpanded?: (param: {
        node: Node,
        event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
    }) => void
}

const expandedAndCloseIconIcon = css`
    ${cursor("pointer")}
    ${fontSize("xs")}
    ${margin("mr-1.5")}
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
                        />
                    </svg>
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                        />
                    </svg>
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
                        ${margin("mr-1")}
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
                    ${cursor("default")}    
                `}
            >
                {node.title}
            </span>
        </div>
    )
}

export default NodeItem;
