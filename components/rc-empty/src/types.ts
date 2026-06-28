import type { HTMLAttributes, ReactNode } from 'react';

export type EmptyPreset = 'default' | 'search' | 'no-permission';

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * 预置空状态类型，内置图示与默认文案
     */
    preset?: EmptyPreset;

    /**
     * 自定义图像/图标节点，设置后忽略 preset 的内置图示
     */
    image?: ReactNode;

    /**
     * 图像区域的宽高，默认 80px
     */
    imageSize?: number | string;

    /**
     * 主标题，不传则显示 preset 对应默认文案
     */
    title?: ReactNode;

    /**
     * 补充说明文字
     */
    description?: ReactNode;

    /**
     * 操作区域（如按钮、链接），位于描述文字下方
     */
    action?: ReactNode;
}
