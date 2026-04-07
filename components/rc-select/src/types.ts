import type { HTMLAttributes, ReactNode } from "react";

// 这是 Select 组件的类型定义文件，包含：
// - 选项类型（单个选项、选项分组）
// - 内部扁平化选项类型（用于渲染列表或虚拟滚动）
// - 组件 Props 的通用与特化声明（单选/多选）

// ─── Option Types（选项类型）─────────────────────────────────────────────────

/**
 * 单个选项
 * - `label`: 渲染时显示的内容（可以是字符串或 React 节点）
 * - `value`: 选项的唯一标识（字符串）
 * - `disabled`: 可选，是否禁用该选项
 */
export interface SelectOption {
    label: ReactNode;
    value: string;
    disabled?: boolean;
}

/**
 * 选项分组
 * - `label`: 分组标题（用于在下拉列表中显示）
 * - `options`: 该分组包含的多个 `SelectOption`
 */
export interface SelectOptionGroup {
    label: ReactNode;
    options: SelectOption[];
}

// 选项可以是单项或分组两种形式
export type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

/**
 * 内部使用的扁平化选项结构
 * - 用于将分组结构展开为行（例如虚拟滚动或渲染索引）
 * - 当 `isGroupLabel` 为 true 时，该项表示一个分组标题行（不可选中）
 */
export interface FlatOption {
    label: ReactNode;
    value: string;
    disabled?: boolean;
    isGroupLabel?: boolean;
}

// ─── Props（组件 Props）──────────────────────────────────────────────────────

/**
 * 基础 Props，适用于单选和多选。继承自 div 的 HTML 属性，但排除了
 * `onChange` 和 `defaultValue`，因为它们在单选/多选中有不同签名。
 */
interface BaseSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    // 数据源：支持扁平选项数组或分组数组
    options: SelectOptionOrGroup[];
    // 占位符文本
    placeholder?: string;
    // 是否禁用整个组件
    disabled?: boolean;
    // 是否可搜索（显示输入框以过滤选项）
    searchable?: boolean;
    // 组件尺寸：large / middle / small
    size?: "large" | "middle" | "small";
    // 状态：用于显示错误或警告的边框样式
    status?: "error" | "warning";
    // 是否显示清除按钮（可通过鼠标悬停显示）
    allowClear?: boolean;
    // 是否处于加载状态（显示加载指示器）
    loading?: boolean;
    // 多选时的最大展示 tag 数量，超出则简写为 +n
    maxTagCount?: number;
    // 是否自动聚焦输入
    autoFocus?: boolean;
    // 无匹配项时的自定义渲染内容
    notFoundContent?: ReactNode;
    // 下拉菜单额外 className
    popupClassName?: string;
    // 下拉宽度是否与 Select 宽度保持一致
    popupMatchSelectWidth?: boolean;
    // 自定义选项渲染函数，提供当前选项及其选中状态
    optionRender?: (option: SelectOption, info: { selected: boolean }) => ReactNode;
    // 自定义 tag 渲染（多选时）
    tagRender?: (option: SelectOption, onClose: () => void) => ReactNode;
    // 自定义下拉菜单整体渲染（包裹原始菜单）
    dropdownRender?: (menu: ReactNode) => ReactNode;
    // 下拉打开/关闭回调
    onOpenChange?: (open: boolean) => void;
    // 聚焦与失焦回调
    onFocus?: () => void;
    onBlur?: () => void;
}

/**
 * 单选模式 Props
 * - `multiple` 可选或 false
 * - `value` / `defaultValue` 为单个字符串或 undefined
 */
export interface SingleSelectProps extends BaseSelectProps {
    multiple?: false;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string | undefined, option: SelectOption | undefined) => void;
}

/**
 * 多选模式 Props
 * - `multiple` 必须为 true
 * - `value` / `defaultValue` 为字符串数组
 */
export interface MultiSelectProps extends BaseSelectProps {
    multiple: true;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[], options: SelectOption[]) => void;
}

// 组件 Props 的联合类型：单选或多选
export type SelectProps = SingleSelectProps | MultiSelectProps;
