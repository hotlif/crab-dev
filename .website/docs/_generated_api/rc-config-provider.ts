// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ConfigColorMode = DocsTypePlaceholder;
type ConfigDensity = DocsTypePlaceholder;
type ConfigDesignSystem = DocsTypePlaceholder;
type ConfigDirection = DocsTypePlaceholder;
type ConfigLocale = DocsTypePlaceholder;
type ConfigSize = DocsTypePlaceholder;

export interface ConfigProviderProps {
    /**
     * 设计体系；省略继承父级，根级默认 md3。
     */
    "designSystem"?: ConfigDesignSystem;

    /**
     * 已解析的明暗模式；省略继承父级，根级默认 light。
     */
    "colorMode"?: ConfigColorMode;

    /**
     * 品牌种子色（#RGB / #RRGGBB）；省略继承父级，null 恢复当前设计风格的默认品牌。
     */
    "brandColor"?: string | null;

    /**
     * 语言；省略时继承父级，根级默认 zh-CN。
     */
    "locale"?: ConfigLocale;

    /**
     * 控件默认尺寸；省略继承父级，根级默认 medium。
     */
    "size"?: ConfigSize;

    /**
     * 数据、导航与布局密度，独立于控件尺寸；默认 standard。
     */
    "density"?: ConfigDensity;

    /**
     * 文字与布局方向；省略继承父级，根级默认 ltr。
     */
    "direction"?: ConfigDirection;
}
