import { useState } from "react";
import { useEventCallback } from "./useEventCallback.js";

export interface ControllableValueOptions<T, A extends unknown[]> {
    /** 受控值：非 `undefined` 即进入受控模式，组件不再持有内部状态 */
    value?: T;
    /** 非受控模式下的初始值 */
    defaultValue?: T;
    /** 值变化回调；`setValue` 的额外参数（如事件对象、第二值）会原样透传给它 */
    onChange?: (value: T, ...args: A) => void;
}

/**
 * 统一"受控 / 非受控"取值：**受控优先，非受控由内部 state 兜底**。收敛各组件此前
 * 逐字重复的 `isControlled = prop !== undefined → isControlled ? prop : inner →
 * if (!isControlled) setInner` 样板。
 *
 * 返回的 `setValue` 引用稳定（经 useEventCallback，面向未启用 React Compiler 的消费
 * 方，见 §4.1 例外第 4 类），可安全用作子组件 prop / effect 依赖。额外参数会透传给
 * `onChange`，以适配 `onChange(next, event)`、`onChange(current, pageSize)` 等签名。
 */
export function useControllableValue<T, A extends unknown[] = []>(
    options: ControllableValueOptions<T, A>,
): readonly [T, (next: T, ...args: A) => void] {
    const { value, defaultValue, onChange } = options;
    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = useState<T | undefined>(defaultValue);

    // 受控取 props.value，非受控取内部 state。受控时 value 必非空，故断言为 T；
    // 非受控且未给 defaultValue 时确为 undefined，属真实语义，由调用方泛型承担。
    const mergedValue = (isControlled ? value : innerValue) as T;

    const setValue = useEventCallback((next: T, ...args: A) => {
        if (!isControlled) {
            setInnerValue(next);
        }
        onChange?.(next, ...args);
    });

    return [mergedValue, setValue] as const;
}
