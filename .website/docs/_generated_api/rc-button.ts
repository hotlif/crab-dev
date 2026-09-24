/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ButtonAppearance = DocsTypePlaceholder;
type ClickHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLAnchorElement = DocsTypePlaceholder;
type HTMLButtonElement = DocsTypePlaceholder;
type LegacyButtonAppearance = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface ButtonProps {
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
     */
    "loading"?: boolean;

    /**
     * 自定义加载图标，替换默认旋转 Spinner
     */
    "loadingIcon"?: ReactNode;

    /**
     * 外观：elevated（浮起）、primary（实色）、tonal（浅色）、outlined（描边，默认）、text（文字）。subtle 兼容映射为 outlined。
     */
    "appearance"?: ButtonAppearance | LegacyButtonAppearance;

    /**
     * 危险操作语义，可与公开外观组合；应同时提供明确的动作文案。
     */
    "danger"?: boolean;

    /**
     * Expressive 五档尺寸 xs/s/m/l/xl；small/middle/large 兼容映射为 xs/s/m，默认 middle
     */
    "size"?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'large' | 'middle' | 'small';

    /**
     * round（默认）或 square；circle 保留为纯图标按钮兼容形状
     */
    "shape"?: 'round' | 'square' | 'circle';

    /**
     * 选中状态（toggle / 工具栏过滤器场景）
     */
    "isSelected"?: boolean;

    /**
     * 宽度撑满父容器
     */
    "shouldFitContainer"?: boolean;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;

    /**
     * 暂无说明。
     */
    "href"?: string;

    /**
     * 暂无说明。
     */
    "onClick"?: ClickHandler<HTMLButtonElement> | ClickHandler<HTMLAnchorElement>;

    /**
     * 暂无说明。
     */
    "onClickCapture"?: ClickHandler<HTMLButtonElement> | ClickHandler<HTMLAnchorElement>;

    /**
     * 暂无说明。
     */
    "disabled"?: boolean;
}
