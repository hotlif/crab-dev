/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLElement = DocsTypePlaceholder;
type ReactKeyboardEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactMouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type TabsBarExtraContent = DocsTypePlaceholder;
type TabsItem = DocsTypePlaceholder;
type TabsSize = DocsTypePlaceholder;
type TabsType = DocsTypePlaceholder;

export interface TabsPropsSearchIndex {
    /**
     * 暂无说明。
     */
    "activeKey"?: string;

    /**
     * 暂无说明。
     * @default false
     */
    "centered"?: boolean;

    /**
     * 暂无说明。
     */
    "defaultActiveKey"?: string;

    /**
     * 暂无说明。
     * @default false
     */
    "destroyInactiveTabPane"?: boolean;

    /**
     * 暂无说明。
     */
    "items": TabsItem[];

    /**
     * 暂无说明。
     */
    "onChange"?: (activeKey: string) => void;

    /**
     * 暂无说明。
     */
    "onTabClose"?: (key: string, event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => void;

    /**
     * 暂无说明。
     * @default 'medium'
     */
    "size"?: TabsSize;

    /**
     * 暂无说明。
     */
    "tabBarExtraContent"?: ReactNode | TabsBarExtraContent;

    /**
     * 暂无说明。
     * @default 'line'
     */
    "type"?: TabsType;
}
