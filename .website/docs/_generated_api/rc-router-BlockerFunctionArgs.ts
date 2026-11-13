// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Location = DocsTypePlaceholder;
type NavigationType = DocsTypePlaceholder;

export interface BlockerFunctionArgs {
    /**
     * 暂无说明。
     */
    "currentLocation": Location;

    /**
     * 暂无说明。
     */
    "nextLocation": Location;

    /**
     * 暂无说明。
     */
    "historyAction": NavigationType;
}
