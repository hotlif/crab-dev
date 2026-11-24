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
     * 使用当前主题 inverse 背景配对的排版前景；承载容器需提供对应的 inverse 背景。
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

/** Named native scroll region for a wide table or code block inside Prose. */
export type ProseScrollRegionProps = Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex' | 'aria-label' | 'aria-labelledby'> & {
    ref?: Ref<HTMLDivElement>;
} & (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-label'?: string; 'aria-labelledby': string }
);
