
import { useMemo, type FC, type HTMLAttributes } from "react";
import { css, cx } from "@linaria/core";
import { transformCode } from "./util";

export interface LiveProps extends HTMLAttributes<HTMLDivElement> {

    /**
     * 源代码
     */
    source: string;

    /**
     * 引入组件的依赖
     */
    scopes: any;
}

const Live: FC<LiveProps> = ({
    source,
    scopes,
    className,
    ...props
}) => {

    const anyComponent = useMemo(() => {
        return transformCode(source, scopes);
    }, [scopes, source]);

    return (
        <div
            className={cx(css`
            `, className)}
            {...props}
        >
            {anyComponent}
        </div>
    )
}

export default Live;
