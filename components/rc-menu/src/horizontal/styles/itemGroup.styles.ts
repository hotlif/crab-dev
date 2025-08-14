import { css } from "@linaria/core"

const groupItemContainer = css`
    font-size: 14px;
    position: relative;
    user-select: none;
    transition: border-color 0.3s, color 0.3s;
`

const groupChildrenList = css`
    list-style-type: none;
    padding-inline-start: unset;
    color: #000;
    line-height: 40px;
    border-radius: 4px;
`

const groupItemHeader = css`
    cursor: default;
    border-radius: 4px;
    padding-inline: 16px;
    display: flex;
    align-items: center;
`

const groupItemTitle = css`
    opacity: 0.5;
`

const groupItemIcon = css`
    opacity: 0.5;
    margin-right: 8px;
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