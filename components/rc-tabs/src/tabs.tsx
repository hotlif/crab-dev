import Button from '@crab-dev/rc-button';
import { useComponentSize, useLocale } from '@crab-dev/rc-config-provider';
import { css, cx } from '@crab-dev/css';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';
import token from './token.js';
import { useTabIndicator } from './useTabIndicator.js';
import type { TabsBarExtraContent, TabsItem, TabsProps, TabsSize, TabsChangeDetails } from './types.js';
import { rootStyle, barWrapperStyle, barStyle, barListStyle, barLineStyle, itemLineStyle, barCenteredStyle, itemBaseStyle, itemSmallStyle, itemMediumStyle, itemLargeStyle, itemIconStyle, itemActiveStyle, itemDisabledStyle, itemCardStyle, itemCardActiveStyle, itemPillStyle, itemPillActiveStyle, indicatorLabelStyle, indicatorStyle, tabItemWrapperStyle, closeSpaceStyle, closeButtonStyle, extraStyle, contentStyle } from "./tabs.styles.js";
const closePositionStyles = {
    small: css`inset-inline-end: ${token.size.small['padding-inline']};`,
    medium: css`inset-inline-end: ${token.size.medium['padding-inline']};`,
    large: css`inset-inline-end: ${token.size.large['padding-inline']};`,
};

const CloseIcon = () => (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
        <path
            d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 1 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
        />
    </svg>
);

const itemSizeStyleOf = (size: TabsSize) => {
    if (size === 'small') return itemSmallStyle;
    if (size === 'large') return itemLargeStyle;
    return itemMediumStyle;
};

const isBarExtraContentObject = (
    value: ReactNode | TabsBarExtraContent | undefined,
): value is TabsBarExtraContent => {
    return (
        typeof value === 'object'
        && value !== null
        && !Array.isArray(value)
        && !('type' in (value as Record<string, unknown>))
        && ('left' in (value as Record<string, unknown>) || 'right' in (value as Record<string, unknown>))
    );
};

const resolveBarExtraContent = (value: ReactNode | TabsBarExtraContent | undefined): TabsBarExtraContent => {
    if (value == null || value === false) return {};
    if (isBarExtraContentObject(value)) return value;
    return { right: value as ReactNode };
};

const findEnabledKey = (items: TabsItem[], startIndex: number, step: 1 | -1): string | null => {
    if (items.length === 0) return null;
    const length = items.length;
    for (let offset = 1; offset <= length; offset += 1) {
        const next = (startIndex + step * offset + length) % length;
        const candidate = items[next];
        if (candidate != null && !candidate.disabled) {
            return candidate.key;
        }
    }
    return null;
};

/** Scroll only the tab strip, leaving the surrounding page and panel in place. */
const revealTab = (bar: HTMLDivElement | null, tab: HTMLButtonElement | undefined) => {
    if (!bar || !tab || typeof bar.scrollBy !== 'function') return;
    const bounds = bar.getBoundingClientRect();
    const item = tab.getBoundingClientRect();
    const delta = item.left < bounds.left
        ? item.left - bounds.left
        : item.right > bounds.right ? item.right - bounds.right : 0;
    // Layout reconciliation is immediate, including initialization and reduced motion.
    if (delta !== 0) bar.scrollBy({ left: delta, behavior: 'instant' });
};

interface CloseFocusRequest {
    source: HTMLButtonElement;
    bar: HTMLDivElement | null;
    list: HTMLDivElement | null;
    key: string;
    candidates: string[];
    moved: boolean;
    release: () => void;
}

