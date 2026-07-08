import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";

/**
 * 把"每次渲染都可能变化"的回调包装成引用稳定、但调用时读取最新实现的函数。
 *
 * 存在意义（tech-stack-constraints §4.1 例外白名单）：本仓库是组件库，消费方不一定
 * 启用 React Compiler。若把消费方传入的内联回调直接放进 effect / memo 依赖，会在未
 * 编译的下游造成反复重算 / effect 重跑。这里的手动稳定化属**第 4 类（面向库消费方的
 * 稳定化）**；用 latest-ref 持有最新实现属**第 2 类（latest-ref 模式）**。
 *
 * ref 的更新放在提交阶段（useIsomorphicLayoutEffect）而非渲染期，以不违反 Rules of
 * React；返回的函数在事件处理器 / effect 中调用时读到的始终是最新实现。
 */
export function useEventCallback<A extends unknown[], R>(
    fn: (...args: A) => R,
): (...args: A) => R {
    const fnRef = useRef<(...args: A) => R>(fn);

    // 提交阶段同步最新实现（第 2 类 latest-ref）：不在渲染期写 ref。
    useIsomorphicLayoutEffect(() => {
        fnRef.current = fn;
    });

    // 稳定引用（第 4 类）：整个生命周期引用不变，调用时转发到最新实现。
    return useCallback((...args: A) => fnRef.current(...args), []);
}
