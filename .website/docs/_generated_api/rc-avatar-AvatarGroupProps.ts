// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type AvatarProps = DocsTypePlaceholder;
type AvatarShape = DocsTypePlaceholder;
type AvatarSize = DocsTypePlaceholder;
type HTMLSpanElement = DocsTypePlaceholder;
type MouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactElement<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;

export interface AvatarGroupProps {
    /**
     * 统一的头像尺寸，可被子 Avatar 的 size prop 覆盖；传数字时单位为 px
     */
    "size"?: AvatarSize | number;

    /**
     * 统一的头像形状，可被子 Avatar 的 shape prop 覆盖
     */
    "shape"?: AvatarShape;

    /**
     * 最多显示的头像数量，超出部分折叠为 +N；0 隐藏成员头像但保留折叠摘要
     */
    "max"?: number;

    /**
     * 相邻头像之间的重叠量，负值表示重叠；传数字时单位为 px。默认使用 token 中定义的 `group.margin`
     */
    "spacing"?: number | string;

    /**
     * 自定义折叠计数的渲染内容；入参为隐藏数量与被隐藏的 Avatar 元素列表
     */
    "renderExtra"?: (hiddenCount: number, hiddenAvatars: ReactElement<AvatarProps>[]) => ReactNode;

    /**
     * 点击折叠计数时触发；提供后 `+N` 会变为可聚焦、可点击元素
     */
    "onExtraClick"?: (event: MouseEvent<HTMLSpanElement>) => void;
}
