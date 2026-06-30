import { css, cx } from "@linaria/core";
import token from "./token.js";
import type { Align, ColumnType, MergeCell, Row, SortDirection } from "./types.js";
import { getMergedCellSize } from "./util.js";

import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { DropSide } from "./hooks/useColumnDrag.js";

interface TableHeaderCellProps<T extends Row> extends HTMLAttributes<HTMLDivElement> {
    columnIndex: number,
    rowIndex: number,
    maxRowIndex: number,
    column?: ColumnType<T>
    fixed?: "left" | "right"
    gridTemplateColumns: number[]
    gridTemplateRows: number[]
    mergeCell?: MergeCell
    isSkipCell: boolean
    isLastColumn?: boolean
    onResizeMouseDown?: (e: MouseEvent<HTMLDivElement>) => void
    isDragging?: boolean
    dropIndicatorSide?: DropSide | null
    isSortable?: boolean
    sortState?: { direction: SortDirection; priority: number } | null
    onSortClick?: (isMulti: boolean) => void
    /** 自定义单元格内容；非 skip cell 时替换默认的 title/排序渲染 */
    customContent?: ReactNode
}

const draggableStyle = css`
    cursor: pointer;
    &:active {
        cursor: grabbing;
    }
`;

// 可排序列头：hover 时显示淡灰图标
const sortableRootStyle = css`
    cursor: ${token.sort['header-cursor']};
    user-select: none;
    &:hover .rc-table-sort-icon-idle {
        opacity: 1;
    }
`;

// sortable / 非 sortable 公共基础样式：确保两种状态盒模型一致，切换时不产生高度偏移
const titleInnerBaseStyle = css`
    display: inline-flex;
    align-items: center;
    width: 100%;
    padding-inline: ${token.cell['padding-inline']};
    box-sizing: border-box;
    overflow: hidden;
`;

// 标题 + 排序图标的行内容器（sortable 额外需要 gap 和交互样式）
const sortTitleInnerStyle = css`
    cursor: pointer;
    &:focus {
        outline: none;
    }
    &:focus-visible {
        outline: 2px solid ${token.sort['icon-active-color']};
        outline-offset: -2px;
        border-radius: 2px;
    }
`;

// 排序图标外壳
const sortIconWrapStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 2px;
`;

// 非 sortable 时：占位但不可见（visibility:hidden 不触发 reflow，切换时无布局抖动）
const sortIconPlaceholderStyle = css`
    visibility: hidden;
    pointer-events: none;
`;

// 未激活时不可见（父 hover 时通过 .rc-table-sort-icon-idle 选择器恢复）
const sortIconIdleStyle = css`
    opacity: 0;
    transition: opacity 100ms;
`;

// 激活态（stroke 色）
const sortIconActiveStyle = css`
    stroke: ${token.sort['icon-active-color']};
`;


// 多列排序序号角标：无背景，小字号，垂直居中
const sortBadgeStyle = css`
    font-size: ${token.sort['badge-font-size']};
    color: ${token.sort['badge-color']};
    line-height: 1;
    font-variant-numeric: tabular-nums;
`;


function SortIcon({ direction }: { direction: SortDirection | null }) {
    const isAsc = direction === "asc";
    const isDesc = direction === "desc";
    if (direction == null) {
        return null;
    }
    return (
        <svg
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={sortIconActiveStyle}
        >
            {isAsc && (<><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></>)}
            {isDesc && (<><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>)}
        </svg>
    );
}

const fixedHeaderBgStyle = css`
    background-color: ${token.header['bg-color']};
`;

// 固定右列跨行起始格：上边框 + 左分隔线
const fixedRightSpanStyle = css`
    box-shadow: inset 0 1px 0 ${token.border.color}, inset 1px 0 0 ${token.border.color};
`;

// 固定右列跨行起始格（同时是最后一行时）：上边框 + 左分隔线 + 底部边框
const fixedRightSpanWithBottomStyle = css`
    box-shadow: inset 0 1px 0 ${token.border.color}, inset 1px 0 0 ${token.border.color}, inset 0 -1px 0 ${token.border.color};
`;

// 固定右列 skip 格（r>0）：左分隔线 + 底部边框
const fixedRightSkipStyle = css`
    box-shadow: inset 1px 0 0 ${token.border.color}, inset 0 -1px 0 ${token.border.color};
`;

const draggingStyle = css`
    opacity: ${token['column-drag']['dragging-opacity']};
`;

const skipCellStyle = css`
    pointer-events: none;
`;

const dropLineBaseStyle = css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${token['column-drag']['indicator-width']};
    background-color: ${token['column-drag']['indicator-color']};
    pointer-events: none;
    z-index: 2;
`;

