import { css, cx } from "@linaria/core";
import { JSONPath } from "jsonpath-plus";
import token from "./token.js";

const rowEditingCellStyle = css`
    background-color: ${token['row-edit']['row-bg']};
`;

const rowEditActiveCellStyle = css`
    background-color: ${token['row-edit']['cell-bg']};
`;
import type { CellSelectionState, ColumnType, MergeCell, Row, TreeRowMeta } from "./types.js";
import type { CellNavDirection } from "./hooks/useCellEditNav.js";
import { Fragment, type HTMLAttributes, type Key, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMergedCellSize } from "./util.js";
import { ROW_BG_VAR, ROW_BG_TRANSITION } from "./rowBg.js";

const highlightMarkStyle = css`
    background-color: ${token.highlight.bg};
    color: ${token.highlight.color};
    padding: 0;
    border-radius: ${token.highlight['border-radius']};
    font-weight: inherit;
    font-style: normal;
`;

const activeHighlightMarkStyle = css`
    background-color: ${token.highlight['active-bg']};
    color: ${token.highlight['active-color']};
    padding: 0;
    border-radius: ${token.highlight['border-radius']};
    font-weight: inherit;
    font-style: normal;
`;

/**
 * 将文本中匹配 keyword 的部分用高亮 mark 包裹后返回 ReactNode。
 * 大小写不敏感；keyword 为空时原样返回。
 * activeOccurrenceIndex：此字符串中第几个（0-based）匹配为"活动"匹配，显示橙色；省略则全部为黄色。
 * 可在自定义 column.render 中直接调用，配合 highlightText 工具函数手动处理高亮。
 */
export function highlightText(text: string, keyword: string, activeOccurrenceIndex?: number): ReactNode {
    if (!keyword.trim()) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    if (parts.length <= 1) return text;
    const lower = keyword.toLowerCase();
    let occIdx = 0;
    return parts.map((part, i) => {
        if (part.toLowerCase() === lower) {
            const isActive = activeOccurrenceIndex !== undefined && occIdx === activeOccurrenceIndex;
            occIdx++;
            return <mark key={i} className={isActive ? activeHighlightMarkStyle : highlightMarkStyle}>{part}</mark>;
        }
        return <Fragment key={i}>{part}</Fragment>;
    });
}

