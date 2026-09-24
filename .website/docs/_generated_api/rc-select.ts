/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SelectOption = DocsTypePlaceholder;
type SelectOptionOrGroup = DocsTypePlaceholder;

export interface SelectProps {
    /**
     * 字段外观，默认 outlined
     */
    "appearance"?: "outlined" | "filled";

    /**
     * 可见的浮动字段标签
     */
    "label"?: string;

    /**
     * 字段下方的辅助说明
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明
     */
    "errorText"?: string;

    /**
     * 表单必填语义与标签星号
     */
    "required"?: boolean;

    /**
     * combobox 容器 DOM 节点的 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 数据源：支持扁平选项数组或分组数组
     */
    "options": SelectOptionOrGroup[];

    /**
     * 占位符文本
     */
    "placeholder"?: string;

    /**
     * 是否禁用整个组件
     */
    "disabled"?: boolean;

    /**
     * 是否可搜索（显示输入框以过滤选项）
     */
    "searchable"?: boolean;

    /**
     * 组件尺寸；省略时继承 ConfigProvider，未配置时为 middle
     */
    "size"?: "large" | "middle" | "small";

    /**
     * 状态：用于显示错误或警告的边框样式
     */
    "status"?: "error" | "warning";

    /**
     * 是否允许清除；有已选项且未禁用时，悬停字段或聚焦尾部按钮会将箭头切换为清除
     */
    "allowClear"?: boolean;

    /**
     * 是否处于加载状态（显示加载指示器）
     */
    "loading"?: boolean;

    /**
     * 多选时的最大展示 tag 数量，超出则简写为 +n
     */
    "maxTagCount"?: number;

    /**
     * 是否自动聚焦输入
     */
    "autoFocus"?: boolean;

    /**
     * 无匹配项时的自定义渲染内容
     */
    "notFoundContent"?: ReactNode;

    /**
     * 下拉菜单额外 className
     */
    "popupClassName"?: string;

    /**
     * 下拉宽度是否与 Select 宽度保持一致
     */
    "popupMatchSelectWidth"?: boolean;

    /**
     * 自定义选项渲染函数，提供当前选项及其选中状态
     */
    "optionRender"?: ((option: SelectOption, info: { selected: boolean; }) => ReactNode);

    /**
     * 自定义 tag 渲染（多选时）
     */
    "tagRender"?: ((option: SelectOption, onClose: () => void) => ReactNode);

    /**
     * 自定义下拉菜单整体渲染（包裹原始菜单）
     */
    "dropdownRender"?: ((menu: ReactNode) => ReactNode);

    /**
     * 下拉打开/关闭回调
     */
    "onOpenChange"?: ((open: boolean) => void);

    /**
     * 聚焦与失焦回调
     */
    "onFocus"?: (() => void);

    /**
     * 暂无说明。
     */
    "onBlur"?: (() => void);

    /**
     * 暂无说明。
     */
    "multiple"?: false | true;

    /**
     * 暂无说明。
     */
    "value"?: string | null | string[];

    /**
     * 暂无说明。
     */
    "defaultValue"?: string | null | string[];

    /**
     * 暂无说明。
     */
    "onChange"?: ((value: string | null, option: SelectOption | undefined) => void) | ((value: string[], options: SelectOption[]) => void);
}
