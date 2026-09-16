import { css, cx } from "@crab-dev/css";
import token from "./token.js";
import type { Align, ColumnType, MergeCell, Row, SortDirection } from "./types.js";
import { getMergedCellSize } from "./util.js";

import { memo, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
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
    onResizeKeyboard?: (delta: number) => void
    isDragging?: boolean
    dropIndicatorSide?: DropSide | null
    isSortable?: boolean
    sortState?: { direction: SortDirection; priority: number } | null
    onSortClick?: (isMulti: boolean) => void
    /** 自定义单元格内容；非 skip cell 时替换默认的 title/排序渲染 */
    customContent?: ReactNode
    /** 同一轮 Table render 内稳定，用于忽略虚拟横向滚动产生的新事件包装函数。 */
    renderVersion?: object
}

const draggableStyle = css`
    cursor: pointer;
    &:active {
        cursor: grabbing;
    }
`;

// 未排序时也显示双向箭头，让鼠标、触控和键盘用户都能发现排序入口。
const sortableRootStyle = css`
    cursor: ${token.sort.header.cursor};
    user-select: none;
`;

// sortable / 非 sortable 公共基础样式：确保两种状态盒模型一致，切换时不产生高度偏移
const titleInnerBaseStyle = css`
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: ${token.header.gap};
    padding-inline: ${token.cell['padding-inline']};
    box-sizing: border-box;
    overflow: hidden;
`;

// 标题 + 排序图标的行内容器（sortable 额外需要 gap 和交互样式）
const sortTitleInnerStyle = css`
    cursor: pointer;
    &:focus-visible {
        outline: ${token.root["outline-width-focus"]} solid ${token.root["outline-color-focus"]};
        outline-offset: calc(-1 * ${token.root["outline-width-focus"]});
    }
`;

// 排序图标外壳
const sortIconWrapStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 2px;
`;

// 不可排序的标题不占用图标空间。
const sortIconPlaceholderStyle = css`
    display: none;
`;

// 未排序图标使用次级颜色，排序状态同时通过箭头方向与 aria-sort 表达。
const sortIconIdleStyle = css`
    color: ${token.sort.icon.color};
`;

// 激活态（stroke 色）
const sortIconActiveStyle = css`
    stroke: ${token.sort.icon['color-active']};
`;


// 多列排序序号角标：无背景，小字号，垂直居中
const sortBadgeStyle = css`
    font-size: ${token.sort.badge['font-size']};
    color: ${token.sort.badge.color};
    line-height: 1;
    font-variant-numeric: tabular-nums;
`;


function SortIcon({ direction }: { direction: SortDirection | null }): ReactNode {
    const isAsc = direction === "asc";
    const isDesc = direction === "desc";
    return (
        <svg
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className={direction == null ? undefined : sortIconActiveStyle}
        >
            {direction == null && (<><path d="m8 9 4-4 4 4"/><path d="m8 15 4 4 4-4"/></>)}
            {isAsc && (<><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></>)}
            {isDesc && (<><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>)}
        </svg>
    );
}

const fixedHeaderBgStyle = css`
    background-color: ${token.header['background-color']};
`;

// 固定右列跨行起始格：上边框 + 左分隔线
const fixedRightSpanStyle = css`
    box-shadow: inset 0 1px 0 ${token.root["border-color"]}, inset 1px 0 0 ${token.root["border-color"]};
`;

// 固定右列跨行起始格（同时是最后一行时）：上边框 + 左分隔线 + 底部边框
const fixedRightSpanWithBottomStyle = css`
    box-shadow: inset 0 1px 0 ${token.root["border-color"]}, inset 1px 0 0 ${token.root["border-color"]}, inset 0 -1px 0 ${token.root["border-color"]};
`;

// 固定右列 skip 格（r>0）：左分隔线 + 底部边框
const fixedRightSkipStyle = css`
    box-shadow: inset 1px 0 0 ${token.root["border-color"]}, inset 0 -1px 0 ${token.root["border-color"]};
`;

const draggingStyle = css`
    opacity: ${token['column-drag']['opacity-dragging']};
`;

const skipCellStyle = css`
    pointer-events: none;
