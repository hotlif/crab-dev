import { css } from "@linaria/core"
import token from "../../token";

const groupItemContainer = css`
    font-size: ${token.horizontal["group-item"]["font-size"]};
    position: relative;
    user-select: none;
    margin: ${token.horizontal["group-item"].margin};
    transition: ${token.horizontal["group-item"].transition};
`

const groupChildrenList = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: #000;
    line-height: ${token.horizontal.submenu["line-height"]};
    border-radius: ${token.horizontal.submenu["border-radius"]};
`

const groupItemHeader = css`
    cursor: default;
    border-radius: 4px;
    padding-inline: ${token.horizontal["group-item"].header["padding-inline"]};
    display: flex;
    align-items: center;
`

const groupItemTitle = css`
    opacity: ${token.horizontal["group-item"].title.opacity};
`

const groupItemIcon = css`
    opacity: ${token.horizontal["group-item"].icon.opacity};
    margin-right: ${token.horizontal["group-item"].icon["margin-right"]};
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