const Tabs = ({
    items,
    value: activeKeyProp,
    defaultValue,
    type = 'line',
    size: sizeProp,
    centered = false,
    destroyInactiveTabPane = false,
    tabBarExtraContent,
    onValueChange,
    onTabClose,
    className,
    ...restProps
}: TabsProps) => {
    const configuredSize = useComponentSize(sizeProp);
    const { messages } = useLocale();
    const size = configuredSize;
    const reactId = useId();
    const tabsIdPrefix = `rc-tabs-${reactId.replace(/:/g, '')}`;
    const getTabId = (index: number) => `${tabsIdPrefix}-tab-${index}`;
    const getPanelId = (index: number) => `${tabsIdPrefix}-panel-${index}`;
    const firstEnabledItem = items.find(item => !item.disabled);

    const resolvedDefault = defaultValue
        ?? firstEnabledItem?.key
        ?? items[0]?.key
        ?? '';

    const [activeKey, setActiveKey] = useControllableValue<string, [TabsChangeDetails]>({
        value: activeKeyProp,
        defaultValue: resolvedDefault,
        onValueChange,
    });
    const registerIndicator = useTabIndicator(activeKey, type === 'line');

    // Mutable DOM registry for keyboard focus; it never participates in rendering.
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const barRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    // A keyboard close owns focus only until its first commit. A rejected or
    // asynchronous controlled close must not steal focus on a later update.
    const closeFocus = useRef<CloseFocusRequest | null>(null);
    const [closeAttempt, setCloseAttempt] = useState<symbol | null>(null);

    useLayoutEffect(() => () => {
        closeFocus.current?.release();
        closeFocus.current = null;
    }, []);

    useLayoutEffect(() => {
        const request = closeFocus.current;
        if (!request) return;
        closeFocus.current = null;
        request.release();
        const owner = request.source.ownerDocument;
        if (request.moved || items.some(item => item.key === request.key)
            || request.source.isConnected || request.bar !== barRef.current
            || request.list !== listRef.current || !request.bar?.isConnected
            || !request.list?.isConnected
            || (owner.activeElement !== owner.body && owner.activeElement !== owner.documentElement)) return;
        const nextKey = request.candidates.find(key => items.some(item => item.key === key && !item.disabled));
        const nextTab = nextKey ? tabRefs.current.get(nextKey) : undefined;
        nextTab?.focus({ preventScroll: true });
        revealTab(barRef.current, nextTab);
    }, [closeAttempt, items]);

    useLayoutEffect(() => {
        if (!items.some(item => item.key === activeKey)) return;
        const revealSelected = () => revealTab(barRef.current, tabRefs.current.get(activeKey));
        revealSelected();
        if (typeof ResizeObserver !== 'function') return;
        const observer = new ResizeObserver(revealSelected);
        if (barRef.current) observer.observe(barRef.current);
        if (listRef.current) observer.observe(listRef.current);
        return () => observer.disconnect();
    }, [activeKey, items]);

    const activateKey = (nextKey: string, details: TabsChangeDetails) => setActiveKey(nextKey, details);

    const handleTabClick = (item: TabsItem, event: ReactMouseEvent<HTMLButtonElement>) => {
        if (item.disabled || item.key === activeKey) return;
        activateKey(item.key, { reason: 'pointer', event });
    };

    const handleTabKeyDown = (
        event: ReactKeyboardEvent<HTMLButtonElement>,
        item: TabsItem,
        index: number,
    ) => {
        const { key } = event;

        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
            event.preventDefault();
            const declaredDirection = event.currentTarget.closest('[dir]')?.getAttribute('dir');
            const rtl = declaredDirection === 'rtl' || (declaredDirection !== 'ltr' && getComputedStyle(event.currentTarget).direction === 'rtl');
            let nextKey: string | null;
            if (key === 'ArrowLeft') {
                nextKey = findEnabledKey(items, index, rtl ? 1 : -1);
            } else if (key === 'ArrowRight') {
                nextKey = findEnabledKey(items, index, rtl ? -1 : 1);
            } else if (key === 'Home') {
                nextKey = findEnabledKey(items, -1, 1);
            } else {
                nextKey = findEnabledKey(items, items.length, -1);
            }
            if (nextKey && nextKey !== activeKey) {
                activateKey(nextKey, { reason: 'keyboard', event });
            }
            if (nextKey) {
                const nextTab = tabRefs.current.get(nextKey);
                nextTab?.focus({ preventScroll: true });
                revealTab(barRef.current, nextTab);
            }
            return;
        }

        if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
            if (!item.disabled && item.key !== activeKey) {
                event.preventDefault();
                activateKey(item.key, { reason: 'keyboard', event });
            }
            return;
        }

        if ((key === 'Delete' || key === 'Backspace') && item.closable && !item.disabled) {
            event.preventDefault();
            const source = event.currentTarget;
            const owner = source.ownerDocument;
            closeFocus.current?.release();
            closeFocus.current = null;
            if (onTabClose && owner.activeElement === source) {
                const request: CloseFocusRequest = {
                    source,
                    bar: barRef.current,
                    list: listRef.current,
                    key: item.key,
                    candidates: [...items.slice(index + 1), ...items.slice(0, index).reverse()].map(candidate => candidate.key),
                    moved: false,
                    release: () => owner.removeEventListener('focusin', trackFocus),
                };
                function trackFocus(focusEvent: FocusEvent) {
                    if (focusEvent.target !== source) request.moved = true;
                }
                owner.addEventListener('focusin', trackFocus);
                closeFocus.current = request;
                setCloseAttempt(Symbol('keyboard-close'));
                try {
                    onTabClose(item.key, event);
                } finally {
                    // Explicit blur/focus during the callback belongs to the caller.
                    // React's own removal blur is allowed once the source disconnects.
                    if (source.isConnected && owner.activeElement !== source) request.moved = true;
                }
            } else {
                onTabClose?.(item.key, event);
            }
        }
    };

    const handleCloseClick = (
        event: ReactMouseEvent<HTMLElement>,
        item: TabsItem,
    ) => {
        event.stopPropagation();
        if (item.disabled) return;
        onTabClose?.(item.key, event);
    };

    const extraContent = resolveBarExtraContent(tabBarExtraContent);

    const registerTabRef = (key: string) => (node: HTMLButtonElement | null) => {
        if (node) {
            tabRefs.current.set(key, node);
            return () => { tabRefs.current.delete(key); };
        }
    };

    const itemSizeStyle = itemSizeStyleOf(size);

    const getTypeItemStyles = (item: TabsItem, isActive: boolean): string => {
        if (type === 'card') {
            return cx.call(undefined, itemCardStyle, isActive ? itemCardActiveStyle : '');
        }
        if (type === 'pill') {
            return cx.call(undefined, itemPillStyle, isActive ? itemPillActiveStyle : '');
        }
        return itemLineStyle;
    };

    const activeItemIndex = items.findIndex(item => item.key === activeKey);
    const activeItem = activeItemIndex >= 0 ? items[activeItemIndex] : null;

    return (
        <div {...restProps} className={cx.call(undefined, rootStyle, className)}>
            <div className={barWrapperStyle}>
                {extraContent.left != null ? (
                    <div className={extraStyle}>{extraContent.left}</div>
                ) : null}
                <div
                    ref={barRef}
                    className={cx.call(undefined, barStyle, type === 'line' ? barLineStyle : '')}
                    role="tablist"
                    aria-orientation="horizontal"
                >
                    <div ref={listRef} className={cx.call(undefined, barListStyle, centered ? barCenteredStyle : '')}>
                        {items.map((item, index) => {
                            const isActive = item.key === activeKey;

                            return (
                                <div key={item.key} role="presentation" className={tabItemWrapperStyle}>
                                    <button
                                        type="button"
                                        ref={registerTabRef(item.key)}
                                        id={getTabId(index)}
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-controls={getPanelId(index)}
                                        aria-disabled={item.disabled || undefined}
                                        tabIndex={isActive ? 0 : -1}
                                        disabled={item.disabled}
                                        className={cx.call(undefined, itemBaseStyle,
                                            itemSizeStyle,
                                            isActive ? itemActiveStyle : '',
                                            item.disabled ? itemDisabledStyle : '',
                                            getTypeItemStyles(item, isActive),
                                            item.className,
                                        )}
                                        style={item.style}
                                        onClick={(event) => handleTabClick(item, event)}
                                        onKeyDown={(event) => handleTabKeyDown(event, item, index)}
                                    >
                                        {item.icon != null ? <span className={itemIconStyle} aria-hidden="true">{item.icon}</span> : null}
                                        <span className={type === 'line' ? indicatorLabelStyle : undefined}>
                                            {item.label}
                                            {type === 'line' && <span ref={registerIndicator(item.key)} className={indicatorStyle} aria-hidden="true" />}
                                        </span>
                                        {item.closable && !item.disabled ? <span className={closeSpaceStyle} aria-hidden="true" /> : null}
                                    </button>
                                    {item.closable && !item.disabled ? (
                                        <Button
                                            type="button"
                                            appearance="text"
                                            size="xs"
                                            tabIndex={-1}
                                            aria-label={messages.tabs.closeTab}
                                            aria-controls={getPanelId(index)}
                                            className={cx(closeButtonStyle, closePositionStyles[size])}
                                            onClick={(event) => handleCloseClick(event, item)}
                                            icon={<CloseIcon />}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {extraContent.right != null ? (
                    <div className={extraStyle}>{extraContent.right}</div>
                ) : null}
            </div>
            <div className={contentStyle}>
                {destroyInactiveTabPane
                    ? activeItem != null
                        ? (
                            <div
                                key={activeItem.key}
                                id={getPanelId(activeItemIndex)}
                                role="tabpanel"
                                aria-labelledby={getTabId(activeItemIndex)}
                            >
                                {activeItem.children}
                            </div>
                        )
                        : null
                    : items.map((item, index) => {
                        const isActive = item.key === activeKey;
                        return (
                            <div
                                key={item.key}
                                id={getPanelId(index)}
                                role="tabpanel"
                                aria-labelledby={getTabId(index)}
                                hidden={!isActive}
                            >
                                {isActive ? item.children : null}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Tabs;
