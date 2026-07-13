import { type MouseEvent, type FC, type HTMLAttributes, useRef, useEffect, type ReactNode, Key } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { css, cx } from "@linaria/core";
import Checkbox from "@crab-dev/rc-checkbox";
import { NodeEditStateType, NodeType, OverStateEnum, type Node, type OverState } from "./type.js";
import { getTreeNodeDepth } from "./util.js";
import { SpinIndicator, vars as spinVars } from "@crab-dev/rc-spin";
import { ChevronRight, GripVertical } from "./icon.js";
import token from "./token.js";

export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    overState: OverState | null
    expanded: boolean
    loading: boolean
    showLine?: boolean
    selectKeys?: Key[]
    /** 是否显示复选框 */
    checkable?: boolean
    /** 节点是否被选中 */
    checked?: boolean
    /** 节点是否处于半选状态 */
    indeterminate?: boolean
    /** 复选框 change 回调 */
    onCheck?: (checked: boolean) => void
    /** 是否允许点击标题行（非 chevron 图标）时同时触发展开/折叠，默认 true */
    expandOnTitleClick?: boolean
    onExpanded?: (param: {
        node: Node
        event?: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
    }) => void
    onTitleClick?: (event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => void
    onTitleContextMenu?: HTMLAttributes<HTMLDivElement>["onContextMenu"]
    /**
     * 节点 inline 编辑完成时触发。
     * @param node 被编辑的节点
     * @param newTitle 新标题（cancelled=true 时忽略此值）
     * @param cancelled 是否取消编辑（Escape）
     */
    onEditEnd?: (node: Node, newTitle: string, cancelled: boolean) => void
    /**
     * 自定义编辑器渲染函数。提供时替换默认 `<input>`。
     * 消费方负责聚焦管理，调用 `onCommit(value)` 提交，`onCancel()` 取消。
     */
    renderEditInput?: (param: {
        node: Node
        defaultValue: string
        onCommit: (value: string) => void
        onCancel: () => void
    }) => ReactNode
    /** 拖拽位置 badge 的文字，用于国际化覆盖。 */
    dragBadgeLabels?: {
        above?: string
        below?: string
        inside?: string
    }
}

const expandIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: ${token.border.radius};
    color: ${token.node.expand.icon.color};
    cursor: pointer;
    flex-shrink: 0;
    margin-left: calc(2 * var(--styleify-margin-space, 0.25rem));
    transition: background-color 0.1s ease;

    > svg {
        display: block;
        transition: transform 0.15s ease;
    }

    &[data-expanded="true"] > svg {
        transform: rotate(90deg);
    }

    &:hover {
        background-color: ${token.node.icon.hover.background.color};
    }
`;

// 复用 rc-spin 的纯视觉环：旋转与 reduced-motion 降级由其统一承担
// （原先此处的动画在减弱动效偏好下照转不误）。
const loadingIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-left: calc(2 * var(--styleify-margin-space, 0.25rem));
    color: ${token.node.icon.loading.color};
    --rc-spin-size: 1em;
    ${spinVars['ring.indicator-color']}: currentColor;
    ${spinVars['ring.track-color']}: transparent;
`;

const fileIconPlaceholderStyle = css`
    width: 20px;
    flex-shrink: 0;
    margin-left: calc(2 * var(--styleify-margin-space, 0.25rem));
`;

const nodeItemBase = css`
    position: relative;
    font-size: var(--styleify-font-size-sm, 0.875rem);
    line-height: var(--styleify-line-height-base, 1.5);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    border-radius: ${token.border.radius};
    user-select: none;
    padding-inline-end: 0.5rem;
    height: 100%;
    transition: background-color 0.1s ease, color 0.1s ease, opacity 0.1s ease;

    &:hover:not([data-disabled="true"]) {
        background-color: ${token.node.hover.background.color};
    }

    &[data-selected="true"]:not([data-disabled="true"]) {
        background-color: ${token.node.select.background.color};
        box-shadow: inset ${token.node.select.indicator.width} 0 0 0 ${token.node.select.indicator.color};
    }

    &[data-disabled="true"] {
        color: ${token.node.disabled.color};
        cursor: not-allowed;
        opacity: 0.6;
    }

    &[data-disabled="true"] span {
        cursor: not-allowed;
        pointer-events: none;
    }

    &[data-dragging="true"] {
        opacity: 0.35;
    }

    &:hover:not([data-disabled="true"]) [data-grip] {
        opacity: 0.3;
    }

    &:hover:not([data-disabled="true"]) [data-grip]:hover {
        opacity: 0.8;
    }
`;

