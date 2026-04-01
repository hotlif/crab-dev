import { css, cx } from "@linaria/core";
import { type FC, type HTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
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
