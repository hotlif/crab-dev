import { useEffect } from "react";
import { useEventCallback } from "./useEventCallback.js";

/**
 * 声明式 `setInterval`：`delay` 为 `null` 时暂停；`callback` 引用可不稳定（内部经
 * useEventCallback 读取最新实现，改变 callback 不会重置计时器）。卸载 / `delay`
 * 变化时自动清理。
 */
export function useInterval(callback: () => void, delay: number | null): void {
    const onTick = useEventCallback(callback);

    useEffect(() => {
        if (delay === null) {
            return;
        }
        const id = setInterval(() => onTick(), delay);
        return () => clearInterval(id);
    }, [delay, onTick]);
}
