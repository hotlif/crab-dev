import { useLocale, type ConfigSize } from '@crab-dev/rc-config-provider';
import LineEdit, { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import { useRef, useEffect, useLayoutEffect, useId, useState } from "react";
import type { MouseEvent, FC, HTMLAttributes, ReactNode, Key, SyntheticEvent, RefObject } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { css, cx } from "@crab-dev/css";
import Checkbox, { TokenVars as checkboxVars } from "@crab-dev/rc-checkbox";
import { NodeEditStateType, NodeType, OverStateEnum } from "./type.js";
import type { Node, OverState } from "./type.js";
import { getTreeNodeDepth } from "./util.js";
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';
import { ChevronRight, GripVertical } from "./icon.js";
import token from "./token.js";

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

const expandIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: ${token.root["border-radius"]};
    color: ${token.node.expand.icon.color};
    cursor: pointer;
    flex-shrink: 0;
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
    transition: background-color ${token.root.transition};
    @media (pointer: coarse) { min-width: ${token.node.touch['min-width']}; min-height: ${token.node.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { &, > svg { transition: none; } }

    > svg {
        display: block;
        transition: transform ${token.motion.arrow.transition};
    }

    &:dir(rtl) > svg {
        transform: rotate(180deg);
    }

    &[data-expanded="true"] > svg {
        transform: rotate(90deg);
    }

    &:hover {
        background-color: ${token.node.icon["background-color-hover"]};
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
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
    color: ${token.node.icon["color-loading"]};
    --rc-spin-size: 1em;
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

const fileIconPlaceholderStyle = css`
    width: 20px;
    flex-shrink: 0;
    margin-inline-start: calc(2 * var(--styleify-margin-space, 0.25rem));
`;

const nodeItemBase = css`
    ${checkboxVars['control.target.width']}: ${token.node.selection.width};
    ${checkboxVars['state-layer.width']}: ${token.node.selection.width};
    ${checkboxVars['root.touch.min-width']}: ${token.node.selection.width};
    ${checkboxVars['root.touch.min-height']}: ${token.node.selection.width};
    @media (pointer: coarse) {
        ${checkboxVars['control.target.width']}: ${token.node.selection.touch.width};
        ${checkboxVars['state-layer.width']}: ${token.node.selection.touch.width};
        ${checkboxVars['root.touch.min-width']}: ${token.node.selection.touch.width};
        ${checkboxVars['root.touch.min-height']}: ${token.node.selection.touch.width};
    }
    position: relative;
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    border-radius: ${token.root["border-radius"]};
    user-select: none;
    padding-inline-end: 0.5rem;
    height: 100%;
    transition: background-color ${token.root.transition}, color ${token.root.transition}, opacity ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { &, [data-grip] { transition: none; } }
    @media (forced-colors: active) {
        &[data-selected="true"] { outline: ${token.root['outline-width-focus']} solid Highlight; outline-offset: -2px; }
        &[data-disabled="true"] { color: GrayText; opacity: 1; }
    }

    &:hover:not([data-disabled="true"]) {
        background-color: ${token.node["background-color-hover"]};
    }

    &[data-selected="true"]:not([data-disabled="true"]) {
        background-color: ${token.node["background-color-selected"]};
        color: ${token.node['color-selected']};
        @media (forced-colors: active) {
            forced-color-adjust: none;
            color: HighlightText;
            background-color: Highlight;
        }
        [data-node-title] { text-decoration: ${token.node.selection['text-decoration']}; }
        [data-expanded], [data-loading-indicator] { color: inherit; }
        /* Pair the library-owned icon container with the selected row. Only
           color inherits: caller-supplied SVG colors, fill and stroke survive. */
        > [data-node-icon] { color: inherit; }
    }

    &[data-disabled="true"] {
        color: ${token.node["color-disabled"]};
        background-color: ${token.node["background-color-disabled"]};
        cursor: not-allowed;
        opacity: ${token.node['opacity-disabled']};
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
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator['background-color']} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator['background-color']}, ${token.node.drag.indicator['background-color']})
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
            radial-gradient(circle 3px at 3px 50%, ${token.node.drag.indicator['background-color']} 100%, transparent 100%)
            no-repeat left center,
            linear-gradient(${token.node.drag.indicator['background-color']}, ${token.node.drag.indicator['background-color']})
            8px center / calc(100% - 8px) 2px no-repeat;
        pointer-events: none;
    }
`;

const dragInsideStyle = css`
    background-color: ${token.node.drag.inside["background-color"]} !important;
    box-shadow: inset 0 0 0 2px ${token.node.drag.inside["border-color"]};
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
    color: ${token.node.drag.badge.color};
    white-space: nowrap;
    pointer-events: none;
`;

const dragBadgeIndicatorStyle = css`
    background-color: ${token.node.drag.badge["background-color"]};
`;

const dragBadgeInsideStyle = css`
    background-color: ${token.node.drag.badge["background-color"]};
`;

const indentLineSpanStyle = css`
    position: relative;
    padding-inline-start: 16px;
    width: ${token.indent.width};
    height: 100%;
    text-align: center;
    flex: 0 0 auto;

    &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        border-inline-end: 1px solid ${token.node["indent-line"]["border-color"]};
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
    margin-inline-start: 0.25rem;
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
    transition: opacity ${token.root.transition};
    @media (pointer: coarse) { min-width: ${token.node.touch['min-width']}; opacity: 1; }

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
    border-radius: ${token.root["border-radius"]};
`;

const editInputStyle = css`
    /* Embedded editing follows the actual Tree row, including explicit row
       heights. The shared input supplies keyboard/value behavior; it must not
       reintroduce a standalone field minimum or a second native border. */
    ${lineEditVars['root.touch.min-height']}: 0px;
    /* The row supplies the paired L3 foreground, including selected Apple
       accent rows; an inset accent ring must not blend into the row. */
    ${lineEditVars['root.outline-color-focus']}: currentColor;
    ${lineEditVars['root.outline-width-focus']}: ${token.root['outline-width-focus']};
    ${lineEditVars['root.outline-offset-focus']}: calc(-1 * ${token.root['outline-width-focus']});
    flex: 1 1 auto;
    min-width: 0;
    font-size: inherit;
    line-height: inherit;
    /* bordered=false owns its defaults. Scope the host geometry/foreground;
       keep the focus/forced-color rules and transparent skin. */
    && {
        height: 100%;
        max-height: 100%;
        padding-inline: 0.375rem;
        border-radius: ${token.root["border-radius"]};
        color: inherit;
    }
`;

// Keep the original non-interactive title available to the naming algorithm.
// A display:none label would include even aria-hidden decorative descendants.
const editLabelStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;

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
