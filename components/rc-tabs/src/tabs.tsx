import { css, cx } from '@crab-dev/css';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useControllableValue } from '@crab-dev/rc-hooks';

import token from './token.js';
import type {
    TabsBarExtraContent,
    TabsItem,
    TabsProps,
    TabsSize,
} from './types.js';

const rootStyle = css`
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-weight: ${token.font.weight};
`;

const barWrapperStyle = css`
    display: flex;
    align-items: stretch;
    gap: ${token.bar.gap};
    min-width: 0;
`;

const barStyle = css`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const barListStyle = css`
    display: flex;
    align-items: stretch;
    gap: ${token.bar.gap};
    min-width: 0;
`;

const barLineStyle = css`
    border-bottom: 1px solid ${token.bar.border.color};
`;

const barCenteredStyle = css`
    justify-content: center;
`;

const itemBaseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${token.item.icon.gap};
    flex: 0 0 auto;
    border: 0;
    background: transparent;
    color: ${token.item.color};
    cursor: pointer;
    white-space: nowrap;
    font: inherit;
    font-weight: inherit;
    transition: ${token.motion.color};

    &:hover {
        color: ${token.item['color-hover']};
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.focus.ring.width} solid ${token.focus.ring.color};
        outline-offset: ${token.focus.ring.offset};
    }
`;

const itemSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-x']};
    font-size: ${token.size.small['font-size']};
`;

const itemMediumStyle = css`
    height: ${token.size.medium.height};
    padding: 0 ${token.size.medium['padding-x']};
    font-size: ${token.size.medium['font-size']};
`;

const itemLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-x']};
    font-size: ${token.size.large['font-size']};
`;

const itemActiveStyle = css`
    color: ${token.item['color-active']};
`;

const itemDisabledStyle = css`
    color: ${token.item['color-disabled']};
    cursor: not-allowed;

    &:hover {
        color: ${token.item['color-disabled']};
    }
`;

const itemCardStyle = css`
    background: ${token.card.background};
    border: 1px solid transparent;
    border-bottom: 0;
    border-top-left-radius: ${token.card.border.radius};
    border-top-right-radius: ${token.card.border.radius};
    margin-bottom: -1px;

    &:hover {
        background: ${token.card['background-hover']};
    }
`;

const itemCardActiveStyle = css`
    background: ${token.card['background-active']};
    border-color: ${token.card.border.color};

    &:hover {
        background: ${token.card['background-active']};
    }
`;

const itemPillStyle = css`
    border-radius: ${token.pill.border.radius};

    &:hover {
        background: ${token.pill['background-hover']};
    }
`;

const itemPillActiveStyle = css`
    background: ${token.pill['background-active']};
    color: ${token.pill['color-active']};

    &:hover {
        background: ${token.pill['background-active']};
        color: ${token.pill['color-active']};
    }
`;

const indicatorStyle = css`
    position: absolute;
    left: 0;
    bottom: 0;
    height: ${token.indicator.height};
    background: ${token.indicator.color};
    border-radius: 1px;
    pointer-events: none;
    transform: translateX(var(--rc-tabs-indicator-x, 0));
    width: var(--rc-tabs-indicator-w, 0);
    transition: ${token.indicator.transition};
`;

const indicatorHiddenStyle = css`
    opacity: 0;
`;

const closeButtonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: ${token.close.gap};
    width: ${token.close.size};
    height: ${token.close.size};
    padding: 0;
    border: 0;
    background: transparent;
    color: ${token.close.color};
    cursor: pointer;
    border-radius: ${token.close.border.radius};
    transition: ${token.motion.color};

    &:hover {
        color: ${token.close['color-hover']};
        background: ${token.close['background-hover']};
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.focus.ring.width} solid ${token.focus.ring.color};
        outline-offset: 1px;
    }
`;

const extraStyle = css`
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
`;

const contentStyle = css`
    padding-top: ${token.content['padding-top']};
    min-height: 0;
