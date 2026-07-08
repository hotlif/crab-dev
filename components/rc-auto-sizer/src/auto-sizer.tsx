import { useRef, useState } from "react";
import { css, cx } from "@linaria/core";
import { useResizeObserver } from "@crab-dev/rc-hooks";

import type { AutoSizerProps, Size } from "./types.js";

/** 撑满父容器，子内容超出时隐藏，避免尺寸测量被子内容反向撑大 */
const containerStyle = css`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

/**
 * AutoSizer 自动测量容器宽高，并将 { width, height } 通过渲染函数传入子组件。
 *
 * 基于 rc-hooks 的 useResizeObserver 实现，仅在尺寸真正变化时触发重渲染。
 * 常与 Virtual 虚拟滚动组件配合使用，将外部容器尺寸传入 viewportWidth / viewportHeight。
 */
const AutoSizer = ({
    children,
    defaultWidth = 0,
    defaultHeight = 0,
    onResize,
    disableHeight = false,
    disableWidth = false,
    className,
    style,
    ...rest
}: AutoSizerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [size, setSize] = useState<Size>({
        width: defaultWidth,
        height: defaultHeight,
    });

    // 可变实例状态 ref（例外白名单第 1 类）：追踪已提交尺寸，在回调层去重，
    // 避免相同尺寸触发额外 setSize / onResize。observer 回调经 useResizeObserver
    // 内部的 useEventCallback 兜底，可直接读取最新的 props，无需再手持 latest-ref。
    const committedSizeRef = useRef<Size>({
        width: defaultWidth,
        height: defaultHeight,
    });

    useResizeObserver(containerRef, (entry) => {
        const { width, height } = entry.contentRect;

        const newSize: Size = {
            width: disableWidth ? defaultWidth : Math.round(width),
            height: disableHeight ? defaultHeight : Math.round(height),
        };

        const committed = committedSizeRef.current;
        if (newSize.width === committed.width && newSize.height === committed.height) {
            return;
        }

        committedSizeRef.current = newSize;
        setSize(newSize);
        onResize?.(newSize);
    });

    return (
        <div
            ref={containerRef}
            className={cx(containerStyle, className)}
            style={style}
            {...rest}
        >
            {children(size)}
        </div>
    );
};

export default AutoSizer;
