import type { FC, HTMLAttributes } from "react";
import { cx, css } from "@linaria/core";
import token from "./token.js";

const contentStyle = css`
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    background-color: ${token.content.background.color};
`;

const Content: FC<HTMLAttributes<HTMLElement>> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <main
            className={cx(contentStyle, className)}
            {...restProps}
        >
            {children}
        </main>
    )
}

export default Content;

