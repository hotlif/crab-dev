import type { HTMLAttributes, ReactNode, Ref } from 'react';

/**
 * 方向。
 */
export type DividerDirection = 'horizontal' | 'vertical';

/**
 * 线型。
 */
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

/**
 * 线两侧的留白档位, 决定分组的强弱（格式塔接近性）。
 */
export type DividerSpacing = 'none' | 'small' | 'middle' | 'large';

/**
 * 文字在横向分割线上的落点。
 */
export type DividerTextAlign = 'start' | 'center' | 'end';

/**
 * Divider 的全部属性（扁平形态）。
 *
 * 这是**实现签名**与 API 文档的单一真源；对外暴露的 {@link DividerProps} 在此之上收窄为
 * 可辨识联合, 把非法组合挡在编译期。两者分离是有意为之：react-docgen 无法从顶层联合中
 * 提取属性表, 若实现签名直接用联合, 文档站的 API 说明会整列丢空。
 */
export interface DividerOwnProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /**
     * 方向, 默认 horizontal
     */
    direction?: DividerDirection;

    /**
     * 线型, 默认 solid
     */
    variant?: DividerVariant;

    /**
     * 线两侧的留白, 默认 middle
     */
    spacing?: DividerSpacing;

    /**
     * 是否为纯装饰线。为 true 时从无障碍树移除（role=none + aria-hidden）, 读屏不再播报「分隔线」。
     * 当线只是重复了已有的视觉分组时应设为 true, 避免噪声反馈。与 children 互斥
     */
    decorative?: boolean;

    /**
     * 嵌在线中的文字, 兼作分节小标题。仅横向分割线支持
     */
    children?: ReactNode;

    /**
     * 文字落点, 默认 center。仅在传入 children 时有效
     */
    textAlign?: DividerTextAlign;

    /**
     * 文字距起止端的偏移, 仅在 textAlign 为 start / end 时生效。数字按 px 处理, 默认 5%
     */
    textOffset?: number | string;

    /**
     * 文字是否降级为正文字重 + 次要色（仅作说明而非小标题时使用）
     */
    plain?: boolean;

    /**
     * 根节点 ref
     */
    ref?: Ref<HTMLDivElement>;
}

type DividerSharedProps = Omit<
    DividerOwnProps,
    'direction' | 'decorative' | 'children' | 'textAlign' | 'textOffset' | 'plain'
>;

/**
 * 横向分割线（无文字）：可选择作为语义分隔或纯装饰。
 */
export interface DividerLineProps extends DividerSharedProps {
    direction?: 'horizontal';
    decorative?: boolean;
    children?: never;
    textAlign?: never;
    textOffset?: never;
    plain?: never;
}

/**
 * 带文字的横向分割线。
 *
 * 文字是真实内容, 故此形态禁止 `decorative`——不得把可读内容藏出无障碍树。
 */
export interface DividerWithTextProps extends DividerSharedProps {
    direction?: 'horizontal';
    children: ReactNode;
    textAlign?: DividerTextAlign;
    textOffset?: number | string;
    plain?: boolean;
    decorative?: never;
}

/**
 * 竖向分割线：行内场景（按钮组 / 面包屑 / 状态栏）的分隔, 高度跟随字号。
 *
 * 不提供 `children`——竖线嵌文字在任何主流实现中都不成立。
 */
export interface DividerVerticalProps extends DividerSharedProps {
    direction: 'vertical';
    decorative?: boolean;
    children?: never;
    textAlign?: never;
    textOffset?: never;
    plain?: never;
}

/**
 * 对外的 Props：三种形态的可辨识联合, 非法组合在编译期即拼不出来。
 */
export type DividerProps = DividerLineProps | DividerWithTextProps | DividerVerticalProps;