const dropLineLeftStyle = css`
    left: 0;
`;

const dropLineRightStyle = css`
    right: 0;
`;

function TableHeaderCell<T extends Row>({
    column,
    columnIndex,
    className,
    isSkipCell,
    mergeCell,
    gridTemplateRows,
    gridTemplateColumns,
    fixed,
    rowIndex,
    maxRowIndex,
    isLastColumn,
    onResizeMouseDown,
    isDragging,
    dropIndicatorSide,
    isSortable,
    sortState,
    onSortClick,
    customContent,
    ...restProps
}: TableHeaderCellProps<T>){

    const getMergedHeaderCellBorderStyle = () => {
        if (isLastColumn) {
            if (rowIndex === maxRowIndex) {
                return css`
                    box-shadow: inset 0 1px 0 ${token.border.color},
                                inset 0 -1px 0 ${token.border.color};
                `;
            }
            return css`
                box-shadow: inset 0 1px 0 ${token.border.color};
            `;
        }
        if (rowIndex === maxRowIndex) {
            return css`
                box-shadow: inset 0 1px 0 ${token.border.color},
                            inset -1px 0 0 ${token.border.color},
                            inset 0 -1px 0 ${token.border.color};
            `;
        }
        return css`
            box-shadow: inset 0 1px 0 ${token.border.color},
                        inset -1px 0 0 ${token.border.color};
        `;
    }

    // 固定列跨行时（rowSpan > 0），不使用绝对定位跨行覆盖，
    // 改为在根 div 上直接添加背景色与边框，避免被后续行 BodyRow stacking context 遮挡。
    const getFixedHeaderRootStyle = () => {
        if (!fixed) return '';

        if (!isSkipCell && mergeCell && mergeCell.rowSpan > 0) {
            if (fixed === 'right') {
                // 固定右列需要左分隔线（inset 1px 0 0），不能用 getMergedHeaderCellBorderStyle
                // 因为两个 box-shadow 类无法通过 cx() 叠加（后者覆盖前者）
                return cx(
                    fixedHeaderBgStyle,
                    rowIndex === maxRowIndex ? fixedRightSpanWithBottomStyle : fixedRightSpanStyle
                );
            }
            // 固定左列：背景色 + 上边框 + 右分隔线（无底部）
            return cx(fixedHeaderBgStyle, getMergedHeaderCellBorderStyle());
        }

        if (isSkipCell) {
            if (fixed === 'right') {
                // 固定右列 skip 格：左分隔线 + 底部边框
                return cx(fixedHeaderBgStyle, fixedRightSkipStyle);
            }
            // 固定左列 skip 格：右分隔线 + 底部边框（不加上边框，避免在两行间画多余横线）
            const skipBorderStyle = isLastColumn
                ? css`box-shadow: inset 0 -1px 0 ${token.border.color};`
                : css`box-shadow: inset -1px 0 0 ${token.border.color}, inset 0 -1px 0 ${token.border.color};`;
            return cx(fixedHeaderBgStyle, skipBorderStyle);
        }

        return '';
    };

    const renderChildrenElement = () => {
        if (isSkipCell) {
            return null;
        }

        if (customContent !== undefined) {
            return (
                <div
                    className={cx(
                        css`
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            vertical-align: top;
                            height: 100%;
                            width: 100%;
                            background-color: ${token.header['bg-color']};
                        `,
                        getMergedHeaderCellBorderStyle()
                    )}
                >
                    {customContent}
                </div>
            )
        }

        const handleSortKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSortClick?.(e.shiftKey); }
        };

        const rawAlign = column?.align;
        const headerAlign: Align = rawAlign
            ? (Array.isArray(rawAlign) ? rawAlign[0] : rawAlign)
            : "left";

        const titleSpanStyle = css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            min-width: 0;
        `;

        // 始终渲染图标 span（保持 DOM 结构稳定），非 sortable 时 visibility:hidden 占位，
        // 避免 isSortable 切换时因 DOM 插入/删除触发 flex 重算导致视觉抖动。
        const stableIconEl = (
            <span
                className={cx(
                    sortIconWrapStyle,
                    !isSortable && sortIconPlaceholderStyle,
                    isSortable && !sortState && sortIconIdleStyle,
                    isSortable && !sortState && "rc-table-sort-icon-idle"
                )}
            >
                <SortIcon direction={sortState?.direction ?? null} />
                {isSortable && sortState && sortState.priority > 0 && (
                    <span className={sortBadgeStyle}>{sortState.priority}</span>
                )}
            </span>
        );

        const titleElement = (
            <div
                className={cx(titleInnerBaseStyle, isSortable && sortTitleInnerStyle)}
                role={isSortable ? "button" : undefined}
                tabIndex={isSortable ? 0 : undefined}
                onClick={isSortable ? (e) => onSortClick?.(e.shiftKey) : undefined}
                onKeyDown={isSortable ? handleSortKeyDown : undefined}
                aria-sort={isSortable ? (sortState ? (sortState.direction === "asc" ? "ascending" : "descending") : "none") : undefined}
            >
                {headerAlign === "right" && stableIconEl}
                <span className={titleSpanStyle} style={{ textAlign: headerAlign }}>{column?.title}</span>
                {headerAlign !== "right" && stableIconEl}
            </div>
        );

        if (mergeCell) {
            if (fixed && mergeCell.rowSpan > 0) {
                // 固定列跨行：绝对定位从根 div 顶部开始，高度覆盖整个跨行区域，
                // 让标题在整个跨行区域内垂直居中，不受根 div align-items 干扰。
                // 溢出到后续行的部分靠 table.tsx 中 BodyRow 逆序 z-index 保证可见。
                const { height: mergedHeight } = getMergedCellSize({
                    gridTemplateRows,
                    gridTemplateColumns,
                    mergeCell
                });
                return (
                    <div
                        className={css`
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `}
                        style={{ height: mergedHeight }}
                    >
                        {titleElement}
                    </div>
                );
            }
            const { width, height } = getMergedCellSize({
                gridTemplateRows,
                gridTemplateColumns,
                mergeCell
            });
            // drop 指示器放在合并 div 内，相对于整个分组/列的总宽度定位：
            // 分组列头的根 div 只有第一个子列的宽度，合并 div 才覆盖全部子列宽度，
            // 指示器在合并 div 内才能正确显示在分组的左/右边界（与 ag-grid 行为一致）。
            // drag 事件也下沉到此 div：根 div 宽度仅为第一子列，超出部分的拖拽命中
            // 此绝对定位 div，由此 div 直接处理并 stopPropagation 防止根 div 重复触发；
            // e.currentTarget 为此 div 时 resolveDropSide 可用完整合并宽度正确计算 side。
            return (
                <div
                    className={cx(css`
                        position: absolute;
                        top: 0;
                        box-sizing: border-box;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background-color: ${token.header['bg-color']};
                    `, getMergedHeaderCellBorderStyle())}
                    style={{ width, height }}
                    draggable={isDraggable || undefined}
                    onDragStart={restProps.onDragStart ? (e) => { e.stopPropagation(); restProps.onDragStart!(e); } : undefined}
                    onDragOver={restProps.onDragOver ? (e) => { e.stopPropagation(); restProps.onDragOver!(e); } : undefined}
                    onDrop={restProps.onDrop ? (e) => { e.stopPropagation(); restProps.onDrop!(e); } : undefined}
                    onDragEnd={restProps.onDragEnd ? (e) => { e.stopPropagation(); restProps.onDragEnd!(e); } : undefined}
                    onDragLeave={restProps.onDragLeave ? (e) => { e.stopPropagation(); restProps.onDragLeave!(e); } : undefined}
                >
                    {titleElement}
                    {dropIndicatorSide && (
                        <div
                            aria-hidden
                            className={cx(
                                dropLineBaseStyle,
                                dropIndicatorSide === 'left' ? dropLineLeftStyle : dropLineRightStyle
                            )}
                        />
                    )}
                </div>
            );
        }

        return titleElement;
    }

    const isDraggable = !!restProps.draggable && !isSkipCell;

    return (
        <div
            className={cx(css`
                position: relative;
                display: inline-flex;
                align-items: center;
                box-sizing: border-box;
                vertical-align: top;
                height: 100%;
            `,
            isDraggable && draggableStyle,
            isSortable && sortableRootStyle,
            isDragging && draggingStyle,
            isSkipCell && skipCellStyle,
            getFixedHeaderRootStyle(),
            className)}
            data-column-index={columnIndex}
            {...restProps}
        >
            {renderChildrenElement()}
            {onResizeMouseDown && !isSkipCell && (
                <div
                    className={css`
                        position: absolute;
                        right: 0;
                        top: 0;
                        height: 100%;
                        width: ${token['resize-handle'].width};
                        cursor: col-resize;
                        z-index: 1;
                    `}
                    onMouseDown={onResizeMouseDown}
                    // 阻止 drag 事件，避免 resize handle 触发列拖拽
                    draggable={false}
                    onDragStart={e => e.stopPropagation()}
                />
            )}
        </div>
    )
}

export default TableHeaderCell;