`;

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

const Tabs = ({
    items,
    activeKey: activeKeyProp,
    defaultActiveKey,
    type = 'line',
    size = 'medium',
    centered = false,
    destroyInactiveTabPane = false,
    tabBarExtraContent,
    onChange,
    onTabClose,
    className,
    ...restProps
}: TabsProps) => {
    const reactId = useId();
    const tabsIdPrefix = useMemo(
        () => `rc-tabs-${reactId.replace(/:/g, '')}`,
        [reactId],
    );

    const getTabId = useCallback(
        (index: number) => `${tabsIdPrefix}-tab-${index}`,
        [tabsIdPrefix],
    );

    const getPanelId = useCallback(
        (index: number) => `${tabsIdPrefix}-panel-${index}`,
        [tabsIdPrefix],
    );

    const firstEnabledItem = useMemo(
        () => items.find(item => !item.disabled),
        [items],
    );

    const resolvedDefault = defaultActiveKey
        ?? firstEnabledItem?.key
        ?? items[0]?.key
        ?? '';

    const [activeKey, setActiveKey] = useControllableValue<string>({
        value: activeKeyProp,
        defaultValue: resolvedDefault,
        onChange,
    });

    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const barRef = useRef<HTMLDivElement | null>(null);
    const [indicatorPosition, setIndicatorPosition] = useState<{ left: number; width: number }>({
        left: 0,
        width: 0,
    });

    const updateIndicator = useCallback(() => {
        if (type !== 'line') return;
        const activeTab = tabRefs.current.get(activeKey);
        if (!activeTab || !barRef.current) return;
        setIndicatorPosition({
            left: activeTab.offsetLeft,
            width: activeTab.offsetWidth,
        });
    }, [activeKey, type]);

    useLayoutEffect(() => {
        updateIndicator();
    }, [updateIndicator, items]);

    useEffect(() => {
        if (type !== 'line') return undefined;
        if (typeof ResizeObserver === 'undefined') return undefined;
        const node = barRef.current;
        if (!node) return undefined;
        const observer = new ResizeObserver(() => updateIndicator());
        observer.observe(node);
        return () => observer.disconnect();
    }, [type, updateIndicator]);

    const activateKey = (nextKey: string) => setActiveKey(nextKey);

    const handleTabClick = (item: TabsItem) => {
        if (item.disabled || item.key === activeKey) return;
        activateKey(item.key);
    };

    const handleTabKeyDown = (
        event: ReactKeyboardEvent<HTMLButtonElement>,
        item: TabsItem,
        index: number,
    ) => {
        const { key } = event;

        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
            event.preventDefault();
            let nextKey: string | null;
            if (key === 'ArrowLeft') {
                nextKey = findEnabledKey(items, index, -1);
            } else if (key === 'ArrowRight') {
                nextKey = findEnabledKey(items, index, 1);
            } else if (key === 'Home') {
                nextKey = findEnabledKey(items, -1, 1);
            } else {
                nextKey = findEnabledKey(items, items.length, -1);
            }
            if (nextKey && nextKey !== activeKey) {
                activateKey(nextKey);
            }
            if (nextKey) {
                const nextTab = tabRefs.current.get(nextKey);
                nextTab?.focus();
            }
            return;
        }

        if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
            if (!item.disabled && item.key !== activeKey) {
                event.preventDefault();
                activateKey(item.key);
            }
            return;
        }

        if ((key === 'Delete' || key === 'Backspace') && item.closable && !item.disabled) {
            event.preventDefault();
            onTabClose?.(item.key, event);
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
        } else {
            tabRefs.current.delete(key);
        }
    };

    const itemSizeStyle = itemSizeStyleOf(size);

    const getTypeItemStyles = (item: TabsItem, isActive: boolean): string => {
        if (type === 'card') {
            return cx(itemCardStyle, isActive ? itemCardActiveStyle : '');
        }
        if (type === 'pill') {
            return cx(itemPillStyle, isActive ? itemPillActiveStyle : '');
        }
        return '';
    };

    const indicatorInlineStyle = useMemo<CSSProperties>(() => ({
        ['--rc-tabs-indicator-x' as never]: `${indicatorPosition.left}px`,
        ['--rc-tabs-indicator-w' as never]: `${indicatorPosition.width}px`,
    }), [indicatorPosition.left, indicatorPosition.width]);

    const activeItemIndex = items.findIndex(item => item.key === activeKey);
    const activeItem = activeItemIndex >= 0 ? items[activeItemIndex] : null;

    return (
        <div {...restProps} className={cx(rootStyle, className)}>
            <div className={barWrapperStyle}>
                {extraContent.left != null ? (
                    <div className={extraStyle}>{extraContent.left}</div>
                ) : null}
                <div
                    ref={barRef}
                    className={cx(barStyle, type === 'line' ? barLineStyle : '')}
                    role="tablist"
                    aria-orientation="horizontal"
                >
                    <div className={cx(barListStyle, centered ? barCenteredStyle : '')}>
                        {items.map((item, index) => {
                            const isActive = item.key === activeKey;

                            return (
                                <button
                                    type="button"
                                    key={item.key}
                                    ref={registerTabRef(item.key)}
                                    id={getTabId(index)}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={getPanelId(index)}
                                    aria-disabled={item.disabled || undefined}
                                    tabIndex={isActive ? 0 : -1}
                                    disabled={item.disabled}
                                    className={cx(
                                        itemBaseStyle,
                                        itemSizeStyle,
                                        isActive ? itemActiveStyle : '',
                                        item.disabled ? itemDisabledStyle : '',
                                        getTypeItemStyles(item, isActive),
                                        item.className,
                                    )}
                                    style={item.style}
                                    onClick={() => handleTabClick(item)}
                                    onKeyDown={(event) => handleTabKeyDown(event, item, index)}
                                >
                                    {item.icon != null ? <span aria-hidden="true">{item.icon}</span> : null}
                                    <span>{item.label}</span>
                                    {item.closable && !item.disabled ? (
                                        <span
                                            role="button"
                                            tabIndex={-1}
                                            aria-label="Close tab"
                                            className={closeButtonStyle}
                                            onClick={(event) => handleCloseClick(event, item)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    onTabClose?.(item.key, event);
                                                }
                                            }}
                                        >
                                            <CloseIcon />
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                    {type === 'line' ? (
                        <div
                            className={cx(
                                indicatorStyle,
                                indicatorPosition.width === 0 ? indicatorHiddenStyle : '',
                            )}
                            style={indicatorInlineStyle}
                            aria-hidden="true"
                        />
                    ) : null}
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
