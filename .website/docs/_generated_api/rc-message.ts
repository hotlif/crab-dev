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

export interface MessagePropsSearchIndex {
    /**
     * 消息内容
     */
    "content": ReactNode;

    /**
     * 消息通知的持续时间，单位为毫秒
     * @default 3000
     */
    "duration"?: number;

    /**
     * 自定义图标
     */
    "icon"?: ReactNode;

    /**
     * 是否暂停进度动画
     * @default false
     */
    "paused"?: boolean;

    /**
     * 剩余时间，单位为毫秒
     */
    "remaining"?: number;

    /**
     * 是否显示进度条
     * @default true
     */
    "showProgress"?: boolean;

    /**
     * 消息类型
     * @default 'info'
     */
    "type"?: MessageType;
}
