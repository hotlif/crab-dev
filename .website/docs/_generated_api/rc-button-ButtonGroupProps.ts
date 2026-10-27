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
     * Expressive 五档尺寸 xs/s/m/l/xl；省略时由全局 small/medium/large 映射为 xs/s/m
     */
    "size"?: ButtonProps['size'];

    /**
     * 外观：elevated（浮起）、primary（实色）、tonal（浅色）、outlined（描边，默认）、text（文字）。subtle 兼容映射为 outlined。
     */
    "appearance"?: ButtonProps['appearance'];

    /**
     * 危险操作语义，可与公开外观组合；应同时提供明确的动作文案。
     */
    "danger"?: boolean;

    /**
     * Expressive 连接式按钮组；默认 standard 保留独立按钮间距。
     */
    "variant"?: 'standard' | 'connected';
}
