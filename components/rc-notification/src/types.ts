import type { ReactNode } from 'react';

export type Direction = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight";

export interface NotificationOpenParam {
    title: ReactNode;
    description: ReactNode;
    duration?: number;
    direction?: Direction;
    showProgress?: boolean;
    onClose?: () => void;
}
export interface NotificationHandle {
    readonly id: string;
    close(): void;
    update(patch: Partial<NotificationOpenParam>): void;
}
export interface NotificationInstance {
    open(param: NotificationOpenParam): NotificationHandle;
    close(id: string): void;
    update(id: string, patch: Partial<NotificationOpenParam>): void;
}
