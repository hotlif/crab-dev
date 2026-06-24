import { css, cx } from "@linaria/core";
import { type FC, type HTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BodyRowProps extends HTMLAttributes<HTMLDivElement> {
}

const BodyRow: FC<BodyRowProps> = ({
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

export default BodyRow;