/* ::before 画左侧实心圆 + 水平插入线，文字 badge 由 JSX 渲染（支持国际化） */
const dragUpwardStyle = css`
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background:
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator.color} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator.color}, ${token.node.drag.indicator.color})
            8px center / calc(100% - 8px) 2px no-repeat;
        pointer-events: none;
    }
`;

const dragDownStyle = css`
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background:
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator.color} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator.color}, ${token.node.drag.indicator.color})
            8px center / calc(100% - 8px) 2px no-repeat;
        pointer-events: none;
    }
`;

const dragInsideStyle = css`
    background-color: ${token.node.drag.inside.background.color} !important;
    box-shadow: inset 0 0 0 2px ${token.node.drag.inside.border.color};
`;

const dragBadgeBaseStyle = css`
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    line-height: 1;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    color: #fff;
    white-space: nowrap;
    pointer-events: none;
`;

const dragBadgeIndicatorStyle = css`
    background-color: ${token.node.drag.indicator.color};
`;

const dragBadgeInsideStyle = css`
    background-color: ${token.node.drag.inside.border.color};
`;

const indentLineSpanStyle = css`
    position: relative;
    padding-left: 16px;
    width: ${token.indent.size};
    height: 100%;
    text-align: center;
    flex: 0 0 auto;

    &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        border-inline-end: 1px solid ${token.node.indent.line.color};
        content: "";
    }
`;

const nodeIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 0.25rem;
    color: ${token.node.expand.icon.color};
`;

const dragHandleStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 100%;
    cursor: grab;
    color: ${token.node.expand.icon.color};
    opacity: 0;
    transition: opacity 0.2s ease;

    &:active {
        cursor: grabbing;
    }
`;

const titleSpanStyle = css`
    cursor: pointer;
    padding-inline: 0.375rem;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: ${token.border.radius};
`;

const editInputStyle = css`
    flex: 1 1 auto;
    min-width: 0;
    padding-inline: 0.375rem;
    font-size: inherit;
    line-height: inherit;
    border: 1px solid ${token.node.select.indicator.color};
    border-radius: ${token.border.radius};
    background: transparent;
    color: inherit;
    outline: none;
    box-sizing: border-box;
`;

