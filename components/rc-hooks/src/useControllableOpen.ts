import { useControllableValue } from "./useControllableValue.js";

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
    return useControllableValue<boolean>({
        value: open,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
}
