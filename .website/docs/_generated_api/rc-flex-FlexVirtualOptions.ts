// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Key = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface FlexVirtualOptions {
    /**
     * 项目总数，取非负安全整数。
     */
    "itemCount": number;

    /**
     * 每项固定高度，单位为 px，必须大于 0。
     */
    "itemHeight": number;

    /**
     * 卡片宽度（px）。提供后按可用宽度换行，省略时每项独占一行。
     */
    "itemWidth"?: number;

    /**
     * 视口上下额外挂载的行数，默认 2。
     */
    "overscan"?: number;

    /**
     * 返回项目的稳定业务标识。
     */
    "getItemKey": (index: number) => Key;

    /**
     * 渲染指定索引的项目，仅访问当前窗口。
     */
    "renderItem": (index: number) => ReactNode;
}