const NodeItem: FC<NodeItemProps> = ({
    className,
    node,
    loading,
    style = {},
    expanded = false,
    selectKeys,
    overState,
    showLine,
    checkable,
    checked,
    indeterminate,
    onCheck,
    expandOnTitleClick = true,
    onTitleClick,
    onExpanded,
    onTitleContextMenu,
    onEditEnd,
    renderEditInput,
    dragBadgeLabels,
    draggable,
    ...restProps
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
        isSorting,
    } = useSortable({ id: node.id, disabled: node.disabled === true || !draggable });

    const divRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const editCommittedRef = useRef(false);
    const isEditing = node.editState === NodeEditStateType.UPDATE;

    useEffect(() => {
        if (isEditing) {
            editCommittedRef.current = false;
            if (!renderEditInput) {
                editInputRef.current?.focus();
                editInputRef.current?.select();
            }
        }
    }, [isEditing]);

    const commitEdit = (newTitle: string, cancelled: boolean) => {
        if (editCommittedRef.current) return;
        editCommittedRef.current = true;
        onEditEnd?.(node, newTitle, cancelled);
    };

    const renderIcon = () => {
        if (loading) {
            return (
                <span className={loadingIconStyle}>
                    <SpinIndicator />
                </span>
            );
        }

        if (node.type === NodeType.FOLDER) {
            return (
                <span
                    className={expandIconStyle}
                    data-expanded={expanded}
                    onPointerUp={(event) => {
                        event.stopPropagation();
                        onExpanded?.({ node, event });
                    }}
                    onMouseEnter={(event) => {
                        if (overState) {
                            onExpanded?.({ node, event });
                        }
                    }}
                >
                    <ChevronRight />
                </span>
            );
        }

        return <span className={fileIconPlaceholderStyle} />;
    };

    const getDragStyle = () => {
        if (overState?.id === node.id) {
            if (overState.state === OverStateEnum.UPWARD) return dragUpwardStyle;
            if (overState.state === OverStateEnum.DOWN) return dragDownStyle;
            if (overState.state === OverStateEnum.INSIDE) return dragInsideStyle;
        }
        return null;
    };

    const depth = getTreeNodeDepth(node);

    const renderIndentLines = (): ReactNode[] => {
        const lines: ReactNode[] = [];
        for (let i = 0; i < depth; i += 1) {
            lines.push(
                <span
                    key={`tree-indent-${node.id}-${i}`}
                    className={indentLineSpanStyle}
                />
            );
        }
        return lines;
    };

    const styles = {
        ...style,
        height: node.height,
    };

    if (showLine !== true) {
        styles.paddingLeft = `calc(${depth} * ${token.indent.size})`;
    }

    return (
        <div
            ref={(ref) => {
                setNodeRef(ref);
                divRef.current = ref;
            }}
            className={cx(nodeItemBase, getDragStyle(), className)}
            {...restProps}
            {...attributes}
            data-selected={selectKeys?.includes(node.id)}
            data-disabled={node.disabled === true}
            data-dragging={isDragging}
            style={styles}
            onPointerUp={(e) => {
                if (e.button === 2) return;
                if (node.disabled === true || isEditing) return;
                if (isSorting) return;
                onTitleClick?.(e);
                if (expandOnTitleClick && node.type === NodeType.FOLDER && !loading) {
                    onExpanded?.({ node, event: e });
                }
            }}
            onContextMenu={node.disabled === true ? undefined : onTitleContextMenu}
        >
            {showLine ? renderIndentLines() : null}
            {draggable && !isEditing && (
                <span
                    data-grip
                    className={dragHandleStyle}
                    {...listeners}
                    onPointerUp={(e) => e.stopPropagation()}
                >
                    <GripVertical />
                </span>
            )}
            {renderIcon()}
            {checkable && (
                <span onPointerUp={(e) => e.stopPropagation()}>
                    <Checkbox
                        aria-label="select node"
                        checked={checked}
                        indeterminate={indeterminate}
                        disabled={node.disabled}
                        onChange={(c) => {
                            onCheck?.(c);
                        }}
                    />
                </span>
            )}
            {node.icon != null && (
                <span className={nodeIconStyle}>
                    {node.icon}
                </span>
            )}
            {overState?.id === node.id && overState.state != null && (() => {
                const isInside = overState.state === OverStateEnum.INSIDE;
                const label = isInside
                    ? `→ ${dragBadgeLabels?.inside ?? '移入'}`
                    : overState.state === OverStateEnum.UPWARD
                        ? `↑ ${dragBadgeLabels?.above ?? '放在上方'}`
                        : `↓ ${dragBadgeLabels?.below ?? '放在下方'}`;
                return (
                    <span className={cx(dragBadgeBaseStyle, isInside ? dragBadgeInsideStyle : dragBadgeIndicatorStyle)}>
                        {label}
                    </span>
                );
            })()}
            {isEditing ? (
                renderEditInput
                    ? renderEditInput({
                        node,
                        defaultValue: typeof node.title === "string" ? node.title : "",
                        onCommit: (value) => commitEdit(value, false),
                        onCancel: () => commitEdit("", true),
                    })
                    : (
                        <input
                            ref={editInputRef}
                            className={editInputStyle}
                            defaultValue={typeof node.title === "string" ? node.title : ""}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    commitEdit((e.target as HTMLInputElement).value, false);
                                    editInputRef.current?.blur();
                                } else if (e.key === "Escape") {
                                    commitEdit("", true);
                                    editInputRef.current?.blur();
                                }
                            }}
                            onBlur={(e) => {
                                commitEdit(e.target.value, false);
                            }}
                        />
                    )
            ) : (
                <span className={titleSpanStyle}>
                    {node.title}
                </span>
            )}
        </div>
    );
};

export default NodeItem;
