/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ConfigLocale = DocsTypePlaceholder;
type ConfigSize = DocsTypePlaceholder;
type ConfigTheme = DocsTypePlaceholder;

export interface ConfigProviderProps {
    /**
     * 品牌种子色（#RGB / #RRGGBB）；省略继承父级，null 恢复默认紫色。
     */
    "brandColor"?: string | null;

    /**
     * 语言；省略时继承父级，根级默认 zh-CN。
     */
    "locale"?: ConfigLocale;

    /**
     * 组件默认尺寸；省略时继承父级，根级默认 middle。
     */
    "size"?: ConfigSize;

    /**
     * 主题；省略时继承父级，根级默认 light。需加载 rc-theme CSS。
     */
    "theme"?: ConfigTheme;
}
