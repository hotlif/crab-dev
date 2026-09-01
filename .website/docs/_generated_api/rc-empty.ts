/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type EmptyPreset = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface EmptyPropsSearchIndex {
    /**
     * 操作区域（如按钮、链接），位于描述文字下方
     */
    "action"?: ReactNode;

    /**
     * 补充说明文字
     */
    "description"?: ReactNode;

    /**
     * 自定义图像/图标节点，设置后忽略 preset 的内置图示
     */
    "image"?: ReactNode;

    /**
     * 图像区域的宽高，默认 80px
     */
    "imageSize"?: number | string;

    /**
     * 预置空状态类型，内置图示与默认文案
     * @default 'default'
     */
    "preset"?: EmptyPreset;

    /**
     * 主标题，不传则显示 preset 对应默认文案
     */
    "title"?: ReactNode;
}
