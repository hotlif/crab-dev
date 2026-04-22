import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, MouseEvent, ReactElement, ReactNode, SyntheticEvent } from 'react';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'small' | 'middle' | 'large';
export type AvatarVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type AvatarFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

interface BaseAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> {
    /** 形状 */
    shape?: AvatarShape;
    /** 尺寸；传数字时单位为 px，覆盖三档预设 */
    size?: AvatarSize | number;
    /** 颜色语义，仅在非图片态下生效 */
    variant?: AvatarVariant;
    /** 图片地址 */
    src?: string;
    /** 响应式图片地址 */
    srcSet?: string;
    /** 图片替代文本 */
    alt?: string;
    /** 图片填充方式 */
    fit?: AvatarFit;
    /** 是否展示描边 */
    bordered?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 图片加载失败回调，返回 false 可阻止回退 */
    onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => boolean | void;
    /** img crossOrigin 属性 */
    crossOrigin?: 'anonymous' | 'use-credentials' | '';
    /** img loading 属性 */
    loading?: 'eager' | 'lazy';
    /** img referrerPolicy 属性 */
    referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
    /** 自定义样式 */
    style?: CSSProperties;
}

type AvatarContentProps =
    | { children: ReactNode; 'aria-label'?: string }
    | { children?: never; 'aria-label': string }
    | { children?: never; src: string; alt: string; 'aria-label'?: string };

export type AvatarProps = BaseAvatarProps & AvatarContentProps;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** 统一的头像尺寸，可被子 Avatar 的 size prop 覆盖；传数字时单位为 px */
    size?: AvatarSize | number;
    /** 统一的头像形状，可被子 Avatar 的 shape prop 覆盖 */
    shape?: AvatarShape;
    /** 最多显示的头像数量，超出部分折叠为 +N */
    max?: number;
    /** 相邻头像之间的重叠量，负值表示重叠；传数字时单位为 px。默认使用 token 中定义的 `group.overlap` */
    spacing?: number | string;
    /** 自定义折叠计数的渲染内容；入参为隐藏数量与被隐藏的 Avatar 元素列表 */
    renderExtra?: (hiddenCount: number, hiddenAvatars: ReactElement<AvatarProps>[]) => ReactNode;
    /** 点击折叠计数时触发；提供后 `+N` 会变为可聚焦、可点击元素 */
    onExtraClick?: (event: MouseEvent<HTMLSpanElement>) => void;
}