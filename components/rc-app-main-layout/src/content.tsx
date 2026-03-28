import type { FC, HTMLAttributes } from "react";
import { cx, css } from "@linaria/core";

const Content: FC<HTMLAttributes<HTMLElement>> = ({
    className,
    ...restProps
}) => {
    return (
        <main
            className={cx(className, css`
                flex-grow: 1;
                overflow-y: auto;
            `)}
            {...restProps}
        >
        </main>
    )
}

export default Content;

