import type { HTMLAttributes, Ref } from 'react';

export type ProseSize = 'sm' | 'base' | 'lg' | 'xl';

export type ProseTag = 'div' | 'article' | 'section' | 'main';

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * 排版尺寸变体
     * @default 'base'
     */
    size?: ProseSize;

    /**
     * 是否启用暗色排版（独立于全局 data-theme）
     * @default false
     */
    invert?: boolean;

    /**
     * 根元素的 HTML 标签名
     * @default 'div'
     */
    as?: ProseTag;

    ref?: Ref<HTMLDivElement>;
}
