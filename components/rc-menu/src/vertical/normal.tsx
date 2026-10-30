import { useId, type FC, type ReactNode, type MouseEvent } from "react";
import { css, cx } from "@crab-dev/css";
import { usePresence } from "@crab-dev/rc-hooks";
import { iconArrayBase, iconArrayDown, iconArrayUp } from "../icon.js";
import { type MenuProps } from "../menu.js";
import { ItemType, type Item } from "../type.js";
import token from "../token.js";
import { navigateMenu, menuActivationEvent } from '../keyboard.js';
import { itemStyle, ulStyle, collapseStyle, ulChildrenItemGroupStyle, stateIconStyle, menuItemIcon } from "./normal.styles.js";
const verticalItemTitleWidth = token.vertical.item.title.width;
const verticalItemTitleMarginBottom = token.vertical.item.title["margin-bottom"];
const verticalItemTitleMarginTop = token.vertical.item.title["margin-top"];
const verticalItemTitlePaddingInlineStart = token.vertical.item.title["padding-inline-start"];
const verticalItemTitlePaddingInlineEnd = token.vertical.item.title["padding-inline-end"];
const verticalItemTitleBorderRadius = token.vertical.item.title["border-radius"];
const verticalItemTitleBackgroundColorHover = token.vertical.item.title["background-color-hover"];
const verticalItemTitleBackgroundColorActive = token.vertical.item.title["background-color-active"];
const verticalItemTitleBackgroundColorSelect = token.vertical.item.title["background-color-selected"];
const verticalItemTitleBackgroundColorOpen = token.vertical.item.title["background-color-open"];
const verticalItemTitleColorHover = token.vertical.item.title["color-hover"];
const verticalItemTitleColorOpen = token.vertical.item.title["color-open"];
const verticalItemTitleHeight = token.vertical.item.title.height;
const verticalItemFontSize = token.vertical.item.title["font-size"];
const verticalItemInlineIndent = token.vertical.item.depth['padding-left'];
const verticalItemChildrenBackgroundColor = token.vertical.item.children["background-color"];
const verticalItemChildrenPadding = token.vertical.item.children.padding;


const itemGroupTitleColor = token.vertical["item-group"].title.color;
const itemGroupTitleFontSize = token.vertical["item-group"].title["font-size"];
const itemGroupTitleHeight = token.vertical["item-group"].title.height;


const itemTitleStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: 0;
    width: ${verticalItemTitleWidth};
    padding-inline-start: ${verticalItemTitlePaddingInlineStart};
    padding-inline-end: ${verticalItemTitlePaddingInlineEnd};
    margin-top: ${verticalItemTitleMarginTop};
    margin-bottom: ${verticalItemTitleMarginBottom};
    box-sizing: border-box;
    overflow: hidden;
