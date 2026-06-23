import { type HTMLAttributes, type ReactNode } from "react";

/** 容器的宽高尺寸，单位为 px（整数） */
export interface Size {
    /** 容器宽度，单位 px */
    width: number;
    /** 容器高度，单位 px */
    height: number;
}

export interface AutoSizerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * 渲染函数，接收当前容器的 { width, height }，返回需要渲染的内容。
     * 用法与 react-virtualized-auto-sizer 保持一致。
     */
    children: (size: Size) => ReactNode;
    /**
     * SSR 或首帧渲染时的默认宽度，ResizeObserver 触发后自动替换。
     * @default 0
     */
    defaultWidth?: number;
    /**
     * SSR 或首帧渲染时的默认高度，ResizeObserver 触发后自动替换。
     * @default 0
     */
    defaultHeight?: number;
    /**
     * 容器尺寸变化时的回调，与子渲染函数收到的 size 一致。
     */
    onResize?: (size: Size) => void;
    /**
     * 禁用高度自动测量，始终返回 defaultHeight 给子渲染函数。
     * 适合只需感知宽度的场景（如水平虚拟列表）。
     * @default false
     */
    disableHeight?: boolean;
    /**
     * 禁用宽度自动测量，始终返回 defaultWidth 给子渲染函数。
     * 适合只需感知高度的场景。
     * @default false
     */
    disableWidth?: boolean;
}
