import { css, cx } from "@linaria/core";
import type { ColumnType, Row } from "./types";

interface TableHeaderCellProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
    columnIndex: number,
    column: ColumnType<T>
    isSkipCell: boolean
}

function TableHeaderCell<T extends Row>({
    column,
    columnIndex,
    className,
    isSkipCell,
    ...restProps
}: TableHeaderCellProps<T>){

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
                {column.title}
            </div>
        )

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
                border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
                border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
                background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
            `, className)}
            {...restProps}
        >
            {renderChildrenElement()}
        </div>
    )
}

export default TableHeaderCell;
