import { css, cx } from "@linaria/core";
import { JSONPath } from "jsonpath-plus";
import type { CellSelectionState, ColumnType, MergeCell, Row } from "./types.js";
import { Fragment, type HTMLAttributes, type Key, type MouseEvent as ReactMouseEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMergedCellSize } from "./util.js";

const highlightMarkStyle = css`
    background-color: var(--crab-rc-table-highlight-bg, #ffeb3b);
    color: var(--crab-rc-table-highlight-color, inherit);
    padding: 0;
    border-radius: 2px;
    font-weight: inherit;
    font-style: normal;
`;

const activeHighlightMarkStyle = css`
    background-color: var(--crab-rc-table-highlight-active-bg, #ff9632);
    color: var(--crab-rc-table-highlight-active-color, #fff);
    padding: 0;
    border-radius: 2px;
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
    editType?: "cell"
    selection?: CellSelectionState
    /** 该单元格是否已被编辑过（用于显示编辑标记） */
    isEdited?: boolean
    /** 递增时强制 dataValue 重新从 row.dataRef 读取（用于撤销后刷新显示） */
    dataVersion?: number
    /** 高亮关键字；默认 render 自动应用，自定义 render 可通过 keyword 参数拿到同一值 */
    highlightKeyword?: string
    /** 当前单元格内第几个（0-based）匹配为活动匹配（橙色）；undefined 表示无活动匹配 */
    activeOccurrenceInCell?: number
    /** 提交编辑时回调，携带编辑前后的值 */
    onCellCommit?: (rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => void
    onCellMouseDown?: (rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void
    onCellMouseEnter?: (rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void
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
    highlightKeyword,
    activeOccurrenceInCell,
    onCellCommit,
    onCellMouseDown,
    onCellMouseEnter,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
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
    useEffect(() => {
        if (isEditing && !canEdit) {
            exitEditing();
        }
    }, [isEditing, canEdit, exitEditing]);

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


    const getBorderStyle = () => {
        if (fixed === "left") {
            return css`
                border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
            `;
        } else if (fixed === "right") {
            return css`
                border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
            `;
        }
        return css`
            border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
        `;
    }

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
                    padding-inline: 8px;
                    align-items: center;
                    box-sizing: border-box;
                `}
                style={{
                    justifyContent: getJustifyContent()
                }}
            >
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
                        background-color: #fff;
                        display: inline-flex;
                        align-items: center;
                        border-top: 1px solid var(--crab-rc-table-border-color, #ddd);
                        border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
                    `, getBorderStyle())}
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

        if (isEditing && canEdit) {
            const editorElement: ReactNode = column.editRender!({
                row,
                rowIndex,
                columnIndex,
                column,
                editorValue,
                onEditorValueChange: setEditorValue,
                onCommit: () => {
                    // editorValue 为 null 说明用户从未调用 onEditorValueChange，内容未变，不记录
                    if (editorValue !== null) {
                        onCellCommit?.(row.id, column.name, columnIndex, originalValueRef.current, editorValue);
                    }
                    exitEditing();
                },
                onCancel: () => {
                    exitEditing();
                },
                originalElement: renderElement
            });
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
                            background-color: #fff;
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
                    border-width: 0 6px 6px 0;
                    border-color: transparent var(--crab-rc-table-edited-indicator-color, #f59e0b) transparent transparent;
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
        const color = "var(--crab-rc-table-selection-border-color, #1976d2)";
        const shadows: string[] = [];
        if (selection.edgeTop) shadows.push(`inset 0 2px 0 0 ${color}`);
        if (selection.edgeBottom) shadows.push(`inset 0 -2px 0 0 ${color}`);
        if (selection.edgeLeft) shadows.push(`inset 2px 0 0 0 ${color}`);
        if (selection.edgeRight) shadows.push(`inset -2px 0 0 0 ${color}`);
        // 锚点（活动单元格）保留单元格原色，其余选区填充淡蓝以体现范围
        const background = selection.isAnchor
            ? "transparent"
            : "var(--crab-rc-table-selection-bg-color, rgb(25 118 210 / 8%))";

        // 合并单元格主格的视觉尺寸跨多格，overlay 必须按合并后的宽高铺开，
        // 否则只会覆盖单格大小、出现裸露的"漏色"区域
        const overlaySize = mergeCell
            ? getMergedCellSize({ gridTemplateRows, gridTemplateColumns, mergeCell })
            : null;

        // 单元格自带 1px border（border-right / border-bottom，固定列还会有 border-left），
        // 而 overlay 默认坐落在 padding 边内，导致相邻被选中格之间的灰色边线会"切"进选区背景。
        // 在"内边"（邻居也被选中、edge=false 的那条边）向外溢出 1px，正好把单元格自带的边线盖掉；
        // "外边"保持对齐，避免画到表格容器之外或覆盖未被选中邻居的内容。
        const extTop = selection.edgeTop ? 0 : 1;
        const extRight = selection.edgeRight ? 0 : 1;
        const extBottom = selection.edgeBottom ? 0 : 1;
        const extLeft = selection.edgeLeft ? 0 : 1;

        return (
            <div
                aria-hidden
                className={css`
                    position: absolute;
                    pointer-events: none;
                    z-index: 2;
                `}
                style={{
                    top: -extTop,
                    left: -extLeft,
                    // 合并单元格用显式 width/height；普通单元格用 right/bottom 让浏览器自动撑满，
                    // 两种模式互斥，避免同时设置导致冲突
                    right: overlaySize ? undefined : -extRight,
                    bottom: overlaySize ? undefined : -extBottom,
                    width: overlaySize ? overlaySize.width + extLeft + extRight : undefined,
                    height: overlaySize ? overlaySize.height + extTop + extBottom : undefined,
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
                border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
            `, getBorderStyle(), className)}
            style={style}
            onDoubleClick={(e) => {
                if (canEdit) {
                    originalValueRef.current = dataValue;
                    setEditorValue(null);
                    setIsEditing(true);
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
