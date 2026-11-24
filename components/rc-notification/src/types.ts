import type { ReactNode } from 'react';

export type Direction = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";

export interface NotificationOpenParam {
    title: ReactNode;
    description: ReactNode;
    duration?: number;
    direction?: Direction;
    showProgress?: boolean;
    onClose?: () => void;
    /** 仍打开的相同任务更新原通知，并返回同一 ID。 */
    taskKey?: string;
    /** 任务列表按钮的名称。省略时使用文本标题或任务键。 */
    taskLabel?: string;
}
export type NotificationUpdate = Partial<Omit<NotificationOpenParam, 'taskKey'>>;
export interface UseNotificationOptions {
    /** tasks 显示可切换的任务列表，持续显示前台任务直到关闭或切换。 */
    mode?: 'stack' | 'tasks';
}
export interface NotificationHandle {
    readonly id: string;
    close(): void;
    update(patch: NotificationUpdate): void;
}
export interface NotificationInstance {
    open(param: NotificationOpenParam): NotificationHandle;
    close(id: string): void;
    update(id: string, patch: NotificationUpdate): void;
}
