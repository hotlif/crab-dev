import { type ReactNode, type ComponentPropsWithRef, type MouseEvent } from 'react';

/** Material 五种按钮外观；primary 对应 Filled。 */
export type ButtonAppearance = 'elevated' | 'primary' | 'tonal' | 'outlined' | 'text';

/** @deprecated 旧外观仅用于兼容。新代码使用 ButtonAppearance，危险操作使用 danger。 */
export type LegacyButtonAppearance = 'subtle' | 'dashed' | 'link' | 'danger';

interface BaseButtonProps {
    /**
     * 图标（左侧）
     */
    icon?: ReactNode;

    /**
     * 图标（右侧）
     */
    iconAfter?: ReactNode;

    /**
     * 加载中
     */
    loading?: boolean;

    /**
     * 自定义加载图标，替换默认旋转 Spinner
     */
    loadingIcon?: ReactNode;

    /**
     * 外观：elevated（浮起）、primary（实色）、tonal（浅色）、outlined（描边，默认）、text（文字）。subtle 兼容映射为 outlined。
     */
    appearance?: ButtonAppearance | LegacyButtonAppearance;

    /** 危险操作语义，可与公开外观组合；应同时提供明确的动作文案。 */
    danger?: boolean;

    /**
     * Expressive 五档尺寸 xs/s/m/l/xl；small/middle/large 兼容映射为 xs/s/m，默认 middle
     */
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'large' | 'middle' | 'small';

    /**
     * round（默认）或 square；circle 保留为纯图标按钮兼容形状
     */
    shape?: 'round' | 'square' | 'circle';

    /**
     * 选中状态（toggle / 工具栏过滤器场景）
     */
    isSelected?: boolean;

    /**
     * 宽度撑满父容器
     */
    shouldFitContainer?: boolean;

}

type ClickHandler<Element extends HTMLElement> = (event: MouseEvent<Element>) => void | Promise<void>;
type ContentProps =
    | { children: ReactNode; 'aria-label'?: string }
    | { children?: never; 'aria-label': string };
type NativeAttributes = ComponentPropsWithRef<'button'>;
type LinkAttributes = ComponentPropsWithRef<'a'>;
type ExcludeOtherAttributes<Own, Other> = {
    [Key in Exclude<keyof Other, keyof Own | 'disabled'>]?: never;
};

/** 原生按钮，ref 和事件对应 HTMLButtonElement。 */
export type ButtonNativeProps = BaseButtonProps & ContentProps & ExcludeOtherAttributes<NativeAttributes, LinkAttributes> & Omit<
    ComponentPropsWithRef<'button'>, keyof BaseButtonProps | 'children' | 'onClick' | 'onClickCapture'
> & {
    href?: never;
    onClick?: ClickHandler<HTMLButtonElement>;
    onClickCapture?: ClickHandler<HTMLButtonElement>;
};

/** 链接按钮，支持原生链接属性，ref 和事件对应 HTMLAnchorElement。 */
export type ButtonLinkProps = BaseButtonProps & ContentProps & ExcludeOtherAttributes<LinkAttributes, NativeAttributes> & Omit<
    ComponentPropsWithRef<'a'>, keyof BaseButtonProps | 'children' | 'onClick' | 'onClickCapture' | 'href'
> & {
    href: string;
    disabled?: boolean;
    onClick?: ClickHandler<HTMLAnchorElement>;
    onClickCapture?: ClickHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonNativeProps | ButtonLinkProps;

export interface ButtonGroupProps {
    children: ReactNode;
    className?: string;
    size?: ButtonProps['size'];
    appearance?: ButtonProps['appearance'];
    danger?: boolean;
    /** Expressive 连接式按钮组；默认 standard 保留独立按钮间距。 */
    variant?: 'standard' | 'connected';
}
