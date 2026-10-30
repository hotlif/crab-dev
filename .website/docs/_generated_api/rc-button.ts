// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ButtonAppearance = DocsTypePlaceholder;
type ClickHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS = DocsTypePlaceholder;
type FormData = DocsTypePlaceholder;
type HTMLAnchorElement = DocsTypePlaceholder;
type HTMLAttributeAnchorTarget = DocsTypePlaceholder;
type HTMLAttributeReferrerPolicy = DocsTypePlaceholder;
type HTMLButtonElement = DocsTypePlaceholder;
type LegacyButtonAppearance = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
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
     * @default false
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
     * Expressive 五档尺寸 xs/s/m/l/xl；省略时由全局 small/medium/large 映射为 xs/s/m
     */
    "size"?: 'xs' | 's' | 'm' | 'l' | 'xl';

    /**
     * 省略时随设计风格：Material 为 round，shadcn 为 square；circle 适用于纯图标按钮
     */
    "shape"?: 'round' | 'square' | 'circle';

    /**
     * 选中状态（toggle / 工具栏过滤器场景）
     */
    "isSelected"?: boolean;

    /**
     * 宽度撑满父容器
     * @default false
     */
    "shouldFitContainer"?: boolean;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * Defines a string value that labels the current element.
     */
    "aria-label"?: (string) & ((string) & (string | undefined));

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "referrerPolicy"?: HTMLAttributeReferrerPolicy | undefined;

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "download"?: any;

    /**
     * 暂无说明。
     */
    "href"?: (undefined) & (never) | string;

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "hrefLang"?: string | undefined;

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "media"?: string | undefined;

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "ping"?: string | undefined;

    /**
     * 暂无说明。 与 form、formAction、formEncType、formMethod、formNoValidate、formTarget、name、value 互斥，不能同时提供。
     */
    "target"?: HTMLAttributeAnchorTarget | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "form"?: string | undefined;

    /**
     * 暂无说明。
     */
    "disabled"?: boolean | undefined | boolean;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "formAction"?: string | ((formData: FormData) => void | Promise<void>) | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS] | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "formEncType"?: string | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "formMethod"?: string | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "formNoValidate"?: boolean | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "formTarget"?: string | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "name"?: string | undefined;

    /**
     * 暂无说明。 与 referrerPolicy、download、hrefLang、media、ping、target 互斥，不能同时提供。
     */
    "value"?: string | readonly string[] | number | undefined;

    /**
     * 暂无说明。
     */
    "onClick"?: ClickHandler<HTMLButtonElement> | ClickHandler<HTMLAnchorElement>;

    /**
     * 暂无说明。
     */
    "onClickCapture"?: ClickHandler<HTMLButtonElement> | ClickHandler<HTMLAnchorElement>;
}
