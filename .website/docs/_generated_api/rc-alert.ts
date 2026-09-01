/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type AlertType = DocsTypePlaceholder;
type HTMLButtonElement = DocsTypePlaceholder;
type ReactMouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface AlertPropsSearchIndex {
    /**
     * 警告类型
     * @default 'info'
     */
    "type"?: AlertType;

    /**
     * 标题
     */
    "title"?: ReactNode;

    /**
     * 是否显示图标
     * @default true
     */
    "showIcon"?: boolean;

    /**
     * 自定义图标
     */
    "icon"?: ReactNode;

    /**
     * 是否可关闭
     * @default false
     */
    "closable"?: boolean;

    /**
     * 自定义关闭按钮，设置为 false 可隐藏
     */
    "closeIcon"?: ReactNode | false;

    /**
     * 关闭回调
     */
    "onClose"?: (e: ReactMouseEvent<HTMLButtonElement>) => void;

    /**
     * 操作区域，位于右侧关闭按钮左侧
     */
    "action"?: ReactNode;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
