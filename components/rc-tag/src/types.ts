import type { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

export type PresetTagColor = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface BaseTagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    /** 标签颜色预设 */
    color?: PresetTagColor | string;
    /** 标签尺寸 */
    size?: 'large' | 'middle' | 'small';
    /** 是否显示边框 */
    bordered?: boolean;
    /** 是否可关闭 */
    closable?: boolean;
    /** 自定义关闭图标，设置为 false 可隐藏默认关闭图标 */
    closeIcon?: ReactNode | false;
    /** 关闭按钮的无障碍标签，默认为 "close"；同一容器内出现多个可关闭标签时应传入可区分的描述 */
    closeAriaLabel?: string;
    /** 标签图标 */
    icon?: ReactNode;
    /** 关闭回调 */
    onClose?: (e: ReactMouseEvent<HTMLSpanElement>) => void;
}

export type TagProps = BaseTagProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

interface BaseCheckableTagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    icon?: ReactNode;
}

export type CheckableTagProps = BaseCheckableTagProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });
