// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Direction = DocsTypePlaceholder;
type NotificationOpenChangeDetails = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface NotificationProps {
    /**
     * 暂无说明。
     */
    "onExitComplete"?: () => void;

    /**
     * 叠层序号：1 为最前层，2、3 为后方卡片。
     * @default 1
     */
    "stack"?: number;

    /**
     * 消息的标题信息
     */
    "title"?: ReactNode;

    /**
     * 消息通知显示的位置
     */
    "direction"?: Direction;

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
     * 改变此值时重新启动倒计时进度动画。
     */
    "progressKey"?: string | number;

    /**
     * 是否暂停进度动画
     */
    "paused"?: boolean;

    /**
     * 暂无说明。 与 defaultOpen 互斥，不能同时提供。
     */
    "open"?: boolean;

    /**
     * 暂无说明。 与 open 互斥，不能同时提供。
     */
    "defaultOpen"?: boolean;

    /**
     * 暂无说明。
     */
    "onOpenChange"?: ((open: boolean, details: NotificationOpenChangeDetails) => void);
}
