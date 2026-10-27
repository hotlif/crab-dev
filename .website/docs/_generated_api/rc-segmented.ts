// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SegmentedChangeDetails = DocsTypePlaceholder;
type SegmentedRawOption = DocsTypePlaceholder;
type SegmentedSize = DocsTypePlaceholder;
type SegmentedValue = DocsTypePlaceholder;

export interface SegmentedProps {
    /**
     * 选项数据源, 支持对象或原始值简写
     */
    "options": SegmentedRawOption[];

    /**
     * 是否禁用整个控制器
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 尺寸, 默认为 medium
     */
    "size"?: SegmentedSize;

    /**
     * 是否撑满父容器并等宽分布各选项
     * @default false
     */
    "block"?: boolean;

    /**
     * 底层 radio 分组的 name, 缺省时自动生成, 用于隔离页面上多个控制器的键盘导航
     */
    "name"?: string;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 选项值, 选中后经 onValueChange 回传 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: SegmentedValue;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: SegmentedValue;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: SegmentedValue, details: SegmentedChangeDetails) => void);
}
