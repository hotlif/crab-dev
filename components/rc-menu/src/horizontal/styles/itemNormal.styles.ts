import { css } from "@crab-dev/css"
import token from "../../token.js";

const menuItem = css`
    cursor: pointer;
    font-size: ${token.horizontal.item["font-size"]};
    position: relative;
    user-select: none;
    transition: ${token.horizontal.item.transition};
`

const menuItemWithDivider = css`
    &:hover {
        color: ${token.horizontal.item["color-hover"]};
    }
`

const menuItemContent = css`
    border-radius: 4px;
    padding-left: ${token.horizontal.item.content["padding-left"]};
    font-size: ${token.horizontal.item.content["font-size"]};
    height: ${token.horizontal.item.content.height};
    display: flex;
    align-items: center;
    box-sizing: border-box;
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
    margin-right: ${token.horizontal.item.icon["margin-right"]};
`

const menuItemLeftIcon = css`
    width: 36px;
    text-align: center;
`

const submenuList = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: #000;
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