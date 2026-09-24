import type { FC, HTMLAttributes } from "react";
import { cx, css } from "@crab-dev/css";
import token from "./token.js";
import type { ContentLandmark } from "./types.js";

const contentStyle = css`
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    background-color: ${token.content["background-color"]};
`;

interface ContentProps extends Omit<HTMLAttributes<HTMLElement>, "role" | "aria-label"> {
    landmark?: ContentLandmark;
}

const Content: FC<ContentProps> = ({
    className,
    children,
    landmark = { role: "main" },
    ...restProps
}) => {
    const Tag = landmark.role === "region" ? "section" : "main";
    return (
        <Tag
            className={cx.call(undefined, contentStyle, className)}
            {...restProps}
            role={landmark.role}
            aria-label={landmark["aria-label"]}
        >
            {children}
        </Tag>
    )
}

export default Content;

