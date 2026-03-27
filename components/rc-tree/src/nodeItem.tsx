import { type MouseEvent, type FC, type HTMLAttributes, useRef, type ReactNode, Key } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { css, cx} from "@linaria/core";
import { NodeType, OverStateEnum, type Node, type OverState } from "./type.js";
import { getTreeNodeDepth } from "./util.js";
import { CaretDownFill, CaretRightFill, Loading } from "./icon.js";
import token from "./token.js";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    // 节点数据
    node: Node
    // 拖拽状态
    overState: OverState | null,
    // 是否展开
    expanded: boolean
    // 是否加载中
    loading: boolean
    // 是否显示线条
    showLine?: boolean
    // 选中的数据
    selectKeys?: Key[]
    // 展开事件处理函数
    onExpanded?: (param: {
        node: Node,
        event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
    }) => void
    // 标题点击事件处理函数
    onTitleClick?: (event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => void
    // 标题右键菜单事件处理函数
    onTitleContextMenu?: HTMLAttributes<HTMLDivElement>["onContextMenu"]
}

const cssIconStyle = `
    display: flex;
    > * {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
    }
    font-size: var(--styleify-font-size-xs, 0.688rem);
    line-height: var(--styleify-line-height-xs, 1.3);
    align-items: center;
    height: 100%;
`

const expandedAndCloseIcon = css`
    cursor: pointer;
    ${cssIconStyle}
    border-radius: inherit;
    margin-left: calc(2 * var(--styleify-margin-space, 0.25rem));
    &:hover {
       background-color: ${token.node.icon.hover.bg.color};
    }
`;


const NodeItem: FC<NodeItemProps> = ({
    className,
    node,
    loading,
    draggable,
    style = {},
    expanded = false,
    selectKeys,
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
        setNodeRef,
    } = useSortable({ id: node.id });

    const divRef = useRef<HTMLDivElement>(null);

    const renderExpandedAndCloseIcon = () => {
        if (loading === true) {
            return (
                <span
                    className={css`
                        animation: AnimSpinKeyframes 1s linear infinite;
                        ${cssIconStyle}
                        color: ${token.node.icon.loading.color};
                        @keyframes AnimSpinKeyframes {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
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

    const generateDraggingOverStyle = () => {
        if (overState?.id === node.id) {
            if (overState?.state === OverStateEnum.UPWARD) {
                return css`
                    border-top: 1px dashed #1677ff;
                `;
            }
            if (overState?.state === OverStateEnum.DOWN) {
                return css`
                    border-bottom: 1px dashed #1677ff;
                `;
            } 
            if (overState?.state === OverStateEnum.INSIDE) {
                return css`
                    border-bottom: 1px dashed red;
                `
            }
        }
        return null;
    }

    const classNames = cx(
        css`
            font-size: var(--styleify-font-size-base, 1rem);
            line-height: var(--styleify-line-height-base, 1.5);
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            > * {
                flex-grow: 0;
                flex-shrink: 0;
                flex-basis: auto;
            }
            align-items: center;
            white-space: nowrap;
            border-radius: ${token.border.radius};
            user-select: none;
            &:hover {
                background-color: ${token.node.hover.bg.color};
            }
            &[data-node-item-selectd="true"] {
                background-color: ${token.node.select.bg.color};
            }
        `,
        generateDraggingOverStyle(),
        className
    );

    const depth = getTreeNodeDepth(node);

    const renderIndentLine = () => {
        const depth = getTreeNodeDepth(node);
        const indents: ReactNode[] = []
        for (let i = 0; i < depth; i += 1) {
            indents.push(
                <span
                    style={{
                        paddingLeft: 16
                    }}
                    key={`tree-node-line-${node.id}-${i}`}
                    className={css`
                        position: relative;
                        width: ${token.indent.size};
                        height: 100%;
                        text-align: center;
                        flex: 0 0 auto;
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
        styles.paddingLeft = `calc(${depth} * ${token.indent.size})`;
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
            onPointerUp={(e) => {
                onTitleClick?.(e);
            }}
            data-node-item-selectd={selectKeys?.includes(node.id)}
            style={styles}
            onContextMenu={onTitleContextMenu}
        >
            {showLine ? renderIndentLine() : null}
            {renderExpandedAndCloseIcon()}
            <span
                className={css`
                    cursor: pointer;
                    padding-inline: 0.5rem;
                    text-overflow: ellipsis;
                    border-radius: inherit;
                `}
                {...listeners}
            >
                {node.title}
            </span>
        </div>
    )
}

export default NodeItem;
