import type { HTMLAttributes, ReactElement } from 'react';

export interface MasonryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /**
     * 列数，默认为 2
     */
    columns?: number;

    /**
     * 子元素间距（像素），省略时从 `root.gap` 读取最近配置边界的 density 间距。
     * 传入数值（包括 0）时覆盖密度与 token 默认值。
     */
    gutter?: number;

    /**
     * 是否按 DOM 顺序从行内起始侧排列（LTR 从左、RTL 从右），
     * 默认 false，优先放入最短列。
     */
    sequential?: boolean;

    /**
     * 瀑布流子项
     */
    children?: ReactElement | ReactElement[];
}
