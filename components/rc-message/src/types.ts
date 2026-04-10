import type { ReactNode } from 'react';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageProps {
    /** 消息类型 */
    type?: MessageType;
    /** 消息内容 */
    content: ReactNode;
    /** 自动关闭延时，单位毫秒，设为 0 时不自动关闭 */
    duration?: number;
    /** 自定义图标 */
    icon?: ReactNode;
    /** 关闭时的回调 */
    onClose?: () => void;
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

export interface MessageInstance {
    open: (param: MessageOpenParam) => void;
    success: (content: ReactNode, duration?: number) => void;
    error: (content: ReactNode, duration?: number) => void;
    warning: (content: ReactNode, duration?: number) => void;
    info: (content: ReactNode, duration?: number) => void;
    loading: (content: ReactNode, duration?: number) => void;
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
