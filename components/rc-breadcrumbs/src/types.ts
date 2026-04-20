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
}

export type BreadcrumbsProps = BaseBreadcrumbsProps;
