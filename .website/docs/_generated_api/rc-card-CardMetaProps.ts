// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface CardMetaProps {
    /**
     * 头像区, 建议传入 rc-avatar
     */
    "avatar"?: ReactNode;

    /**
     * 标题
     */
    "title"?: ReactNode;

    /**
     * 描述文字
     */
    "description"?: ReactNode;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;
}
