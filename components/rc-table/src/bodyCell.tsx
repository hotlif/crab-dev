import { css, cx } from "@linaria/core";
import { JSONPath } from "jsonpath-plus";
import type { ColumnType, Row } from "./types";
import React, { type ReactNode, useMemo } from "react";

interface TableCellProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
    row: T
    rowIndex: number,
    columnIndex: number,
    column: ColumnType<T>,
    isSkipCell: boolean
    renderElement?: (originalElement: ReactNode) => ReactNode
}

function TableCell<T extends Row>({
    row,
    rowIndex,
    column,
    columnIndex,
    className,
    isSkipCell,
    renderElement = (originalElement) => originalElement,
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
        const renderElement = (
            <div
                className={css`
                    display: inline-block;
                    padding-inline: 8px;
                `}
            >
                {dataValue}
            </div>
        )

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
            {renderElement(renderChildrenElement())}
        </div>
    )
}

export default TableCell;