export interface TableCellProps<T extends Row> extends HTMLAttributes<HTMLDivElement> {
    row: T
    rowIndex: number,
    columnIndex: number,
    column: ColumnType<T>,
    fixed?: "left" | "right"
    gridTemplateRows: number[],
    gridTemplateColumns: number[],
    isSkipCell: boolean
    mergeCell?: MergeCell
    editType?: "cell" | "row"
    selection?: CellSelectionState
    /** 该单元格是否已被编辑过（用于显示编辑标记） */
    isEdited?: boolean
    /** 递增时强制 dataValue 重新从 row.dataRef 读取（用于撤销后刷新显示） */
    dataVersion?: number
    /** 是否是最后一列（最右列），用于控制右侧阴影边框显示 */
    isLastColumn?: boolean
    /** 高亮关键字；默认 render 自动应用，自定义 render 可通过 keyword 参数拿到同一值 */
    highlightKeyword?: string
    /** 当前单元格内第几个（0-based）匹配为活动匹配（橙色）；undefined 表示无活动匹配 */
    activeOccurrenceInCell?: number
    /** 提交编辑时回调，携带编辑前后的值 */
    onCellCommit?: (rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => void
    onCellMouseDown?: (rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void
    onCellMouseEnter?: (rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void
    /** 树形行元数据；仅在 treeColumn 列传入，其他列不传 */
    treeNode?: TreeRowMeta
    /** 切换当前行展开/收起 */
    onTreeToggle?: () => void
    /** 当前行是否处于行编辑态（editType="row" 时由 table 下发） */
    isRowEditing?: boolean
    /** 行编辑模式下当前列的编辑值（外部受控，替代内部 editorValue state） */
    rowEditorValue?: unknown
    /** 行编辑模式下编辑值变更回调 */
    onRowEditorValueChange?: (value: unknown) => void
    /** 行编辑模式下取消整行编辑 */
    onRowCancel?: () => void
    /**
     * cell-edit 键盘导航：table 层激活此格时为 true，激活其他格时为 false，非 cell-edit 模式时为 undefined。
     * 变为 true → 自动进入编辑；变为 false → 强制退出编辑。
     */
    isActivatedByNav?: boolean
    /** 双击进入 cell-edit 时通知 table 层，使 table 层能追踪当前编辑格以支持键盘导航 */
    onCellEditStart?: (rowIndex: number, columnIndex: number) => void
    /** Tab / Enter / Escape 键盘导航回调；table 层根据方向激活下一个可编辑格或退出编辑 */
    onCellEditNavigate?: (rowIndex: number, columnIndex: number, direction: CellNavDirection) => void
}

const mapping = {
    "left": "flex-start",
    "center": "center",
    "right": "flex-end",
}

function TableCell<T extends Row>({
    row,
    rowIndex,
    column,
    columnIndex,
    className,
    isSkipCell,
    mergeCell,
    gridTemplateRows,
    gridTemplateColumns,
    style,
    fixed,
    editType,
    selection,
    isEdited,
    dataVersion,
    isLastColumn,
    highlightKeyword,
    activeOccurrenceInCell,
    onCellCommit,
    onCellMouseDown,
    onCellMouseEnter,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    treeNode,
    onTreeToggle,
    isRowEditing,
    rowEditorValue,
    onRowEditorValueChange,
    onRowCancel,
    isActivatedByNav,
    onCellEditStart,
    onCellEditNavigate,
    ...restProps
}: TableCellProps<T>){
    const [editorValue, setEditorValue] = useState<unknown>(null);
    const [isEditing, setIsEditing] = useState(false);
    // 进入编辑时快照原值，提交时作为 oldValue 写入操作记录
    const originalValueRef = useRef<unknown>(null);

    const exitEditing = useCallback(() => {
        // 退出编辑态必须把缓存的 editorValue 一并清掉，
        // 否则下次进入编辑器会读到上一次的陈旧值（外部数据已经更新过）
        setIsEditing(false);
        setEditorValue(null);
    }, []);

    // 如果父级在编辑过程中关掉了 editType / 移除了 editRender，
    // isEditing 不会自动复位 —— 必须主动同步，否则该格永远卡在"既看不到编辑器、双击也进不去"的死态
    const canEdit = column.editRender != null && editType === "cell";
    // 行编辑模式：该列有 editRender 且当前行处于行编辑态
    const isRowEditActive = isRowEditing === true && column.editRender != null;
    useEffect(() => {
        if (isEditing && !canEdit) {
            exitEditing();
        }
    }, [isEditing, canEdit, exitEditing]);

    // cell-edit 导航：table 层切换激活格时同步本地编辑状态。
    // 用 ref 持有最新值，避免把 isEditing/canEdit/dataValue 加入 deps 导致 effect 在非预期时机触发。
    const canEditRef = useRef(canEdit);
    canEditRef.current = canEdit;
    const isEditingRef = useRef(isEditing);
    isEditingRef.current = isEditing;
    const dataValueForNavRef = useRef<unknown>(undefined);
    useEffect(() => {
        if (isActivatedByNav === true && canEditRef.current && !isEditingRef.current) {
            // dataValue 尚未计算完（useMemo 在后面），通过 ref 在 commit 时读取
            originalValueRef.current = dataValueForNavRef.current;
            setEditorValue(null);
            setIsEditing(true);
        } else if (isActivatedByNav === false && isEditingRef.current) {
            exitEditing();
        }
    }, [isActivatedByNav, exitEditing]);

    const dataValue = useMemo(() => {
        if (isSkipCell) {
            return null;
        }
        const result = JSONPath({
            path: column.name,
            json: row.dataRef,
        })
        return result;
    }, [isSkipCell, column.name, row.dataRef, dataVersion])

    dataValueForNavRef.current = dataValue;

    const getBorderStyle = () => {
        if (fixed === "right") {
            // 固定右列的右边框被该列自身的 sticky 背景覆盖不可见，改用左边框分隔
            return css`
                box-shadow: inset 1px 0 0 ${token.border.color},
                            inset 0 -1px 0 ${token.border.color};
            `;
        }
        if (isLastColumn) {
            return css`
                box-shadow: inset 0 -1px 0 ${token.border.color};
            `;
        }
        return css`
            box-shadow: inset -1px 0 0 ${token.border.color},
                        inset 0 -1px 0 ${token.border.color};
        `;
    };

    const getMergedContentBorderStyle = () => {
        if (isLastColumn) {
            return css`
                box-shadow: inset 0 1px 0 ${token.border.color},
                            inset 0 -1px 0 ${token.border.color};
            `;
        }
        return css`
            box-shadow: inset 0 1px 0 ${token.border.color},
                        inset -1px 0 0 ${token.border.color},
                        inset 0 -1px 0 ${token.border.color};
        `;
    };

    const getJustifyContent = () => {
        if (column.align && typeof column.align === "string") {
            return mapping[column.align]
        } else if (column.align && Array.isArray(column.align)) {
            return mapping[column.align?.[1]]
        } else {
            return "flex-start";
        }
    }

    const renderChildrenElement = () => {
        if (isSkipCell) {
            return null;
        }

        const displayContent = (() => {
            if (!highlightKeyword || !dataValue) return dataValue;
            const arr = Array.isArray(dataValue) ? dataValue : [dataValue];
            const lower = highlightKeyword.toLowerCase();
            let occurrenceOffset = 0;
            return arr.map((item, idx) => {
                const text = typeof item === "string" ? item
                    : typeof item === "number" ? String(item)
                        : null;
                if (text == null) return item;
                // Which occurrence within this string is the active one?
                const activeInItem = activeOccurrenceInCell !== undefined && activeOccurrenceInCell >= occurrenceOffset
                    ? activeOccurrenceInCell - occurrenceOffset
                    : undefined;
                const node = highlightText(text, highlightKeyword, activeInItem);
                // Count occurrences in this string to advance the offset for the next item
                let count = 0;
                let from = 0;
                const tl = text.toLowerCase();
                while (true) {
                    const i = tl.indexOf(lower, from);
                    if (i === -1) break;
                    count++;
                    from = i + lower.length;
                }
                occurrenceOffset += count;
                return <Fragment key={idx}>{node}</Fragment>;
            });
        })();

        let renderElement = (
            <div
                className={css`
                    display: inline-flex;
                    height: 100%;
                    width: 100%;
                    padding-inline: ${token.cell['padding-inline']};
                    align-items: center;
                    box-sizing: border-box;
                `}
                style={{
                    justifyContent: treeNode ? 'flex-start' : getJustifyContent()
                }}
            >
                {treeNode && (
                    <>
                        {/* 层级缩进占位 */}
                        <div
                            aria-hidden
                            className={css`flex-shrink: 0;`}
                            style={{ width: `calc(${treeNode.level} * ${token.tree.indent})` }}
                        />
                        {/* 展开/收起按钮（非叶子）或等宽占位（叶子） */}
                        {treeNode.hasChildren ? (
                            <div
                                role="button"
                                tabIndex={0}
                                aria-expanded={treeNode.isExpanded}
                                className={css`
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: ${token.tree['chevron-size']};
                                    height: ${token.tree['chevron-size']};
                                    flex-shrink: 0;
                                    cursor: pointer;
                                    border-radius: ${token.tree['button-radius']};
                                    margin-right: ${token.tree['button-gap']};
                                    color: ${token.tree['chevron-color']};
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTreeToggle?.();
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onTreeToggle?.();
                                    }
                                }}
                            >
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={css`transition: ${token.tree['chevron-transition']};`}
                                    style={{ transform: treeNode.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                >
                                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ) : (
                            <div
                                aria-hidden
                                className={css`flex-shrink: 0;`}
                                style={{ width: token.tree['chevron-size'] }}
                            />
                        )}
                    </>
                )}
                <div
                    className={css`
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `}
                >
                    {displayContent}
                </div>
            </div>
        )

        /**
         * 如果有合并单元格，则需要计算合并单元格的宽度和高度, 并且生产合并单元格的信息
         */
        let mergedSize: { width: number; height: number } | null = null;
        if (mergeCell) {
            mergedSize = getMergedCellSize({
                gridTemplateRows,
                gridTemplateColumns,
                mergeCell
            });
            renderElement = (
                <div
                    className={cx(css`
                        position: absolute;
                        z-index: 1;
                        top: 0;
                        box-sizing: border-box;
                        /* 合并单元格自带一层不透明底，同样读行底色变量 —— 过渡必须与行、
                           固定列严格一致，否则 hover 时它会瞬时跳色而其余仍在渐变。 */
                        background-color: var(${ROW_BG_VAR}, ${token.cell['bg-color']});
                        transition: ${ROW_BG_TRANSITION};

                        @media (prefers-reduced-motion: reduce) {
                            transition: none;
                        }
                    `, getMergedContentBorderStyle())}
                    style={{
                        width: mergedSize.width,
                        height: mergedSize.height,
                        justifyContent: getJustifyContent()
                    }}
                >
                    {renderElement}
                </div>
            )
        }

        if (isRowEditActive || (isEditing && canEdit)) {
            const editorElement: ReactNode = column.editRender!({
                row,
                rowIndex,
                columnIndex,
                column,
                editorValue: isRowEditActive ? (rowEditorValue ?? null) : editorValue,
                onEditorValueChange: isRowEditActive
                    ? (value: unknown) => onRowEditorValueChange?.(value)
                    : setEditorValue,
                onCommit: isRowEditActive
                    // 行编辑模式：单列 commit 是 no-op，由行级确认按钮统一提交
                    ? undefined
                    : (explicitValue?: unknown) => {
                        // 优先使用调用方传入的显式终值（select onChange 等同步场景），
                        // 否则回退到 editorValue state（input onBlur / onKeyDown 等场景）
                        const valueToCommit = explicitValue !== undefined ? explicitValue : editorValue;
                        if (valueToCommit !== null) {
                            onCellCommit?.(row.id, column.name, columnIndex, originalValueRef.current, valueToCommit);
                        }
                        exitEditing();
                    },
                onCancel: isRowEditActive
                    ? () => onRowCancel?.()
                    : () => {
                        exitEditing();
                        onCellEditNavigate?.(rowIndex, columnIndex, 'escape');
                    },
                originalElement: renderElement
            });

            // cell-edit 模式下：Tab / Enter 提交当前值并跳转到相邻可编辑格。
            // 通过手动 blur() 触发消费者的 onBlur → patchRow → onCommit → exitEditing 路径，
            // 而非在 capture 阶段直接 exitEditing()，避免 input unmount 导致 onBlur 不触发、
            // 消费者无法调用 patchRow 而显示陈旧值。
            const handleEditKeyDown = !isRowEditActive
                ? (e: ReactKeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        e.stopPropagation();
                        (document.activeElement as HTMLElement | null)?.blur?.();
                        onCellEditNavigate?.(rowIndex, columnIndex, e.shiftKey ? 'tab-backward' : 'tab-forward');
                    } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                        // textarea 里的 Enter 保留默认换行行为
                        if ((e.target as HTMLElement).tagName.toLowerCase() === 'textarea') return;
                        e.preventDefault();
                        e.stopPropagation();
                        (document.activeElement as HTMLElement | null)?.blur?.();
                        onCellEditNavigate?.(rowIndex, columnIndex, e.shiftKey ? 'shift-enter' : 'enter');
                    }
                }
                : undefined;

            // 合并单元格进入编辑时，必须让编辑器跨越整片合并区域，
            // 否则编辑器只占主格单格尺寸、合并区域露白，视觉抖动严重
            if (mergedSize) {
                return (
                    <div
                        className={cx(css`
                            position: absolute;
                            z-index: 3;
                            top: 0;
                            left: 0;
                            box-sizing: border-box;
                            background-color: ${token.cell['bg-color']};
                            font-size: inherit;
                            font-family: inherit;
                            & input, & textarea, & select {
                                font-size: inherit;
                                font-family: inherit;
                            }
                        `, getBorderStyle())}
                        style={{
                            width: mergedSize.width,
                            height: mergedSize.height
                        }}
                        onKeyDownCapture={handleEditKeyDown}
                    >
                        {editorElement}
                    </div>
                );
            }
            // 普通单元格：用 wrapper 把字体属性透传给内部表单元素
            return (
                <div
                    className={css`
                        width: 100%;
                        height: 100%;
                        font-size: inherit;
                        font-family: inherit;
                        & input, & textarea, & select {
                            font-size: inherit;
                            font-family: inherit;
                        }
                    `}
                    onKeyDownCapture={handleEditKeyDown}
                >
                    {editorElement}
                </div>
            );
        } else if (column.render) {
            return column.render({
                row,
                rowIndex,
                columnIndex,
                column,
                keyword: highlightKeyword,
                activeOccurrenceInCell,
                originalElement: renderElement
            })
        } else {
            return renderElement;
        }
    }

    const renderEditedIndicator = () => {
        if (!isEdited || isSkipCell) return null;
        return (
            <div
                aria-hidden
                className={css`
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 ${token['edited-indicator'].size} ${token['edited-indicator'].size} 0;
                    border-color: transparent ${token['edited-indicator'].color} transparent transparent;
                    pointer-events: none;
                    z-index: 4;
                `}
            />
        );
    }

    const renderSelectionOverlay = () => {
        // 被合并覆盖的次单元格本身不渲染内容，让主单元格的 overlay 跨整片合并区
        if (isSkipCell || !selection?.selected) {
            return null;
        }
        // 用 inset box-shadow 模拟 Excel 风格的选区边框：相邻已选单元格之间不画线，仅在选区外缘描边
        // 这样不会占用布局空间，避免单元格出现 1~2px 尺寸抖动
        const color = token.selection['border-color'];
        const bw = token.selection['border-width'];
        const shadows: string[] = [];
        if (selection.edgeTop) shadows.push(`inset 0 ${bw} 0 0 ${color}`);
        if (selection.edgeBottom) shadows.push(`inset 0 calc(-1 * ${bw}) 0 0 ${color}`);
        if (selection.edgeLeft) shadows.push(`inset ${bw} 0 0 0 ${color}`);
        if (selection.edgeRight) shadows.push(`inset calc(-1 * ${bw}) 0 0 0 ${color}`);
        // 锚点（活动单元格）保留单元格原色，其余选区填充淡蓝以体现范围
        const background = selection.isAnchor
            ? "transparent"
            : token.selection['bg-color'];

        // 合并单元格主格的视觉尺寸跨多格，overlay 必须按合并后的宽高铺开，
        // 否则只会覆盖单格大小、出现裸露的"漏色"区域
        const overlaySize = mergeCell
            ? getMergedCellSize({ gridTemplateRows, gridTemplateColumns, mergeCell })
            : null;

        return (
            <div
                aria-hidden
                className={css`
                    position: absolute;
                    pointer-events: none;
                    z-index: 2;
                    top: 0;
                    left: 0;
                `}
                style={{
                    // 合并单元格用显式 width/height；普通单元格用 right/bottom 让浏览器自动撑满，
                    // 两种模式互斥，避免同时设置导致冲突
                    right: overlaySize ? undefined : 0,
                    bottom: overlaySize ? undefined : 0,
                    width: overlaySize ? overlaySize.width : undefined,
                    height: overlaySize ? overlaySize.height : undefined,
                    backgroundColor: background,
                    boxShadow: shadows.length > 0 ? shadows.join(", ") : undefined
                }}
            />
        );
    }

    return (
        <div
            className={cx(css`
                display: inline-flex;
                align-items: center;
                box-sizing: border-box;
                vertical-align: top;
                height: 100%;
                position: relative;
                font-size: inherit;
            `, getBorderStyle(), isRowEditing && rowEditingCellStyle, isRowEditActive && rowEditActiveCellStyle, className)}
            style={style}
            onDoubleClick={(e) => {
                if (canEdit) {
                    originalValueRef.current = dataValue;
                    setEditorValue(null);
                    setIsEditing(true);
                    onCellEditStart?.(rowIndex, columnIndex);
                    // 这次双击已被单元格编辑消费：不再冒泡到行，否则会连带触发 onRowDoubleClick
                    e.stopPropagation();
                }
                onDoubleClick?.(e);
            }}
            onMouseDown={(e) => {
                // 编辑态下不再触发选区拖拽，避免父级 preventDefault() 吞掉
                // 输入框的光标定位 / 文本选择
                if (!isSkipCell && !isEditing) {
                    onCellMouseDown?.(rowIndex, columnIndex, e);
                }
                onMouseDown?.(e);
            }}
            onMouseEnter={(e) => {
                if (!isSkipCell && !isEditing) {
                    onCellMouseEnter?.(rowIndex, columnIndex, e);
                }
                onMouseEnter?.(e);
            }}
            {...restProps}
        >
            {renderChildrenElement()}
            {renderEditedIndicator()}
            {renderSelectionOverlay()}
        </div>
    )
}

export default TableCell;
