import { useEffect } from "react";
import { useEventCallback } from "./useEventCallback.js";

/**
 * 声明式 `setTimeout`：`delay` 为 `null` 时暂停计时；`callback` 引用可不稳定
 * （内部经 useEventCallback 读取最新实现，改变 callback 不会重置计时器）。
 * 卸载 / `delay` 变化时自动清理，收敛各处手写的 timer 清理样板。
 */
export function useTimeout(callback: () => void, delay: number | null): void {
    const onTimeout = useEventCallback(callback);

    useEffect(() => {
        if (delay === null) {
            return;
        }
        const id = setTimeout(() => onTimeout(), delay);
        return () => clearTimeout(id);
    }, [delay, onTimeout]);
}
