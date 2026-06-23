import { useLayoutEffect, useRef, useState } from "react";
import { css, cx } from "@linaria/core";

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
 * 基于 ResizeObserver 实现，仅在尺寸真正变化时触发重渲染。
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

    // 用 ref 持有最新值，避免 ResizeObserver 闭包陈旧引用，同时不触发 effect 重建
    const onResizeRef = useRef(onResize);
    const disableWidthRef = useRef(disableWidth);
    const disableHeightRef = useRef(disableHeight);
    const defaultWidthRef = useRef(defaultWidth);
    const defaultHeightRef = useRef(defaultHeight);
    // 用 ref 追踪已提交的最新尺寸，在 observer 回调层去重，避免触发 React 额外 bailout 渲染
    const committedSizeRef = useRef<Size>({ width: defaultWidth, height: defaultHeight });

    onResizeRef.current = onResize;
    disableWidthRef.current = disableWidth;
    disableHeightRef.current = disableHeight;
    defaultWidthRef.current = defaultWidth;
    defaultHeightRef.current = defaultHeight;

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (el === null) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            const { width, height } = entry.contentRect;

            const newSize: Size = {
                width: disableWidthRef.current
                    ? defaultWidthRef.current
                    : Math.round(width),
                height: disableHeightRef.current
                    ? defaultHeightRef.current
                    : Math.round(height),
            };

            // 尺寸未变化时直接跳过，不调用 setSize 也不触发 onResize
            const committed = committedSizeRef.current;
            if (newSize.width === committed.width && newSize.height === committed.height) {
                return;
            }

            committedSizeRef.current = newSize;
            setSize(newSize);
            onResizeRef.current?.(newSize);
        });

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

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
