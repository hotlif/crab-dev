import { css, cx } from "@linaria/core";
import { type FC } from "react";

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
}

const TableRow: FC<TableRowProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <div
            className={cx(css`
                white-space: nowrap;
                box-sizing: border-box;
            `, className)}
            {...restProps}
        >
            {children}
        </div>
    )
}

export default TableRow;
