import { useControllableValue } from "./useControllableValue.js";
import { useEventCallback } from "./useEventCallback.js";

export interface ControllableOpenOptions {
    /** 受控展开态：非 `undefined` 即进入受控模式 */
    open?: boolean;
    /** 非受控模式下的初始展开态，默认 `false` */
    defaultOpen?: boolean;
    /** 展开态变化回调 */
    onOpenChange?: (open: boolean) => void;
}

/**
 * useControllableValue 的布尔特例：统一浮层 / 展开类组件（下拉、气泡、面板、菜单等）
 * 的 `open` 受控逻辑。返回的 setter 引用稳定。
 */
export function useControllableOpen(
    options: ControllableOpenOptions,
): readonly [boolean, (open: boolean) => void] {
    const { open, defaultOpen = false, onOpenChange } = options;
    const [value, setValue] = useControllableValue<boolean>({
        value: open,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });

    // 仅暴露 (open: boolean) 签名：调用方（如 Floating UI 的 onOpenChange 会附带
    // event / reason）传入的额外参数不应透传到 onOpenChange —— 其语义固定为
    // (open: boolean) => void。
    const setOpen = useEventCallback((next: boolean) => setValue(next));

    return [value, setOpen];
}