`;

const dropLineBaseStyle = css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${token['column-drag'].indicator.width};
    background-color: ${token['column-drag'].indicator["background-color"]};
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
    onResizeKeyboard,
    isDragging,
    dropIndicatorSide,
    isSortable,
    sortState,
    onSortClick,
    customContent,
    renderVersion: _renderVersion,
    ...restProps
}: TableHeaderCellProps<T>): ReactNode {

    const getMergedHeaderCellBorderStyle = () => {
        if (isLastColumn) {
            if (rowIndex === maxRowIndex) {
                return css`
                    box-shadow: inset 0 1px 0 ${token.root["border-color"]},
                                inset 0 -1px 0 ${token.root["border-color"]};
                `;
            }
            return css`
                box-shadow: inset 0 1px 0 ${token.root["border-color"]};
            `;
        }
        if (rowIndex === maxRowIndex) {
            return css`
                box-shadow: inset 0 1px 0 ${token.root["border-color"]},
                            inset -1px 0 0 ${token.root["border-color"]},
                            inset 0 -1px 0 ${token.root["border-color"]};
            `;
        }
        return css`
            box-shadow: inset 0 1px 0 ${token.root["border-color"]},
                        inset -1px 0 0 ${token.root["border-color"]};
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
                return cx.call(undefined, fixedHeaderBgStyle,
                    rowIndex === maxRowIndex ? fixedRightSpanWithBottomStyle : fixedRightSpanStyle
                );
            }
            // 固定左列：背景色 + 上边框 + 右分隔线（无底部）
            return cx.call(undefined, fixedHeaderBgStyle, getMergedHeaderCellBorderStyle());
        }

        if (isSkipCell) {
            if (fixed === 'right') {
                // 固定右列 skip 格：左分隔线 + 底部边框
                return cx.call(undefined, fixedHeaderBgStyle, fixedRightSkipStyle);
            }
            // 固定左列 skip 格：右分隔线 + 底部边框（不加上边框，避免在两行间画多余横线）
            const skipBorderStyle = isLastColumn
                ? css`box-shadow: inset 0 -1px 0 ${token.root["border-color"]};`
                : css`box-shadow: inset -1px 0 0 ${token.root["border-color"]}, inset 0 -1px 0 ${token.root["border-color"]};`;
            return cx.call(undefined, fixedHeaderBgStyle, skipBorderStyle);
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
                    className={cx.call(undefined, css`
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            vertical-align: top;
                            height: 100%;
                            width: 100%;
                            background-color: ${token.header['background-color']};
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

        // 使用同一图标槽呈现未排序、升序和降序状态。
        const stableIconEl = (
            <span
                className={cx.call(undefined, sortIconWrapStyle,
                    !isSortable && sortIconPlaceholderStyle,
                    isSortable && !sortState && sortIconIdleStyle
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
                className={cx.call(undefined, titleInnerBaseStyle, isSortable && sortTitleInnerStyle)}
                role={isSortable ? "button" : undefined}
                tabIndex={isSortable ? 0 : undefined}
                onClick={isSortable ? (e) => onSortClick?.(e.shiftKey): undefined}
                onKeyDown={isSortable ? handleSortKeyDown : undefined}
            >
                {headerAlign === "right" && stableIconEl}
                <span className={titleSpanStyle} title={typeof column?.title === 'string' ? column.title : undefined} style={{ textAlign: headerAlign }}>{column?.title}</span>
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
                    className={cx.call(undefined, css`
                        position: absolute;
                        top: 0;
                        box-sizing: border-box;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background-color: ${token.header['background-color']};
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
                            className={cx.call(undefined, dropLineBaseStyle,
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
            className={cx.call(undefined, css`
                display: inline-flex;
                align-items: center;
                box-sizing: border-box;
                vertical-align: top;
                height: 100%;
                color: ${token.header.color};
                font-weight: ${token.header['font-weight']};
            `,
            fixed ? css`position: sticky;` : css`position: relative;`,
            isDraggable && draggableStyle,
            isSortable && sortableRootStyle,
            isDragging && draggingStyle,
            isSkipCell && skipCellStyle,
            getFixedHeaderRootStyle(),
            className)}
            data-column-index={columnIndex}
            {...restProps}
            role={isSkipCell ? undefined : "columnheader"}
            aria-hidden={isSkipCell || undefined}
            aria-colindex={isSkipCell ? undefined : columnIndex + 1}
            aria-sort={isSortable ? (sortState ? (sortState.direction === "asc" ? "ascending" : "descending"): "none"): undefined}
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
                        &::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 0;
                            width: ${token['resize-handle'].indicator.width};
                        }
                        &:hover::after, &:focus-visible::after {
                            background-color: ${token['resize-handle'].color};
                        }
                        &:focus-visible {
                            outline: ${token.root["outline-width-focus"]} solid ${token.root["outline-color-focus"]};
                            outline-offset: calc(-1 * ${token.root["outline-width-focus"]});
                        }
                    `}
                    onMouseDown={onResizeMouseDown}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`调整${column?.title ?? "当前"}列宽`}
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                        event.preventDefault();
                        event.stopPropagation();
                        const step = event.shiftKey ? 1 : 10;
                        onResizeKeyboard?.(event.key === "ArrowLeft" ? -step : step);
                    }}
                    // 阻止 drag 事件，避免 resize handle 触发列拖拽
                    draggable={false}
                    onDragStart={e => e.stopPropagation()}
                />
            )}
        </div>
    )
}

const shallowEqualObject = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;
    if (a == null || b == null || typeof a !== "object" || typeof b !== "object") return false;
    const aRecord = a as Record<string, unknown>;
    const bRecord = b as Record<string, unknown>;
    const aKeys = Object.keys(aRecord);
    if (aKeys.length !== Object.keys(bRecord).length) return false;
    return aKeys.every(key => Object.prototype.hasOwnProperty.call(bRecord, key)
        && Object.is(aRecord[key], bRecord[key]));
};

const areHeaderCellPropsEqual = <T extends Row>(
    prev: Readonly<TableHeaderCellProps<T>>,
    next: Readonly<TableHeaderCellProps<T>>,
): boolean => {
    if (prev.renderVersion !== next.renderVersion) return false;
    const ignored = new Set([
        "style", "mergeCell", "sortState", "customContent",
        "onResizeMouseDown", "onResizeKeyboard", "onSortClick",
        "onDragStart", "onDragOver", "onDrop", "onDragEnd", "onDragLeave",
    ]);
    const prevRecord = prev as Record<string, unknown>;
    const nextRecord = next as Record<string, unknown>;
    const keys = new Set([...Object.keys(prevRecord), ...Object.keys(nextRecord)]);
    for (const key of keys) {
        if (ignored.has(key)) continue;
        if (!Object.is(prevRecord[key], nextRecord[key])) return false;
    }
    return shallowEqualObject(prev.style, next.style)
        && shallowEqualObject(prev.mergeCell, next.mergeCell)
        && shallowEqualObject(prev.sortState, next.sortState);
};

// Consumer stability: preserve the existing header comparator for consumers without React Compiler.
const MemoizedTableHeaderCell: typeof TableHeaderCell = memo(TableHeaderCell, areHeaderCellPropsEqual) as typeof TableHeaderCell;

export default MemoizedTableHeaderCell;
