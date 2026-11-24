import { cx } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { BreadcrumbsItem, BreadcrumbsProps } from './types.js';
import {
    rootStyle, listStyle, itemStyle, linkStyle, currentStyle, actionStyle, disabledStyle, separatorStyle, ellipsisStyle,
    disclosureLayoutStyle, disclosureStyle, disclosureTriggerStyle, collapsedListStyle,
} from "./breadcrumbs.styles.js";
type RenderEntry =
    | { type: 'item'; item: BreadcrumbsItem; index: number }
    | { type: 'ellipsis'; items: BreadcrumbsItem[] };

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
    // The current page takes priority when only one non-ellipsis slot remains.
    const tailCount = Math.max(1, Math.floor(remaining / 2));
    const headCount = remaining - tailCount;
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
            items: items.slice(headCount, items.length - tailCount),
        },
        ...tailItems.map((item, index) => ({
            type: 'item' as const,
            item,
            index: items.length - tailItems.length + index,
        })),
    ];
};

const renderItemNode = (item: BreadcrumbsItem, isLast: boolean, onActivate?: () => void): ReactNode => {
    if (item.href && !item.disabled && !isLast) {
        return (
            <a
                href={item.href}
                className={linkStyle}
                onClick={event => {
                    item.onClick?.(event);
                    onActivate?.();
                }}
            >
                {item.title}
            </a>
        );
    }

    if (item.onClick && !isLast) {
        return (
            <Button type="button" appearance="text" disabled={item.disabled} className={actionStyle}
                onClick={event => {
                    item.onClick?.(event);
                    onActivate?.();
                }}>
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

function CollapsedBreadcrumbs({ items, label, ellipsis, separator }: {
    items: BreadcrumbsItem[];
    label: string;
    ellipsis: ReactNode;
    separator: ReactNode;
}) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const branch = useRef<HTMLLIElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const element = branch.current;
        if (!expanded || !element) return;
        const document = element.ownerDocument;
        const dismiss = (event: PointerEvent) => {
            if (!event.composedPath().includes(element)) setExpanded(false);
        };
        document.addEventListener('pointerdown', dismiss, true);
        return () => document.removeEventListener('pointerdown', dismiss, true);
    }, [expanded]);

    function closeFromPath() {
        const element = branch.current;
        if (element?.contains(element.ownerDocument.activeElement)) trigger.current?.focus();
        setExpanded(false);
    }

    return <li ref={branch} className={disclosureStyle}
        onBlur={event => {
            if (expanded && !event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
        }}
        onKeyDown={event => {
            if (!expanded || event.defaultPrevented || event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            closeFromPath();
        }}>
        <div className={disclosureTriggerStyle}>
            <Button ref={trigger} type="button" appearance="text" aria-label={label}
                aria-expanded={expanded} aria-controls={listId}
                className={cx(actionStyle, ellipsisStyle)} onClick={() => setExpanded(!expanded)}>
                <span aria-hidden="true">{ellipsis}</span>
            </Button>
            <span className={separatorStyle} aria-hidden="true">{separator}</span>
        </div>
        <ol id={listId} className={collapsedListStyle} aria-label={label} hidden={!expanded}>
            {items.map((item, index) => <li key={item.key ?? index}
                className={cx(itemStyle, item.className)} style={item.style}>
                {renderItemNode(item, false, closeFromPath)}
            </li>)}
        </ol>
    </li>;
}

const Breadcrumbs = ({
    items,
    separator = '/',
    maxCount,
    ellipsis = '... ',
    expandCollapsed = false,
    expandLabel,
    className,
    'aria-label': ariaLabel,
    ...restProps
}: BreadcrumbsProps) => {
    const { locale, messages } = useLocale();
    const entries = getVisibleEntries(items, maxCount);

    return (
        <nav
            {...restProps}
            className={cx.call(undefined, rootStyle, className)}
            aria-label={ariaLabel ?? messages.breadcrumbs.label}
        >
            <ol className={cx(listStyle, expandCollapsed && disclosureLayoutStyle)}>
                {entries.map((entry, renderIndex) => {
                    const isLast = renderIndex === entries.length - 1;

                    if (entry.type === 'ellipsis') {
                        if (expandCollapsed) return <CollapsedBreadcrumbs key="__breadcrumbs_ellipsis__"
                            items={entry.items} ellipsis={ellipsis} separator={separator}
                            label={expandLabel ?? (locale === 'zh-CN' ? '查看折叠路径' : 'Show collapsed path')} />;
                        return (
                            <li key="__breadcrumbs_ellipsis__" className={cx.call(undefined, itemStyle, ellipsisStyle)} aria-hidden="true">
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
