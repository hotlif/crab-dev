import type { HTMLAttributes, ReactElement } from 'react';

export interface MasonryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /**
     * 列数，默认为 2
     */
    columns?: number;

    /**
     * 子元素间距（像素），默认使用 token 中的 gutter 值。
     * 传入数值时覆盖 token 默认值。
     */
    gutter?: number;

    /**
     * 是否按 DOM 顺序排列（从左到右依次放置），
     * 默认 false，优先放入最短列。
     */
    sequential?: boolean;

    /**
     * 瀑布流子项
     */
    children?: ReactElement | ReactElement[];
}
