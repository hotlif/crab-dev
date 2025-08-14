import { css } from "@linaria/core"

const menuItem = css`
    cursor: pointer;
    font-size: 14px;
    position: relative;
    user-select: none;
    transition: border-color 0.3s, color 0.3s;

`

const menuItemWithDivider = css`
    &:hover {
        color: #1677ff;
        &::after {
            border-bottom: 2px solid #1677ff;
        }
    }
    &::after {
        position: absolute;
        content: "";
        inset-inline-end: 12px;
        inset-inline-start: 14px;
        bottom: 0;
        transition: border-bottom 0.3s;
        border-bottom: 2px solid transparent;
    }
`

const menuItemContent = css`
    border-radius: 4px;
    padding-left: 16px;
    display: flex;
    align-items: center;
`

const menuItemFloatTrigger = css`
    margin: 4px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
`

const menuItemTitle = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
`

const menuItemIcon = css`
    margin-right: 8px;
`

const menuItemLeftIcon = css`
    width: 36px;
    text-align: center;
`

const submenuList = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: #000;
    line-height: 40px;
    border-radius: 4px;
`

const submenuFloat = css`
    z-index: 1000;
    white-space: nowrap;
    padding: 6px 4px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px;
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