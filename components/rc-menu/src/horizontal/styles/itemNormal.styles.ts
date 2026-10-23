import { css } from "@crab-dev/css"
import token from "../../token.js";

const menuItem = css`
    cursor: pointer;
    font-size: ${token.horizontal.item["font-size"]};
    position: relative;
    user-select: none;
    transition: ${token.horizontal.item.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
`

const menuItemWithDivider = css`
    &:hover {
        color: ${token.horizontal.item["color-hover"]};
    }
`

const menuItemContent = css`
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }

    border-radius: ${token.vertical.item.title['border-radius']};
    padding-left: ${token.horizontal.item.content["padding-left"]};
    font-size: ${token.horizontal.item.content["font-size"]};
    height: ${token.horizontal.item.content.height};
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &[aria-current='page'] {
        background-color: ${token.vertical.item.title['background-color-selected']};
        color: ${token.vertical.item.title['color-selected']};
        font-weight: ${token.vertical.item.title['font-weight-selected']};
        [data-menu-icon] { color: inherit; }
        &:hover, &:focus-visible { background-color: ${token.vertical.item.selection['background-color-hover']}; }
        &:active { background-color: ${token.vertical.item.selection['background-color-pressed']}; }
        @media (forced-colors: active) {
            &, &:hover, &:active { color: HighlightText; background-color: Highlight; }
        }
    }
`

const menuItemFloatTrigger = css`
    margin: 4px;
    &:hover {
        background-color: ${token.horizontal.item.content["background-color-hover"]};
    }
`

const menuItemTitle = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    font-size: inherit;
`

const menuItemIcon = css`
    color: ${token.vertical.item.icon.color};
    width: ${token.vertical.item.icon.width};
    height: ${token.vertical.item.icon.width};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    > svg, > img { width: 100%; height: 100%; }
    margin-right: ${token.horizontal.item.icon["margin-right"]};
`

const menuItemLeftIcon = css`
    width: 36px;
    text-align: center;
`

const submenuList = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: ${token.horizontal.item.color};
    line-height: ${token.horizontal.submenu["line-height"]};
    border-radius: ${token.horizontal.submenu["border-radius"]};
`

const submenuFloat = css`
    z-index: ${token.horizontal.submenu["z-index"]};
    white-space: nowrap;
    padding: ${token.horizontal.submenu.padding};
    background-color: ${token.horizontal.submenu["background-color"]};
    box-shadow: ${token.horizontal.submenu["box-shadow"]};
`



const styles = {
    item: {
        base: menuItem,
        withDivider: menuItemWithDivider,
        content: menuItemContent,
        floatTrigger: menuItemFloatTrigger,
        icon: menuItemIcon,
        leftIcon: menuItemLeftIcon,
        title: menuItemTitle,
    },
    submenu: {
        container: submenuList,
        float: submenuFloat,
    }
};

export default styles;
