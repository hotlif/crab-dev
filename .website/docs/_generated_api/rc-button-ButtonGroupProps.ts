// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ButtonProps = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface ButtonGroupProps {
    /**
     * 暂无说明。
     */
    "children": ReactNode;

    /**
     * 暂无说明。
     */
    "className"?: string;

    /**
     * 暂无说明。
     */
    "size"?: ButtonProps['size'];

    /**
     * 暂无说明。
     */
    "appearance"?: ButtonProps['appearance'];

    /**
     * 暂无说明。
     */
    "danger"?: boolean;

    /**
     * Expressive 连接式按钮组；默认 standard 保留独立按钮间距。
     */
    "variant"?: 'standard' | 'connected';
}
