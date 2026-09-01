/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type PreviewCodeTheme = DocsTypePlaceholder;
type PreviewDensity = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface PreviewPropsSearchIndex {
    /**
     * 源码高亮主题，默认 light
     * @default 'light'
     */
    "codeTheme"?: PreviewCodeTheme;

    /**
     * 默认是否展开代码，默认 false
     * @default false
     */
    "defaultExpanded"?: boolean;

    /**
     * 预览区密度，控制舞台留白
     * @default 'regular'
     */
    "density"?: PreviewDensity;

    /**
     * 描述内容（标题下方一行）。 - 传入 string 时按 Markdown 内联语法渲染； - 传入 ReactNode 时原样渲染。
     */
    "description"?: ReactNode;

    /**
     * 源码语言，默认 tsx
     * @default 'tsx'
     */
    "language"?: string;

    /**
     * 自定义复制行为；默认 navigator.clipboard.writeText
     */
    "onCopyCode"?: (code: string) => Promise<void> | void;

    /**
     * 自定义新窗口打开方式，默认 window.open
     */
    "onOpenExternal"?: (path: string) => void;

    /**
     * 在新窗口打开的 URL；为空时隐藏外链按钮
     */
    "path"?: string;

    /**
     * 展示在源码区的代码字符串；为空时隐藏「源码」按钮
     */
    "sourceCode"?: string;

    /**
     * 中间信息栏的标题；可以是文本或自定义节点
     */
    "title"?: ReactNode;
}
