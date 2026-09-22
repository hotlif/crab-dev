/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type HTMLInputElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface LineEditProps {
    /**
     * 字段外观，默认 outlined；bordered=false 时由宿主提供外观。
     * @default "outlined"
     */
    "appearance"?: "outlined" | "filled";

    /**
     * 可见的浮动标签，与输入框自动关联。
     */
    "label"?: string;

    /**
     * 输入框下方的辅助说明，自动加入 aria-describedby。
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明。
     */
    "errorText"?: string;

    /**
     * input 元素的 ref
     */
    "ref"?: Ref<HTMLInputElement>;

    /**
     * 容器 div 的 ref
     */
    "containerRef"?: Ref<HTMLDivElement>;

    /**
     * 设置单行文本输入框的大小，默认为 middle
     * @default "middle"
     */
    "size"?: "large" | "middle" | "small";

    /**
     * 前缀图标
     */
    "prefix"?: ReactNode;

    /**
     * 后缀图标
     */
    "suffix"?: ReactNode;

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    "status"?: "error" | "warning";

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。 设为 false 时容器变为无样式（透明、无边框、高度随内容自适应）， 用于嵌入到已有边框的宿主容器中（例如作为另一个组件内部的搜索框）
     */
    "bordered"?: boolean;

    /**
     * 是否允许一键清除内容（仅受控模式生效）
     */
    "allowClear"?: boolean;

    /**
     * 点击清除按钮时的回调
     */
    "onClear"?: () => void;

    /**
     * 是否显示字符计数，配合 maxLength 使用
     */
    "showCount"?: boolean;
}
