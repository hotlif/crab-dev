/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ButtonHTMLAttributes<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLButtonElement = DocsTypePlaceholder;
type NonNullable<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Parameters<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface ButtonPropsSearchIndex {
    /**
     * 图标（左侧）
     */
    "icon"?: ReactNode;

    /**
     * 图标（右侧）
     */
    "iconAfter"?: ReactNode;

    /**
     * 加载中
     * @default false
     */
    "loading"?: boolean;

    /**
     * 自定义加载图标，替换默认旋转 Spinner
     */
    "loadingIcon"?: ReactNode;

    /**
     * 按钮外观
     */
    "appearance"?: 'primary' | 'subtle' | 'dashed' | 'text' | 'link' | 'danger';

    /**
     * 按钮大小，默认 middle
     */
    "size"?: 'large' | 'middle' | 'small';

    /**
     * 按钮形状，circle 时宽高相等、边框全圆
     */
    "shape"?: 'circle';

    /**
     * 选中状态（toggle / 工具栏过滤器场景）
     * @default false
     */
    "isSelected"?: boolean;

    /**
     * 宽度撑满父容器
     * @default false
     */
    "shouldFitContainer"?: boolean;

    /**
     * 存在时渲染为 <a> 元素
     */
    "href"?: string;

    /**
     * 链接打开方式（_blank / _self / _parent / _top）
     */
    "target"?: string;

    /**
     * 链接 rel 属性，href 为外部地址时建议传 "noopener noreferrer"
     */
    "rel"?: string;

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
     */
    "onClick"?: ( param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']>>[0], ) => Promise<void> | void;

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]
     */
    "onClickCapture"?: ( param: Parameters< NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClickCapture']> >[0], ) => Promise<void> | void;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
