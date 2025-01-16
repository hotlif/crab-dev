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
    spin,
} from "@crab/styleify";
import { NodeType, type Node } from "./type";
import { CaretDownFill, CaretRightFill, Draggable, Loading } from "./icon";
import {
    TreeNodeIconHoverBgColor,
    TreeNodeTitleHoverBgColor
} from "./token";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    expanded: boolean
    loading: boolean
    selectd: boolean
    onExpanded?: (param: {
        node: Node,
        event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
    }) => void
    onTitleClick?: (event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => void
}

const cssIconStyle = `
    ${display("flex")}
    ${fontSize("xs")}
    ${alignItems("center")}
    ${padding("px-1.5")}
    ${height("full")}
`

const expandedAndCloseIcon = css`
    ${cursor("pointer")}
    ${cssIconStyle}
    &:hover {
       ${TreeNodeIconHoverBgColor}
    }
`;

const NodeItem: FC<NodeItemProps> = ({
    className,
    node,
    selectd,
    loading,
    draggable,
    style = {},
    expanded = false,
    onTitleClick,
    onExpanded,
    ...restProps
}) => {
    const { attributes, listeners, setNodeRef } = useSortable({ id: node.id });
    const renderExpandedAndCloseIcon = () => {
        if (loading === true) {
            return (
                <span
                    className={css`
                        animation: spin 1s linear infinite;
                        ${cssIconStyle}
                        ${spin}
                    `}
                >
                    <Loading />
                </span>
            )
        } else if (node.type === NodeType.FOLDER && expanded === false ) {
            return (
                <span
                    className={expandedAndCloseIcon}
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
                    className={expandedAndCloseIcon}
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
                    <Draggable />
                </span>
            ): null }
            {renderExpandedAndCloseIcon()}
            <span
                className={css`
                    ${cursor("pointer")}
                    ${padding("px-2")}
                    &:hover {
                        ${TreeNodeTitleHoverBgColor}
                    }
                    &[data-node-item-selectd="true"] {
                        background-color: #e6f4ff;
                    }
                `}
                data-node-item-selectd={selectd}
                onClick={(e) => {
                    onTitleClick?.(e)
                }}
            >
                {node.title}
            </span>
        </div>
    )
}

export default NodeItem;
