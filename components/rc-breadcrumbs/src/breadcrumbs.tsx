import { cx } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import type { ReactNode } from 'react';
import type { BreadcrumbsItem, BreadcrumbsProps } from './types.js';
import { rootStyle, listStyle, itemStyle, linkStyle, currentStyle, actionStyle, disabledStyle, separatorStyle, ellipsisStyle } from "./breadcrumbs.styles.js";
type RenderEntry =
    | { type: 'item'; item: BreadcrumbsItem; index: number }
    | { type: 'ellipsis'; key: string };

const getVisibleEntries = (
    items: BreadcrumbsItem[],
    maxCount: number | undefined,
): RenderEntry[] => {
    if (!maxCount || maxCount < 2 || items.length <= maxCount) {
        return items.map((item, index) => ({
            type: 'item',
            item,
            index,
        }));
    }

    const remaining = maxCount - 1;
    const headCount = Math.ceil(remaining / 2);
    const tailCount = Math.floor(remaining / 2);
    const headItems = items.slice(0, headCount);
    const tailItems = items.slice(items.length - tailCount);

    return [
        ...headItems.map((item, index) => ({
            type: 'item' as const,
            item,
            index,
        })),
        {
            type: 'ellipsis' as const,
            key: '__breadcrumbs_ellipsis__',
        },
        ...tailItems.map((item, index) => ({
            type: 'item' as const,
            item,
            index: items.length - tailItems.length + index,
        })),
    ];
};

const renderItemNode = (item: BreadcrumbsItem, isLast: boolean): ReactNode => {
    if (item.href && !item.disabled && !isLast) {
        return (
            <a
                href={item.href}
                className={linkStyle}
                onClick={(event) => item.onClick?.(event)}
            >
                {item.title}
            </a>
        );
    }

    if (item.onClick && !isLast) {
        return (
            <Button type="button" appearance="text" disabled={item.disabled} onClick={item.onClick} className={actionStyle}>
                {item.title}
            </Button>
        );
    }

    return (
        <span
            className={cx.call(undefined, linkStyle,
                isLast ? currentStyle : '',
                item.disabled ? disabledStyle : '',
            )}
            aria-disabled={item.disabled || undefined}
            aria-current={isLast ? 'page' : undefined}
        >
            {item.title}
        </span>
    );
};

const Breadcrumbs = ({
    items,
    separator = '/',
    maxCount,
    ellipsis = '... ',
    className,
    'aria-label': ariaLabel,
    ...restProps
}: BreadcrumbsProps) => {
    const { messages } = useLocale();
    const entries = getVisibleEntries(items, maxCount);

    return (
        <nav
            {...restProps}
            className={cx.call(undefined, rootStyle, className)}
            aria-label={ariaLabel ?? messages.breadcrumbs.label}
        >
            <ol className={listStyle}>
                {entries.map((entry, renderIndex) => {
                    const isLast = renderIndex === entries.length - 1;

                    if (entry.type === 'ellipsis') {
                        return (
                            <li key={entry.key} className={cx.call(undefined, itemStyle, ellipsisStyle)} aria-hidden="true">
                                {ellipsis}
                                {!isLast ? (
                                    <span className={separatorStyle} aria-hidden="true">
                                        {separator}
                                    </span>
                                ) : null}
                            </li>
                        );
                    }

                    const key = entry.item.key ?? `${entry.index}-${renderIndex}`;

                    return (
                        <li
                            key={key}
                            className={cx.call(undefined, itemStyle, entry.item.className)}
                            style={entry.item.style}
                        >
                            {renderItemNode(entry.item, isLast)}
                            {!isLast ? (
                                <span className={separatorStyle} aria-hidden="true">
                                    {separator}
                                </span>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
