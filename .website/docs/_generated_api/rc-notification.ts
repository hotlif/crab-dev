/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Direction = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface NotificationPropsSearchIndex {
    /**
     * 消息的标题信息
     */
    "title"?: ReactNode;

    /**
     * 消息通知显示的位置
     */
    "direction"?: Direction;

    /**
     * 是否开启
     */
    "open": boolean;

    /**
     * 状态发生改变的时候触发的事件
     */
    "onOpenChange": (open: boolean) => void;

    /**
     * 消息通知的内容
     */
    "children"?: ReactNode;

    /**
     * 是否显示进度条
     * @default true
     */
    "showProgress"?: boolean;

    /**
     * 消息通知的持续时间，单位为毫秒
     */
    "duration"?: number;

    /**
     * 剩余时间，单位为毫秒
     */
    "remaining"?: number;

    /**
     * 是否暂停进度动画
     */
    "paused"?: boolean;
}
