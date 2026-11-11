// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactNode = DocsTypePlaceholder;

export interface FlowNodeReadability {
    /**
     * Minimum CSS-pixel label size, default 10.
     */
    "minFontSize"?: number;

    /**
     * Short label used below the minimum size (for example model name + field count).
     */
    "compactLabel"?: string;

    /**
     * Model/name + count at overview scale; defaults to compactLabel.
     */
    "overviewLabel"?: string;

    /**
     * Screen font size below which overviewLabel is used, default 7.
     */
    "overviewBelow"?: number;

    /**
     * Full, non-interactive details shown on hover/focus. Defaults to label.
     */
    "details"?: ReactNode;

    /**
     * Accessible name for the details button. Defaults to the complete label.
     */
    "detailsLabel"?: string;
}
