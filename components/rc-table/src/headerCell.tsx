import { css, cx } from "@linaria/core";
import type { ColumnType, MergeCell, Row } from "./types";
import { getMergedCellSize } from "./util";

interface TableHeaderCellProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
    columnIndex: number,
    column?: ColumnType<T>
    gridTemplateColumns: number[]
    gridTemplateRows: number[]
    mergeCell?: MergeCell
    isSkipCell: boolean
}

function TableHeaderCell<T extends Row>({
    column,
    columnIndex,
    className,
    isSkipCell,
    mergeCell,
    gridTemplateRows,
    gridTemplateColumns,
    ...restProps
}: TableHeaderCellProps<T>){

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
                    className={css`
                        position: absolute;
                        top: 0;
                        box-sizing: border-box;
                        display: inline-flex;
                        align-items: center;
                        background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
                        border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
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

        return renderElement;
    }

    return (
        <div
            className={cx(css`
                display: inline-flex;
                align-items: center;
                box-sizing: border-box;
                vertical-align: top;
                height: 100%;
            `, className)}
            {...restProps}
        >
            {renderChildrenElement()}
        </div>
    )
}

export default TableHeaderCell;
