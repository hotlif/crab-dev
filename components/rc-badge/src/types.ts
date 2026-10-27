import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type BadgeStatus = 'default' | 'processing' | 'success' | 'warning' | 'error';
export type BadgePresetColor = BadgeStatus;

interface BaseBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
    /** 展示的数字，大于 overflowCount 时显示为 `${overflowCount}+` */
    count?: number | ReactNode;
    /** 最大显示数，count 超出时显示为 `${overflowCount}+`。默认 99 */
    overflowCount?: number;
    /** 当数值为 0 时是否展示 */
    showZero?: boolean;
    /** 不展示数字，只显示小圆点；缺少 title 或字符串 text 时，可访问名称跟随 ConfigProvider.locale。 */
    dot?: boolean;
    /** 状态圆点类型，与 text 一起构成"状态 + 文字"模式（无子节点时生效） */
    status?: BadgeStatus;
    /** 设置状态点的文字（与 status 搭配） */
    text?: ReactNode;
    /** 自定义颜色：预设语义色或任意 CSS 颜色字符串 */
    color?: BadgePresetColor | string;
    /** 角标尺寸 */
    size?: 'default' | 'small';
    /** 角标的物理偏移 [x, y]：正 x 向右、正 y 向下，不随 RTL 反转。数值为 px，也支持 CSS 长度或 calc() 字符串。 */
    offset?: [number | string, number | string];
    /** 鼠标悬停时的提示内容（默认等于 count） */
    title?: string;
    /** 包裹的子节点；角标位于上方逻辑末端（LTR 右上、RTL 左上），以实际 DOM dir 为准。 */
    children?: ReactNode;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: CSSProperties;
    /** 自定义角标类名 */
    indicatorClassName?: string;
    /** 自定义角标样式，优先于内置颜色、偏移与定位样式；强制颜色模式保留系统前景/背景配对。 */
    indicatorStyle?: CSSProperties;
}

export type BadgeProps = BaseBadgeProps;
