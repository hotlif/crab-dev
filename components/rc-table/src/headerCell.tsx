import { css, cx } from "@linaria/core";
import token from "./token.js";
import type { ColumnType, MergeCell, Row } from "./types.js";
import { getMergedCellSize } from "./util.js";

import type { HTMLAttributes, MouseEvent } from "react";

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
}

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

    const renderChildrenElement = () => {
        if (isSkipCell) {
            return null;
        }

        let renderElement = (
            <div
                className={css`
                    display: inline-block;
                    padding-inline: ${token.cell['padding-inline']};
                `}
            >
                {column?.title}
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
                        top: 0;
                        box-sizing: border-box;
                        display: inline-flex;
                        align-items: center;
                        background-color: ${token.header['bg-color']};
                    `, getMergedHeaderCellBorderStyle())}
                    style={{
                        width,
                        height,
                    }}
                >
                    {renderElement}
                </div>
            )
        }

        return renderElement;
    }

    return (
        <div
            className={cx(css`
                position: relative;
                display: inline-flex;
                align-items: center;
                box-sizing: border-box;
                vertical-align: top;
                height: 100%;
            `, className)}
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
                />
            )}
        </div>
    )
}

export default TableHeaderCell;
