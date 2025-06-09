import { css, cx } from "@linaria/core";
import { JSONPath } from "jsonpath-plus";
import type { Align, ColumnType, MergeCell, Row } from "./types";
import React, { useMemo } from "react";
import { getMergedCellSize } from "./util";

interface TableCellProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
    row: T
    rowIndex: number,
    columnIndex: number,
    column: ColumnType<T>,
    fixed?: "left" | "right"
    gridTemplateRows: number[],
    gridTemplateColumns: number[],
    isSkipCell: boolean
    mergeCell?: MergeCell
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
    ...restProps
}: TableCellProps<T>){

    const dataValue = useMemo(() => {
        const result = JSONPath({
            path: column.name,
            json: row.dataRef,
        })
        return result;
    }, [column, row])


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
                    {dataValue}
                </div>
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
                        width,
                        height,
                        justifyContent: getJustifyContent()
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
                border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
            `, getBorderStyle(), className)}
            style={{
                ...style,
            }}
            {...restProps}
        >
            {renderChildrenElement()}
        </div>
    )
}

export default TableCell;
