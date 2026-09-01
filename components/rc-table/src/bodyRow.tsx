import { css, cx } from "@crab-dev/css";
import { memo, type FC, type HTMLAttributes } from "react";

interface BodyRowProps extends HTMLAttributes<HTMLDivElement> {
    /** 同一轮 Table render 内保持稳定；提供后允许跳过虚拟滚动造成的重复 children 构造。 */
    renderVersion?: object
    /** 行列虚拟窗口改变时强制更新 children。 */
    virtualWindowKey?: string
}

const BodyRow: FC<BodyRowProps> = ({
    className,
    children,
    renderVersion: _renderVersion,
    virtualWindowKey: _virtualWindowKey,
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

const MemoBodyRow = memo(BodyRow, (prev, next) => {
    // 未显式提供版本的普通用法保持标准 React 更新语义。
    if (prev.renderVersion == null || next.renderVersion == null) return false;
    // 同一 Table render + 同一横向窗口下，重新传入的 children/事件/style 均来自同一闭包，
    // 只是 RcVirtual 的滚动 state 触发了 renderRows，DOM 无需再次协调。
    return prev.renderVersion === next.renderVersion
        && prev.virtualWindowKey === next.virtualWindowKey;
});

export default MemoBodyRow as FC<BodyRowProps>;
