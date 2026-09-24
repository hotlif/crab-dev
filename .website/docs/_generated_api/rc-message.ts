/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type MessageType = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface MessageProps {
    /**
     * 消息内容
     */
    "content": ReactNode;

    /**
     * 倒计时动画长度；自动关闭由 useMessage 管理，独立组件通过 open 控制。
     * @default 3000
     */
    "duration"?: number;

    /**
     * 自定义图标
     */
    "icon"?: ReactNode;

    /**
     * 暂无说明。
     */
    "onExitComplete"?: () => void;

    /**
     * 暂无说明。
     * @default true
     */
    "open"?: boolean;

    /**
     * 暂无说明。
     * @default false
     */
    "paused"?: boolean;

    /**
     * 改变此值时重新启动倒计时进度动画。
     */
    "progressKey"?: string | number;

    /**
     * 暂无说明。
     */
    "remaining"?: number;

    /**
     * 暂无说明。
     * @default true
     */
    "showProgress"?: boolean;

    /**
     * 暂无说明。
     */
    "stack"?: number;

    /**
     * 消息类型
     * @default 'info'
     */
    "type"?: MessageType;
}
