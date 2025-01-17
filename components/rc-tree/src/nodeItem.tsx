import { type MouseEvent, type FC, type HTMLAttributes, CSSProperties } from "react";
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
    TreeNodeTitleHoverBgColor,
    TreeNodeIconLoadingColor,
    TreeNodeTitleBorderRadius,
    TreeNodeTitleSelectBgColor,
    TreeNodeDraggableIconColor,
    TreeNodeIconBorderRadius,
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
    onTitleContextMenu?: HTMLAttributes<HTMLDivElement>["onContextMenu"]
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
    ${TreeNodeIconBorderRadius}
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
    onTitleContextMenu,
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
                       ${TreeNodeIconLoadingColor}
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
                        ${TreeNodeDraggableIconColor}
                        
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
                    ${TreeNodeTitleBorderRadius}
                    &:hover {
                        ${TreeNodeTitleHoverBgColor}
                    }
                    &[data-node-item-selectd="true"] {
                        ${TreeNodeTitleSelectBgColor}
                    }
                `}
                data-node-item-selectd={selectd}
                onClick={(e) => {
                    onTitleClick?.(e)
                }}
                onContextMenu={onTitleContextMenu}
            >
                {node.title}
            </span>
        </div>
    )
}

export default NodeItem;
