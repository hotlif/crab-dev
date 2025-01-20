import { type MouseEvent, type FC, type HTMLAttributes, useRef, type ReactNode, CSSProperties } from "react";
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
import { NodeType, OverStateEnum, type Node } from "./type";
import { getTreeNodeDepth } from "./util";
import { CaretDownFill, CaretRightFill, Draggable, Loading } from "./icon";
import {
    TreeNodeIconHoverBgColor,
    TreeNodeTitleHoverBgColor,
    TreeNodeIconLoadingColor,
    TreeNodeTitleSelectBgColor,
    TreeNodeDraggableIconColor,
    TreeNodeDraggableBorder,
    TreeNodeBorderRadius,
    TreeIndentSize,
} from "./token";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    overState?: OverStateEnum,
    expanded: boolean
    loading: boolean
    showLine?: boolean
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
    border-radius: inherit;
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
    overState,
    showLine,
    onTitleClick,
    onExpanded,
    onTitleContextMenu,
    ...restProps
}) => {
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
    } = useSortable({ id: node.id });
    const divRef = useRef<HTMLDivElement>(null);

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
                    onMouseEnter={(event) => {
                        if (overState) {
                            onExpanded?.({
                                node,
                                event,
                            })
                        }
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

    const generateDraggingStyle = () => {
        if (isDragging) {
            return css`
                pointer-events: none;
                ${TreeNodeDraggableBorder}
            `
        }
        return null;
    }

    const generateDraggingOverStyle = () => {
        if (overState === OverStateEnum.UPWARD) {
            return css`
                border-top: 1px dashed #1677ff;
            `;
        } else if (overState === OverStateEnum.DOWN) {
            return css`
                border-bottom: 1px dashed #1677ff;
            `;
        } else if (overState === OverStateEnum.INSIDE) {
            return css`
                border-bottom: 1px dashed red;
            `
        } else {
            return null;
        }
    }

    const classNames = cx(
        css`
            ${fontSize("sm")}
            ${display("flex")}
            ${alignItems("center")}
            ${TreeNodeBorderRadius}
            user-select: none;
        `,
        generateDraggingOverStyle(),
        generateDraggingStyle(),
        className
    );

    const depth = getTreeNodeDepth(node);

    const renderIndentLine = () => {
        const depth = getTreeNodeDepth(node);
        const indents: ReactNode[] = []
        for (let i = 0; i < depth; i += 1) {
            const styles: CSSProperties = {};
            indents.push(
                <span
                    style={{
                        paddingLeft: 16
                    }}
                    className={css`
                        position: relative;
                        width: ${TreeIndentSize};
                        height: 100%;
                        text-align: center;
                        &::before {
                            display: inline-block;
                            width: 1px;
                            height: 100%;
                            border-inline-end: 1px solid #d9d9d9;
                            content: "";
                        }
                    `}
                />
            )
        }
        return indents;
    }

    const styles = {
        ...style,
        height: node.height,
    }

    if (showLine !== true) {
        styles.paddingLeft = `calc(${depth} * ${TreeIndentSize})`;
    }

    return (
        <div
            ref={(ref) => {
                setNodeRef(ref);
                divRef.current = ref;
            }}
            className={classNames}
            {...restProps}
            {...attributes}
            style={styles}
        >
            {showLine ? renderIndentLine() : null}
            {draggable ? (
                <span
                    className={css`
                        ${cursor("grab")}
                        text-align: center;
                        color: ${TreeNodeDraggableIconColor};
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
                    border-radius: inherit;
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