`


const itemTitleBaseStyle = css`
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.vertical.item.title['outline-offset-focus']}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }

    height: ${verticalItemTitleHeight};
    font-size: ${verticalItemFontSize};
    color: ${token.vertical.item.title.color};
    border-radius: ${verticalItemTitleBorderRadius};
    transition: ${token.vertical.item.title.transition};
    &:hover {
        background-color: ${verticalItemTitleBackgroundColorHover};
        color: ${verticalItemTitleColorHover};
    }

    &:active {
        background-color: ${verticalItemTitleBackgroundColorActive};
        color: ${token.vertical.item.title["color-active"]};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`

const itemGroupTitleStyle = css`
    cursor: default;
    height: ${itemGroupTitleHeight};
    font-size: ${itemGroupTitleFontSize};
    font-weight: ${token.vertical["item-group"].title["font-weight"]};
    letter-spacing: ${token.vertical["item-group"].title["letter-spacing"]};
    text-transform: ${token.vertical["item-group"].title["text-transform"]};
    color: ${itemGroupTitleColor};
`

const itemSelectStyle = css`
    background-color: ${verticalItemTitleBackgroundColorSelect};
    color: ${token.vertical.item.title['color-selected']};
    font-weight: ${token.vertical.item.title["font-weight-selected"]};
    [data-menu-icon] { color: inherit; }
    &:hover, &:focus-visible {
        background-color: ${token.vertical.item.selection['background-color-hover']};
        color: ${token.vertical.item.title['color-selected']};
    }
    &:active { background-color: ${token.vertical.item.selection['background-color-pressed']}; }
    @media (forced-colors: active) {
        /* Preserve this explicit system pair and prevent a Canvas text backplate. */
        &, &:hover, &:active, &:focus-visible {
            forced-color-adjust: none;
            color: HighlightText;
            background-color: Highlight;
        }
    }
`

const itemOpenStyle = css`
    background-color: ${verticalItemTitleBackgroundColorOpen};
    color: ${verticalItemTitleColorOpen};
`

const ulChildrenStyle = css`
    overflow: hidden;
    padding: ${verticalItemChildrenPadding};
    box-sizing: border-box;
    height: auto;
    background-color: ${verticalItemChildrenBackgroundColor};
`

function Submenu({ open, children, id }: { open: boolean; children: ReactNode; id: string }) {
    const presence = usePresence<HTMLDivElement>(open);
    if (!presence.present) return null;
    return <div id={id} ref={presence.ref} className={collapseStyle} data-state={presence.state} inert={!open}>
        <div><ul className={cx(ulStyle, ulChildrenStyle)}>{children}</ul></div>
    </div>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VerticalMenuProps extends Omit<MenuProps, "mode"> {
}

const VerticalNormalMenu: FC<VerticalMenuProps> = ({
    className,
    openKeys,
    selectedKeys = [],
    items = [],
    onSelectedKeysChange,
    onOpenKeysChange,
    onClick,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inlineCollapsed,
    onKeyDown,
    ...props
}) => {
    const menuId = useId();

    const selectItemFunction = (item: Item, event: MouseEvent<HTMLElement>) => {
        const semanticEvent = menuActivationEvent(event.currentTarget) ?? event;
        const keys = []
        if (!selectedKeys.includes(item.key)) {
            keys.push(item.key)
        }

        onSelectedKeysChange?.(keys, { reason: keys.length ? 'select' : 'deselect', item, event: semanticEvent });

        if (openKeys && item.type != ItemType.ItemGroup && item.children?.length) {
            const wasOpen = openKeys.includes(item.key);
            const nextKeys = wasOpen ? openKeys.filter(key => key !== item.key) : [...openKeys, item.key];
            onOpenKeysChange?.(nextKeys, { reason: wasOpen ? 'collapse' : 'expand', item, event: semanticEvent });
        }
    }

    const renderChildrenStateIcon = (item: Item, children: ReactNode[]) => {
        if (children.length > 0 && openKeys?.includes(item.key) !== true) {
            return (
                <i
                    className={cx.call(undefined, stateIconStyle, iconArrayBase, iconArrayDown)}
                >
                </i>
            )
        } else if (children.length > 0 && openKeys?.includes(item.key) === true) {
            return (
                <i
                    className={cx.call(undefined, stateIconStyle, iconArrayBase, iconArrayUp)}
                >
                </i>
            )
        } else {
            return null;
        }
    }

    const renderItem = (item: Item, children: ReactNode[], depth: number) => {
        const submenuId = `${menuId}-${encodeURIComponent(String(item.key))}`;
        return (
            <li
                className={itemStyle}
                key={item.key}
            >
                <div
                    role="button"
                    tabIndex={0}
                    data-menu-item=""
                    aria-expanded={children.length > 0 ? openKeys?.includes(item.key) === true : undefined}
                    aria-controls={children.length > 0 ? submenuId : undefined}
                    aria-current={selectedKeys.includes(item.key) ? 'page' : undefined}
                    className={cx.call(undefined, itemTitleStyle,
                        itemTitleBaseStyle,
                        children.length > 0 && openKeys?.includes(item.key) ? itemOpenStyle : null,
                        children.length === 0 && selectedKeys.includes(item.key) ? itemSelectStyle : null)
                    }
                    style={{
                        paddingInlineStart: `calc(${depth} * ${verticalItemInlineIndent})`
                    }}
                    onClick={(e) => {
                        selectItemFunction(item, e);
                        onClick?.({
                            event: e,
                            item
                        });
                    }}
                >

                    {
                        item.icon ? (
                            <span
                                className={menuItemIcon}
                                data-menu-icon=""
                            >
                                {item.icon}
                            </span>
                        ) : null
                    }
                    <span
                        className={css`
                            flex: 1;
                            min-width: 0;
                            font-size: inherit;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        `}
                    >
                        {item.title}
                    </span>
                    {renderChildrenStateIcon(item, children)}
                </div>
                <Submenu id={submenuId} open={openKeys?.includes(item.key) === true}>{children}</Submenu>
            </li>
        );
    }

    const renderItemGroup = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <li
                className={itemStyle}
                key={item.key}
            >
                <div
                    className={cx.call(undefined, itemTitleStyle, itemGroupTitleStyle)}
                    style={{
                        paddingInlineStart: `calc(${depth} * ${verticalItemInlineIndent} * 0.7)`
                    }}
                    onClick={(e) => {
                        selectItemFunction(item, e);
                    }}
                >
                    {
                        item.icon ? (
                            <span
                                className={menuItemIcon}
                            >
                                {item.icon}
                            </span>
                        ) : null
                    }
                    {item.title}
                </div>
                <ul
                    className={cx.call(undefined, ulStyle, ulChildrenItemGroupStyle)}
                >
                    {children}
                </ul>
            </li>
        );
    }

    const renderMenu = (items: Item[], depth: number): ReactNode[] => {
        return items.map(item => {
            if (item.type === ItemType.ItemGroup ) {
                return renderItemGroup(item, renderMenu(item.children ?? [], depth + 1), depth);
            } else if (item.type === ItemType.Item) {
                return renderItem(item, renderMenu(item.children ?? [],depth + 1), depth);
            } else {
                throw new Error(`[${item.type}] The parameter \`type\` is incorrect, please check.`)
            }
        })
    }

    return (
        <ul
            className={cx.call(undefined, className, ulStyle)}
            {...props}
            onKeyDown={event => { onKeyDown?.(event); navigateMenu(event); }}
        >
            {renderMenu(items, 1)}
        </ul>
    )
}

export default VerticalNormalMenu;
