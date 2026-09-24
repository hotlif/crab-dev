import type { HTMLAttributes, ReactNode } from 'react';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
    open?: boolean;
    onExitComplete?: () => void;
    stack?: number;
    showProgress?: boolean;
    remaining?: number;
    /** 改变此值时重新启动倒计时进度动画。 */
    progressKey?: string | number;
    paused?: boolean;
    /** 消息类型 */
    type?: MessageType;
    /** 消息内容 */
    content: ReactNode;
    /** 倒计时动画长度；自动关闭由 useMessage 管理，独立组件通过 open 控制。 */
    duration?: number;
    /** 自定义图标 */
    icon?: ReactNode;
}

export interface MessageOpenParam {
    /** 消息类型 */
    type?: MessageType;
    /** 消息内容 */
    content: ReactNode;
    /** 自动关闭延时，单位毫秒 */
    duration?: number;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 关闭时的回调 */
    onClose?: () => void;
}

export interface MessageHandle {
    readonly id: string;
    close(): void;
    update(patch: Partial<MessageOpenParam>): void;
}

export interface MessageInstance {
    open: (param: MessageOpenParam) => MessageHandle;
    close: (id: string) => void;
    update: (id: string, patch: Partial<MessageOpenParam>) => void;
    success: (content: ReactNode, duration?: number) => MessageHandle;
    error: (content: ReactNode, duration?: number) => MessageHandle;
    warning: (content: ReactNode, duration?: number) => MessageHandle;
    info: (content: ReactNode, duration?: number) => MessageHandle;
    loading: (content: ReactNode, duration?: number) => MessageHandle;
}

export interface MessageItemData {
    id: string;
    type: MessageType;
    content: ReactNode;
    icon?: ReactNode;
    duration: number;
    remaining: number;
    paused: boolean;
}
