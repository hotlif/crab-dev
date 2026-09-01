/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type BadgePresetColor = DocsTypePlaceholder;
type BadgeStatus = DocsTypePlaceholder;
type CSSProperties = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface BadgePropsSearchIndex {
    /**
     * 包裹的子节点，有子节点时以角标形式浮动在右上角
     */
    "children"?: ReactNode;

    /**
     * 自定义类名
     */
    "className"?: string;

    /**
     * 自定义颜色：预设语义色或任意 CSS 颜色字符串
     */
    "color"?: BadgePresetColor | string;

    /**
     * 展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`
     */
    "count"?: number | ReactNode;

    /**
     * 不展示数字，只显示小圆点
     * @default false
     */
    "dot"?: boolean;

    /**
     * 自定义角标类名
     */
    "indicatorClassName"?: string;

    /**
     * 自定义角标样式
     */
    "indicatorStyle"?: CSSProperties;

    /**
     * 设置状态点的位置偏移，格式 [x, y]，单位 px 或带单位的字符串
     */
    "offset"?: [number | string, number | string];

    /**
     * 最大显示数，count 超出时显示为 `${overflowCount}+`。默认 99
     */
    "overflowCount"?: number;

    /**
     * 当数值为 0 时是否展示
     * @default false
     */
    "showZero"?: boolean;

    /**
     * 角标尺寸
     * @default 'default'
     */
    "size"?: 'default' | 'small';

    /**
     * 状态圆点类型，与 text 一起构成"状态 + 文字"模式（无子节点时生效）
     */
    "status"?: BadgeStatus;

    /**
     * 自定义样式
     */
    "style"?: CSSProperties;

    /**
     * 设置状态点的文字（与 status 搭配）
     */
    "text"?: ReactNode;

    /**
     * 鼠标悬停时的提示内容（默认等于 count）
     */
    "title"?: string;
}
