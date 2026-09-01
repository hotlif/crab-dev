/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SegmentedRawOption = DocsTypePlaceholder;
type SegmentedSize = DocsTypePlaceholder;
type SegmentedValue = DocsTypePlaceholder;

export interface SegmentedPropsSearchIndex {
    /**
     * 是否撑满父容器并等宽分布各选项
     * @default false
     */
    "block"?: boolean;

    /**
     * 默认选中值（非受控）, 缺省时取第一个可用选项
     */
    "defaultValue"?: SegmentedValue;

    /**
     * 是否禁用整个控制器
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 底层 radio 分组的 name, 缺省时自动生成, 用于隔离页面上多个控制器的键盘导航
     */
    "name"?: string;

    /**
     * 选中值变化时的回调
     */
    "onChange"?: (value: SegmentedValue) => void;

    /**
     * 选项数据源, 支持对象或原始值简写
     */
    "options": SegmentedRawOption[];

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 尺寸, 默认为 middle
     * @default 'middle'
     */
    "size"?: SegmentedSize;

    /**
     * 当前选中值（受控）
     */
    "value"?: SegmentedValue;
}
