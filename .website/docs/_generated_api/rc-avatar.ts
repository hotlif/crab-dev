/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type AvatarFit = DocsTypePlaceholder;
type AvatarShape = DocsTypePlaceholder;
type AvatarSize = DocsTypePlaceholder;
type AvatarVariant = DocsTypePlaceholder;
type CSSProperties = DocsTypePlaceholder;
type Event = DocsTypePlaceholder;
type HTMLImageElement = DocsTypePlaceholder;
type ImgHTMLAttributes<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SyntheticEvent<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };

export interface AvatarPropsSearchIndex {
    /**
     * 形状
     * @default 'circle'
     */
    "shape"?: AvatarShape;

    /**
     * 尺寸；传数字时单位为 px，覆盖三档预设
     * @default 'middle'
     */
    "size"?: AvatarSize | number;

    /**
     * 颜色语义，仅在非图片态下生效
     * @default 'default'
     */
    "variant"?: AvatarVariant;

    /**
     * 图片地址
     */
    "src"?: string;

    /**
     * 响应式图片地址
     */
    "srcSet"?: string;

    /**
     * 图片替代文本
     */
    "alt"?: string;

    /**
     * 图片填充方式
     * @default 'cover'
     */
    "fit"?: AvatarFit;

    /**
     * 是否展示描边
     * @default false
     */
    "bordered"?: boolean;

    /**
     * 是否禁用
     * @default false
     */
    "disabled"?: boolean;

    /**
     * 自定义图标
     */
    "icon"?: ReactNode;

    /**
     * 图片加载失败回调，返回 false 可阻止回退
     */
    "onError"?: (event: SyntheticEvent<HTMLImageElement, Event>) => boolean | void;

    /**
     * img crossOrigin 属性
     */
    "crossOrigin"?: 'anonymous' | 'use-credentials' | '';

    /**
     * img loading 属性
     */
    "loading"?: 'eager' | 'lazy';

    /**
     * img referrerPolicy 属性
     */
    "referrerPolicy"?: ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];

    /**
     * 自定义样式
     */
    "style"?: CSSProperties;

    /**
     * 暂无说明。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。
     */
    "aria-label"?: string;
}
