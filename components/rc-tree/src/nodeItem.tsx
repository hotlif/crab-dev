import { useLocale, type ConfigSize } from '@crab-dev/rc-config-provider';
import LineEdit from '@crab-dev/rc-line-edit';
import { useRef, useEffect, useLayoutEffect, useId, useState } from "react";
import type { MouseEvent, FC, HTMLAttributes, ReactNode, Key, SyntheticEvent, RefObject } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { cx } from "@crab-dev/css";
import Checkbox from "@crab-dev/rc-checkbox";
import { NodeEditStateType, NodeType, OverStateEnum } from "./type.js";
import type { Node, OverState } from "./type.js";
import { getTreeNodeDepth } from "./util.js";
import { SpinIndicator } from '@crab-dev/rc-spin';
import { ChevronRight, GripVertical } from "./icon.js";
import token from "./token.js";
import { expandIconStyle, loadingIconStyle, fileIconPlaceholderStyle, nodeItemBase, dragUpwardStyle, dragDownStyle, dragInsideStyle, dragBadgeBaseStyle, dragBadgeIndicatorStyle, dragBadgeInsideStyle, indentLineSpanStyle, nodeIconStyle, dragHandleStyle, titleSpanStyle, editInputStyle, editLabelStyle } from "./nodeItem.styles.js";
export interface NodeItemProps extends HTMLAttributes<HTMLDivElement> {
    node: Node
    overState: OverState | null
    expanded: boolean
    loading: boolean
    showLine?: boolean
    selectedKeys?: Key[]
    size?: ConfigSize;
    /** 是否显示复选框 */
    checkable?: boolean
    /** 节点是否被选中 */
    checked?: boolean
    /** 节点是否处于半选状态 */
    indeterminate?: boolean
    /** 复选框 change 回调 */
    onCheck?: (checked: boolean, event?: SyntheticEvent<HTMLElement>) => void
    /** 是否允许点击标题行（非 chevron 图标）时同时触发展开/折叠，默认 true */
    expandOnTitleClick?: boolean
    onExpanded?: (param: {
        node: Node
        event?: SyntheticEvent<HTMLElement>
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
    /** 库内：实际 Tree 键盘容器，不改变应用的选择状态。 */
    keyboardFocusRef?: RefObject<HTMLDivElement | null>
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

const NodeItem: FC<NodeItemProps> = ({
    className,
    node,
    loading,
    style = {},
    expanded = false,
    selectedKeys,
    size,
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
    keyboardFocusRef,
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
    // Consume ownership in this attempt's first React commit, including a
    // controlled rejection that does not cause the parent to render.
    const [editEndAttempt, setEditEndAttempt] = useState<symbol | null>(null);
    // 可变实例状态：只跨同一次键盘提交的 React commit 保存焦点所有权。
    const editFocusRef = useRef<{
        attempt: symbol;
        input: HTMLInputElement;
        row: HTMLDivElement;
        tree: HTMLDivElement;
        nodeId: Node['id'];
        moved: boolean;
        cleanup: () => void;
    } | null>(null);
    const editLabelId = useId();
    const { messages } = useLocale();
    const isEditing = node.editState === NodeEditStateType.UPDATE;

    useLayoutEffect(() => {
        const pending = editFocusRef.current;
        if (!pending || pending.attempt !== editEndAttempt) return;
        editFocusRef.current = null;
        pending.cleanup();
        const document = pending.input.ownerDocument;
        if (!isEditing && !renderEditInput && pending.nodeId === node.id
            && divRef.current === pending.row && keyboardFocusRef?.current === pending.tree
            && pending.row.isConnected && pending.tree.contains(pending.row)
            && !pending.input.isConnected && !pending.moved
            && (document.activeElement === document.body || document.activeElement === null)) {
            pending.tree.focus({ preventScroll: true });
        }
    });
    useLayoutEffect(() => () => {
        editFocusRef.current?.cleanup();
        editFocusRef.current = null;
    }, []);

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

    const finishKeyboardEdit = (input: HTMLInputElement, cancelled: boolean) => {
        const row = divRef.current;
        const tree = keyboardFocusRef?.current;
        const document = input.ownerDocument;
        editFocusRef.current?.cleanup();
        editFocusRef.current = null;
        if (row && tree && tree.contains(row) && document.activeElement === input) {
            const pending = { attempt: Symbol('tree-edit-end'), input, row, tree, nodeId: node.id, moved: false, cleanup: () => {
                document.removeEventListener('focusin', onFocus);
            } };
            const onFocus = (event: Event) => { if (event.target !== input) pending.moved = true; };
            document.addEventListener('focusin', onFocus);
            editFocusRef.current = pending;
            setEditEndAttempt(pending.attempt);
        }
        // A new explicit key may retry a controlled editor that stayed open.
        editCommittedRef.current = false;
        const request = editFocusRef.current;
        commitEdit(cancelled ? '' : input.value, cancelled);
        // A callback may explicitly blur the still-mounted editor. Respect
        // that synchronous choice. Native removal can also dispatch blur while
        // isConnected is still true, so a blur listener cannot own this guard.
        if (request && editFocusRef.current === request && input.isConnected
            && document.activeElement !== input) {
            request.moved = true;
        }
    };

    const renderIcon = () => {
        if (loading) {
            return (
                <span className={loadingIconStyle} data-loading-indicator="">
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
        styles.paddingInlineStart = `calc(${depth} * ${token.indent.width})`;
    }

    return (
        <div
            ref={(ref) => {
                setNodeRef(ref);
                divRef.current = ref;
            }}
            className={cx.call(undefined, nodeItemBase, getDragStyle(), className)}
            {...restProps}
            {...attributes}
            role="treeitem"
            tabIndex={-1}
            aria-disabled={node.disabled === true}
            aria-selected={selectedKeys?.includes(node.id) ?? false}
            aria-expanded={node.type === NodeType.FOLDER ? expanded : undefined}
            aria-level={depth + 1}
            aria-describedby={draggable ? attributes['aria-describedby'] : undefined}
            data-selected={selectedKeys?.includes(node.id)}
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
                        aria-label={messages.tree.selectNode}
                        size={size}
                        checked={Boolean(checked)}
                        indeterminate={indeterminate}
                        disabled={node.disabled}
                        onCheckedChange={(c, details) => {
                            onCheck?.(c, details.event);
                        }}
                    />
                </span>
            )}
            {node.icon != null && (
                <span data-node-icon="" className={nodeIconStyle}>
                    {node.icon}
                </span>
            )}
            {overState?.id === node.id && overState.state != null && (() => {
                const isInside = overState.state === OverStateEnum.INSIDE;
                const label = isInside
                    ? `→ ${dragBadgeLabels?.inside ?? messages.tree.dragInside}`
                    : overState.state === OverStateEnum.UPWARD
                        ? `↑ ${dragBadgeLabels?.above ?? messages.tree.dragAbove}`
                        : `↓ ${dragBadgeLabels?.below ?? messages.tree.dragBelow}`;
                return (
                    <span className={cx.call(undefined, dragBadgeBaseStyle, isInside ? dragBadgeInsideStyle : dragBadgeIndicatorStyle)}>
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
                        <>
                            <span id={editLabelId} className={editLabelStyle}>{node.title}</span>
                            <LineEdit
                                ref={editInputRef}
                                size={size}
                                bordered={false}
                                className={editInputStyle}
                                aria-labelledby={editLabelId}
                                defaultValue={typeof node.title === "string" ? node.title : ""}
                                onValueChange={() => { editCommittedRef.current = false; }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    // Text editing keys must not navigate or deselect the tree.
                                    e.stopPropagation();
                                    // IME confirmation/cancellation belongs to composition,
                                    // not to the editor or the tree's bubbled navigation keys.
                                    if (e.nativeEvent.isComposing || e.keyCode === 229) {
                                        return;
                                    }
                                    if (e.key === "Enter" || e.key === "Escape") {
                                        e.preventDefault();
                                        finishKeyboardEdit(e.currentTarget, e.key === "Escape");
                                    }
                                }}
                                onBlur={(e) => {
                                    commitEdit(e.target.value, false);
                                }}
                            />
                        </>
                    )
            ) : (
                <span className={titleSpanStyle} data-node-title="">
                    {node.title}
                </span>
            )}
        </div>
    );
};

export default NodeItem;
