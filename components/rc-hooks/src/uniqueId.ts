/**
 * 生成进程内唯一的字符串 id：模块级计数器每次调用自增，拼接可选前缀后返回。
 *
 * 用途：为运行时动态创建、需要稳定 `key` 又无天然主键的元素（toast、通知、列表项等）
 * 分配唯一标识。计数器是模块级全局单例，故跨组件实例、跨多次调用都不会碰撞——这正是
 * 它区别于 React 19 `useId` 的地方：`useId` 为「单个组件的一个稳定 id」而设计，无法在
 * 事件回调里按需产出新 id。
 *
 * 这是**纯工具函数而非 Hook**，可在渲染期之外（事件处理器 / 回调）自由调用；产出的 id
 * 仅在单次进程生命周期内唯一，不适合作为需跨会话或持久化的稳定标识。
 *
 * @param prefix 可选前缀，默认空串。
 * @returns 形如 `${prefix}${n}` 的唯一字符串（`n` 为自增整数）。
 */
let idCounter = 0;

export function uniqueId(prefix = ""): string {
    idCounter += 1;
    return `${prefix}${idCounter}`;
}
