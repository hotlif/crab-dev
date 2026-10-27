import { css } from "@crab-dev/css"
import token from "../../token.js";

const groupItemContainer = css`
    font-size: ${token.horizontal["group-item"]["font-size"]};
    position: relative;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    user-select: none;
    margin: ${token.horizontal["group-item"].margin};
    transition: ${token.horizontal["group-item"].transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
`

const groupChildrenList = css`
    list-style-type: none;
    padding: 0;
    margin: 0;
    min-width: 0;
    max-width: 100%;
    color: ${token.horizontal.item.color};
    line-height: ${token.horizontal.submenu["line-height"]};
    border-radius: ${token.horizontal.submenu["border-radius"]};
`

const groupItemHeader = css`
    cursor: default;
    border-radius: 4px;
    padding-inline: ${token.horizontal["group-item"].header["padding-inline"]};
    display: flex;
    min-width: 0;
    box-sizing: border-box;
    align-items: center;
`

const groupItemTitle = css`
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${token.horizontal["group-item"].title.color};
    font-weight: ${token.horizontal["group-item"].title["font-weight"]};
`

const groupItemIcon = css`
    color: ${token.horizontal["group-item"].icon.color};
    margin-inline-end: ${token.horizontal["group-item"].icon["margin-right"]};
`


const styles = {
    groupItem: {
        container: groupItemContainer,
        header: groupItemHeader,
        icon: groupItemIcon,
        title: groupItemTitle,
    },
    childrenList: {
        container: groupChildrenList,
    },
};

export default styles;
