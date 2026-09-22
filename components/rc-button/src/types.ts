import { type ReactNode, type ButtonHTMLAttributes } from 'react';

/** Material 五种按钮外观；primary 对应 Filled。 */
export type ButtonAppearance = 'elevated' | 'primary' | 'tonal' | 'outlined' | 'text';

/** @deprecated 旧外观仅用于兼容。新代码使用 ButtonAppearance，危险操作使用 danger。 */
export type LegacyButtonAppearance = 'subtle' | 'dashed' | 'link' | 'danger';

interface BaseButtonProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'onClickCapture'
> {
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

    /**
     * 存在时渲染为 <a> 元素
     */
    href?: string;

    /**
     * 链接打开方式（_blank / _self / _parent / _top）
     */
    target?: string;

    /**
     * 链接 rel 属性，href 为外部地址时建议传 "noopener noreferrer"
     */
    rel?: string;

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
     */
    onClick?: (
        param: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']>>[0],
    ) => Promise<void> | void;

    /**
     * see ButtonHTMLAttributes<HTMLButtonElement>["onClickCapture"]
     */
    onClickCapture?: (
        param: Parameters<
            NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClickCapture']>
        >[0],
    ) => Promise<void> | void;
}

export type ButtonProps = BaseButtonProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

export interface ButtonGroupProps {
    children: ReactNode;
    className?: string;
    size?: ButtonProps['size'];
    appearance?: ButtonProps['appearance'];
    danger?: boolean;
    /** Expressive 连接式按钮组；默认 standard 保留独立按钮间距。 */
    variant?: 'standard' | 'connected';
}
