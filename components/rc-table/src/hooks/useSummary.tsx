import { type ReactNode } from "react";
import { css, cx } from "@linaria/core";

import BodyRow from "../bodyRow.js";
import token from "../token.js";
import type { ColumnType, Row } from "../types.js";

// 底部汇总行整体贴住可视区底部（横向固定列单元格在其内部各自 sticky）
const summaryRowStyle = css`
    position: sticky;
    bottom: 0;
    z-index: 10;
`;

// 汇总单元格：背景与表头一致，加粗以区别于普通数据行
const summaryCellBaseStyle = css`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    vertical-align: top;
    height: 100%;
    overflow: hidden;
    padding-inline: ${token.summary['padding-inline']};
    background-color: ${token.header['bg-color']};
    color: ${token.summary.color};
    font-weight: ${token.summary['font-weight']};
`;

// 固定列汇总单元格：横向 sticky 跟随 X 轴滚动，盖在主体单元格之上
const summaryCellStickyStyle = css`
    position: sticky;
    z-index: 11;
`;

// 顶边（与数据区分隔）+ 右边（列分隔）
const summaryCellBorderStyle = css`
    box-shadow: inset 0 1px 0 ${token.border.color},
                inset -1px 0 0 ${token.border.color};
`;
// 最后一列：仅顶边
const summaryCellLastBorderStyle = css`
    box-shadow: inset 0 1px 0 ${token.border.color};
`;
// 固定右列：右边被自身 sticky 背景覆盖，改用左边分隔
const summaryCellRightFixedBorderStyle = css`
    box-shadow: inset 0 1px 0 ${token.border.color},
                inset 1px 0 0 ${token.border.color};
`;

const getSummaryJustify = <T extends Row>(column: ColumnType<T>) => {
    const align = Array.isArray(column.align) ? column.align[1] : column.align;
    return align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
};

export function useSummary<T extends Row>(params: {
    /** 是否显示汇总行 */
    showSummary: boolean
    /** 汇总行高度 */
    summaryRowHeight: number
    /** 表格全量数据行，供 summaryRender 计算聚合值 */
    rows: T[]
    /** 叶子列 */
    bottomColumns: ColumnType<T>[]
    /** 左 / 右固定列下标 */
    fixedLeftColumnsIdx: number[]
    fixedRightColumnsIdx: number[]
    /** 列宽数组 */
    gridTemplateColumns: number[]
    /** 固定列横向偏移 */
    stickyLeftOffsets: number[]
    stickyRightOffsets: number[]
    /** 行的总宽度 */
    actualHeight: number
    /** 虚拟列表左 / 右占位节点 */
    paddingLeft: ReactNode
    paddingRight: ReactNode
    /** 行选择列的列名（该列不渲染汇总内容） */
    selectionColumnName: string
}) {
    const {
        showSummary, summaryRowHeight, rows, bottomColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, gridTemplateColumns,
        stickyLeftOffsets, stickyRightOffsets, actualHeight,
        paddingLeft, paddingRight, selectionColumnName
    } = params;

    const renderSummaryCell = (columnIndex: number, fixed?: "left" | "right"): ReactNode => {
        const column = bottomColumns[columnIndex];
        if (!column) return null;
        const isLastColumn = columnIndex === bottomColumns.length - 1
            || (fixedRightColumnsIdx.length > 0 && columnIndex === fixedRightColumnsIdx[0] - 1);
        const borderStyle = fixed === "right"
            ? summaryCellRightFixedBorderStyle
            : isLastColumn ? summaryCellLastBorderStyle : summaryCellBorderStyle;
        const content = column.name === selectionColumnName
            ? null
            : column.summaryRender?.({ column, columnIndex, rows }) ?? null;
        return (
            <div
                key={`table-summary-cell-${columnIndex}`}
                className={cx(summaryCellBaseStyle, borderStyle, fixed && summaryCellStickyStyle)}
                style={{
                    width: gridTemplateColumns[columnIndex],
                    justifyContent: getSummaryJustify(column),
                    left: fixed === "left" ? stickyLeftOffsets[columnIndex] : undefined,
                    right: fixed === "right" ? stickyRightOffsets[columnIndex] : undefined
                }}
            >
                {content}
            </div>
        );
    };

    const generateSummaryElement = ({ columnRange }: { columnRange: [number, number] }): ReactNode => {
        if (!showSummary) return null;
        const mainCells: ReactNode[] = [];
        for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
            const column = bottomColumns[columnIndex];
            if (!column || column.fixed === "left" || column.fixed === "right") continue;
            mainCells.push(renderSummaryCell(columnIndex));
        }
        return (
            <BodyRow
                key="table-summary-row"
                className={summaryRowStyle}
                style={{ height: summaryRowHeight, width: actualHeight }}
            >
                {fixedLeftColumnsIdx.map((columnIndex) => renderSummaryCell(columnIndex, "left"))}
                {paddingLeft}
                {mainCells}
                {paddingRight}
                {fixedRightColumnsIdx.map((columnIndex) => renderSummaryCell(columnIndex, "right"))}
            </BodyRow>
        );
    };

    return { generateSummaryElement };
}