import { css, cx } from "@linaria/core";
import { JSONPath } from "jsonpath-plus";
import type { ColumnType, MergeCell, Row } from "./types";
import React, { useMemo } from "react";
import { getMergedCellSize } from "./util";

interface TableCellProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
    row: T
    rowIndex: number,
    columnIndex: number,
    column: ColumnType<T>,
    gridTemplateRows: number[],
    gridTemplateColumns: number[],
    isSkipCell: boolean
    mergeCell?: MergeCell
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
    ...restProps
}: TableCellProps<T>){

    const dataValue = useMemo(() => {
        const result = JSONPath({
            path: column.name,
            json: row.dataRef,
        })
        return result;
    }, [column, row])

    const renderChildrenElement = () => {
        if (isSkipCell) {
            return null;
        }

        let renderElement = (
            <div
                className={css`
                    display: inline-block;
                    padding-inline: 8px;
                `}
            >
                {dataValue}
            </div>
        )

        /**
         * 如果有合并单元格，则需要计算合并单元格的宽度和高度, 并且生产合并单元格的信息
         */
        if (mergeCell) {
            const { 
                width,
                height
            } = getMergedCellSize({
                gridTemplateRows,
                gridTemplateColumns,
                mergeCell
            });

            renderElement = (
                <div
                    className={css`
                        position: absolute;
                        z-index: 1;
                        top: 0;
                        box-sizing: border-box;
                        background-color: #fff;
                        display: inline-flex;
                        align-items: center;
                        border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
                        border-top: 1px solid var(--crab-rc-table-border-color, #ddd);
                        border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
                    `}
                    style={{
                        width,
                        height
                    }}
                >
                    {renderElement}
                </div>
            )
        }

        if (column.render) {
            return column.render({
                row,
                rowIndex,
                columnIndex,
                column,
                originalElement: renderElement
            })
        } else {
            return renderElement;
        }
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
                border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
                border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
            `, className)}
            {...restProps}
        >
            {renderChildrenElement()}
        </div>
    )
}

export default TableCell;
