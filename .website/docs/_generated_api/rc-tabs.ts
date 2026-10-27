// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLElement = DocsTypePlaceholder;
type ReactKeyboardEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactMouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type TabsBarExtraContent = DocsTypePlaceholder;
type TabsChangeDetails = DocsTypePlaceholder;
type TabsItem = DocsTypePlaceholder;
type TabsSize = DocsTypePlaceholder;
type TabsType = DocsTypePlaceholder;

export interface TabsProps {
    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: string | number | readonly string[] | undefined | string;

    /**
     * 暂无说明。
     */
    "items": TabsItem[];

    /**
     * 暂无说明。
     * @default ’line’
     */
    "type"?: TabsType;

    /**
     * 暂无说明。
     */
    "size"?: TabsSize;

    /**
     * 暂无说明。
     * @default false
     */
    "centered"?: boolean;

    /**
     * 暂无说明。
     * @default false
     */
    "destroyInactiveTabPane"?: boolean;

    /**
     * 暂无说明。
     */
    "tabBarExtraContent"?: ReactNode | TabsBarExtraContent;

    /**
     * 暂无说明。
     */
    "onTabClose"?: (key: string, event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => void;

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: string;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: string, details: TabsChangeDetails) => void);
}
