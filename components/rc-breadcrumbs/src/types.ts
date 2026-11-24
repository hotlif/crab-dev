import type {
    CSSProperties,
    HTMLAttributes,
    MouseEvent as ReactMouseEvent,
    ReactNode
} from 'react';

export interface BreadcrumbsItem {
    key?: string | number;
    title: ReactNode;
    href?: string;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}

interface BaseBreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    items: BreadcrumbsItem[];
    separator?: ReactNode;
    maxCount?: number;
    ellipsis?: ReactNode;
    /** 用展开按钮公开 maxCount 折叠的路径。 */
    expandCollapsed?: boolean;
    /** 展开按钮的可访问名称，缺省跟随当前语言。 */
    expandLabel?: string;
}

export type BreadcrumbsProps = BaseBreadcrumbsProps;
