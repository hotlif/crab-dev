import type { FC, HTMLAttributes } from "react";
import { flexGrow, overflow } from "@crab/styleify";
import { cx, css } from "@linaria/core";

interface ContentProps extends Omit<
    HTMLAttributes<HTMLElement>, ""> {
}

const Content: FC<ContentProps> = ({
    className,
    ...restProps
}) => {
    return (
        <main
            className={cx(className, css`
                ${flexGrow(1)}
                ${overflow("y-auto")}
            `)}
            {...restProps}
        >
        </main>
    )
}

export default Content;

