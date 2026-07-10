import type { HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';

/**
 * 卡片视觉变体。
 * - `elevated`：白底 + 静态微投影（默认）
 * - `outlined`：白底 + 1px 描边, 无投影
 * - `filled`：弱灰底, 无描边无投影
 */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/**
 * 尺寸档位, 控制内边距 / 圆角 / 标题字号, 与 rc-button / rc-segmented 对齐。
 */
export type CardSize = 'large' | 'middle' | 'small';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * 视觉变体
     * @default "elevated"
     */
    variant?: CardVariant;

    /**
     * 尺寸档位
     * @default "middle"
     */
    size?: CardSize;

    /**
     * 标题, 渲染在标题区左侧
     */
    title?: ReactNode;

    /**
     * 标题区右侧的操作区（如"更多"按钮）
     */
    extra?: ReactNode;

    /**
     * 封面媒体, 出血铺满卡片顶部并随圆角裁切
     */
    cover?: ReactNode;

    /**
     * 底部操作组, 渲染在分割线下方并靠右排布
     */
    actions?: ReactNode[];

    /**
     * 悬浮时是否浮起（大投影 + 上移 + 封面微缩放）
     * @default false
     */
    hoverable?: boolean;

    /**
     * 整卡是否可点击：自带浮起反馈 / 键盘激活（Enter / Space）/ 焦点环,
     * 卡内 extra 与 actions 的点击自动与整卡点击隔离
     * @default false
     */
    clickable?: boolean;

    /**
     * 是否处于加载态, 为 true 时渲染骨架占位
     * @default false
     */
    loading?: boolean;

    /**
     * 是否禁用：撤销全部交互示能并降低不透明度
     * @default false
     */
    disabled?: boolean;

    /**
     * 整卡点击回调, 仅 clickable 时生效
     */
    onClick?: MouseEventHandler<HTMLDivElement>;

    /**
     * 卡片内容：裸内容自动包裹进内容区; 传入 Card.Cover / Card.Header /
     * Card.Body / Card.Footer 时切换为自由拼装模式
     */
    children?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export interface CardCoverProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * 封面媒体（img / video 等）
     */
    children?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * 标题
     */
    title?: ReactNode;

    /**
     * 右侧操作区
     */
    extra?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * 内容
     */
    children?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * 操作组内容
     */
    children?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

export interface CardMetaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * 头像区, 建议传入 rc-avatar
     */
    avatar?: ReactNode;

    /**
     * 标题
     */
    title?: ReactNode;

    /**
     * 描述文字
     */
    description?: ReactNode;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}
