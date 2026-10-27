// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type HTMLTextAreaElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TextEditChangeDetails = DocsTypePlaceholder;

export interface TextEditProps {
    /**
     * 字段外观，默认 outlined；bordered=false 时由宿主提供外观。
     * @default "outlined"
     */
    "appearance"?: "outlined" | "filled";

    /**
     * 可见标签；Material 使用浮动标签，shadcn 使用上方标签。
     */
    "label"?: string;

    /**
     * 文本域下方的辅助说明，自动加入 aria-describedby。
     */
    "supportingText"?: string;

    /**
     * 错误说明；提供时自动启用 error 状态并替换辅助说明。
     */
    "errorText"?: string;

    /**
     * textarea 元素的 ref
     */
    "ref"?: Ref<HTMLTextAreaElement>;

    /**
     * 容器 div 的 ref
     */
    "containerRef"?: Ref<HTMLDivElement>;

    /**
     * 控件几何档位，默认为 medium；不缩放正文，内容高度由 rows / autoSize 决定。 Apple / shadcn 调整内边距和最小高度；MD3 三档保持标准字段几何， 仅内部清除动作分档。bordered=false 时几何和排版由宿主提供。
     */
    "size"?: "large" | "medium" | "small";

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    "status"?: "error" | "warning";

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。 设为 false 时容器变为无样式（透明、无边框）， 用于嵌入到已有边框的宿主容器中（例如作为表单项内部的备注框）
     * @default true
     */
    "bordered"?: boolean;

    /**
     * 是否允许一键清除内容；触发 onValueChange，受控模式由父组件接受新值
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

    /**
     * 高度随内容自动增长（CSS field-sizing: content，浏览器不支持时按 rows 回退）； 开启后禁用手动拖拽调整尺寸，避免两种高度控制方式互相冲突
     */
    "autoSize"?: boolean;

    /**
     * 手动拖拽调整尺寸的方向，默认为 vertical；autoSize 开启时忽略
     * @default "vertical"
     */
    "resize"?: "none" | "vertical" | "both";

    /**
     * 暂无说明。 与 defaultValue 互斥，不能同时提供。
     */
    "value"?: string;

    /**
     * 暂无说明。 与 value 互斥，不能同时提供。
     */
    "defaultValue"?: string;

    /**
     * 暂无说明。
     */
    "onValueChange"?: ((value: string, details: TextEditChangeDetails) => void);
}
