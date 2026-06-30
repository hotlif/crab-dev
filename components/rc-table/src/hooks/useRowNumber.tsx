import { useMemo, useRef } from "react";
import { css } from "@linaria/core";
import token from "../token.js";
import type { ColumnType, Row } from "../types.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { isGroupRow, isExpandedContentRow } from "../util.js";

export const ROW_NUMBER_COLUMN_NAME = '__rc_table_row_number__';

// 序号列单元格：绝对定位铺满 bodyCell，覆盖行选中背景，保持与表头一致的静态底色。
// 右对齐 + caption 字号 + 三级灰色，让序号具有"行号"的辅助感，不与数据列内容争抢视觉权重。
// box-shadow 与 bodyCell 普通列保持一致（inset 边框被此 div 的背景遮挡，需在此层补回）。
const rowNumberCellStyle = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: ${token.cell['padding-inline']};
    background-color: ${token.header['bg-color']};
    color: ${token.sort['icon-color']};
    font-size: ${token.group['count-font-size']};
    font-variant-numeric: tabular-nums;
    user-select: none;
    box-shadow: inset -1px 0 0 ${token.border.color},
                inset 0 -1px 0 ${token.border.color};
`;

interface UseRowNumberOptions {
    showRowNumber: boolean
    rowNumberColumnFixed?: boolean
    rowNumberColumnWidth?: number
}

/**
 * 管理行序号列：返回列定义（numberColumn）和同步函数（syncRowNumbers）。
 *
 * 设计约束：numberColumn 须在 effectiveColumns（displayRows 之前）中存在，
 * 而序号映射须在 displayRows 确定后才能计算。两者通过内部 ref 解耦——
 * 调用方在 displayRows 确定后立即调用 syncRowNumbers(displayRows)，
 * 直接写 ref（不触发 re-render），render 时从 ref 读取最新映射。
 */
export function useRowNumber<T extends Row>({
    showRowNumber,
    rowNumberColumnFixed,
    rowNumberColumnWidth,
}: UseRowNumberOptions): {
    numberColumn: ColumnType<T> | null
    syncRowNumbers: (displayRows: (T | InternalGroupRow<T> | InternalExpandedRow<T>)[]) => void
} {
    const rowNumberMapRef = useRef<Map<number, number>>(new Map());

    const numberColumn = useMemo<ColumnType<T> | null>(() => {
        if (!showRowNumber) return null;
        const isFixed = rowNumberColumnFixed !== false;
        return {
            name: ROW_NUMBER_COLUMN_NAME,
            title: '',
            fixed: isFixed ? 'left' : undefined,
            width: rowNumberColumnWidth ?? 30,
            selectable: false,
            sortable: false,
            resizable: false,
            filterable: false,
            render: ({ rowIndex }) => (
                <div className={rowNumberCellStyle}>
                    {rowNumberMapRef.current.get(rowIndex)}
                </div>
            ),
        };
    }, [showRowNumber, rowNumberColumnFixed, rowNumberColumnWidth]);

    const syncRowNumbers = (displayRows: (T | InternalGroupRow<T> | InternalExpandedRow<T>)[]) => {
        if (!showRowNumber) {
            rowNumberMapRef.current = new Map();
            return;
        }
        const map = new Map<number, number>();
        let num = 0;
        displayRows.forEach((row, idx) => {
            if (!isGroupRow(row) && !isExpandedContentRow(row)) {
                num++;
                map.set(idx, num);
            }
        });
        rowNumberMapRef.current = map;
    };

    return { numberColumn, syncRowNumbers };
}
