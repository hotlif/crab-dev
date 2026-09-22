import { css, cx } from '@crab-dev/css';
import { useId, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
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
    font-weight: ${token.root['font-weight']};
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
    border-bottom: 1px solid ${token.bar['border-color']};
`;

const barCenteredStyle = css`
    justify-content: center;
`;

const itemBaseStyle = css`
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } &[aria-selected='true'], &[aria-current='page'] { outline: 2px solid Highlight; } }
    @media (prefers-reduced-motion: reduce) { transition: none; }

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
    line-height: ${token.root['line-height']};
    transition: ${token.motion.color};

    @media (prefers-reduced-motion: reduce) { transition: none; }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not(:disabled):hover::before { opacity: ${token['state-layer']['opacity-hover']}; }
    &:not(:disabled):focus-visible::before { opacity: ${token['state-layer']['opacity-focus']}; }
    &:not(:disabled):active::before { opacity: ${token['state-layer']['opacity-pressed']}; }
    &:not(:disabled):not([aria-selected='true']):hover { color: ${token.item['color-hover']}; }
    @media (prefers-reduced-motion: reduce) { &::before { transition: none; } }
    @media (forced-colors: active) { &::before { display: none; } }


    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.tab['outline-width-focus']} solid ${token.tab['outline-color-focus']};
        outline-offset: ${token.tab['outline-offset-focus']};
    }
`;

const itemSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-inline']};
    font-size: ${token.size.small['font-size']};
`;

const itemMediumStyle = css`
    height: ${token.size.medium.height};
    padding: 0 ${token.size.medium['padding-inline']};
    font-size: ${token.size.medium['font-size']};
`;

const itemLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-inline']};
    font-size: ${token.size.large['font-size']};
`;

const itemActiveStyle = css`
    color: ${token.item['color-active']};
`;

const itemDisabledStyle = css`
    color: ${token.item.color};
    opacity: ${token.item['opacity-disabled']};
    cursor: not-allowed;
`;

const itemCardStyle = css`
    background: ${token.card['background-color']};
    border: 1px solid transparent;
    border-bottom: 0;
    border-top-left-radius: ${token.card['border-radius']};
    border-top-right-radius: ${token.card['border-radius']};
    margin-bottom: -1px;

`;

const itemCardActiveStyle = css`
    background: ${token.card['background-color-active']};
    border-color: ${token.card['border-color']};

`;

const itemPillStyle = css`
    border-radius: ${token.pill['border-radius']};

`;

const itemPillActiveStyle = css`
    background: ${token.pill['background-color-active']};
    color: ${token.pill['color-active']};

`;

// The primary indicator follows label width, including font loading and text zoom.
const indicatorLabelStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: ${token.indicator['min-width']};
    align-self: stretch;
    position: relative;
    &::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: ${token.indicator.height};
        border-radius: ${token.indicator['border-radius']} ${token.indicator['border-radius']} 0 0;
        background: ${token.indicator.color};
        pointer-events: none;
        transform: scaleX(0);
        transition: ${token.indicator.transition};
    }
    [aria-selected='true'] > &::after { transform: scaleX(1); }
    @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }
    @media (forced-colors: active) { &::after { background: Highlight; } }
`;

const closeButtonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: ${token.close.gap};
    min-width: ${token.close.touch.width};
    min-height: ${token.close.touch.width};
    & > svg { width: ${token.close.width}; height: ${token.close.width}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    padding: 0;
    border: 0;
    background: transparent;
    color: ${token.close.color};
    cursor: pointer;
    border-radius: ${token.close['border-radius']};
    transition: ${token.motion.color};
    @media (prefers-reduced-motion: reduce) { transition: none; }

    &:hover {
        color: ${token.close['color-hover']};
        background: ${token.close['background-color-hover']};
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.close['outline-width-focus']} solid ${token.close['outline-color-focus']};
        outline-offset: ${token.close['outline-offset-focus']};
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
    const tabsIdPrefix = `rc-tabs-${reactId.replace(/:/g, '')}`;
    const getTabId = (index: number) => `${tabsIdPrefix}-tab-${index}`;
    const getPanelId = (index: number) => `${tabsIdPrefix}-panel-${index}`;
    const firstEnabledItem = items.find(item => !item.disabled);

    const resolvedDefault = defaultActiveKey
        ?? firstEnabledItem?.key
        ?? items[0]?.key
        ?? '';

    const [activeKey, setActiveKey] = useControllableValue<string>({
        value: activeKeyProp,
        defaultValue: resolvedDefault,
        onChange,
    });

    // Mutable DOM registry for keyboard focus; it never participates in rendering.
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

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
        return '';
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
                    className={cx.call(undefined, barStyle, type === 'line' ? barLineStyle : '')}
                    role="tablist"
                    aria-orientation="horizontal"
                >
                    <div className={cx.call(undefined, barListStyle, centered ? barCenteredStyle : '')}>
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
                                    className={cx.call(undefined, itemBaseStyle,
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
                                    <span className={type === 'line' ? indicatorLabelStyle : undefined}>{item.label}</span>
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
