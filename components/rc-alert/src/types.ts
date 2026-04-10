import type { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

interface BaseAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** 警告类型 */
    type?: AlertType;
    /** 标题 */
    title?: ReactNode;
    /** 是否显示图标 */
    showIcon?: boolean;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 是否可关闭 */
    closable?: boolean;
    /** 自定义关闭按钮，设置为 false 可隐藏 */
    closeIcon?: ReactNode | false;
    /** 关闭回调 */
    onClose?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
    /** 操作区域，位于右侧关闭按钮左侧 */
    action?: ReactNode;
}

export type AlertProps = BaseAlertProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });
