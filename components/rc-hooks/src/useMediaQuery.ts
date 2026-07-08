import { useState } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";

/**
 * 订阅 CSS 媒体查询（JS 侧 `matchMedia`），如 `"(max-width: 768px)"` /
 * `"(prefers-reduced-motion: reduce)"`。SSR 安全：首帧返回 `false`，挂载后同步真实
 * 匹配值并订阅后续变化。
 *
 * 注意：纯样式响应式应优先写 CSS `@media`；本 hook 仅用于**布局 / 行为需要在 JS 中
 * 读取媒体查询结果**的场景。
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useIsomorphicLayoutEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) {
            return;
        }
        const mql = window.matchMedia(query);
        setMatches(mql.matches);
        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}
