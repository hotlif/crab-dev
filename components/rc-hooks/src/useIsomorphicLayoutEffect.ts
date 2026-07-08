import { useEffect, useLayoutEffect } from "react";

/**
 * SSR 安全的 layout effect：浏览器端用 `useLayoutEffect`，非浏览器环境（SSR）回退
 * `useEffect`，避免服务端渲染期间 React 关于 `useLayoutEffect` 无效的告警。
 *
 * 作为 useEventCallback / useResizeObserver / useMediaQuery 的内部依赖。
 */
export const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;
